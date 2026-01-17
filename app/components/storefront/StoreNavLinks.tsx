"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  {
    name: "New & Featured",
    href: "/featured",
  },
  {
    name: "All Products",
    href: "/products",
  },
  {
    name: "Men",
    href: "/men",
  },
  {
    name: "Women",
    href: "/women",
  },
  {
    name: "Kids",
    href: "/kids",
  },
];

// Type for admin links
const adminLinks = [
  {
    name: "Admin Dashboard",
    href: "/dashboard",
  },
];

// This is a client component now, so we need to pass admin status as prop
export function StoreNavLinks({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathName = usePathname();

  // Combine regular links with admin links if user is admin
  const allLinks = [...links, ...(isAdmin ? adminLinks : [])];

  return (
    <>
      {allLinks.map((link) => {
        const isActive = link.href === pathName;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "text-accent-foreground font-semibold hover:cursor-pointer m-4 transition-all duration-200",
              isActive
                ? "underline text-primary"
                : "hover:underline hover:text-primary"
            )}
          >
            {link.name}
          </Link>
        );
      })}
    </>
  );
}
