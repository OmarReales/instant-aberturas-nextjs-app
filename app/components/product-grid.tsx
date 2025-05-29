import { Product } from "@/app/lib/products";
import Image from "next/image";
import Link from "next/link";

interface ProductGridProps {
  products: Product[];
}
export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Link
          key={product.slug}
          href={`/products/${product.slug}`}
          className="group"
          prefetch={true}
        >
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="relative h-64">
              <Image
                src={product.imageURL}
                alt={product.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-2 group-hover:text-gray-600 line-clamp-2">
                {product.title}
              </h3>
              <p className="text-lg font-bold">
                ${product.price.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Stock: {product.stock} unidades
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
