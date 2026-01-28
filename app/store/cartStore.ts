import { create } from "zustand";

interface CartItem {
  id: string;
  quantity: number;
  price: number;
}

interface CartState {
  totalItems: number;
  isLoading: boolean;
  error: string | null;

  refreshCart: () => Promise<void>;
  setTotalItems: (count: number) => void;
  fetchCartCount: () => Promise<void>; // Add this new function
}

export const useCartStore = create<CartState>((set, get) => ({
  totalItems: 0,
  isLoading: false,
  error: null,

  setTotalItems: (count) => set({ totalItems: count }),

  refreshCart: async () => {
    try {
      set({ isLoading: true, error: null });

      const res = await fetch("/api/cart");
      if (!res.ok) {
        // If unauthorized (401), set count to 0
        if (res.status === 401) {
          set({ totalItems: 0, isLoading: false });
          return;
        }
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const cart = await res.json();

      const count = cart.items.reduce(
        (sum: number, item: CartItem) => sum + item.quantity,
        0,
      );

      set({ totalItems: count, isLoading: false });
    } catch (err) {
      console.error("Failed to refresh cart", err);
      set({ isLoading: false, error: "Failed to load cart" });
    }
  },

  // NEW FUNCTION: Fetch only the cart count
  fetchCartCount: async () => {
    try {
      set({ isLoading: true, error: null });

      const res = await fetch("/api/cart/count", {
        // Add cache control to prevent stale data
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      if (!res.ok) {
        // Fallback to the full cart endpoint if count endpoint fails
        console.log("Cart count endpoint failed, falling back to full cart...");

        const fallbackRes = await fetch("/api/cart", {
          cache: "no-store",
        });

        if (!fallbackRes.ok) {
          // If unauthorized, user is logged out - set count to 0
          if (fallbackRes.status === 401) {
            set({ totalItems: 0, isLoading: false });
            return;
          }
          throw new Error(`Fallback failed! status: ${fallbackRes.status}`);
        }

        const cart = await fallbackRes.json();
        const count =
          cart.items?.reduce(
            (sum: number, item: CartItem) => sum + (item.quantity || 0),
            0,
          ) || 0;

        set({ totalItems: count, isLoading: false });
        return;
      }

      const data = await res.json();
      set({ totalItems: data.count || 0, isLoading: false });
    } catch (err) {
      console.error("Failed to fetch cart count", err);
      set({ isLoading: false, error: "Failed to fetch cart count" });
    }
  },
}));
