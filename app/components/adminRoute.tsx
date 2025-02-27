"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAdminAuth } from "@/app/utils/auth";

export default function AdminRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  useEffect(() => {
    if (!getAdminAuth()) {
      router.push("/admin/login");
    }
  }, [router]);
  return <>{children}</>;
}
