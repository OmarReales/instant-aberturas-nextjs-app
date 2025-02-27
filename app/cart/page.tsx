"use client";
import { useAuth } from "@/app/context/AuthContext";
import { useCart } from "@/app/context/CartContext";
import { CartItem } from "@/app/types";
import Image from "next/image";
import { Button } from "@/app/components/ui/button";
import {
  Minus,
  Plus,
  Trash2,
  LogIn,
  UserPlus,
  ShoppingBag,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const {
    cart,
    loading: cartLoading,
    removeProductFromCart,
    updateProductQuantity,
    total,
  } = useCart();

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user?.logged) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
          <div className="flex justify-center mb-6">
            <ShoppingBag className="h-16 w-16 text-blue-500" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Carrito no disponible</h1>
          <p className="text-gray-600 mb-8">
            Para ver y gestionar tu carrito, necesitas iniciar sesión o crear
            una cuenta.
          </p>

          <div className="flex flex-col gap-3">
            <Link href="/login" className="w-full">
              <Button
                variant="default"
                className="w-full flex items-center justify-center gap-2"
              >
                <LogIn className="h-4 w-4" />
                Iniciar sesión
              </Button>
            </Link>

            <Link href="/register" className="w-full">
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
              >
                <UserPlus className="h-4 w-4" />
                Crear cuenta
              </Button>
            </Link>

            <div className="mt-4 text-sm text-gray-500">
              <p>¿Prefieres seguir navegando?</p>
              <Link
                href="/products"
                className="text-blue-500 hover:underline mt-1 inline-block"
              >
                Ver todos los productos
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cartLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Cargando tu carrito...</p>
        </div>
      </div>
    );
  }

  if (!cart.length) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Tu carrito está vacío</h1>
          <p className="text-gray-600 mb-8">
            Agrega productos para continuar con tu compra
          </p>
          <Link href="/products">
            <Button>Continuar comprando</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleCheckout = () => {
    router.push("/checkout");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item: CartItem) => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex gap-4">
                <div className="relative w-24 h-24">
                  <Image
                    src={item.imageURL}
                    alt={item.title}
                    fill
                    className="object-cover rounded-md"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>

                <div className="flex-1">
                  <Link
                    href={`/products/${item.slug}`}
                    className="text-lg font-semibold hover:text-gray-600"
                  >
                    {item.title}
                  </Link>

                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border rounded-md">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            updateProductQuantity(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            updateProductQuantity(item.id, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.stock}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeProductFromCart(item.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold">
                        ${(item.price * item.quantity).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        ${item.price.toLocaleString()} each
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between font-bold text-lg mb-6">
                <span>Total</span>
                <span>${total.toLocaleString()}</span>
              </div>

              <Button className="w-full" size="lg" onClick={handleCheckout}>
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
