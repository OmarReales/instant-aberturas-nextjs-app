"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getOrderById } from "@/app/lib/orders";
import { Order } from "@/app/types";
import { Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    if (!orderId) {
      router.push("/");
      return;
    }

    async function fetchOrder() {
      try {
        const orderData = await getOrderById(orderId as string);
        setOrder(orderData);
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
        <p className="mb-6">No pudimos encontarr la orden que estas buscando</p>
        <Button asChild>
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>

        <h1 className="text-3xl font-bold mb-2">Thank You for Your Order!</h1>
        <p className="text-xl mb-6">Your order has been placed successfully.</p>

        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="flex justify-between mb-4">
            <span className="font-medium">Order Number:</span>
            <span>{order.id?.slice(-6).toUpperCase()}</span>
          </div>

          <div className="flex justify-between mb-4">
            <span className="font-medium">Order Total:</span>
            <span>${order.total.toLocaleString()}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium">Status:</span>
            <span className="capitalize">{order.status}</span>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-8">
          Enviaremos un email de confirmacion a {order.customerInfo.email} con
          todos los detalles.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild>
            <Link href="/orders">View My Orders</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
