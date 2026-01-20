import { currentUser } from "@clerk/nextjs/server";
import { ReactNode } from "react";
import StoreNavbar from "@/app/components/storefront/StoreNavbar";

export default async function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await currentUser();

  let isUser = false;
  // user is logged in
  if (user) {
    isUser = true;
  }
  return (
    <>
      <StoreNavbar />
      <div className="flex w-full flex-col max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <main className="my-5">{children}</main>
      </div>
    </>
  );
}
