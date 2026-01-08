import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clipboard, DollarSign, ShoppingBag, User } from "lucide-react";

export default function Dashboard() {
  return (
    <>
      <div className="grid gap-2 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card className="h-38 w-58">
          <CardHeader className="flex justify-center">
            <CardTitle className="font-bold text-xl">Total Revenue</CardTitle>
            <DollarSign className="h-6 w-6 text-green-500" />
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <p className="text-2xl font-bold">$1324.89</p>
            <p className="text-xs text-muted-foreground">
              Based on 100 Charges
            </p>
          </CardContent>
        </Card>
        <Card className="h-38 w-58">
          <CardHeader className="flex justify-center">
            <CardTitle className="font-bold text-xl">Total Sales</CardTitle>
            <ShoppingBag className="h-6 w-6 text-blue-500" />
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <p className="text-2xl font-bold">+75</p>
            <p className="text-xs text-muted-foreground">
              Toatal sales on Shoe Mart
            </p>
          </CardContent>
        </Card>
        <Card className="h-38 w-58">
          <CardHeader className="flex justify-center">
            <CardTitle className="font-bold text-xl">Toatal Products</CardTitle>
            <Clipboard className="h-6 w-6 text-indigo-500" />
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <p className="text-2xl font-bold">42</p>
            <p className="text-xs text-muted-foreground">
              Toatal Products in Shoe Mart
            </p>
          </CardContent>
        </Card>
        <Card className="h-38 w-58">
          <CardHeader className="flex justify-center">
            <CardTitle className="font-bold text-xl">Total Users</CardTitle>
            <User className="h-6 w-6 text-orange-500" />
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <p className="text-2xl font-bold">173</p>
            <p className="text-xs text-muted-foreground">
              Toatal users on Shoe Mart
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3 mt-10">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
            <CardDescription>
              Recent transactions from your store
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-8">
            <div className="flex items-center gap-4">
              <Avatar className="hidden sm:flex h-10 w-10">
                <AvatarFallback>AS</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium">Abhijith Selvam</p>
                <p className="text-sm text-muted-foreground ">
                  test@testmail.com
                </p>
              </div>
              <p className="ml-auto font-medium">+ $1,982.00</p>
            </div>
            <div className="flex items-center gap-4">
              <Avatar className="hidden sm:flex h-10 w-10">
                <AvatarFallback>AS</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium">Abhijith Selvam</p>
                <p className="text-sm text-muted-foreground ">
                  test@testmail.com
                </p>
              </div>
              <p className="ml-auto font-medium">+ $1,982.00</p>
            </div>
            <div className="flex items-center gap-4">
              <Avatar className="hidden sm:flex h-10 w-10">
                <AvatarFallback>AS</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium">Abhijith Selvam</p>
                <p className="text-sm text-muted-foreground ">
                  test@testmail.com
                </p>
              </div>
              <p className="ml-auto font-medium">+ $1,982.00</p>
            </div>
            <div className="flex items-center gap-4">
              <Avatar className="hidden sm:flex h-10 w-10">
                <AvatarFallback>AS</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium">Abhijith Selvam</p>
                <p className="text-sm text-muted-foreground ">
                  test@testmail.com
                </p>
              </div>
              <p className="ml-auto font-medium">+ $1,982.00</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
