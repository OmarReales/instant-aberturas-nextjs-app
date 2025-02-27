"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { LayoutDashboard, Package, LogOut } from "lucide-react";
import { getAdminAuth } from "@/app/utils/auth";

export default function AdminLayout({
  children,
  auth,
}: {
  children: React.ReactNode;
  auth: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const checkAuth = () => {
      const authStatus = getAdminAuth();
      setIsAuthenticated(!!authStatus);
    };
    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    setIsAuthenticated(false);
  };

  if (!isClient) return null;

  if (!isAuthenticated) {
    return <>{auth}</>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white border-r">
        <div className="p-6">
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>
        <nav className="px-4 space-y-2">
          <Link href="/admin">
            <Button
              variant={pathname === "/admin" ? "default" : "ghost"}
              className="w-full justify-start"
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link href="/admin/products">
            <Button
              variant={
                pathname.startsWith("/admin/products") ? "default" : "ghost"
              }
              className="w-full justify-start"
            >
              <Package className="mr-2 h-4 w-4" />
              Products
            </Button>
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
