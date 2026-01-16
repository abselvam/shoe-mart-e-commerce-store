import { db } from "@/db";
import { banner } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

async function isAdminUser(): Promise<boolean> {
  try {
    const user = await currentUser();
    if (!user) return false;

    const userEmail = user.emailAddresses[0]?.emailAddress;
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

    return userEmail === ADMIN_EMAIL;
  } catch (error) {
    console.error("Error checking admin:", error);
    return false;
  }
}

// Type definition for params
interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // ✅ For Next.js 16: Await the params Promise
    const { id } = await params;

    // Check if user is admin
    const isAdmin = await isAdminUser();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, message: "Only admin can delete products" },
        { status: 403 }
      );
    }

    // Check if product exists
    const [existingBanner] = await db
      .select()
      .from(banner)
      .where(eq(banner.id, id))
      .limit(1);

    if (!existingBanner) {
      return NextResponse.json(
        { success: false, message: "Banner not found" },
        { status: 404 }
      );
    }

    // Delete Banner
    await db.delete(banner).where(eq(banner.id, id));

    return NextResponse.json({
      success: true,
      message: "banner deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting banner:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete banner" },
      { status: 500 }
    );
  }
}
