// app/api/cart/count/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getCart } from "@/app/lib/cart";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const user = await currentUser();

    if (!user) {
      // Return 0 for unauthenticated users
      return NextResponse.json({ count: 0 }, { status: 200 });
    }

    // Use authenticated user's ID
    const userId = user.id;

    // Get user's cart
    const cart = await getCart(userId);

    // Calculate total items count
    const count = cart.items.reduce(
      (sum: number, item: any) => sum + (item.quantity || 0),
      0,
    );

    return NextResponse.json({
      success: true,
      count,
      message: "Cart count retrieved successfully",
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
