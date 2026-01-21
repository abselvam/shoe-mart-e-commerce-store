import React from "react";
import CategoriesPageDisplay from "./CategoriesPageDisplay";

async function CategoriesPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  return <CategoriesPageDisplay category={category} />;
}

export default CategoriesPage;
