// User types
export interface User {
  id?: string;
  name?: string;
  email?: string;
  uid?: string;
  logged: boolean;
}

// Cart types
export interface CartItem {
  id: string;
  title: string;
  slug: string;
  price: number;
  quantity: number;
  stock: number;
  imageURL: string;
  name?: string;
  userId?: string;
}

// Auth context types
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  registerUser: (email: string, password: string) => Promise<void>;
}

// Cart context types
export interface CartContextType {
  cart: CartItem[];
  loading: boolean;
  addProductToCart: (product: any, quantity: number) => Promise<void>;
  removeProductFromCart: (id: string) => Promise<void>;
  updateProductQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  total: number;
  error: string | null;
}

// Order types
export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Order {
  id?: string;
  userId: string;
  items: CartItem[];
  total: number;
  shipping: number;
  status: OrderStatus;
  customerInfo: CustomerInfo;
  createdAt?: any; // Compatible with Firebase Timestamp
}
