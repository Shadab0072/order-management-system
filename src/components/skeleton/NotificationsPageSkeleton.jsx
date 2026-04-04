import { Skeleton } from "@/components/ui/skeleton";

function NotificationCardSkeleton() {
  return (
    <div className="glass-card p-4 flex items-start gap-4">
      <Skeleton className="h-9 w-9 rounded-xl shrink-0" />
      <div className="flex-1 min-w-0 space-y-2">
        <Skeleton className="h-4 w-48 max-w-[80%] rounded-md" />
        <Skeleton className="h-3 w-full rounded-md" />
        <Skeleton className="h-3 w-[90%] rounded-md" />
        <div className="flex gap-3 mt-2">
          <Skeleton className="h-3 w-28 rounded-md" />
          <Skeleton className="h-3 w-20 rounded-md" />
        </div>
      </div>
    </div>
  );
}

function SectionSkeleton({ cards }) {
  return (
    <section className="space-y-3">
      <Skeleton className="h-3 w-24 rounded-md" />
      <div className="space-y-2">
        {Array.from({ length: cards }).map((_, i) => (
          <NotificationCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}

export function NotificationsPageSkeleton() {
  return (
    <div
      className="max-w-3xl mx-auto space-y-6 animate-fade-in"
      aria-busy="true"
      aria-label="Loading notifications">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-40 rounded-md" />
        <Skeleton className="h-4 w-28 rounded-md" />
      </div>
      <div className="space-y-8">
        <SectionSkeleton cards={2} />
        <SectionSkeleton cards={1} />
      </div>
    </div>
  );
}
