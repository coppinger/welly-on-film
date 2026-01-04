import { Skeleton } from "@/components/ui/skeleton";
import { PhotoGridSkeleton } from "@/components/gallery";

export default function SubmissionsLoading() {
  return (
    <div className="container py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-48" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-20" />
      </div>

      {/* Photo grid */}
      <PhotoGridSkeleton count={12} />
    </div>
  );
}
