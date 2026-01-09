// components/UserSync.tsx
"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";

export default function UserSync() {
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    // Wait for everything to load and user to be signed in
    if (!isLoaded || !isSignedIn || !user) {
      return;
    }

    console.log("🔄 UserSync: Starting sync process");

    async function syncUser() {
      try {
        console.log("📤 Calling sync API...");

        const response = await fetch("/api/users/sync", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (data.success) {
          console.log("✅ UserSync: User synced successfully");
        } else {
          console.warn("⚠️ UserSync:", data.message);
        }
      } catch (error) {
        console.error("❌ UserSync: Network error", error);
      }
    }

    // Run sync
    syncUser();
  }, [isLoaded, isSignedIn, user]);

  // This component doesn't render anything
  return null;
}
