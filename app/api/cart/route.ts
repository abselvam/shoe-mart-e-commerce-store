// app/api/cart/route.ts - WITH CLERK AUTH
import { NextRequest, NextResponse } from "next/server";
import { clearCart, getCart, saveCart } from "@/app/lib/cart";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in to view your cart" },
        { status: 401 },
      );
    }

    // Use authenticated user's ID
    const userId = user.id;

    // Get cart for authenticated user (no session needed)
    const cart = await getCart(userId);

    return NextResponse.json(cart);
  } catch (error) {
    console.error("Get cart error:", error);
    return NextResponse.json({ error: "Failed to get cart" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in to clear your cart" },
        { status: 401 },
      );
    }

    const result = await clearCart(user.id);

    return NextResponse.json({
      success: true,
      message: "Cart cleared successfully",
      cart: result.cart,
    });
  } catch (error) {
    console.error("Clear cart error:", error);
    return NextResponse.json(
      { error: "Failed to clear cart" },
      { status: 500 },
    );
  }
}
