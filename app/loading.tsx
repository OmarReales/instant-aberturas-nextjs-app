import { Skeleton } from "@/app/components/ui/skeleton";

function HeroSkeleton() {
  return (
    <div className="mb-16">
      <div className="relative h-[500px] rounded-lg overflow-hidden bg-gray-200 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Skeleton className="h-12 w-96 mx-auto" />
            <Skeleton className="h-6 w-80 mx-auto" />
            <Skeleton className="h-12 w-40 mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoriesSkeleton() {
  return (
    <div className="mb-16">
      <Skeleton className="h-10 w-48 mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={`category-${i}`} className="h-64 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

function ProductsSkeleton() {
  return (
    <div>
      <Skeleton className="h-10 w-48 mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={`product-${i}`} className="space-y-4">
            <Skeleton className="h-64 rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <HeroSkeleton />
      <CategoriesSkeleton />
      <ProductsSkeleton />
    </div>
  );
}
