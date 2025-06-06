import { Skeleton } from "@/app/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-10 w-48 mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex gap-4">
                <Skeleton className="w-24 h-24 rounded-md" />
                <div className="flex-1">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-10 w-32" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                    <Skeleton className="h-6 w-24" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
            <Skeleton className="h-6 w-40 mb-4" />

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between mb-6">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-32" />
              </div>

              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
