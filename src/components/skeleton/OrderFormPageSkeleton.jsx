import { Skeleton } from "@/components/ui/skeleton";

export function OrderFormPageSkeleton() {
  return (
    <div
      className="max-w-3xl mx-auto space-y-4 sm:space-y-6 animate-fade-in"
      aria-busy="true"
      aria-label="Loading form">
      <div className="flex items-center gap-3 sm:gap-4">
        <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
        <Skeleton className="h-7 w-48 rounded-md" />
      </div>
      <div className="glass-card p-3 sm:p-4">
        <div className="flex items-center justify-between gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center flex-1 last:flex-none min-w-0">
              <div className="flex items-center gap-2 sm:gap-3">
                <Skeleton className="h-8 w-8 sm:h-9 sm:w-9 rounded-full shrink-0" />
                <Skeleton className="h-3 w-20 rounded-md hidden sm:block" />
              </div>
              {i < 3 && <Skeleton className="flex-1 h-px mx-2 sm:mx-4 min-w-[8px]" />}
            </div>
          ))}
        </div>
      </div>
      <div className="glass-card p-4 sm:p-6 min-h-[300px]">
        <Skeleton className="h-4 w-40 rounded-md mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <Skeleton className="h-3 w-24 rounded-md" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-8 pt-4 border-t border-border">
          <Skeleton className="h-10 w-24 rounded-xl" />
          <Skeleton className="h-10 w-28 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
