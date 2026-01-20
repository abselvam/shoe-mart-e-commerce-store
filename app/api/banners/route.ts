import { db } from "@/db";
import { banner, insertBannerSchema } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import z from "zod";

async function isAdminUser(): Promise<boolean> {
  try {
    // 1. Get current user from Clerk
    const user = await currentUser();
    if (!user) {
      console.log("❌ No user found");
      return false;
    }

    // 2. Get user's email
    const userEmail = user.emailAddresses[0]?.emailAddress;
    if (!userEmail) {
      console.log("❌ User has no email");
      return false;
    }

    // 3. Get admin email from .env
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    if (!ADMIN_EMAIL) {
      console.log("⚠️ Warning: ADMIN_EMAIL not set in .env");
      return false;
    }

    // 4. Simple check: does user email match admin email?
    const isAdmin = userEmail === ADMIN_EMAIL;

    if (isAdmin) {
      console.log("✅ User is admin:", userEmail);
    } else {
      console.log("❌ User is NOT admin:", userEmail);
    }

    return isAdmin;
  } catch (error) {
    console.error("Error checking admin:", error);
    return false;
  }
}

//POST add new banner
export async function POST(request: Request) {
  try {
    const isAdmin = await isAdminUser();
    if (!isAdmin) {
      return NextResponse.json(
        {
          success: false,
          message: "User not authorized",
        },
        { status: 403 },
      );
    }
    console.log("✅ Admin verified, creating product...");
    const body = await request.json();
    let validatedData;
    try {
      validatedData = insertBannerSchema.parse(body);
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        console.log("❌ Zod validation failed:", error);

        // ✅ FIX: In Zod v3.22+, use error.issues instead of error.errors
        const formattedErrors = error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
          code: issue.code,
        }));

        return NextResponse.json(
          {
            success: false,
            message: "Validation failed",
            errors: formattedErrors,
          },
          { status: 400 },
        );
      }
      throw error;
    }

    const { name, image } = validatedData;

    const existingBannerByName = await db
      .select()
      .from(banner)
      .where(eq(banner.name, name.trim()))
      .limit(1);

    if (existingBannerByName.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "A banner with this name already exists",
        },
        { status: 409 }, // Conflict status code
      );
    }

    //add new banner
    const [newBanner] = await db
      .insert(banner)
      .values({ name: name.trim(), image: image })
      .returning();

    console.log("✅ Product created:", newBanner.name);

    return NextResponse.json(
      {
        success: true,
        message: "Banner added",
        product: newBanner,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error:", error);

    // Simple error handling
    if (error.message?.includes("unique constraint")) {
      return NextResponse.json(
        {
          success: false,
          message: "Banner with this name already exists",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const banners = await db
      .select()
      .from(banner)
      .orderBy(desc(banner.createdAt));
    return NextResponse.json({
      success: true,
      banners,
    });
  } catch (error) {
    console.error("Error", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to get banners",
      },
      { status: 500 },
    );
  }
}
