// app/api/cart/remove/route.ts - AUTHENTICATED VERSION
import { NextRequest, NextResponse } from "next/server";
import { getCart, saveCart } from "@/app/lib/cart";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in to remove items from cart" },
        { status: 401 },
      );
    }

    const { itemId, variant } = await request.json();

    if (!itemId) {
      return NextResponse.json(
        { error: "Item ID is required" },
        { status: 400 },
      );
    }

    // Use authenticated user's ID
    const userId = user.id;

    // Get user's cart
    const cart = await getCart(userId);

    // Filter out the item to remove
    const updatedItems = cart.items.filter(
      (item) => !(item.id === itemId && (!variant || item.variant === variant)),
    );

    // Check if item was actually found and removed
    const itemRemoved = cart.items.length !== updatedItems.length;

    if (!itemRemoved) {
      return NextResponse.json(
        {
          error: "Item not found in cart",
          itemId,
          variant,
        },
        { status: 404 },
      );
    }

    const updatedCart = {
      ...cart,
      userId, // Ensure userId is set
      items: updatedItems,
    };

    await saveCart(updatedCart);

    return NextResponse.json({
      success: true,
      cart: updatedCart,
      message: "Item removed from cart",
      removedItem: { itemId, variant },
    });
  } catch (error) {
    console.error("Remove from cart error:", error);
    return NextResponse.json(
      { error: "Failed to remove item from cart" },
      { status: 500 },
    );
  }
}
