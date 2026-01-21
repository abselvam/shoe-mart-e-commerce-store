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
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // ADDED: For showing API errors
  const [images, setImages] = useState<string[]>([]); // ADDED: Store uploaded image URLs

  // UPDATED: Added category and fixed featured type
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    status: "draft" as "draft" | "published" | "archived", // ADDED: Type safety
    category: "men" as "men" | "women" | "kids", // ADDED: Category field
    featured: false,
  });

  // REMOVED: Slug generation (now done in API)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // ADDED: Clear previous errors

    try {
      // UPDATED: Send data matching API expectations
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price), // CHANGED: parseFloat for decimals
          images: images, // ADDED: Send uploaded images array
          status: formData.status,
          category: formData.category,
          // REMOVED: slug (API generates it)
          featured: formData.featured,
        }),
      });

      const result = await response.json(); // ADDED: Parse response

      if (response.ok) {
        router.push("/dashboard/products");
        router.refresh(); // ADDED: Refresh page data
      } else {
        // ADDED: Show actual error from API
        setError(result.message || "Failed to create product");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Network error. Please try again."); // ADDED: Better error message
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {" "}
      {/* ADDED: onSubmit handler */}
      <div className="flex items-center gap-4">
        <Link href={"/dashboard/products"}>
          <Button variant={"outline"} size={"icon"}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold tracking-tight ml-6">
          Create New Product
        </h1>
      </div>
      {/* ADDED: Error display */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}
      <Card className="mt-10">
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
          <CardDescription>Add details about your new product.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            {/* UPDATED: Added value and onChange */}
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
              />
            </div>

            {/* UPDATED: Added value and onChange */}
            <div className="flex flex-col gap-3">
              <Label>Description</Label>
              <span className="text-sm text-muted-foreground">
                {formData.description?.length || 0}/250
              </span>
              <Textarea
                className="w-full"
                placeholder="Write description for the product..."
                value={formData.description}
                onChange={(e) => {
                  if (e.target.value.length <= 250) {
                    setFormData({ ...formData, description: e.target.value });
                  }
                }}
                rows={4}
              />
            </div>

            {/* UPDATED: Added value, onChange, and step for decimals */}
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
                required
              />
            </div>

            {/* ADDED: Category field */}
            <div className="flex flex-col gap-3">
              <Label>Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value: "men" | "women" | "kids") =>
                  setFormData({ ...formData, category: value })
                }
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

            {/* UPDATED: Added value and onChange */}
            <div className="flex flex-col gap-3">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "draft" | "published" | "archived") =>
                  setFormData({ ...formData, status: value })
                }
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

            {/* ADDED: Featured toggle with state */}
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
              />
            </div>

            {/* UPDATED: Store uploaded images */}
            <div className="flex flex-col gap-3">
              <Label>Images *</Label>
              <p className="text-sm text-gray-500">
                Upload product images (max 4MB each)
              </p>

              {/* Upload Zone */}
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
              />

              {/* Image Previews - Only show if images exist */}
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
                    >
                      Clear All
                    </Button>
                  </div>

                  {/* Image Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {images.map((url, index) => (
                      <Card
                        key={index}
                        className="overflow-hidden relative group"
                      >
                        <CardContent className="p-0">
                          {/* Image */}
                          <div className="aspect-square relative">
                            <img
                              src={url}
                              alt={`Product ${index + 1}`}
                              className="w-full h-full object-cover"
                            />

                            {/* Remove button */}
                            <Button
                              type="button"
                              size="icon"
                              variant="destructive"
                              className="absolute top-2 right-2 w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => {
                                setImages(images.filter((_, i) => i !== index));
                              }}
                            >
                              ×
                            </Button>

                            {/* Image number */}
                            <div className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm text-foreground text-xs font-medium rounded-full w-6 h-6 flex items-center justify-center">
                              {index + 1}
                            </div>
                          </div>

                          {/* Image info */}
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

              {/* Validation message */}
              {images.length === 0 && (
                <p className="text-sm text-amber-600">
                  ⚠️ Please upload at least one product image
                </p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          {/* UPDATED: Added type="submit" and loading state */}
          <Button
            type="submit"
            disabled={loading || images.length === 0} // ADDED: Disable if no images
          >
            {loading ? "Creating..." : "Create Product"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
