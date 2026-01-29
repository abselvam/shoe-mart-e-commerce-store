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

export const PaymentMethod = {
  COD: "cod",
  ONLINE: "online",
} as const;

export type PaymentMethodType =
  (typeof PaymentMethod)[keyof typeof PaymentMethod];

// Define the structure for order items
export interface OrderItem {
  id: string;
  name: string;
  price: number; // Price per unit
  quantity: number;
  images?: string[];
}

export const order = pgTable("Order", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address"),
  totalPrice: decimal("totalPrice", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: text("paymentMethod") // Fixed typo: "payementMethod" → "paymentMethod"
    .$type<PaymentMethodType>()
    .notNull()
    .default(PaymentMethod.ONLINE),
  items: json("items").$type<OrderItem[]>().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(), // Fixed: Added proper type
});

// Types
export type Order = typeof order.$inferSelect;
export type NewOrder = typeof order.$inferInsert;

// Zod schema for order validation (if needed)
export const insertOrderSchema = createInsertSchema(order, {
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Phone number is required"),
  address: z.string().min(10, "Address is required"),
  totalPrice: z.number().positive("Total price must be positive"),
  paymentMethod: z.enum([PaymentMethod.COD, PaymentMethod.ONLINE]),
  items: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      price: z.number().positive(),
      quantity: z.number().int().positive(),
      images: z.array(z.string()).optional(),
    }),
  ),
}).omit({
  id: true,
  createdAt: true,
  userId: true,
});
