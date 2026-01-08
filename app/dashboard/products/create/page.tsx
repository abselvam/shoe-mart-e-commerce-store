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

export default function CreateProductPage() {
  return (
    <form>
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
      <Card className=" mt-10">
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
          <CardDescription>Add details about your new product.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <Label>Name</Label>
              <Input
                type="text"
                className="w-full"
                placeholder="Product Name"
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label>Description</Label>
              <Textarea
                className="w-full"
                placeholder="Write description for the product..."
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label>Price</Label>
              <Input type="number" className="w-full" placeholder="129.93" />
            </div>
            <div className="flex flex-col gap-3">
              <Label>Featured Product</Label>
              <Switch className="hover:cursor-pointer" />
            </div>
            <div className="flex flex-col gap-3">
              <Label>Status</Label>
              <Select>
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
            <div className="flex flex-col gap-3">
              <Label>Images</Label>
              <UploadDropzone
                endpoint={"imageUploader"}
                onClientUploadComplete={(res) => {
                  alert("Finished Uploading");
                }}
                onUploadError={() => {
                  alert("Upload Error!");
                }}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button>Create Product</Button>
        </CardFooter>
      </Card>
    </form>
  );
}
