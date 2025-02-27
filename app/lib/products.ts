import { cache } from "react";
import { FirebaseError } from "firebase/app";
import { db } from "./firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";

export interface Product {
  id: string;
  title: string;
  price: number;
  stock: number;
  description: string;
  category: string;
  brand: string;
  imageURL: string;
  slug: string;
}

export class ProductError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = "ProductError";
  }
}

function mapDocToProduct(doc: DocumentData): Product {
  const data = doc.data();
  return {
    id: doc.id,
    title: data.title,
    price: data.price,
    stock: data.stock,
    description: data.description,
    category: data.category,
    brand: data.brand,
    imageURL: data.imageURL,
    slug: data.slug,
  } as Product;
}

export async function getProducts(): Promise<Product[]> {
  try {
    const productsRef = collection(db, "products");
    const snapshot = await getDocs(productsRef);
    return snapshot.docs.map(mapDocToProduct);
  } catch (error) {
    if (error instanceof FirebaseError) {
      throw new ProductError(`Firebase error: ${error.message}`, error.code);
    }
    throw new ProductError("Failed to fetch products");
  }
}

export async function getProductsByCategory(
  category: string
): Promise<Product[]> {
  try {
    if (!category) throw new ProductError("Category is required");

    const productsRef = collection(db, "products");
    const q = query(productsRef, where("category", "==", category));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(mapDocToProduct);
  } catch (error) {
    if (error instanceof FirebaseError) {
      throw new ProductError(`Firebase error: ${error.message}`, error.code);
    }
    throw new ProductError("Failed to fetch products by category");
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    if (!id) throw new ProductError("Product ID is required");

    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return mapDocToProduct(docSnap);
    }

    return null;
  } catch (error) {
    if (error instanceof FirebaseError) {
      throw new ProductError(`Firebase error: ${error.message}`, error.code);
    }
    throw new ProductError("Failed to fetch product by ID");
  }
}

export const getCategories = cache(async (): Promise<string[]> => {
  try {
    const products = await getProducts();
    return Array.from(new Set(products.map((product) => product.category)));
  } catch (error) {
    throw new ProductError("Failed to fetch categories");
  }
});

export const getBrands = cache(async (): Promise<string[]> => {
  try {
    const products = await getProducts();
    return Array.from(new Set(products.map((product) => product.brand)));
  } catch (error) {
    throw new ProductError("Failed to fetch brands");
  }
});

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    if (!slug) throw new ProductError("Slug is required");

    const products = await getProducts();
    return products.find((product) => product.slug === slug) || null;
  } catch (error) {
    if (error instanceof FirebaseError) {
      throw new ProductError(`Firebase error: ${error.message}`, error.code);
    }
    throw new ProductError("Failed to fetch product by slug");
  }
}

export async function productExists(id: string): Promise<boolean> {
  try {
    const product = await getProductById(id);
    return product !== null;
  } catch (error) {
    return false;
  }
}
