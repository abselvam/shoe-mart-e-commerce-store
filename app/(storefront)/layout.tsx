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
      <div className="min-h-screen flex flex-col">
        <StoreNavbar />
        <main>{children}</main>
      </div>
    </>
  );
}
