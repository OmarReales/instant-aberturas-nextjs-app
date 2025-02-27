"use client";

import { useEffect, useState } from "react";
import { Product, getProducts } from "@/app/lib/products";
import { MetricCard } from "@/app/components/MetricCard";
import { Package, DollarSign, ShoppingCart } from "lucide-react";
import { ProductError } from "@/app/lib/products";
import AdminRoute from "@/app/components/adminRoute";

export default function AdminDashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts() {
      try {
        setIsLoading(true);
        const productsData = await getProducts();
        setProducts(productsData);
        setError(null);
      } catch (err) {
        if (err instanceof ProductError) {
          setError(err.message);
        } else {
          setError("Failed to load products");
        }
        console.error("Error loading products:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  const totalProducts = products.length;
  const totalValue = products.reduce(
    (sum, product) => sum + product.price * product.stock,
    0
  );
  const lowStock = products.filter((product) => product.stock < 10).length;

  return (
    <AdminRoute>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="Total Products"
            value={totalProducts}
            icon={<Package className="h-4 w-4 text-muted-foreground" />}
          />

          <MetricCard
            title="Total Inventory Value"
            value={`$${totalValue.toLocaleString()}`}
            icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          />

          <MetricCard
            title="Low Stock Items"
            value={lowStock}
            icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />}
          />
        </div>
      </div>
    </AdminRoute>
  );
}
