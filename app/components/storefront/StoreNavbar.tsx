import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignInButton, SignOutButton, SignUpButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { CircleUser, MenuIcon } from "lucide-react";
import { StoreNavLinks } from "./StoreNavLinks";
import Link from "next/link";
import { DarkModeToggle } from "../DarkModeToggle";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CartSheet } from "@/app/components/storefront/CartSheet"; // Import the new component

export default async function StoreNavbar() {
  const user = await currentUser();
  const adminEmail = process.env.ADMIN_EMAIL;
  const userEmail = user?.emailAddresses[0]?.emailAddress;
  const isAdmin = userEmail === adminEmail;

  return (
    <div className="sticky top-0 flex h-24 items-center justify-between gap-4 border-b bg-card px-6 z-50">
      <div className="hidden md:flex justify-center items-center">
        <div className="flex flex-col">
          <Link href={"/"}>
            <h1 className="text-4xl font-bold mr-8">
              Shoe
              <span className="text-primary">Mart</span>
            </h1>
          </Link>
          {isAdmin ? <p className="text-xs">You are logged in as ADMIN</p> : ""}
        </div>
        <div className="hidden md:flex justify-center items-center">
          <StoreNavLinks isAdmin={isAdmin} />
        </div>
      </div>
      <div className="flex justify-center items-center md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              className="shrink-0 md:hidden bg-primary text-primary-foreground"
              size="icon"
            >
              <MenuIcon className="h-5 w-5 " />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetTitle>
              <nav className="flex flex-col gap-6 text-lg font-medium mt-7 ml-10">
                <StoreNavLinks isAdmin={isAdmin} />
              </nav>
            </SheetTitle>
          </SheetContent>
        </Sheet>
        <div className="flex flex-col ml-3">
          <Link href={"/"}>
            <h1 className="text-4xl font-bold mr-8">
              S<span className="text-primary">M</span>
            </h1>
          </Link>
          {isAdmin ? <p className="text-xs pl-2">Admin</p> : ""}
        </div>
      </div>

      <div>
        {!user ? (
          <div className="flex justify-center items-center gap-5">
            <Button asChild>
              <SignUpButton>Sign Up</SignUpButton>
            </Button>
            <Button
              asChild
              className="px-5 bg-primary-foreground text-primary hover:bg-gray-100"
            >
              <SignInButton>Login</SignInButton>
            </Button>
          </div>
        ) : (
          <div className="flex gap-8 justify-center items-center">
            <DarkModeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="rounded-full bg-primary p-2 hover:cursor-pointer hover:bg-primary/80">
                  <CircleUser className="text-primary-foreground h-6 w-6" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <SignOutButton>Logout</SignOutButton>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Use the CartSheet component */}
            <CartSheet />
          </div>
        )}
      </div>
    </div>
  );
}
