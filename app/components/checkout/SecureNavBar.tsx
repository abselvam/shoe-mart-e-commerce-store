import Link from "next/link";
import { DarkModeToggle } from "../DarkModeToggle";

export default function SecureNavBar() {
  return (
    <div className="w-full h-18 bg-card px-10 py-4 flex justify-between z-50">
      <div className="hidden md:flex text-left">
        <Link href={"/"}>
          <h1 className="text-4xl font-bold mr-8">
            Shoe
            <span className="text-primary">Mart</span>
          </h1>
        </Link>
      </div>
      <div className="md:hidden flex ml-3">
        <Link href={"/"}>
          <h1 className="text-4xl font-bold mr-8">
            S<span className="text-primary">M</span>
          </h1>
        </Link>
      </div>
      <div className="flex justify-between gap-13 md:gap-150">
        <h1 className="text-card-foreground text-lg md:text-3xl font-semibold">
          Secure checkout
        </h1>
        <DarkModeToggle />
      </div>
    </div>
  );
}
