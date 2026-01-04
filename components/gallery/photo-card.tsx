"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { SubmissionCard, CategoryTypeId } from "@/types";
import { CATEGORY_TYPES, FIXED_CATEGORIES } from "@/lib/constants";

interface PhotoCardProps {
  submission: SubmissionCard;
  showCategory?: boolean;
  showUser?: boolean;
  priority?: boolean;
}

function getCategoryLabel(categoryType: CategoryTypeId): string {
  return CATEGORY_TYPES[categoryType]?.name || categoryType;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function PhotoCard({
  submission,
  showCategory = true,
  showUser = true,
  priority = false,
}: PhotoCardProps) {
  return (
    <Link
      href={`/this-month/submissions/${submission.id}`}
      className="group relative block aspect-square overflow-hidden rounded-lg bg-muted"
    >
      {/* Image */}
      <Image
        src={submission.thumbnailUrl}
        alt={`Photo by ${submission.user.displayName}`}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        priority={priority}
      />

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Featured badge */}
      {submission.isFeatured && (
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="gap-1 bg-yellow-500/90 text-yellow-950">
            <Star className="h-3 w-3 fill-current" />
            Featured
          </Badge>
        </div>
      )}

      {/* Persistent photographer attribution */}
      {showUser && (
        <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded truncate max-w-[calc(100%-1rem)] transition-opacity duration-300 group-hover:opacity-0">
          {submission.user.displayName}
        </div>
      )}

      {/* Bottom info - visible on hover */}
      <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full transition-transform duration-300 group-hover:translate-y-0">
        <div className="flex items-center justify-between gap-2">
          {showUser && (
            <div className="flex items-center gap-2 min-w-0">
              <Avatar className="h-6 w-6 border border-white/20">
                <AvatarImage src={submission.user.avatarUrl || undefined} />
                <AvatarFallback className="text-xs bg-muted">
                  {getInitials(submission.user.displayName)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-white truncate">
                {submission.user.displayName}
              </span>
            </div>
          )}

          {showCategory && (
            <Badge
              variant="outline"
              className="shrink-0 border-white/30 text-white text-xs"
            >
              {getCategoryLabel(submission.categoryType)}
            </Badge>
          )}
        </div>
      </div>
    </Link>
  );
}

// Loading skeleton for photo cards
export function PhotoCardSkeleton() {
  return (
    <div className="aspect-square rounded-lg bg-muted animate-pulse" />
  );
}
