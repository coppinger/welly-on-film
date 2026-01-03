"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Calendar, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PhotoGrid, CategoryFilter } from "@/components/gallery";
import { getCurrentMonth, formatMonthYear } from "@/lib/data/months";
import { getSubmissionCards } from "@/lib/data/submissions";
import type { CategoryTypeId } from "@/types";

export default function SubmissionsPage() {
  const [categoryFilter, setCategoryFilter] = useState<CategoryTypeId | "all">("all");

  const currentMonth = getCurrentMonth();

  const submissions = useMemo(() => {
    if (!currentMonth) return [];
    return getSubmissionCards(currentMonth.monthYear);
  }, [currentMonth]);

  const filteredSubmissions = useMemo(() => {
    if (categoryFilter === "all") return submissions;
    return submissions.filter((s) => s.categoryType === categoryFilter);
  }, [submissions, categoryFilter]);

  // Calculate counts for filter tabs
  const counts = useMemo(() => {
    const result: Record<CategoryTypeId | "all", number> = {
      all: submissions.length,
      fixed: submissions.filter((s) => s.categoryType === "fixed").length,
      rotating: submissions.filter((s) => s.categoryType === "rotating").length,
      open: submissions.filter((s) => s.categoryType === "open").length,
    };
    return result;
  }, [submissions]);

  if (!currentMonth) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">No Active Month</h1>
        <p className="text-muted-foreground mb-6">
          There&apos;s no active submission period right now.
        </p>
        <Button asChild>
          <Link href="/archive">Browse Archive</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-12">
      {/* Header */}
      <div className="mb-8">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link href="/this-month/brief">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Brief
          </Link>
        </Button>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">{formatMonthYear(currentMonth.monthYear)}</span>
            </div>
            <h1 className="text-3xl font-bold">Submissions</h1>
            <p className="text-muted-foreground mt-1">
              {submissions.length} photo{submissions.length === 1 ? "" : "s"} submitted
            </p>
          </div>

          {currentMonth.status === "open" && (
            <Button asChild>
              <Link href="/submit">Submit Photo</Link>
            </Button>
          )}
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <CategoryFilter
          value={categoryFilter}
          onChange={setCategoryFilter}
          counts={counts}
        />
      </div>

      {/* Gallery */}
      <PhotoGrid submissions={filteredSubmissions} />

      {/* Empty state for filtered view */}
      {filteredSubmissions.length === 0 && categoryFilter !== "all" && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            No submissions in this category yet.
          </p>
          <Button variant="outline" onClick={() => setCategoryFilter("all")}>
            View All Submissions
          </Button>
        </div>
      )}
    </div>
  );
}
