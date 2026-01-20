"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Banner {
  id: string;
  name: string;
  image: string;
  createdAt: string;
}

function Hero() {
  const [loading, setLoading] = useState(true);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch products from API
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/banners");
      const data = await response.json();

      if (data.success) {
        setBanners(data.banners || []);
      } else {
        setError(data.message || "Failed to load banners");
      }
    } catch (error) {
      console.error("Error fetching banners:", error);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full mt-4 px-4 sm:px-6 lg:px-8">
      <Carousel className="w-full">
        <CarouselContent className="ml-0">
          {banners.map((item) => (
            <CarouselItem key={item.id} className="pl-0">
              <div className="relative w-full h-100 md:h-125 lg:h-150 overflow-hidden rounded-2xl">
                <Image
                  alt="Banner image"
                  src={item.image}
                  fill
                  className="object-cover"
                  priority
                  sizes="100vw"
                />
                {/* Optional gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/10 via-transparent to-transparent" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Previous Button */}
        <CarouselPrevious className="absolute left-6 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-white text-primary font-semibold border-none shadow-lg h-12 w-12 rounded-full hidden sm:flex" />

        {/* Next Button */}
        <CarouselNext className="absolute right-6 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-white text-primary font-semibold border-none shadow-lg h-12 w-12 rounded-full hidden sm:flex" />
      </Carousel>
    </div>
  );
}

export default Hero;
