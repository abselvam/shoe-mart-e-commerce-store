// app/api/cart/clear/route.ts - CLEAR ENTIRE CART
import { NextRequest, NextResponse } from "next/server";
import { getCart, clearCart } from "@/app/lib/cart"; // Need to add deleteCart function
import { currentUser } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in to clear cart" },
        { status: 401 },
      );
    }

    const userId = user.id;

    // Get current cart first (optional, for logging or confirmation)
    const currentCart = await getCart(userId);

    // Check if cart is already empty
    if (currentCart.items.length === 0) {
      return NextResponse.json({
        success: true,
        message: "Cart is already empty",
        cart: currentCart,
      });
    }

    const clearedCart = await clearCart(userId);

    return NextResponse.json({
      success: true,
      cart: clearedCart,
      message: "Cart cleared successfully",
    });
  } catch (error) {
    console.error("Clear cart error:", error);
    return NextResponse.json(
      { error: "Failed to clear cart" },
      { status: 500 },
    );
  }
}
