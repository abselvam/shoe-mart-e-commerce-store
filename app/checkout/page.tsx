"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

export default function CheckoutPage() {
  const [cart, setCart] = useState<Cart>({ items: [] });
  const router = useRouter();
  const [error, setError] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    cod: false,
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // Validation function
  const validateForm = () => {
    const errors = {
      name: "",
      email: "",
      phone: "",
      address: "",
    };
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = "Full name is required";
      isValid = false;
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
      isValid = false;
    }

    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
      isValid = false;
    } else if (!/^\d{10,}$/.test(formData.phone.replace(/\D/g, ""))) {
      errors.phone = "Phone number must be at least 10 digits";
      isValid = false;
    }

    if (!formData.address.trim()) {
      errors.address = "Address is required";
      isValid = false;
    } else if (formData.address.trim().length < 10) {
      errors.address = "Address must be at least 10 characters";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/cart");
      if (response.ok) {
        const cartData = await response.json();
        setCart(cartData);

        const priceTotal = cartData.items.reduce(
          (sum: number, item: CartItem) => sum + item.price * item.quantity,
          0,
        );
        setTotalPrice(priceTotal);

        const itemsCount = cartData.items.reduce(
          (sum: number, item: CartItem) => sum + item.quantity,
          0,
        );
      } else if (response.status === 401) {
        setCart({ items: [] });
        setTotalPrice(0);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setTotalPrice(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      setError("Please fix the errors in the form");
      return;
    }

    if (cart.items.length === 0) {
      setError("Your cart is empty");
      return;
    }

    // Store form data and cart in localStorage for the payment page
    const checkoutData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      items: cart.items,
      totalPrice: totalPrice,
    };

    localStorage.setItem("checkoutData", JSON.stringify(checkoutData));

    // Redirect to payment page with amount
    router.push(`/checkout/payment?amount=${totalPrice}`);
  };

  const handleSubmitCod = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      setError("Please fix the errors in the form");
      return;
    }

    if (cart.items.length === 0) {
      setError("Your cart is empty");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone.toString(),
          address: formData.address,
          items: cart.items,
          totalPrice: totalPrice,
          paymentMethod: "cod",
        }),
      });

      const orderResult = await orderResponse.json();

      if (orderResponse.ok) {
        try {
          const clearCartResponse = await fetch("/api/cart/clear", {
            method: "POST",
          });

          if (!clearCartResponse.ok) {
            console.warn("Order created but failed to clear cart");
          }

          router.push("/checkout/success");
        } catch (cartError) {
          console.error("Error clearing cart:", cartError);
          router.push("/checkout/success");
        }
      } else {
        setError(orderResult.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to update form data and clear field error
  const updateFormData = (
    field: keyof typeof formData,
    value: string | boolean,
  ) => {
    setFormData({ ...formData, [field]: value });
    // Clear error for this field when user starts typing
    if (typeof value === "string" && value.trim()) {
      setFormErrors({ ...formErrors, [field]: "" });
    }
  };

  return (
    <>
      <div className="md:hidden bg-card border-2 border-primary flex justify-center items-center h-12 mb-4 w-full rounded-2xl">
        <h1>View Order Summary</h1>
      </div>
      <div className="flex flex-row gap-4">
        {/* form */}
        <div className="bg-card min-h-screen w-full py-4 px-6 rounded-2xl">
          <form
            onSubmit={formData.cod ? handleSubmitCod : handleSubmit}
            className="flex flex-col gap-6"
          >
            <h1 className="text-2xl mb-2">Delivery Details</h1>

            {/* Name Field */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                required
                onChange={(e) => updateFormData("name", e.target.value)}
                className={formErrors.name ? "border-red-500" : ""}
              />
              {formErrors.name && (
                <p className="text-sm text-red-500">{formErrors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                required
                onChange={(e) => updateFormData("email", e.target.value)}
                className={formErrors.email ? "border-red-500" : ""}
              />
              {formErrors.email && (
                <p className="text-sm text-red-500">{formErrors.email}</p>
              )}
            </div>

            {/* Phone Field */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                required
                onChange={(e) => updateFormData("phone", e.target.value)}
                className={formErrors.phone ? "border-red-500" : ""}
              />
              {formErrors.phone && (
                <p className="text-sm text-red-500">{formErrors.phone}</p>
              )}
            </div>

            {/* Address Field */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="address">Address *</Label>
              <Textarea
                id="address"
                value={formData.address}
                required
                onChange={(e) => updateFormData("address", e.target.value)}
                className={formErrors.address ? "border-red-500" : ""}
                rows={4}
              />
              {formErrors.address && (
                <p className="text-sm text-red-500">{formErrors.address}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label>Payment Method</Label>
              <RadioGroup
                value={formData.cod ? "cod" : "online"}
                onValueChange={(value) =>
                  setFormData({ ...formData, cod: value === "cod" })
                }
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="online" id="pay-online" />
                  <Label htmlFor="pay-online">Pay Online</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cod" id="cash-on-delivery" />
                  <Label htmlFor="cash-on-delivery">Cash on Delivery</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Global Error Display */}
            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                {error}
              </div>
            )}

            {/* Submit Button */}
            {formData.cod ? (
              <div className="flex mt-10 justify-center items-center">
                <Button
                  type="submit"
                  className="w-full h-15 text-2xl bg-secondary-foreground hover:bg-secondary-foreground/80"
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Confirm Cash on Delivery"}
                </Button>
              </div>
            ) : (
              <div className="flex mt-10 justify-center items-center">
                <Button
                  type="submit"
                  className="w-full h-15 text-2xl"
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Pay Now"}
                </Button>
              </div>
            )}
          </form>
        </div>

        {/* summary */}
        <div className="hidden bg-card px-6 pt-4 md:flex flex-col min-h-screen w-210 rounded-2xl">
          <h1 className="text-2xl mb-4">Order Summary</h1>
          <div className="flex justify-between mb-2">
            <h1>Subtotal</h1>
            <h1>${totalPrice.toFixed(2)}</h1>
          </div>
          <div className="flex justify-between mb-2">
            <h1>Delivery/Shipping</h1>
            <h1>Free</h1>
          </div>
          <hr />
          <div className="flex justify-between mt-2 font-semibold">
            <h1>Total</h1>
            <h1>${totalPrice.toFixed(2)}</h1>
          </div>

          {/* items */}
          <div className="flex flex-col mt-6">
            <h1 className="text-xl my-4">Your items:</h1>
            {cart.items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between my-2 items-center h-40 w-full"
              >
                <div className="relative w-30 h-30">
                  {item.images && item.images.length > 0 ? (
                    <Image
                      src={item.images[0]}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  ) : (
                    <div>no image</div>
                  )}
                </div>
                <div className="w-60 pl-6 py-8">
                  <h1 className="mb-4 font-semibold">{item.name}</h1>
                  <h1 className="text-sm mb-2">
                    Each - ${item.price.toFixed(2)}
                  </h1>
                  <h1 className="text-sm mb-2">Qty - {item.quantity}</h1>
                  <h1 className="text-sm">
                    total - ${(item.price * item.quantity).toFixed(2)}
                  </h1>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
