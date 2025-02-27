"use client";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Menu, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { toast } from "sonner";

export function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const { user, signOut } = useAuth();
  useEffect(() => {
    setIsClient(true);
    const userId = user?.logged ? user.uid ?? "temp-user-id" : "temp-user-id";
    const unsubscribe = onSnapshot(
      doc(db, "carts", userId),
      (doc) => {
        if (doc.exists()) {
          const items = doc.data().items || [];
          const count = items.reduce(
            (acc: number, item: { quantity: number }) => acc + item.quantity,
            0
          );
          setCartCount(count);
        } else {
          setCartCount(0);
        }
      },
      (error) => {
        console.error("Error listening to cart updates:", error);
        setCartCount(0);
      }
    );
    return () => unsubscribe();
  }, [user]);
  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Has cerrado sesión correctamente");
    } catch (error) {
      toast.error("Error al cerrar sesión");
    }
  };
  if (!isClient) {
    return null;
  }
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Instant Aberturas"
              width={120}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/products" className="hover:text-gray-600">
              Productos
            </Link>
            {user?.logged && (
              <Link href="/orders" className="hover:text-gray-600">
                Mis pedidos
              </Link>
            )}
            <Link href="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>
            {user?.logged && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                title="Cerrar sesión"
                className="text-gray-600 hover:text-red-600"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            )}
          </div>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
