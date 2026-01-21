import { db } from "@/db";
import { product } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

interface Category {
  params: Promise<{ category: "men" | "women" | "kids" }>;
}

export async function GET(request: NextRequest, { params }: Category) {
  try {
    const { category } = await params;
    const products = await db
      .select()
      .from(product)
      .where(eq(product.category, category))
      .orderBy(desc(product.createdAt));
    return NextResponse.json({
      success: true,
      products,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch products",
      },
      { status: 500 },
    );
  }
}
