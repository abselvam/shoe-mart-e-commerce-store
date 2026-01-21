"use client";

import ProductCard from "@/app/components/storefront/ProductCard";
import { useEffect, useState } from "react";

// Define Product type matching your schema
interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  images: string[];
  status: "draft" | "published" | "archived";
  category: "men" | "women" | "kids";
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

function AllProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      setLoading(true);
      const response = await fetch(`/api/products`);
      const data = await response.json();
      console.log("API Response data:", data);
      if (data.success) {
        setProducts(data.products);
      } else {
        // setError(data.message || "Failed to fetch product");
        console.error(data.message, "Error fetching product details");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      //   setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen">
      <h1 className="text-3xl text-foreground my-6 font-bold">All Products</h1>
      <div className="px-30 mt-15 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 place-content-center">
        {products.map((product) => (
          <div key={product.id} className="my-4">
            <ProductCard
              params={{
                name: product.name,
                image: product.images[0],
                price: product.price,
                slug: product.slug,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllProducts;
