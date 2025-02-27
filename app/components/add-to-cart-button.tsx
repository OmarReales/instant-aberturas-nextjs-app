"use client";
import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Product } from "@/app/lib/products";
import { toast } from "sonner";
import { Loader2, Minus, Plus, ShoppingCart } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";

interface AddToCartButtonProps {
  product: Product;
}
export function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const { addProductToCart } = useCart();
  const handleAddToCart = async () => {
    if (!user || !user.uid) {
      toast.error("Please login to add items to cart");
      router.push("/login");
      return;
    }
    try {
      setIsLoading(true);
      await addProductToCart(product, quantity);
      toast.success("Added to cart", {
        description: `${quantity} × ${product.title}`,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to add to cart"
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center border rounded-md">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1 || isLoading}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-12 text-center">{quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            disabled={quantity >= product.stock || isLoading}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <Button
          onClick={handleAddToCart}
          className="flex-1"
          disabled={product.stock === 0 || isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ShoppingCart className="mr-2 h-4 w-4" />
          )}
          {isLoading ? "Agregando..." : "Agregar al carrito"}
        </Button>
      </div>
      {product.stock <= 5 && product.stock > 0 && (
        <p className="text-sm text-orange-600">
          Solo quedan {product.stock} en stock!
        </p>
      )}
      {product.stock === 0 && <p className="text-sm text-red-600">Sin stock</p>}
    </div>
  );
}
