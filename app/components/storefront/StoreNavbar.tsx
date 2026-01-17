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
import { CircleUser, ShoppingBag } from "lucide-react";
import { StoreNavLinks } from "./StoreNavLinks";
import Link from "next/link";

export default async function StoreNavbar() {
  const user = await currentUser();
  const adminEmail = process.env.ADMIN_EMAIL;
  const userEmail = user?.emailAddresses[0]?.emailAddress;
  const isAdmin = userEmail === adminEmail;

  return (
    <div className="flex justify-between h-18 bg-secondary py-4 px-20">
      <div className="flex justify-center items-center">
        <div className="flex flex-col">
          <Link href={"/"}>
            <h1 className="text-4xl font-bold mr-20">
              Shoe
              <span className="text-primary">Mart</span>
            </h1>
          </Link>
          {isAdmin ? <p className="text-xs">You are logged in as ADMIN</p> : ""}
        </div>
        <StoreNavLinks isAdmin={isAdmin} />
      </div>
      <div>
        {!user ? (
          <div className=" flex justify-center items-center gap-5">
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
          <div className="flex gap-13 justify-center items-center">
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
            <div className="rounded-full bg-primary p-2 hover:cursor-pointer hover:bg-primary/80">
              <ShoppingBag className="text-primary-foreground h-6 w-6" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
