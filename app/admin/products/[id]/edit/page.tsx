"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { toast } from "sonner";
import {
  getCategories,
  getBrands,
  getProductById,
  ProductError,
} from "@/app/lib/products";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

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

// Define la interfaz sin parámetros locales para evitar conflictos con los tipos de Next.js
export default function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const productId = params.id;

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
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
    async function loadData() {
      try {
        const [categoriesData, brandsData, product] = await Promise.all([
          getCategories(),
          getBrands(),
          getProductById(productId),
        ]);

        if (!product) {
          toast.error("Product not found");
          router.push("/admin/products");
          return;
        }

        setCategories(categoriesData);
        setBrands(brandsData);
        setFormData({
          title: product.title,
          price: product.price.toString(),
          stock: product.stock.toString(),
          description: product.description,
          category: product.category,
          brand: product.brand,
          imageURL: product.imageURL,
          slug: product.slug,
        });
      } catch (error) {
        toast.error("Failed to load product data");
        console.error("Error loading product:", error);
        router.push("/admin/products");
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [productId, router]);

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
        slug: formData.slug,
      };

      const productRef = doc(db, "products", productId);
      await updateDoc(productRef, productData);

      toast.success("Product updated successfully");
      router.push("/admin/products");
    } catch (error) {
      if (error instanceof ProductError) {
        toast.error(error.message);
      } else {
        toast.error("Failed to update product");
        console.error("Error updating product:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Editar Productos</h1>

      <div className="max-w-2xl bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title">Titulo</Label>
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
              <Label htmlFor="price">Precio</Label>
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
            <Label htmlFor="description">Descripción</Label>
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
              <Label htmlFor="category">Categoria</Label>
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
              {isLoading ? "Updating..." : "Update Product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
