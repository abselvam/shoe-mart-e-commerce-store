import { ReactNode } from "react";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DashboardNavbar from "../components/dashboard/DashboardNavbar";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await currentUser();

  // user is not logged in
  if (!user) redirect("/");

  const adminEmail = process.env.ADMIN_EMAIL;
  const userEmail = user.emailAddresses[0]?.emailAddress;

  // user is not the admin
  if (!adminEmail || userEmail !== adminEmail) redirect("/");
  return (
    <>
      <DashboardNavbar />
      <div className="flex w-full flex-col max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <main className="my-5">{children}</main>
      </div>
    </>
  );
}
