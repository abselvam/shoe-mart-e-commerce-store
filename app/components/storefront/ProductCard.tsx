import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { ReactNode } from "react";

interface FeaturedProducts {
  slug: string;
  name: string;
  price: number;
  image: string;
}

function ProductCard({ params }: { params: FeaturedProducts }) {
  return (
    <Link href={`/productpage/${params.slug}`}>
      <Card className="overflow-hidden w-80 h-90 hover:cursor-pointer py-0">
        <div className="relative h-90">
          <Image
            src={params.image}
            alt={params.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex justify-between pl-2 pr-8 pb-4 pt-0">
          <CardContent>
            <h3 className="font-semibold text-2xl">{params.name}</h3>
            <p className="text-primary text-lg font-bold mt-1">
              ${params.price}
            </p>
          </CardContent>
          <Button className="bg-primary text-primary-foreground rounded-full h-10 w-10">
            <ShoppingBag />
          </Button>
        </div>
      </Card>
    </Link>
  );
}

export default ProductCard;
