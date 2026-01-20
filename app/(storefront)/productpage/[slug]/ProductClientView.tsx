"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  description?: string;
  category: string;
  slug: string;
}

function ProductClientView({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);

  async function fetchProduct() {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${productId}`);
      const data = await response.json();

      if (data.success) {
        setProduct(data.product); // ✅ FIX: Use data.product
      } else {
        setError(data.message || "Failed to fetch product");
        console.error(data.message, "Error fetching product details");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  if (loading)
    return (
      <div className="flex justify-center items-center text-5xl text-foreground bg-background min-h-screen">
        Loading...
      </div>
    );
  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex gap-4 justify-center">
        {/* Left - Image Gallery */}
        <div className="flex gap-4 w-180 h-130">
          {/* Thumbnail Column */}
          <Card className="flex flex-col gap-2 p-3">
            {product.images.map((image, index) => (
              <Button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative h-16 w-16 rounded-md overflow-hidden border ${
                  selectedImage === index ? "border-primary" : "border-gray-200"
                }`}
              >
                <Image
                  alt={`Thumbnail ${index + 1}`}
                  src={image}
                  fill
                  className="object-cover"
                />
              </Button>
            ))}
          </Card>

          {/* Main Image */}
          <Card className="flex w-180">
            <CardContent className="p-4">
              <div className="relative h-100">
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right - Product Details */}
        <div className="min-h-full">
          <Card className="flex-1 lg:max-w-md h-full">
            <CardContent className="px-10 py-0">
              <div className=" flex flex-col space-y-6">
                <div>
                  <h1 className="text-3xl font-bold">{product.name}</h1>
                  <p className="text-sm text-secondary-foreground">
                    {product.category}
                  </p>
                </div>

                <p className="text-3xl font-bold text-primary">
                  ${product.price.toFixed(2)}
                </p>

                {product.description && (
                  <div>
                    <p className="text-secondary-foreground">
                      {product.description}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
            <div className="flex flex-col justify-end gap-4 h-full px-10 py-2">
              <Button className="w-full py-6 text-lg bg-secondary-foreground hover:bg-secondary-foreground/80">
                Add to Bag
                <ShoppingBag className="text-primary-foreground ml-4" />
              </Button>
              <Button className="w-full py-6 text-lg">Buy Now</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ProductClientView;
