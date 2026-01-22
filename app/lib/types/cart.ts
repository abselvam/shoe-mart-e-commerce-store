// app/lib/types/cart.ts
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variant?: string;
  addedAt?: string; // When item was added to cart
}

export interface Cart {
  userId: string; // Required for authenticated users
  items: CartItem[];
  updatedAt: number;
  expiresAt?: number;
}
