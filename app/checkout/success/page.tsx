import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

function OrderSuccessPage() {
  return (
    <div className="felx flex-col items-center w-full min-h-screen">
      <h1 className="text-5xl my-20 ml-40">
        Your oder has been placed successfully
      </h1>
      <Link href={"/products"}>
        <Button className="w-100 h-18 text-2xl ml-90">
          Browse More Products
        </Button>
      </Link>
    </div>
  );
}

export default OrderSuccessPage;
