import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import menImg from "@/public/men.jpeg";
import womenImg from "@/public/women.jpg";

function ShopByCategory() {
  // Image URLs array
  const categoryImages = [
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop", // All Products
  ];

  return (
    <div className="max-w-7xl mx-auto mt-18 px-4 sm:px-6 lg:px-8 ">
      {/* Heading */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
            Shop By <span className="text-primary">Category</span>
          </h2>
        </div>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-lg font-medium text-primary hover:text-primary/80 transition-colors"
        >
          Browse All Products
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Card Section */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 h-150">
        {/* Big Card - All Products */}
        <Link href="/products" className="lg:w-1/2">
          <Card className="overflow-hidden group transition-all duration-300 p-0 m-0 h-full">
            <div className="relative w-full h-full">
              <Image
                src={categoryImages[0]}
                alt="All Products"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="100vw"
                priority
              />
              <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 text-white">
                <h3 className="text-2xl md:text-3xl font-bold mb-2">
                  All Products
                </h3>
                <p className="text-white/90 mb-4 max-w-md">
                  Explore our complete collection of footwear
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-medium bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  Shop Now <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          </Card>
        </Link>

        {/* Small Cards - Men & Women */}
        <div className="lg:w-1/2 flex flex-col gap-6 h-full">
          {/* Men's Card */}
          <Link href="/products/men" className="flex-1 h-full">
            <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 p-0 flex-1 h-full">
              <div className="relative w-full h-full">
                <Image
                  src={menImg}
                  alt="Men's Collection"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-2xl font-bold">Men</h3>
                  <p className="text-sm text-white/90">View Products</p>
                </div>
              </div>
            </Card>
          </Link>

          {/* Women's Card */}
          <Link href="/products/women" className="flex-1 h-full">
            <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 p-0 flex-1 h-full">
              <div className="relative w-full h-full">
                <Image
                  src={womenImg}
                  alt="Women's Collection"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-2xl font-bold">Women</h3>
                  <p className="text-sm text-white/90">View Products</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ShopByCategory;
