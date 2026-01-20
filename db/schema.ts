// schema.ts
import {
  boolean,
  decimal,
  json,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import crypto from "crypto";

// Users table - Syncs with Clerk user data
export const user = pgTable("User", {
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
export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;

export const ProductStatus = {
  DRAFT: "draft",
  PUBLISHED: "published",
  ARCHIVED: "archived",
} as const;

export type ProductStatusType =
  (typeof ProductStatus)[keyof typeof ProductStatus];

export const Category = {
  MEN: "men",
  WOMEN: "women",
  KIDS: "kids",
} as const;

export type CategoryType = (typeof Category)[keyof typeof Category];

// Product Table
export const product = pgTable("Product", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  images: json("images").$type<string[]>().default([]),
  status: text("status")
    .$type<ProductStatusType>()
    .notNull()
    .default(ProductStatus.DRAFT),
  category: text("category")
    .$type<CategoryType>()
    .notNull()
    .default(Category.MEN),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// Types
export type Product = typeof product.$inferSelect;
export type NewProduct = typeof product.$inferInsert;

// Zod Schema for validation
export const insertProductSchema = createInsertSchema(product, {
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(1000).optional(),
  price: z.number().positive("Price must be positive"),
  images: z.array(z.string()).min(1, "At least one image is required"),
  featured: z.boolean(),
  status: z.enum([
    ProductStatus.DRAFT,
    ProductStatus.PUBLISHED,
    ProductStatus.ARCHIVED,
  ]),
  category: z.enum([Category.MEN, Category.WOMEN, Category.KIDS]),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  slug: true,
});

// Update schema (same as insert but all fields optional)
export const updateProductSchema = insertProductSchema.partial();

//banner schema
export const banner = pgTable("Banner", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  image: text("image").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

//banner zod schema
export const insertBannerSchema = createInsertSchema(banner, {
  name: z.string().min(1, "Name is required").max(100),
  image: z.string().url("Must be a valid image URL"),
}).omit({
  id: true,
  createdAt: true,
});
