import { Skeleton } from "@/components/ui/skeleton";

export function NotFoundPageSkeleton() {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-muted p-6"
      aria-busy="true"
      aria-label="Loading">
      <div className="text-center space-y-4 max-w-sm w-full">
        <Skeleton className="h-12 w-24 mx-auto rounded-md" />
        <Skeleton className="h-6 w-full max-w-[280px] mx-auto rounded-md" />
        <Skeleton className="h-4 w-40 mx-auto rounded-md" />
      </div>
    </div>
  );
}
