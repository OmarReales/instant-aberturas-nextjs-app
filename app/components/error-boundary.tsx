"use client";
import { Button } from "@/app/components/ui/button";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}
export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  return <div>{children}</div>;
}
export function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <p className="text-red-500 mb-4">{message}</p>
      <Button onClick={() => window.location.reload()}>Try Again</Button>
    </div>
  );
}
