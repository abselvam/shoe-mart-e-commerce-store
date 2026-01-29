"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import CheckoutForm from "./CheckoutForm";

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

function PaymentPageContent() {
  const searchParams = useSearchParams();
  const amount = parseFloat(searchParams.get("amount") || "0");

  if (!amount || amount <= 0) {
    return (
      <div className="min-h-screen bg-background flex mt-10 justify-center px-20">
        <div className="h-100 w-300 bg-primary rounded-2xl flex flex-col gap-4 p-10">
          <h1 className="text-2xl text-white">Invalid amount</h1>
          <p className="text-white">Please go back and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex mt-10 justify-center px-20">
      <div className="h-120 w-300 bg-primary rounded-2xl flex flex-col gap-4 p-10">
        <h1 className="text-2xl text-white mb-4">Complete Your Payment</h1>
        <Elements
          stripe={stripePromise}
          options={{
            mode: "payment",
            amount: Math.round(amount * 100), // Convert to cents
            currency: "usd",
          }}
        >
          <CheckoutForm amount={amount} />
        </Elements>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex mt-10 justify-center px-20">
          <div className="h-100 w-300 bg-primary rounded-2xl flex flex-col gap-4 p-10">
            <div className="flex items-center justify-center">
              <div
                className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-white motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status"
              >
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <PaymentPageContent />
    </Suspense>
  );
}
