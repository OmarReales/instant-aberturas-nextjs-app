import { db } from "@/app/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";
import { CartItem } from "@/app/types";

export async function getCart(userId: string): Promise<CartItem[]> {
  try {
    const cartRef = collection(db, "carts");
    const q = query(cartRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    const cartItems: CartItem[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as CartItem;
      cartItems.push({
        id: doc.id,
        name: data.name || data.title || "",
        title: data.title || data.name || "",
        slug: data.slug || "",
        price: data.price,
        quantity: data.quantity,
        stock: data.stock,
        imageURL: data.imageURL || "",
        userId: data.userId,
      });
    });

    return cartItems;
  } catch (error) {
    console.error("Error getting cart:", error);
    throw new Error("Failed to get cart");
  }
}

export async function updateCartItemQuantity(
  userId: string,
  productId: string,
  newQuantity: number
): Promise<void> {
  try {
    const cartItemRef = doc(db, "carts", productId);
    await updateDoc(cartItemRef, { quantity: newQuantity });
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    throw new Error("Failed to update cart item quantity");
  }
}

export async function removeFromCart(
  userId: string,
  productId: string
): Promise<void> {
  try {
    const cartItemRef = doc(db, "carts", productId);
    await deleteDoc(cartItemRef);
  } catch (error) {
    console.error("Error removing item from cart:", error);
    throw new Error("Failed to remove item from cart");
  }
}

export async function clearUserCart(userId: string): Promise<void> {
  try {
    const cartRef = collection(db, "carts");
    const q = query(cartRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    const batch = writeBatch(db);

    querySnapshot.forEach((document) => {
      batch.delete(document.ref);
    });

    await batch.commit();
  } catch (error) {
    console.error("Error clearing cart:", error);
    throw new Error("Failed to clear cart");
  }
}
