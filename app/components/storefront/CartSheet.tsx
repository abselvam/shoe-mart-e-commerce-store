"use client";

import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingBag, X, Plus, Minus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/app/store/cartStore";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  images?: string[];
}

interface Cart {
  userId?: string;
  items: CartItem[];
}

export function CartSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cart, setCart] = useState<Cart>({ items: [] });
  const { totalItems, fetchCartCount } = useCartStore();
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    fetchCartCount();
  }, []);

  // Fetch cart when sheet opens
  const fetchCart = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/cart");

      if (response.ok) {
        const cartData = await response.json();
        setCart(cartData);

        // Calculate totals
        const itemsCount = cartData.items.reduce(
          (sum: number, item: CartItem) => sum + item.quantity,
          0,
        );
        const priceTotal = cartData.items.reduce(
          (sum: number, item: CartItem) => sum + item.price * item.quantity,
          0,
        );

        setTotalPrice(priceTotal);
        // Update Zustand store after calculating count
        useCartStore.getState().setTotalItems(itemsCount);
      } else if (response.status === 401) {
        // User not logged in
        setCart({ items: [] });
        useCartStore.getState().setTotalItems(0);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch cart when sheet opens
  useEffect(() => {
    if (isOpen) {
      fetchCart();
    }
  }, [isOpen]);

  const handleSheetOpen = (open: boolean) => {
    setIsOpen(open);
  };

  // Optional: Remove item function
  const handleRemoveItem = async (itemId: string) => {
    try {
      const response = await fetch("/api/cart/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId: itemId }),
      });

      if (response.ok) {
        fetchCart(); // Refresh cart
        fetchCartCount(); // Also refresh the global cart store
      }
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  // Fixed: Update quantity function
  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      const response = await fetch("/api/cart/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId: itemId, quantity: newQuantity }),
      });

      if (response.ok) {
        // Update local cart state immediately for better UX
        setCart((prevCart) => {
          const updatedItems = prevCart.items.map((item) => {
            if (item.id === itemId) {
              return { ...item, quantity: newQuantity };
            }
            return item;
          });

          const newTotalPrice = updatedItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0,
          );

          setTotalPrice(newTotalPrice);
          return { ...prevCart, items: updatedItems };
        });

        // Don't update Zustand store here - let server refresh handle it
        // Also refresh from server to ensure consistency
        setTimeout(() => {
          fetchCart();
          fetchCartCount();
        }, 100);
      }
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleSheetOpen}>
      <SheetTrigger asChild>
        <div className="rounded-full bg-primary p-2 hover:cursor-pointer hover:bg-primary/80 relative transition-all duration-200 hover:scale-105">
          <ShoppingBag className="text-primary-foreground h-6 w-6" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg">
              {totalItems}
            </span>
          )}
        </div>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 overflow-hidden"
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-background border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-xl font-bold text-foreground">
                Your Shopping Cart
                {totalItems > 0 && (
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    ({totalItems} {totalItems === 1 ? "item" : "items"})
                  </span>
                )}
              </SheetTitle>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 hover:bg-accent transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4"></div>
                <p className="text-muted-foreground">Loading your cart...</p>
              </div>
            ) : (
              <>
                {cart.items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <div className="rounded-full bg-accent p-4 mb-4">
                      <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Your cart is empty
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Add some products to get started
                    </p>
                    <Button
                      onClick={() => setIsOpen(false)}
                      asChild
                      className="px-8"
                    >
                      <Link href="/products">Browse Products</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.items.map((item) => (
                      <div
                        key={item.id}
                        className="group flex gap-4 p-4 bg-card border rounded-xl hover:shadow-md transition-all duration-200"
                      >
                        {/* Product Image */}
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                          {item.images && item.images.length > 0 ? (
                            <Image
                              src={item.images[0]}
                              alt={item.name}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full w-full">
                              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <div className="flex-1">
                              <h4 className="font-semibold text-foreground truncate">
                                {item.name.length > 25
                                  ? item.name.slice(0, 25) + "..."
                                  : item.name}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                ${item.price.toFixed(2)} each
                              </p>
                            </div>
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-accent rounded"
                            >
                              <X className="h-4 w-4 text-muted-foreground" />
                            </button>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item.id,
                                    item.quantity - 1,
                                  )
                                }
                                disabled={item.quantity <= 1}
                                className="p-1 rounded-md border hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-8 text-center font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item.id,
                                    item.quantity + 1,
                                  )
                                }
                                className="p-1 rounded-md border hover:bg-accent"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            <p className="font-bold text-lg text-foreground">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Cart Summary & Checkout */}
          {cart.items.length > 0 && (
            <div className="sticky bottom-0 border-t bg-background px-6 py-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-bold text-lg text-foreground">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground">FREE</span>
                </div>
                <div className="border-t pt-2 flex justify-between items-center">
                  <span className="font-semibold text-foreground">
                    Estimated Total
                  </span>
                  <span className="font-bold text-xl text-primary">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              <SheetFooter className="mt-4">
                <div className="w-full space-y-3">
                  <Button
                    className="w-full py-6 text-base font-semibold bg-primary hover:bg-primary/90"
                    onClick={() => setIsOpen(false)}
                    asChild
                  >
                    <Link href="/checkout">Proceed to Checkout</Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsOpen(false)}
                    asChild
                  >
                    <Link href="/cart">View Full Cart</Link>
                  </Button>
                </div>
              </SheetFooter>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
