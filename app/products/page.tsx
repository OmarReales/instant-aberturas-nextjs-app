import { getProducts, getCategories, getBrands } from "@/app/lib/products";
import { ProductGrid } from "@/app/components/product-grid";
import { ProductFilters } from "@/app/components/product-filters";

export default async function ProductsPage(props: any) {
  const [products, categories, brands] = await Promise.all([
    getProducts(),
    getCategories(),
    getBrands(),
  ]);
  const searchParams = props.searchParams;

  const categoryParam = searchParams?.category || "";
  const brandParam = searchParams?.brand || "";

  let filteredProducts = products;

  if (categoryParam) {
    filteredProducts = filteredProducts.filter(
      (product) => product.category === categoryParam
    );
  }

  if (brandParam) {
    filteredProducts = filteredProducts.filter(
      (product) => product.brand === brandParam
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Nuestros productos</h1>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <ProductFilters
          categories={categories}
          brands={brands}
          selectedCategory={categoryParam}
          selectedBrand={brandParam}
        />
        <div className="lg:col-span-3">
          <ProductGrid products={filteredProducts} />
        </div>
      </div>
    </div>
  );
}
