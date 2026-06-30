import { Skeleton } from '@/components/ui/skeleton';

const CARD_COUNT = 6;

export function PublicationsSkeleton() {
  return (
    <div
      className="grid min-h-[600px] lg:grid-cols-[minmax(310px,1.05fr)_minmax(0,1.4fr)]"
      aria-busy="true"
      aria-label="Loading publications"
    >
      {/* Sidebar skeleton */}
      <aside className="flex min-h-0 flex-col border-b border-border/50 bg-background/35 p-4 lg:border-b-0 lg:border-r">
        <Skeleton className="h-11 w-full rounded-full" />

        <ul className="mt-4 flex min-h-0 flex-1 flex-col gap-0" aria-hidden="true">
          {Array.from({ length: CARD_COUNT }).map((_, index) => (
            <li
              key={index}
              className="flex items-start gap-3 border-b border-border/30 px-2.5 py-3"
            >
              <Skeleton className="size-14 shrink-0 rounded-lg" />
              <div className="min-w-0 flex-1 space-y-2 pt-1">
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3.5 w-4/5" />
                <Skeleton className="h-2.5 w-24" />
              </div>
            </li>
          ))}
        </ul>
      </aside>

      {/* Preview skeleton */}
      <div className="hidden min-h-0 flex-col p-6 lg:flex">
        <Skeleton className="aspect-video w-full rounded-xl" />
        <div className="mt-5 flex gap-3">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="mt-4 h-7 w-4/5" />
        <Skeleton className="mt-4 h-7 w-3/5" />
        <div className="mt-4 space-y-2">
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-11/12" />
          <Skeleton className="h-3.5 w-4/5" />
        </div>
        <div className="mt-auto flex justify-end pt-6">
          <Skeleton className="h-11 w-56 rounded-full" />
        </div>
      </div>
    </div>
  );
}
