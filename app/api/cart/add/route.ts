// app/api/cart/add/route.ts - FIXED VERSION
import { NextRequest, NextResponse } from "next/server";
import { getCart, saveCart } from "@/app/lib/cart";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in to add items to cart" },
        { status: 401 },
      );
    }

    const { product, quantity = 1 } = await request.json();

    if (!product || !product.id) {
      return NextResponse.json(
        { error: "Product is required" },
        { status: 400 },
      );
    }

    // ✅ user.id is safe here (we checked !user above)
    const userId = user.id;

    // Get existing cart
    const cart = await getCart(userId);

    // Check if product already exists in cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.id === product.id,
    );

    let updatedItems = [...cart.items];

    if (existingItemIndex > -1) {
      // Update quantity
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + quantity,
      };
    } else {
      // Add new item
      updatedItems.push({
        ...product,
        quantity,
      });
    }

    // Update cart with userId
    const updatedCart = {
      ...cart,
      userId, // ✅ Add this line - saveCart requires it
      items: updatedItems,
    };

    await saveCart(updatedCart);

    return NextResponse.json({
      success: true,
      cart: updatedCart,
      message: "Item added to cart",
      itemCount: updatedItems.length,
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    return NextResponse.json(
      { error: "Failed to add item to cart" },
      { status: 500 },
    );
  }
}
