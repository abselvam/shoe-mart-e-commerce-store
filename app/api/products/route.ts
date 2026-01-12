// app/api/products/route.ts
import { db } from "@/db";
import { product } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

// Simple helper to generate slug
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Simple helper to get unique slug
async function getUniqueSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await db
      .select()
      .from(product)
      .where(eq(product.slug, slug))
      .limit(1);

    if (existing.length === 0) return slug;

    slug = `${baseSlug}-${counter}`;
    counter++;

    if (counter > 100) {
      throw new Error("Could not generate unique slug");
    }
  }
}

// SIMPLE: Check if user is admin
async function isAdminUser(): Promise<boolean> {
  try {
    // 1. Get current user from Clerk
    const user = await currentUser();
    if (!user) {
      console.log("❌ No user found");
      return false;
    }

    // 2. Get user's email
    const userEmail = user.emailAddresses[0]?.emailAddress;
    if (!userEmail) {
      console.log("❌ User has no email");
      return false;
    }

    // 3. Get admin email from .env
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    if (!ADMIN_EMAIL) {
      console.log("⚠️ Warning: ADMIN_EMAIL not set in .env");
      return false;
    }

    // 4. Simple check: does user email match admin email?
    const isAdmin = userEmail === ADMIN_EMAIL;

    if (isAdmin) {
      console.log("✅ User is admin:", userEmail);
    } else {
      console.log("❌ User is NOT admin:", userEmail);
    }

    return isAdmin;
  } catch (error) {
    console.error("Error checking admin:", error);
    return false;
  }
}

// POST: Create new product (Admin only)
export async function POST(request: Request) {
  try {
    console.log("📥 Received request to create product");

    // SIMPLE CHECK: Is user admin?
    const isAdmin = await isAdminUser();

    if (!isAdmin) {
      return NextResponse.json(
        {
          success: false,
          message: "Only admin can create products",
        },
        { status: 403 }
      );
    }

    console.log("✅ Admin verified, creating product...");

    // Parse request body
    const body = await request.json();
    const { name, description, price, images, status, category, featured } =
      body;

    // Simple validation
    if (!name || !price) {
      return NextResponse.json(
        {
          success: false,
          message: "Name and price are required",
        },
        { status: 400 }
      );
    }
    const existingProductByName = await db
      .select()
      .from(product)
      .where(eq(product.name, name.trim()))
      .limit(1);

    if (existingProductByName.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "A product with this name already exists",
        },
        { status: 409 } // Conflict status code
      );
    }

    // Generate slug
    const baseSlug = generateSlug(name);
    const uniqueSlug = await getUniqueSlug(baseSlug);

    // Create product
    const [newProduct] = await db
      .insert(product)
      .values({
        name: name.trim(),
        slug: uniqueSlug,
        description: description?.trim() || null,
        price: price.toString(),
        images: images || [],
        status: status || "draft",
        category: category || "men",
        featured: featured || false,
      })
      .returning();

    console.log("✅ Product created:", newProduct.name);

    return NextResponse.json(
      {
        success: true,
        message: "Product created",
        product: newProduct,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error:", error);

    // Simple error handling
    if (error.message?.includes("unique constraint")) {
      return NextResponse.json(
        {
          success: false,
          message: "Product with this name already exists",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}

// GET: Get all products (Public)
export async function GET() {
  try {
    const products = await db.select().from(product).orderBy(product.createdAt);

    return NextResponse.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to get products" },
      { status: 500 }
    );
  }
}

interface RouteParams {
  params: {
    id: string;
  };
}

export async function DELETE(request: Request) {
  try {
    // Check if user is admin
    const isAdmin = await isAdminUser();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, message: "Only admin can delete products" },
        { status: 403 }
      );
    }

    // Get the ID from query parameters
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    // Check if product exists
    const [existingProduct] = await db
      .select()
      .from(product)
      .where(eq(product.id, id))
      .limit(1);

    if (!existingProduct) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // Delete product
    await db.delete(product).where(eq(product.id, id));

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete product" },
      { status: 500 }
    );
  }
}
