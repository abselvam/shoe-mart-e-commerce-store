// app/api/orders/route.ts
import { db } from "@/db";
import { insertOrderSchema, order } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { z } from "zod";

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

// POST: Create new order
export async function POST(request: Request) {
  try {
    // SIMPLE CHECK: Is user logged in?
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not logged in",
        },
        { status: 403 },
      );
    }

    // Parse request body
    const body = await request.json();

    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Order must contain at least one item",
        },
        { status: 400 },
      );
    }

    let validatedData;
    try {
      validatedData = insertOrderSchema.parse(body);
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        console.log("❌ Zod validation failed:", error);

        // ✅ FIX: In Zod v3.22+, use error.issues instead of error.errors
        const formattedErrors = error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
          code: issue.code,
        }));

        return NextResponse.json(
          {
            success: false,
            message: "Validation failed",
            errors: formattedErrors,
          },
          { status: 400 },
        );
      }
      throw error;
    }

    const { name, email, totalPrice, phone, address, paymentMethod, items } =
      validatedData;

    // Create order
    const [NewOrder] = await db
      .insert(order)
      .values({
        name: name,
        userId: user.id,
        address: address,
        totalPrice: totalPrice.toString(),
        email: email,
        phone: phone,
        paymentMethod: paymentMethod,
        items: items,
      })
      .returning();

    return NextResponse.json(
      {
        success: true,
        message: "Order created",
        order: NewOrder,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error:", error);

    // Simple error handling
    if (error.message?.includes("unique constraint")) {
      return NextResponse.json(
        {
          success: false,
          message: "Order Creation Failed",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 },
    );
  }
}

// GET: Get all orders (Public)
export async function GET() {
  try {
    const isAdmin = await isAdminUser();

    if (!isAdmin) {
      return NextResponse.json(
        {
          success: false,
          message: "Only admin can see all orders",
        },
        { status: 403 },
      );
    }

    const orders = await db.select().from(order).orderBy(desc(order.createdAt));

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to get orders" },
      { status: 500 },
    );
  }
}
