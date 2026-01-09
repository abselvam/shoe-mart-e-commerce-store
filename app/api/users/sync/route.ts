// app/api/users/sync/route.ts
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/db/index";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    console.log("🔄 User sync endpoint called");

    // 1. Get the authenticated user from Clerk
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json(
        {
          success: false,
          message: "No authenticated user found. Please sign in.",
        },
        { status: 401 }
      );
    }

    console.log("✅ Clerk user found:", clerkUser.id);

    // 2. Get user's primary email
    const primaryEmail = clerkUser.emailAddresses.find(
      (email) => email.id === clerkUser.primaryEmailAddressId
    );

    const email =
      primaryEmail?.emailAddress || clerkUser.emailAddresses[0]?.emailAddress;

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "User has no email address",
        },
        { status: 400 }
      );
    }

    // 3. Check if user already exists in database
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, clerkUser.id))
      .limit(1);

    // 4. If user exists, return the existing user
    if (existingUser.length > 0) {
      console.log(
        "📊 User already exists in database, returning existing user"
      );
      const user = existingUser[0];

      return NextResponse.json({
        success: true,
        message: "User already exists",
        action: "fetched",
        user: { ...user },
      });
    }

    // 5. User doesn't exist, create new user
    console.log("🆕 User doesn't exist, creating new user");

    const userData = {
      id: clerkUser.id,
      email: email,
      firstName: clerkUser.firstName || null,
      lastName: clerkUser.lastName || null,
      imageUrl: clerkUser.imageUrl || null,
      clerkUserId: clerkUser.id,
    };

    console.log("📝 Creating new user:", {
      id: userData.id,
      email: userData.email.substring(0, 7) + "...",
      hasName: !!(userData.firstName || userData.lastName),
    });

    // 6. Insert new user (no onConflict needed since we checked existence)
    const [newUser] = await db.insert(users).values(userData).returning();

    console.log("✅ New user created in database");

    // 7. Return success response
    return NextResponse.json({
      success: true,
      message: "New user created successfully",
      action: "created",
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        imageUrl: newUser.imageUrl,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
      },
    });
  } catch (error) {
    console.error("❌ Error in user sync:", error);

    // Return generic error message
    return NextResponse.json(
      {
        success: false,
        message: "Failed to sync user. Please try again.",
      },
      { status: 500 }
    );
  }
}
