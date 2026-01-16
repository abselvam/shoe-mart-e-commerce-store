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

export default function AddBannerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // ADDED: For showing API errors
  const [image, setImage] = useState<string>(""); // ADDED: Store uploaded image URLs

  // UPDATED: Added category and fixed featured type
  const [formData, setFormData] = useState({
    name: "",
  });

  // REMOVED: Slug generation (now done in API)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // ADDED: Clear previous errors

    try {
      // UPDATED: Send data matching API expectations
      const response = await fetch("/api/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name, // CHANGED: parseFloat for decimals
          image: image, // ADDED: Send uploaded images array
        }),
      });

      const result = await response.json(); // ADDED: Parse response

      if (response.ok) {
        router.push("/dashboard/banners");
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
        <Link href={"/dashboard/banners"}>
          <Button variant={"outline"} size={"icon"}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold tracking-tight ml-6">
          Add New Banner
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
          <CardTitle>Banner Details</CardTitle>
          <CardDescription>Add details about your banner.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            {/* UPDATED: Added value and onChange */}
            <div className="flex flex-col gap-3">
              <Label>Name *</Label>
              <Input
                type="text"
                className="w-full"
                placeholder="Banner Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            {/* UPDATED: Store uploaded images */}
            <div className="flex flex-col gap-3">
              <Label>Banner Image *</Label>
              <p className="text-sm text-gray-500">
                Upload banner image (max 4MB)
              </p>

              {/* Upload Zone */}
              {!image && (
                <UploadDropzone
                  endpoint={"bannerUploader"}
                  onClientUploadComplete={(res) => {
                    if (res && res[0]) {
                      setImage(res[0].url);
                    }
                  }}
                  onUploadError={(error) => {
                    alert(`Upload failed: ${error.message}`);
                  }}
                  config={{
                    mode: "auto",
                  }}
                />
              )}

              {/* Image Previews - Only show if images exist */}
              {image && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Uploaded Image</Label>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setImage("")}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Remove Image
                    </Button>
                  </div>

                  {/* Image Grid */}
                  <div className="flex items-center justify-center">
                    <Card className="overflow-hidden relative group">
                      <CardContent>
                        {/* Image */}
                        <div className="h-60 w-100 mb-18 ">
                          <img
                            src={image}
                            alt={"Banner Preview"}
                            className="object-center"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          {/* UPDATED: Added type="submit" and loading state */}
          <Button
            type="submit"
            disabled={loading || !image} // ADDED: Disable if no images
          >
            {loading ? "Adding..." : "Add Banner"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
