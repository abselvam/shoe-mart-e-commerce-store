// app/lib/cart.ts - AUTHENTICATED USERS ONLY
import { Cart } from "./types/cart";
import { redis } from "./upstash";

const CART_EXPIRY = 60 * 60 * 24 * 7; // 7 days in seconds

export async function getCart(userId: string) {
  // Removed sessionId parameter
  if (!userId) {
    throw new Error("User ID is required");
  }

  const key = `cart:user:${userId}`; // Simplified key
  const cart = await redis.get<Cart>(key);

  if (!cart) {
    return {
      userId,
      items: [],
      updatedAt: Date.now(),
      expiresAt: Math.floor(Date.now() / 1000) + CART_EXPIRY,
    };
  }

  // Check if cart has expired
  if (cart.expiresAt && cart.expiresAt < Math.floor(Date.now() / 1000)) {
    await redis.del(key);
    return {
      userId,
      items: [],
      updatedAt: Date.now(),
      expiresAt: Math.floor(Date.now() / 1000) + CART_EXPIRY,
    };
  }

  return cart;
}

export async function saveCart(cart: Cart) {
  if (!cart.userId) {
    throw new Error("Cart must have a userId");
  }

  const key = `cart:user:${cart.userId}`;
  const expiresAt = Math.floor(Date.now() / 1000) + CART_EXPIRY;

  const cartToSave = {
    ...cart,
    updatedAt: Date.now(),
    expiresAt,
  };

  await redis.set(key, cartToSave, { ex: CART_EXPIRY });
  return cartToSave;
}

// Optional: Remove mergeCarts function if not needed
// Since we only have authenticated users, no merging needed

// In cart.ts - UPDATE clearCart function
export async function clearCart(userId: string) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const emptyCart = {
    userId,
    items: [],
    updatedAt: Date.now(),
    expiresAt: Math.floor(Date.now() / 1000) + CART_EXPIRY,
  };

  // Save empty cart instead of deleting
  await saveCart(emptyCart);

  return {
    success: true,
    message: "Cart cleared successfully",
    cart: emptyCart,
  };
}

export async function getCartItemCount(userId: string): Promise<number> {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const cart = await getCart(userId);
  return cart.items.reduce((total, item) => total + item.quantity, 0);
}

export async function getCartTotal(userId: string): Promise<number> {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const cart = await getCart(userId);
  return cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
}
