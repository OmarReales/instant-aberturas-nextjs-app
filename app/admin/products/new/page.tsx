"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { toast } from "sonner";
import { getCategories, getBrands } from "@/app/lib/products";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { ProductError } from "@/app/lib/products";

interface FormData {
  title: string;
  price: string;
  stock: string;
  description: string;
  category: string;
  brand: string;
  imageURL: string;
  slug: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);

  const [formData, setFormData] = useState<FormData>({
    title: "",
    price: "",
    stock: "",
    description: "",
    category: "",
    brand: "",
    imageURL: "",
    slug: "",
  });

  useEffect(() => {
    async function loadFormData() {
      try {
        const [categoriesData, brandsData] = await Promise.all([
          getCategories(),
          getBrands(),
        ]);
        setCategories(categoriesData);
        setBrands(brandsData);
        setFormData((prev) => ({
          ...prev,
          category: categoriesData[0] || "",
          brand: brandsData[0] || "",
        }));
      } catch (error) {
        toast.error("Failed to load form data");
        console.error("Error loading form data:", error);
      }
    }

    loadFormData();
  }, []);

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const productData = {
        title: formData.title,
        price: Number(formData.price),
        stock: Number(formData.stock),
        description: formData.description,
        category: formData.category,
        brand: formData.brand,
        imageURL: formData.imageURL,
        slug: generateSlug(formData.title),
      };

      const productsRef = collection(db, "products");
      await addDoc(productsRef, productData);

      toast.success("Product created successfully");
      router.push("/admin/products");
    } catch (error) {
      if (error instanceof ProductError) {
        toast.error(error.message);
      } else {
        toast.error("Failed to create product");
        console.error("Error creating product:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Add New Product</h1>

      <div className="max-w-2xl bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                required
                disabled={isLoading}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="brand">Brand</Label>
              <select
                id="brand"
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                value={formData.brand}
                onChange={(e) =>
                  setFormData({ ...formData, brand: e.target.value })
                }
                required
                disabled={isLoading}
              >
                {brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="imageURL">Image URL</Label>
            <Input
              id="imageURL"
              type="url"
              value={formData.imageURL}
              onChange={(e) =>
                setFormData({ ...formData, imageURL: e.target.value })
              }
              required
              disabled={isLoading}
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
