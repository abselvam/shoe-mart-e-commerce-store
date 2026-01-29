"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const createOrder = async () => {
      try {
        // Get checkout data from localStorage
        const checkoutDataStr = localStorage.getItem("checkoutData");
        if (!checkoutDataStr) {
          setError("Checkout data not found");
          setIsProcessing(false);
          return;
        }

        const checkoutData = JSON.parse(checkoutDataStr);

        // Create order
        const orderResponse = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: checkoutData.name,
            email: checkoutData.email,
            phone: checkoutData.phone,
            address: checkoutData.address,
            items: checkoutData.items,
            totalPrice: checkoutData.totalPrice,
            paymentMethod: "online",
          }),
        });

        const orderResult = await orderResponse.json();

        if (orderResponse.ok) {
          // Clear cart
          try {
            await fetch("/api/cart/clear", {
              method: "POST",
            });
          } catch (cartError) {
            console.warn("Order created but failed to clear cart:", cartError);
          }

          // Clear localStorage
          localStorage.removeItem("checkoutData");

          // Redirect to success page
          router.push("/checkout/success");
        } else {
          setError(orderResult.message || "Failed to create order");
          setIsProcessing(false);
        }
      } catch (error) {
        console.error("Error creating order:", error);
        setError("An error occurred while processing your order");
        setIsProcessing(false);
      }
    };

    createOrder();
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="bg-card p-8 rounded-2xl max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="mb-4">{error}</p>
          <button
            onClick={() => router.push("/checkout")}
            className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/80"
          >
            Return to Checkout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="bg-card p-8 rounded-2xl max-w-md w-full text-center">
        <div className="flex items-center justify-center mb-4">
          <div
            className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          >
            <span className="sr-only">Processing...</span>
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-2">Processing Your Order</h1>
        <p className="text-muted-foreground">
          Please wait while we confirm your payment and create your order...
        </p>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-e-transparent" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
