import Skeleton from "@/components/ui/Skeleton";

export default function ClientsLoading() {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <Skeleton className="h-8 w-28 mb-2" />
          <Skeleton className="h-4 w-56" />
        </div>
        <Skeleton className="h-10 w-36 rounded-lg" />
      </div>

      <div className="bg-card rounded-2xl shadow-card">
        <div className="p-6 border-b border-gray-100">
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>

        <div className="px-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 py-4 border-b border-gray-50 last:border-b-0">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-3 w-44" />
              </div>
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-36" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
