// schema.ts
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

// Users table - Syncs with Clerk user data
export const users = pgTable("users", {
  id: text("id").primaryKey(), // Clerk user ID
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  imageUrl: text("image_url"),
  clerkUserId: text("clerk_user_id").unique(), // Reference to Clerk's user ID
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Export type for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
