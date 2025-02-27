import { Skeleton } from "@/app/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white border-r">
        <div className="p-6">
          <Skeleton className="h-8 w-32" />
        </div>
        <nav className="px-4 space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </div>
              <Skeleton className="h-8 w-16 mt-2" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
