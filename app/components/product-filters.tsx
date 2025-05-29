"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Check } from "lucide-react"; // Import the Check icon

interface ProductFiltersProps {
  categories: string[];
  brands: string[];
  selectedCategory?: string;
  selectedBrand?: string;
}
export function ProductFilters({
  categories,
  brands,
  selectedCategory,
  selectedBrand,
}: ProductFiltersProps) {
  const router = useRouter();
  const handleCategoryClick = (category: string) => {
    const params = new URLSearchParams(window.location.search);
    if (category === selectedCategory) {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    router.push(`/products?${params.toString()}`, { scroll: false });
  };
  const handleBrandClick = (brand: string) => {
    const params = new URLSearchParams(window.location.search);
    if (brand === selectedBrand) {
      params.delete("brand");
    } else {
      params.set("brand", brand);
    }
    router.push(`/products?${params.toString()}`, { scroll: false });
  };
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Categorias</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={category === selectedCategory ? "default" : "ghost"}
              className={`w-full justify-start relative transition-all duration-200 ${
                category === selectedCategory
                  ? "pl-8 font-medium"
                  : "hover:pl-6"
              }`}
              onClick={() => handleCategoryClick(category)}
            >
              {category === selectedCategory && (
                <Check className="h-4 w-4 absolute left-2" />
              )}
              {category}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">Marcas</h3>
        <div className="space-y-2">
          {brands.map((brand) => (
            <Button
              key={brand}
              variant={brand === selectedBrand ? "default" : "ghost"}
              className={`w-full justify-start relative transition-all duration-200 ${
                brand === selectedBrand ? "pl-8 font-medium" : "hover:pl-6"
              }`}
              onClick={() => handleBrandClick(brand)}
            >
              {brand === selectedBrand && (
                <Check className="h-4 w-4 absolute left-2" />
              )}
              {brand}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
