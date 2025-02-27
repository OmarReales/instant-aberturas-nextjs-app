"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/app/context/AuthContext";
import { useCart } from "@/app/context/CartContext";
import { createOrder, OrderError } from "@/app/lib/orders";
import { CustomerInfo } from "@/app/types";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Loader2 } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { cart, total: subTotal, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const shipping = 2500;
  const total = subTotal + shipping;
  const [formData, setFormData] = useState<CustomerInfo>({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });
  useEffect(() => {
    if (!user) {
      toast.error("Please login to checkout");
      router.push("/login");
      return;
    }
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      router.push("/cart");
    }
  }, [user, cart, router]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const validateForm = (): boolean => {
    const phoneRegex = /^\d{10}$/;
    const zipRegex = /^\d{4}$/;
    if (!formData.firstName.trim()) {
      toast.error("Please enter your first name");
      return false;
    }
    if (!formData.lastName.trim()) {
      toast.error("Please enter your last name");
      return false;
    }
    if (!formData.email.trim()) {
      toast.error("Please enter your email");
      return false;
    }
    if (!phoneRegex.test(formData.phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return false;
    }
    if (!formData.address.trim()) {
      toast.error("Please enter your address");
      return false;
    }
    if (!formData.city.trim()) {
      toast.error("Please enter your city");
      return false;
    }
    if (!formData.state.trim()) {
      toast.error("Please enter your state");
      return false;
    }
    if (!zipRegex.test(formData.zipCode)) {
      toast.error("Please enter a valid 4-digit ZIP code");
      return false;
    }
    return true;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      setIsLoading(true);
      if (!user || !user.uid) {
        throw new Error("User not authenticated");
      }
      const orderData = {
        userId: user.uid,
        items: cart,
        total,
        shipping,
        status: "pending" as const,
        customerInfo: formData,
      };
      const orderId = await createOrder(orderData);
      await clearCart();
      toast.success("Order placed successfully!");
      router.push(`/checkout/success?orderId=${orderId}`);
    } catch (error) {
      console.error("Error creating order:", error);
      if (error instanceof OrderError) {
        toast.error(error.message);
      } else {
        toast.error("Failed to place order. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  if (!user || cart.length === 0) {
    return null;
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    First Name
                  </label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Last Name
                  </label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone
                </label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="10-digit phone number"
                />
              </div>
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Address
                </label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    City
                  </label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    State
                  </label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="zipCode"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  ZIP Code
                </label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  required
                  placeholder="4-digit ZIP code"
                />
              </div>
              <Button
                type="submit"
                className="w-full mt-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Place Order - $${total.toLocaleString()}`
                )}
              </Button>
            </form>
          </div>
        </div>
        <div>
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative w-20 h-20">
                    {item.imageURL && (
                      <Image
                        src={item.imageURL}
                        alt={item.title || item.name || "Product"}
                        fill
                        className="object-cover rounded-md"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.title || item.name}</h3>
                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                    <p className="font-semibold">
                      ${(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${shipping.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2">
                <span>Total</span>
                <span>${total.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <Link
              href="/cart"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Return to Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
