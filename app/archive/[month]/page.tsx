"use client";

import { useState, useMemo, use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PhotoGrid, CategoryFilter } from "@/components/gallery";
import { getMonthBySlug, formatMonthYear } from "@/lib/data/months";
import {
  getSubmissionCards,
  getFeaturedSubmissions,
} from "@/lib/data/submissions";
import { getUserSummary } from "@/lib/data/users";
import { getRaffleWinnerForMonth } from "@/lib/data/users";
import { CATEGORY_TYPES } from "@/lib/constants";
import type { CategoryTypeId, SubmissionCard } from "@/types";

interface PageProps {
  params: Promise<{ month: string }>;
}

export default function ArchiveMonthPage({ params }: PageProps) {
  const { month: monthSlug } = use(params);
  const [view, setView] = useState<"featured" | "all">("featured");
  const [categoryFilter, setCategoryFilter] = useState<CategoryTypeId | "all">("all");

  const month = getMonthBySlug(monthSlug);

  if (!month) {
    notFound();
  }

  const allSubmissions = useMemo(
    () => getSubmissionCards(month.monthYear),
    [month.monthYear]
  );

  const featuredSubmissions = useMemo(
    () =>
      getFeaturedSubmissions(month.monthYear).map((s) => ({
        id: s.id,
        thumbnailUrl: s.thumbnailUrl,
        categoryType: s.categoryType,
        user: s.user,
        isFeatured: s.isFeatured,
      })) as SubmissionCard[],
    [month.monthYear]
  );

  const raffleWinner = getRaffleWinnerForMonth(month.monthYear);
  const winnerUser = raffleWinner ? getUserSummary(raffleWinner.userId) : null;

  // Filter submissions for "all" view
  const filteredSubmissions = useMemo(() => {
    if (categoryFilter === "all") return allSubmissions;
    return allSubmissions.filter((s) => s.categoryType === categoryFilter);
  }, [allSubmissions, categoryFilter]);

  const counts = useMemo(
    () => ({
      all: allSubmissions.length,
      fixed: allSubmissions.filter((s) => s.categoryType === "fixed").length,
      rotating: allSubmissions.filter((s) => s.categoryType === "rotating").length,
      open: allSubmissions.filter((s) => s.categoryType === "open").length,
    }),
    [allSubmissions]
  );

  return (
    <div className="container py-12">
      {/* Back navigation */}
      <Button asChild variant="ghost" size="sm" className="mb-6">
        <Link href="/archive">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Archive
        </Link>
      </Button>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <Calendar className="h-4 w-4" />
          <span>{formatMonthYear(month.monthYear)}</span>
        </div>

        <h1 className="text-3xl font-bold mb-2">
          {month.rotatingCategory.name}
        </h1>
        <p className="text-muted-foreground mb-4">
          {month.rotatingCategory.description}
        </p>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">
            <Star className="h-3 w-3 mr-1" />
            {featuredSubmissions.length} featured
          </Badge>
          <Badge variant="outline">{allSubmissions.length} submissions</Badge>
        </div>
      </div>

      {/* Raffle Winner */}
      {winnerUser && (
        <div className="mb-8 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <p className="text-sm text-muted-foreground mb-1">
            Raffle Winner
          </p>
          <p className="font-medium">{winnerUser.displayName}</p>
        </div>
      )}

      {/* View Toggle */}
      <Tabs value={view} onValueChange={(v) => setView(v as "featured" | "all")}>
        <TabsList className="mb-6">
          <TabsTrigger value="featured" className="gap-2">
            <Star className="h-4 w-4" />
            Featured ({featuredSubmissions.length})
          </TabsTrigger>
          <TabsTrigger value="all">
            All Submissions ({allSubmissions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="featured">
          {featuredSubmissions.length > 0 ? (
            <>
              <p className="text-muted-foreground mb-6">
                The 15 photos selected for the print magazine.
              </p>
              <PhotoGrid submissions={featuredSubmissions} />
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Featured photos will be announced soon.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="all">
          {/* Category Filter */}
          <div className="mb-6">
            <CategoryFilter
              value={categoryFilter}
              onChange={setCategoryFilter}
              counts={counts}
            />
          </div>

          <PhotoGrid submissions={filteredSubmissions} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
