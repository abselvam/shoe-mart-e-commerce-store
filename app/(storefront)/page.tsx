import Hero from "@/app/components/storefront/Hero";
import ShopByCategory from "../components/storefront/ShopByCategory";
import FeaturedProducts from "../components/storefront/FeaturedProducts";

export default function PublicPage() {
  return (
    <div className="bg-background min-h-screen">
      <Hero />
      <FeaturedProducts />
      <ShopByCategory />
    </div>
  );
}
