import { getProducts, getProductBySlug } from "@/app/lib/products";
import { AddToCartButton } from "@/app/components/add-to-cart-button";
import { notFound } from "next/navigation";
import Image from "next/image";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductPage(props: any) {
  const slug = props.params.slug;

  if (!slug) {
    notFound();
  }
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative aspect-square rounded-lg overflow-hidden">
          <Image
            src={product.imageURL}
            alt={product.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
            <p className="text-2xl font-bold text-gray-900">
              ${product.price.toLocaleString()}
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-semibold">Description</h2>
            <p className="text-gray-600">{product.description}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Brand:</span>
              <span className="text-gray-600">{product.brand}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Category:</span>
              <span className="text-gray-600">{product.category}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Stock:</span>
              <span className="text-gray-600">{product.stock} units</span>
            </div>
          </div>

          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}
