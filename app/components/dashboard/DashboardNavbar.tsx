import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { DashboardNavigation } from "./DashboardNavigation";
import { Button } from "@/components/ui/button";
import { CircleUser, MenuIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignOutButton } from "@clerk/nextjs";
import { DarkModeToggle } from "../DarkModeToggle";

export default function DashboardNavbar() {
  return (
    <header className="sticky top-0 flex h-16 items-center justify-between gap-4 border-b bg-card px-10">
      <nav className="hidden font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg: gap-6">
        <DashboardNavigation />
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button className="shrink-0 md:hidden" variant="outline" size="icon">
            <MenuIcon className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetTitle>
          <SheetContent side="left">
            <nav className="flex flex-col gap-6 text-lg font-medium mt-7 ml-10">
              <DashboardNavigation />
            </nav>
          </SheetContent>
        </SheetTitle>
      </Sheet>
      <div className="flex gap-6">
        <DarkModeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" className="rounded-full ">
              <CircleUser className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <SignOutButton>Logout</SignOutButton>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
