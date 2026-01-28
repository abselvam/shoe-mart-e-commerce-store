// app/api/cart/count/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getCart } from "@/app/lib/cart";
import { currentUser } from "@clerk/nextjs/server";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Check authentication
    const user = await currentUser();

    const { slug } = await params;

    if (!user) {
      // Return 0 for unauthenticated users
      return NextResponse.json({ count: 0 }, { status: 200 });
    }

    // Use authenticated user's ID
    const userId = user.id;

    // Get user's cart
    const cart = await getCart(userId);

    // Calculate total items count
    const item = cart.items.find((item) => item.slug == slug);

    const itemCount = item?.quantity || 0;

    return NextResponse.json({
      success: true,
      count: itemCount,
      message: "item count count retrieved successfully",
    });
  } catch (error) {
    console.error("Get cart count error:", error);

    // Return 0 on error to avoid breaking the UI
    return NextResponse.json(
      {
        success: false,
        count: 0,
        error: "Failed to fetch cart count",
      },
      { status: 200 },
    );
  }
}
