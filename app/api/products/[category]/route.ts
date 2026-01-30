import { db } from "@/db";
import { product } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { CategoryType } from "@/db/schema"; // Import your type

// ✅ Accept string in the interface (Next.js sends string)
interface Category {
  params: Promise<{ category: string }>;
}

export async function GET(request: NextRequest, { params }: Category) {
  try {
    const { category } = await params;

    // ✅ Cast to CategoryType after validation
    const validCategories: CategoryType[] = ["men", "women", "kids"];

    // Validate it's one of the allowed values
    if (!validCategories.includes(category as CategoryType)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid category. Must be 'men', 'women', or 'kids'",
        },
        { status: 400 },
      );
    }

    // ✅ Now safely cast to CategoryType
    const categoryTyped = category as CategoryType;

    const products = await db
      .select()
      .from(product)
      .where(eq(product.category, categoryTyped))
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
