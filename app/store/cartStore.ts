import { create } from "zustand";

interface CartItem {
  id: string;
  quantity: number;
  price: number;
}

interface CartState {
  specificItemCount: number;
  totalItems: number;
  isLoading: boolean;
  error: string | null;

  fetchCartCount: () => Promise<void>; // Add this new function
  setTotalItems: (count: number) => void;

  thisItemCount: (slug: string) => Promise<void>;
  setSpecificItemCount: (count: number) => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  totalItems: 0,
  isLoading: false,
  error: null,
  specificItemCount: 0,

  setTotalItems: (count) => set({ totalItems: count }),
  setSpecificItemCount: (count) => set({ specificItemCount: count }),

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

        set({ totalItems: 0, isLoading: false });
        return;
      }

      const data = await res.json();
      set({ totalItems: data.count || 0, isLoading: false });
    } catch (err) {
      console.error("Failed to fetch cart count", err);
      set({ isLoading: false, error: "Failed to fetch cart count" });
    }
  },

  thisItemCount: async (slug) => {
    try {
      set({ isLoading: true, error: null });
      const res = await fetch(`/api/cart/count/${slug}`, {
        // Add cache control to prevent stale data
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      if (!res.ok) {
        // Fallback to the full cart endpoint if count endpoint fails
        console.log("Cart count endpoint failed, falling back to full cart...");

        set({ specificItemCount: 0, isLoading: false });
        return;
      }

      const data = await res.json();
      set({ specificItemCount: data.count || 0, isLoading: false });
    } catch (err) {
      console.error("Failed to fetch specific item count", err);
      set({ isLoading: false, error: "Failed to fetch specific item count" });
    }
  },
}));
