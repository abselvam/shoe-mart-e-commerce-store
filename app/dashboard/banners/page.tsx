"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Eye,
  ImageIcon,
  MoreHorizontal,
  PlusCircle,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Banner {
  id: string; // Changed from String to string (lowercase)
  name: string; // Changed from String to string
  image: string; // Changed from String to string
}

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (bannerId: string, bannerName: string) => {
    if (!confirm(`Are you sure you want to delete "${bannerName}"?`)) return;

    try {
      const response = await fetch(`/api/banners/${bannerId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        // Remove banner from state
        setBanners(banners.filter((b) => b.id !== bannerId));
        alert("Banner deleted successfully"); // Fixed: "Product" to "Banner"
      } else {
        alert(`Failed to delete: ${data.message}`);
      }
    } catch (error) {
      console.error("Error deleting banner:", error);
      alert("Failed to delete banner");
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/banners");
      const data = await response.json();
      if (data.success) {
        setBanners(data.banners || []);
      } else {
        setError(data.message || "Failed to load banners");
      }
    } catch (error) {
      console.error("Error in fetching banners", error);
      setError("Network error, please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-end mb-6">
        <Link href="/dashboard/banners/add">
          <Button className="flex items-center gap-x-2">
            <PlusCircle />
            <span>Add Banner</span>
          </Button>
        </Link>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-2xl">Banners</CardTitle>
          <CardDescription>Manage your banners</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading banners...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-600">
              <p>{error}</p>
              <Button onClick={fetchBanners} variant="outline" className="mt-4">
                Try Again
              </Button>
            </div>
          ) : banners.length === 0 ? (
            <div className="text-center py-10">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <ImageIcon className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium">No banners yet</h3>
              <p className="text-gray-500 mt-1">
                Get started by adding your first banner
              </p>
              <Link href="/dashboard/banners/add">
                <Button className="mt-4">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add Banner
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-100">Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {banners.map((banner) => (
                    <TableRow key={banner.id}>
                      <TableCell>
                        <div className="w-42 h-30 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                          {banner.image ? ( // Fixed: removed extra parenthesis
                            <img
                              src={banner.image}
                              alt={banner.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Fallback if image fails to load
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <ImageIcon className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="font-medium">
                        {banner.name}
                      </TableCell>

                      <TableCell className="text-right">
                        <Button
                          className="text-red-600 focus:text-red-600 bg-gray-200 hover:bg-red-200"
                          onClick={() => handleDelete(banner.id, banner.name)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
