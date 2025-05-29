"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "../lib/products";
import { db } from "../lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useAuth } from "./AuthContext";
import { CartItem, CartContextType } from "../types";
const CartContext = createContext<CartContextType | undefined>(undefined);
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  useEffect(() => {
    async function loadCart() {
      if (user && user.uid) {
        try {
          setLoading(true);
          const cartRef = doc(db, "carts", user.uid);
          const cartSnap = await getDoc(cartRef);

          if (cartSnap.exists()) {
            setCart(cartSnap.data().items || []);
          } else {
            setCart([]);
          }
          setError(null);
        } catch (error) {
          console.error("Error loading cart:", error);
          setError("Failed to load cart");
        } finally {
          setLoading(false);
        }
      } else {
        setCart([]);
        setLoading(false);
      }
    }
    loadCart();
  }, [user]);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    const saveCart = async () => {
      if (user && user.uid) {
        try {
          const cartRef = doc(db, "carts", user.uid);
          await setDoc(cartRef, { items: cart }, { merge: true });
        } catch (error) {
          console.error("Error saving cart:", error);
          setError("Failed to save cart");
        }
      }
    };

    if (user && user.uid) {
      saveCart();
    }
  }, [cart, user]);

  const addProductToCart = async (product: Product, quantity: number) => {
    try {
      setLoading(true);
      setCart((prevCart) => {
        const existingItemIndex = prevCart.findIndex(
          (item) => item.id === product.id
        );

        if (existingItemIndex >= 0) {
          return prevCart.map((item, index) =>
            index === existingItemIndex
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          const newCartItem: CartItem = {
            id: product.id,
            title: product.title,
            slug: product.slug,
            price: product.price,
            quantity: quantity,
            stock: product.stock,
            imageURL: product.imageURL || "",
            userId: user?.uid,
          };
          return [...prevCart, newCartItem];
        }
      });
      setError(null);
    } catch (err) {
      setError("Failed to add product to cart");
      console.error("Error adding product to cart:", err);
    } finally {
      setLoading(false);
    }
  };

  const removeProductFromCart = async (productId: string) => {
    try {
      setLoading(true);
      setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
      setError(null);
    } catch (err) {
      setError("Failed to remove product from cart");
      console.error("Error removing product from cart:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateProductQuantity = async (productId: string, quantity: number) => {
    try {
      setLoading(true);
      if (quantity <= 0) {
        await removeProductFromCart(productId);
        return;
      }

      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
      setError(null);
    } catch (err) {
      setError("Failed to update product quantity");
      console.error("Error updating product quantity:", err);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      setCart([]);
      if (user && user.uid) {
        const cartRef = doc(db, "carts", user.uid);
        await setDoc(cartRef, { items: [] });
      }
      setError(null);
    } catch (err) {
      setError("Failed to clear cart");
      console.error("Error clearing cart in database:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addProductToCart,
        removeProductFromCart,
        updateProductQuantity,
        clearCart,
        total,
        error,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
