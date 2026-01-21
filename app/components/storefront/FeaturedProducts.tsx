"use client";

import { useEffect, useRef, useState } from "react";
import ProductCard from "./ProductCard";
import { ChevronLeftCircle, ChevronRightCircle } from "lucide-react";
import { smoothScroll } from "@/app/utils/smoothScroll";

interface FeaturedProducts {
  id: string;
  name: string;
  images: string[];
  price: number;
  slug: string;
}

function FeaturedProducts() {
  const [loading, setLoading] = useState(true);
  const [featProds, setFeatProds] = useState<FeaturedProducts[]>([]);
  const [error, setError] = useState<string | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchFeatProds();
  }, []);

  async function fetchFeatProds() {
    try {
      setLoading(true);
      const response = await fetch("api/products/featured");
      const data = await response.json();
      if (data.success) {
        setFeatProds(data.featured || []);
      } else {
        setError(data.message || "Failed to fetch featured products");
      }
    } catch (error) {
      console.error("Error fetching banners:", error);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const scrollLeft = () => {
    if (sliderRef.current) {
      smoothScroll(sliderRef.current, -sliderRef.current.offsetWidth);
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      smoothScroll(sliderRef.current, sliderRef.current.offsetWidth);
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-18 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between">
        <h2 className="text-4xl font-bold text-foreground mb-8">
          <span className="text-primary">Featured </span>Products
        </h2>
        <div className="flex gap-7 text-primary">
          <ChevronLeftCircle
            onClick={scrollLeft}
            className=" hover:cursor-pointer hover:text-primary/80"
          />
          <ChevronRightCircle
            onClick={scrollRight}
            className=" hover:cursor-pointer hover:text-primary/80"
          />
        </div>
      </div>
      <div
        ref={sliderRef}
        className="flex overflow-x-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-4 gap-4"
      >
        {featProds.map((item) => (
          <div key={item.id} className="min-w-62.5 shrink-0">
            <ProductCard
              params={{
                name: item.name,
                image: item.images[0],
                price: item.price,
                slug: item.slug,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default FeaturedProducts;
