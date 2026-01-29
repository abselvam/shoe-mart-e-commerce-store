import { ReactNode } from "react";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import SecureNavBar from "@/app/components/checkout/SecureNavBar";

export default async function CheckoutLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await currentUser();

  // user is not logged in
  if (!user) redirect("/");
  return (
    <>
      <SecureNavBar />
      <div className="flex w-full flex-col max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <main className="my-5">{children}</main>
      </div>
    </>
  );
}
