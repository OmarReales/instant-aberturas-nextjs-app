import { db } from "@/app/lib/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import { Order, CartItem, OrderStatus, CustomerInfo } from "@/app/types";

export class OrderError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = "OrderError";
  }
}

export async function createOrder(
  orderData: Omit<Order, "id" | "createdAt">
): Promise<string> {
  try {
    const ordersRef = collection(db, "orders");
    const docRef = await addDoc(ordersRef, {
      ...orderData,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating order:", error);
    throw new OrderError("Failed to create order");
  }
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  try {
    const ordersRef = collection(db, "orders");
    const q = query(
      ordersRef,
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      orders.push({
        id: doc.id,
        userId: data.userId,
        items: data.items,
        total: data.total,
        shipping: data.shipping,
        status: data.status,
        customerInfo: data.customerInfo,
        createdAt:
          data.createdAt instanceof Timestamp
            ? new Date(data.createdAt.toDate()).toISOString()
            : data.createdAt,
      });
    });

    return orders;
  } catch (error) {
    console.error("Error getting user orders:", error);
    throw new OrderError("Failed to fetch orders");
  }
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    const orderRef = doc(db, "orders", orderId);
    const orderDoc = await getDoc(orderRef);

    if (!orderDoc.exists()) {
      return null;
    }

    const data = orderDoc.data();
    return {
      id: orderDoc.id,
      userId: data.userId,
      items: data.items,
      total: data.total,
      shipping: data.shipping,
      status: data.status,
      customerInfo: data.customerInfo,
      createdAt:
        data.createdAt instanceof Timestamp
          ? new Date(data.createdAt.toDate()).toISOString()
          : data.createdAt,
    };
  } catch (error) {
    console.error("Error getting order by ID:", error);
    throw new OrderError("Failed to fetch order details");
  }
}

export type { Order, OrderStatus, CustomerInfo };
