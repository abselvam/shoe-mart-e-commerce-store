import { db } from "@/db";
import { product } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const featured = await db
      .select()
      .from(product)
      .where(and(eq(product.featured, true), eq(product.status, "published")))
      .orderBy(desc(product.createdAt));

    return NextResponse.json({
      success: true,
      featured,
    });
  } catch (error) {
    console.error("Error", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to get featured products",
      },
      { status: 500 },
    );
  }
}
