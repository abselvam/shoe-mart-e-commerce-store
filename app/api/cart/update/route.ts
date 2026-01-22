// app/api/cart/update/route.ts - AUTHENTICATED VERSION
import { NextRequest, NextResponse } from "next/server";
import { getCart, saveCart } from "@/app/lib/cart";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in to update your cart" },
        { status: 401 },
      );
    }

    const { itemId, quantity, variant } = await request.json();

    // Validation
    if (!itemId || quantity === undefined) {
      return NextResponse.json(
        { error: "Item ID and quantity are required" },
        { status: 400 },
      );
    }

    if (quantity < 0) {
      return NextResponse.json(
        { error: "Quantity cannot be negative" },
        { status: 400 },
      );
    }

    // Optional: Validate quantity is integer
    if (!Number.isInteger(quantity)) {
      return NextResponse.json(
        { error: "Quantity must be a whole number" },
        { status: 400 },
      );
    }

    // Use authenticated user's ID
    const userId = user.id;

    // Get user's cart
    const cart = await getCart(userId);

    // Find the item
    const itemIndex = cart.items.findIndex(
      (item) => item.id === itemId && (!variant || item.variant === variant),
    );

    if (itemIndex === -1) {
      return NextResponse.json(
        {
          error: "Item not found in cart",
          itemId,
          variant,
        },
        { status: 404 },
      );
    }

    let updatedItems = [...cart.items];

    if (quantity === 0) {
      // Remove item if quantity is 0
      updatedItems.splice(itemIndex, 1);
    } else {
      // Update quantity
      updatedItems[itemIndex] = {
        ...updatedItems[itemIndex],
        quantity,
      };
    }

    // Update cart with userId
    const updatedCart = {
      ...cart,
      userId, // Ensure userId is set
      items: updatedItems,
    };

    await saveCart(updatedCart);

    return NextResponse.json({
      success: true,
      cart: updatedCart,
      message:
        quantity === 0
          ? "Item removed from cart"
          : "Quantity updated successfully",
      action: quantity === 0 ? "removed" : "updated",
      updatedItem: { itemId, variant, quantity },
    });
  } catch (error) {
    console.error("Update cart error:", error);
    return NextResponse.json(
      { error: "Failed to update cart" },
      { status: 500 },
    );
  }
}
