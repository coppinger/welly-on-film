"use client";

import { cn } from "@/lib/utils";
import { PhotoCard, PhotoCardSkeleton } from "./photo-card";
import type { SubmissionCard } from "@/types";

interface PhotoGridProps {
  submissions: SubmissionCard[];
  showCategory?: boolean;
  showUser?: boolean;
  className?: string;
  priorityCount?: number; // Number of images to load with priority
}

export function PhotoGrid({
  submissions,
  showCategory = true,
  showUser = true,
  className,
  priorityCount = 4,
}: PhotoGridProps) {
  if (submissions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No submissions yet</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4",
        className
      )}
    >
      {submissions.map((submission, index) => (
        <PhotoCard
          key={submission.id}
          submission={submission}
          showCategory={showCategory}
          showUser={showUser}
          priority={index < priorityCount}
        />
      ))}
    </div>
  );
}

// Loading skeleton grid
interface PhotoGridSkeletonProps {
  count?: number;
  className?: string;
}

export function PhotoGridSkeleton({
  count = 8,
  className,
}: PhotoGridSkeletonProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4",
        className
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <PhotoCardSkeleton key={i} />
      ))}
    </div>
  );
}
