import { Button } from "@/app/components/ui/button";
import { getCategories, getProducts, Product } from "@/app/lib/products";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { ProductError } from "@/app/lib/products";
import { LoadingComponent } from "./components/ui/loading";
import { ErrorBoundary } from "./components/error-boundary";

export const metadata = {
  title: "Instant Aberturas app",
  description: "Instant Aberturas app",
  keywords: "Instant Aberturas app",
  openGraph: {
    title: "Instant Aberturas app",
    description: "Instant Aberturas app",
    type: "website",
    authors: "https://github.com/OmarReales",
  },
};

interface CategoryImage {
  [key: string]: string;
}

const categoryImages: CategoryImage = {
  Ventanas: "/images/categories/ventanas.jpg",
  Puertas: "/images/categories/puertas.jpg",
};

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const products = await getProducts();
    return products.slice(0, 4);
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
}

export default async function Home() {
  let categories: string[] = [];
  let featuredProducts: Product[] = [];

  try {
    const [categoriesData, productsData] = await Promise.all([
      getCategories(),
      getFeaturedProducts(),
    ]);

    categories = categoriesData;
    featuredProducts = productsData;
  } catch (error) {
    if (error instanceof ProductError) {
      console.error("Product error:", error.message);
    } else {
      console.error("Error loading home page data:", error);
    }
  }

  const getCategoryImage = (category: string): string => {
    const productInCategory = featuredProducts.find(
      (p) => p.category === category
    );
    return (
      productInCategory?.imageURL ||
      categoryImages[category] ||
      "/images/placeholder.jpg"
    );
  };

  return (
    <ErrorBoundary>
      <div className="container mx-auto px-4 py-8">
        <section className="mb-16">
          <div className="relative h-[500px] rounded-lg overflow-hidden">
            <Image
              src="/hero.jpg"
              alt="Hero"
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center text-white">
                <h1 className="text-5xl font-bold mb-4">
                  Ventanas y puertas de primera calidad
                </h1>
                <p className="text-xl mb-8">
                  Encuentra las mejores ventanas y puertas para tu hogar
                </p>
                <Link href="/products">
                  <Button
                    size="lg"
                    className="bg-white text-black hover:bg-gray-100"
                  >
                    Compra ahora!
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <Suspense fallback={<LoadingComponent />}>
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Categorías</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {categories.map((category) => (
                <Link
                  key={category}
                  href={`/products?category=${encodeURIComponent(category)}`}
                  className="relative h-64 rounded-lg overflow-hidden group"
                >
                  <Image
                    src={getCategoryImage(category)}
                    alt={category}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <h3 className="text-2xl font-bold text-white">
                      {category}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </Suspense>

        <Suspense fallback={<LoadingComponent />}>
          <section>
            <h2 className="text-3xl font-bold mb-8">Productos destacados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group"
                >
                  <div className="relative h-64 mb-4 rounded-lg overflow-hidden">
                    <Image
                      src={product.imageURL}
                      alt={product.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  </div>
                  <h3 className="font-semibold mb-2 group-hover:text-gray-600">
                    {product.title}
                  </h3>
                  <p className="text-lg font-bold">
                    ${product.price.toLocaleString()}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        </Suspense>
      </div>
    </ErrorBoundary>
  );
}
