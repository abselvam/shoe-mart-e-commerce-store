// app/dashboard/products/[id]/edit/page.tsx
"use client";

import { UploadDropzone } from "@/app/lib/uploadthing";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";

type ProductStatus = "draft" | "published" | "archived";
type Category = "men" | "women" | "kids";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();

  // In Next.js 16, useParams() returns an object
  const productId = params?.id as string;

  console.log("🔄 Edit Page - Product ID:", productId);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [images, setImages] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    status: "draft" as ProductStatus,
    category: "men" as Category,
    featured: false,
  });

  // Fetch product data on mount
  useEffect(() => {
    async function fetchProduct() {
      if (!productId) {
        console.log("❌ No product ID in params");
        setError("Product ID is missing from URL");
        setFetching(false);
        return;
      }

      setFetching(true);
      try {
        console.log("📡 Fetching product with ID:", productId);
        const response = await fetch(`/api/products/${productId}`);
        console.log("API Response status:", response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("API Response data:", result);

        if (result.success && result.product) {
          const product = result.product;

          console.log("✅ Setting product data:", product.name);

          // Set form data
          setFormData({
            name: product.name || "",
            description: product.description || "",
            price: product.price?.toString() || "",
            status: product.status || "draft",
            category: product.category || "men",
            featured: product.featured || false,
          });

          // Set images
          setImages(product.images || []);
          setError("");
        } else {
          setError(result.message || "Failed to fetch product data");
        }
      } catch (error) {
        console.error("❌ Error fetching product:", error);
        setError(
          `Failed to load product data: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      } finally {
        setFetching(false);
      }
    }

    fetchProduct();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("🔄 Submitting update for product:", productId);

      const response = await fetch(`/api/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          images: images,
          status: formData.status,
          category: formData.category,
          featured: formData.featured,
        }),
      });

      const result = await response.json();
      console.log("Update response:", result);

      if (response.ok) {
        router.push("/dashboard/products");
        router.refresh();
      } else {
        setError(result.message || "Failed to update product");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading product data...</p>
        {productId && (
          <p className="text-sm text-gray-500 mt-2">Product ID: {productId}</p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center gap-4">
        <Link href={"/dashboard/products"}>
          <Button variant={"outline"} size={"icon"}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold tracking-tight ml-6">
          Edit Product
        </h1>
        {productId && (
          <span className="text-sm text-gray-500 ml-auto">
            Product ID: {productId}
          </span>
        )}
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
          <p className="font-medium">Error</p>
          <p>{error}</p>
          {productId && (
            <p className="text-sm mt-2">
              <strong>Product ID:</strong> {productId}
            </p>
          )}
        </div>
      )}

      <Card className="mt-10">
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
          <CardDescription>Edit your product details below.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <Label>Name *</Label>
              <Input
                type="text"
                className="w-full"
                placeholder="Product Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                disabled={loading}
              />
            </div>

            <div className="flex flex-col gap-3">
              <Label>Description</Label>
              <Textarea
                className="w-full"
                placeholder="Write description for the product..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
                disabled={loading}
              />
            </div>

            <div className="flex flex-col gap-3">
              <Label>Price *</Label>
              <Input
                type="number"
                className="w-full"
                placeholder="129.93"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                step="0.01"
                required
                disabled={loading}
              />
            </div>

            <div className="flex flex-col gap-3">
              <Label>Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value: Category) =>
                  setFormData({ ...formData, category: value })
                }
                disabled={loading}
              >
                <SelectTrigger className="hover:cursor-pointer">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem className="hover:cursor-pointer" value="men">
                    Men
                  </SelectItem>
                  <SelectItem className="hover:cursor-pointer" value="women">
                    Women
                  </SelectItem>
                  <SelectItem className="hover:cursor-pointer" value="kids">
                    Kids
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-3">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: ProductStatus) =>
                  setFormData({ ...formData, status: value })
                }
                disabled={loading}
              >
                <SelectTrigger className="hover:cursor-pointer">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem className="hover:cursor-pointer" value="draft">
                    Draft
                  </SelectItem>
                  <SelectItem
                    className="hover:cursor-pointer"
                    value="published"
                  >
                    Published
                  </SelectItem>
                  <SelectItem className="hover:cursor-pointer" value="archived">
                    Archived
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center mb-2">
              <div className="flex flex-col mr-9">
                <Label>Featured Product</Label>
                <p className="text-sm text-gray-500">Show on homepage</p>
              </div>
              <Switch
                checked={formData.featured}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, featured: checked })
                }
                className="hover:cursor-pointer"
                disabled={loading}
              />
            </div>

            <div className="flex flex-col gap-3">
              <Label>Images *</Label>
              <p className="text-sm text-gray-500">
                Upload product images (max 4MB each)
              </p>

              <UploadDropzone
                endpoint={"imageUploader"}
                onClientUploadComplete={(res) => {
                  const uploadedUrls = res.map((file) => file.url);
                  setImages([...images, ...uploadedUrls]);
                }}
                onUploadError={(error) => {
                  alert(`Upload failed: ${error.message}`);
                }}
                config={{
                  mode: "auto",
                }}
                disabled={loading}
              />

              {images.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Uploaded Images</Label>
                      <p className="text-sm text-gray-500">
                        {images.length} image{images.length !== 1 ? "s" : ""}{" "}
                        ready
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setImages([])}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      disabled={loading}
                    >
                      Clear All
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {images.map((url, index) => (
                      <Card
                        key={index}
                        className="overflow-hidden relative group"
                      >
                        <CardContent className="p-0">
                          <div className="aspect-square relative">
                            <img
                              src={url}
                              alt={`Product ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <Button
                              type="button"
                              size="icon"
                              variant="destructive"
                              className="absolute top-2 right-2 w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => {
                                setImages(images.filter((_, i) => i !== index));
                              }}
                              disabled={loading}
                            >
                              ×
                            </Button>
                            <div className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm text-foreground text-xs font-medium rounded-full w-6 h-6 flex items-center justify-center">
                              {index + 1}
                            </div>
                          </div>
                          <div className="p-3">
                            <p className="text-xs text-gray-500 truncate">
                              Image {index + 1}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {images.length === 0 && (
                <p className="text-sm text-amber-600">
                  ⚠️ Please upload at least one product image
                </p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex gap-4">
          <Button type="submit" disabled={loading || images.length === 0}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Product"
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/products")}
            disabled={loading}
          >
            Cancel
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
