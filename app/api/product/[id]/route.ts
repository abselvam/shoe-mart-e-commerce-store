// app/api/products/[id]/route.ts
import { db } from "@/db";
import { product } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

// Helper to check if user is admin
async function isAdminUser(): Promise<boolean> {
  try {
    const user = await currentUser();
    if (!user) return false;

    const userEmail = user.emailAddresses[0]?.emailAddress;
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

    return userEmail === ADMIN_EMAIL;
  } catch (error) {
    console.error("Error checking admin:", error);
    return false;
  }
}

// Type definition for params
interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET: Get single product by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    console.log("🔍 GET Product API called");

    // ✅ For Next.js 16: Await the params Promise
    const { id } = await params;

    console.log("Product ID received:", id);

    if (!id || id === "[id]") {
      console.log("❌ Invalid ID:", id);
      return NextResponse.json(
        {
          success: false,
          message: "Product ID is required",
          receivedId: id,
        },
        { status: 400 }
      );
    }

    console.log("🔍 Querying database for ID:", id);

    const [productData] = await db
      .select()
      .from(product)
      .where(eq(product.id, id))
      .limit(1);

    console.log("Query result:", productData ? "Found" : "Not found");

    if (!productData) {
      // For debugging, let's see what's in the database
      const allProducts = await db.select().from(product).limit(5);
      console.log(
        "First 5 products:",
        allProducts.map((p) => ({ id: p.id, name: p.name }))
      );

      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
          searchedId: id,
          availableIds: allProducts.map((p) => p.id),
        },
        { status: 404 }
      );
    }

    console.log("✅ Product found:", productData.name);

    return NextResponse.json({
      success: true,
      product: {
        ...productData,
        price: parseFloat(productData.price),
      },
    });
  } catch (error) {
    console.error("❌ Error in GET /api/products/[id]:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch product",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// PATCH: Update product by ID (Admin only)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    // ✅ For Next.js 16: Await the params Promise
    const { id } = await params;

    console.log("🔧 PATCH Request for product ID:", id);

    // Check if user is admin
    const isAdmin = await isAdminUser();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, message: "Only admin can update products" },
        { status: 403 }
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

    // Parse request body
    const body = await request.json();
    console.log("Request body:", body);

    const { name, description, price, images, status, category, featured } =
      body;

    // Validate required fields
    if (!name || !price) {
      return NextResponse.json(
        { success: false, message: "Name and price are required" },
        { status: 400 }
      );
    }

    // Check if name is changed and if new name already exists
    if (name !== existingProduct.name) {
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
          { status: 409 }
        );
      }
    }

    // Update product
    const [updatedProduct] = await db
      .update(product)
      .set({
        name: name.trim(),
        description: description?.trim() || null,
        price: price.toString(),
        images: images || [],
        status: status || "draft",
        category: category || "men",
        featured: featured || false,
      })
      .where(eq(product.id, id))
      .returning();

    console.log("✅ Product updated:", updatedProduct.name);

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error: any) {
    console.error("Error updating product:", error);

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
      { success: false, message: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE: Delete product by ID (Admin only)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // ✅ For Next.js 16: Await the params Promise
    const { id } = await params;

    // Check if user is admin
    const isAdmin = await isAdminUser();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, message: "Only admin can delete products" },
        { status: 403 }
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
