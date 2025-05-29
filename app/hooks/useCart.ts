import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "sonner";
import { CartItem } from "@/app/types";
import {
  getCart,
  updateCartItemQuantity,
  removeFromCart,
} from "@/app/lib/cart";

export function useCart() {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCart() {
      if (!user || !user.uid) {
        setIsLoading(false);
        setError("Usuario no autenticado");
        return;
      }

      try {
        const cartItems = await getCart(user.uid);
        setCart(cartItems);
        setError(null);
      } catch (err) {
        console.error("Error loading cart:", err);
        setError("Failed to load cart items");
        toast.error("Failed to load cart items");
      } finally {
        setIsLoading(false);
      }
    }

    loadCart();
  }, [user]);

  const handleQuantityChange = async (
    productId: string,
    newQuantity: number
  ) => {
    if (!user || !user.uid) {
      toast.error("Usuario no autenticado");
      return;
    }

    try {
      if (newQuantity < 1) return;
      const product = cart.find((item) => item.id === productId);

      if (product && newQuantity <= product.stock) {
        await updateCartItemQuantity(user.uid, productId, newQuantity);
        const updatedCart = await getCart(user.uid);
        setCart(updatedCart);
        toast.success("Quantity updated");
      } else {
        toast.error("Stock insuficiente");
      }
    } catch (err) {
      console.error("Error updating quantity:", err);
      toast.error("Failed to update quantity");
    }
  };

  const handleRemove = async (productId: string) => {
    if (!user || !user.uid) {
      toast.error("Usuario no autenticado");
      return;
    }

    try {
      await removeFromCart(user.uid, productId);
      const updatedCart = await getCart(user.uid);
      setCart(updatedCart);
      toast.success("Product removed from cart");
    } catch (err) {
      console.error("Error removing item:", err);
      toast.error("Failed to remove item");
    }
  };

  return {
    cart,
    isLoading,
    error,
    handleQuantityChange,
    handleRemove,
  };
}
