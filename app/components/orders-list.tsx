"use client";
import { formatDate } from "@/app/lib/utils";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Separator } from "@/app/components/ui/separator";
import { Package, ChevronRight, CalendarIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

interface OrderItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  createdAt: { toDate: () => Date } | Date;
  total: number;
  status: string;
  items: OrderItem[];
}

interface OrdersListProps {
  orders: Order[];
}

// Helper function to get status color
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    case "processing":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "shipped":
      return "bg-purple-100 text-purple-800 hover:bg-purple-200";
    case "delivered":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "cancelled":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
};

// Helper function to get status Spanish translation
const getStatusInSpanish = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "Pendiente";
    case "processing":
      return "Procesando";
    case "shipped":
      return "Enviado";
    case "delivered":
      return "Entregado";
    case "cancelled":
      return "Cancelado";
    default:
      return status;
  }
};

export function OrdersList({ orders }: OrdersListProps) {
  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <Card
          key={order.id}
          className="overflow-hidden border border-gray-100 shadow-sm hover:shadow transition-shadow duration-200"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-500">Pedido</span>
                <span className="font-mono text-sm font-medium">
                  #{order.id.slice(-6).toUpperCase()}
                </span>
              </div>
              <Badge className={`${getStatusColor(order.status)}`}>
                {getStatusInSpanish(order.status)}
              </Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-3 mb-4">
              <div>
                <p className="text-sm text-gray-500 flex items-center gap-1 mb-1">
                  <CalendarIcon className="h-3 w-3" />
                  Fecha
                </p>
                <p className="font-medium">
                  {formatDate(
                    order.createdAt instanceof Date
                      ? order.createdAt
                      : order.createdAt.toDate()
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Productos</p>
                <p className="font-medium">
                  {order.items.length}{" "}
                  {order.items.length === 1 ? "producto" : "productos"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Total</p>
                <p className="font-medium text-lg">
                  ${order.total.toLocaleString()}
                </p>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-3 mb-4 max-h-40 overflow-y-auto">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 line-clamp-1">
                      {item.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {item.quantity} x ${item.price.toLocaleString()}
                    </p>
                  </div>
                  <p className="font-medium">
                    ${(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-4">
              <Link href={`/orders/${order.id}`}>
                <Button
                  variant="ghost"
                  className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 flex items-center gap-1"
                >
                  Ver detalles
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
