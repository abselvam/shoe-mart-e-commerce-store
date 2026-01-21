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

function CategoriesPageDisplay({ category }: { category: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [category]);

  async function fetchProducts() {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${category}`);
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

  function getCategoryName(category: string): string {
    switch (category) {
      case "men":
        return "Men's Collection";
      case "women":
        return "Women's Collection";
      case "kids":
        return "Kids' Collection";
      default:
        return "Products";
    }
  }

  // Usage:
  const categoryName = getCategoryName(category);

  return (
    <div className="min-h-screen">
      <h1 className="text-3xl text-foreground my-6 font-bold">
        {categoryName}
      </h1>
      <div className="px-10 mt-15 flex grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            params={{
              name: product.name,
              image: product.images[0],
              price: product.price,
              slug: product.slug,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default CategoriesPageDisplay;
