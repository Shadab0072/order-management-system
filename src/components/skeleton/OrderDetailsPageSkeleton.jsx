import { Skeleton } from "@/components/ui/skeleton";

export function OrderDetailsPageSkeleton() {
  return (
    <div
      className="space-y-4 sm:space-y-6 animate-fade-in"
      aria-busy="true"
      aria-label="Loading order">
      <div className="flex items-center gap-3 sm:gap-4">
        <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-6 w-40 rounded-md" />
          <Skeleton className="h-3 w-48 rounded-md" />
        </div>
        <Skeleton className="h-8 w-24 rounded-lg shrink-0" />
      </div>
      <div className="glass-card p-4 sm:p-6">
        <Skeleton className="h-4 w-36 rounded-md mb-6" />
        <div className="hidden sm:flex items-center justify-between gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center flex-1 gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-3 w-16 rounded-md" />
              <Skeleton className="h-2 w-14 rounded-md" />
            </div>
          ))}
        </div>
        <div className="sm:hidden space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-8 w-8 rounded-full shrink-0" />
              <div className="space-y-2 pt-0.5 flex-1">
                <Skeleton className="h-4 w-28 rounded-md" />
                <Skeleton className="h-3 w-24 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="space-y-4 sm:space-y-6">
          <div className="glass-card p-4 sm:p-6 space-y-4">
            <Skeleton className="h-4 w-28 rounded-md" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-32 rounded-md" />
                <Skeleton className="h-3 w-20 rounded-md" />
              </div>
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-[75%] rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
            </div>
          </div>
          <div className="glass-card p-4 sm:p-6 space-y-4">
            <Skeleton className="h-4 w-36 rounded-md" />
            <div className="flex gap-3">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <div className="space-y-2 flex-1 pt-1">
                <Skeleton className="h-4 w-40 rounded-md" />
                <Skeleton className="h-3 w-32 rounded-md" />
              </div>
            </div>
          </div>
        </div>
        <div className="glass-card p-4 sm:p-6 lg:col-span-2">
          <Skeleton className="h-4 w-28 rounded-md mb-4" />
          <div className="hidden sm:block space-y-0">
            <div className="flex gap-8 border-b border-border pb-2 mb-2">
              <Skeleton className="h-3 w-20 rounded-md" />
              <Skeleton className="h-3 w-8 rounded-md mx-auto" />
              <Skeleton className="h-3 w-12 rounded-md ml-auto" />
              <Skeleton className="h-3 w-12 rounded-md" />
            </div>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-3 border-b border-border">
                <Skeleton className="h-4 flex-1 rounded-md" />
                <Skeleton className="h-4 w-8 rounded-md" />
                <Skeleton className="h-4 w-16 rounded-md" />
                <Skeleton className="h-4 w-16 rounded-md" />
              </div>
            ))}
          </div>
          <div className="sm:hidden space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex justify-between py-2 border-b border-border">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32 rounded-md" />
                  <Skeleton className="h-3 w-24 rounded-md" />
                </div>
                <Skeleton className="h-4 w-16 rounded-md" />
              </div>
            ))}
          </div>
          <div className="flex justify-between pt-4 mt-2">
            <Skeleton className="h-5 w-16 rounded-md" />
            <Skeleton className="h-7 w-28 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
