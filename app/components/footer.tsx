import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center">
              <Image
                src="/logo.png"
                alt="Instant Aberturas"
                width={100}
                height={30}
                className="h-8 w-auto"
              />
            </div>
            <p className="text-sm text-gray-600">
              Encuentra las mejores ventanas y puertas para tu hogar
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Productos
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Carrito de compra
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Categorias</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/products?category=Puertas"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Puertas
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=Ventanas"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Ventanas
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Nuestras redes</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t mt-12 pt-8">
          <p className="text-sm text-center text-gray-600">
            © {currentYear} Instant Aberturas. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
