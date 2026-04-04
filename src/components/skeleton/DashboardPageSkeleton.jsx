import { Skeleton } from "@/components/ui/skeleton";

function StatCardSkeleton({ wide }) {
  return (
    <div
      className={`glass-card p-4 sm:p-5 ${wide ? "col-span-2 sm:col-span-1" : ""}`}>
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <Skeleton className="h-4 w-4 sm:h-5 sm:w-5 rounded-md" />
        <Skeleton className="h-3 w-10 rounded-md" />
      </div>
      <Skeleton className="h-7 sm:h-8 w-14 rounded-md mb-1" />
      <Skeleton className="h-3 w-24 rounded-md" />
    </div>
  );
}

export function DashboardPageSkeleton() {
  return (
    <div
      className="space-y-4 sm:space-y-6 animate-fade-in"
      aria-busy="true"
      aria-label="Loading dashboard">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <StatCardSkeleton wide />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 glass-card p-4 sm:p-6">
          <Skeleton className="h-4 w-32 rounded-md mb-4" />
          <Skeleton className="w-full h-[220px] rounded-xl" />
        </div>
        <div className="glass-card p-4 sm:p-6">
          <Skeleton className="h-4 w-40 rounded-md mb-4" />
          <div className="flex justify-center py-2">
            <Skeleton className="h-[140px] w-[140px] rounded-full" />
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-2.5 w-2.5 rounded-full shrink-0" />
                <Skeleton className="h-3 flex-1 rounded-md" />
                <Skeleton className="h-3 w-6 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="glass-card overflow-hidden">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-border flex items-center justify-between">
          <Skeleton className="h-4 w-32 rounded-md" />
          <Skeleton className="h-3 w-16 rounded-md" />
        </div>
        <div className="hidden sm:block p-4 sm:p-6 space-y-3">
          <div className="flex gap-4 border-b border-border pb-2">
            {["w-16", "w-24", "w-20", "w-14", "w-20"].map((w, i) => (
              <Skeleton key={i} className={`h-3 ${w} rounded-md`} />
            ))}
          </div>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 py-2 border-b border-border last:border-0">
              <Skeleton className="h-4 w-20 rounded-md" />
              <div className="flex items-center gap-2 flex-1">
                <Skeleton className="h-7 w-7 rounded-full shrink-0" />
                <Skeleton className="h-4 flex-1 max-w-[180px] rounded-md" />
              </div>
              <Skeleton className="h-6 w-20 rounded-lg" />
              <Skeleton className="h-4 w-16 rounded-md ml-auto" />
              <Skeleton className="h-4 w-24 rounded-md hidden md:block" />
            </div>
          ))}
        </div>
        <div className="sm:hidden divide-y divide-border p-2 space-y-0">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-4">
              <Skeleton className="h-9 w-9 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-full max-w-[200px] rounded-md" />
                <Skeleton className="h-3 w-[70%] rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
