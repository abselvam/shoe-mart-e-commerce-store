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
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Cart {
  userId?: string;
  items: CartItem[];
}

export function CartSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cart, setCart] = useState<Cart>({ items: [] });
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

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

        setTotalItems(itemsCount);
        setTotalPrice(priceTotal);
      } else if (response.status === 401) {
        // User not logged in
        setCart({ items: [] });
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

  return (
    <Sheet open={isOpen} onOpenChange={handleSheetOpen}>
      <SheetTrigger asChild>
        <div className="rounded-full bg-primary p-2 hover:cursor-pointer hover:bg-primary/80 relative">
          <ShoppingBag className="text-primary-foreground h-6 w-6" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </div>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetTitle className="text-xl font-bold mb-4">
          Your Cart {totalItems > 0 && `(${totalItems})`}
        </SheetTitle>

        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {cart.items.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingBag className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500">Your cart is empty</p>
                </div>
              ) : (
                cart.items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 border rounded hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <span className="font-bold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>${item.price.toFixed(2)} each</span>
                      <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                        Qty: {item.quantity}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Summary */}
            {cart.items.length > 0 && (
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Subtotal:</span>
                  <span className="font-bold text-lg">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Items in cart:</span>
                  <span>{totalItems}</span>
                </div>
              </div>
            )}

            {/* Footer Button */}
            <SheetFooter className="mt-6">
              {cart.items.length > 0 ? (
                <div className="flex gap-3 w-full">
                  <Button
                    className="flex-1"
                    onClick={() => setIsOpen(false)}
                    asChild
                  >
                    <Link href="/checkout">Checkout</Link>
                  </Button>
                </div>
              ) : (
                <Button
                  className="w-full"
                  onClick={() => setIsOpen(false)}
                  asChild
                >
                  <Link href="/products">Shop Products</Link>
                </Button>
              )}
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
