import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { ReactNode } from "react";

interface Product {
  slug: string;
  name: string;
  price: number;
  image: string;
}

function ProductCard({ params }: { params: Product }) {
  return (
    <Link href={`/productpage/${params.slug}`}>
      <Card className="overflow-hidden w-90 h-120 hover:cursor-pointer py-0 gap-3">
        <div className="relative min-h-90">
          <Image
            src={params.image}
            alt={params.name}
            fill
            className="object-cover"
          />
        </div>
        <div className=" flex justify-between min-h-20 pr-4 pl-6 mb-18">
          <div className="flex flex-col justify-between">
            <h3 className="text-lg min-h-15">{params.name}</h3>
            <p className="text-primary text-lg font-semibold w-10 mb-1">
              ${params.price}
            </p>
          </div>
          <Button className="bg-primary text-primary-foreground rounded-full ml-4 h-10 w-10">
            <ShoppingBag />
          </Button>
        </div>
      </Card>
    </Link>
  );
}

export default ProductCard;
