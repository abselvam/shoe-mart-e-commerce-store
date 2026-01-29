// app/products/[slug]/page.tsx
import { db } from "@/db";
import { product } from "@/db/schema"; // ← IMPORT product schema!
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import ProductClientView from "./ProductClientView";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // 1. Await params
  const { slug } = await params;

  // 2. Query database
  const result = await db
    .select({ id: product.id }) // Get all product fields
    .from(product)
    .where(eq(product.slug, slug))
    .limit(1);

  if (result.length === 0) {
    notFound();
  }

  const productId = result[0].id;

  // 3. Pass to client component
  return <ProductClientView productId={productId} />;
}
