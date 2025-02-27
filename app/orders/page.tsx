"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { Card } from "@/app/components/ui/card";
import { Skeleton } from "@/app/components/ui/skeleton";
import { OrdersList } from "@/app/components/orders-list";
import { ShoppingBag, PackageOpen } from "lucide-react";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      if (!user?.uid) {
        setOrders([]);
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, "orders"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const fetchedOrders = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setOrders(fetchedOrders);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    }

    fetchOrders();
  }, [user]);

  if (loading) {
    return (
      <div className="container py-16 px-4 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Mis Pedidos</h1>
        <Card className="p-6 shadow-sm border border-gray-100">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-md" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
              </div>
              <Skeleton className="h-8 w-24" />
            </div>
            <Skeleton className="h-px w-full bg-gray-200" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-md" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
              </div>
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!user?.logged) {
    return (
      <div className="container py-16 px-4 max-w-5xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md mx-auto">
          <ShoppingBag className="h-16 w-16 mx-auto text-blue-500 mb-6" />
          <h1 className="text-3xl font-bold mb-4 text-gray-900">
            Acceso restringido
          </h1>
          <p className="text-gray-600 mb-8">
            Necesitas iniciar sesión para ver tus pedidos
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/login">
              <Button>Iniciar sesión</Button>
            </Link>
            <Link href="/products">
              <Button variant="outline">Ver productos</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-16 px-4 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mis Pedidos</h1>
        <Link href="/products">
          <Button variant="outline" className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" />
            Seguir comprando
          </Button>
        </Link>
      </div>

      {orders.length > 0 ? (
        <OrdersList orders={orders} />
      ) : (
        <Card className="p-8 text-center border border-gray-100 shadow-sm">
          <PackageOpen className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No tienes pedidos aún</h2>
          <p className="text-gray-600 mb-6">
            Cuando realices compras, podrás ver el historial y estado de tus
            pedidos aquí.
          </p>
          <Link href="/products">
            <Button className="mt-2">Explorar productos</Button>
          </Link>
        </Card>
      )}
    </div>
  );
}
