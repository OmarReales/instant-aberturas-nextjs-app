import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { DoorClosed } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <DoorClosed className="h-24 w-24 text-gray-400" />
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xl font-bold rounded-full w-8 h-8 flex items-center justify-center">
              ?
            </div>
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>

        <p className="text-gray-600 mb-8">
          Oops! The page you are looking for does not exist. How you got here is
          a mystery. But you can click the button below to go back
        </p>

        <div className="space-y-4">
          <Link href="/">
            <Button size="lg" className="w-full">
              Return Home
            </Button>
          </Link>

          <Link href="/products">
            <Button variant="outline" size="lg" className="w-full">
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
