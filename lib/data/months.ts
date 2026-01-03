import monthsData from "@/data/months.json";
import type { Month, MonthSummary, MonthWithStats, RotatingTheme } from "@/types";
import { getSubmissionsByMonth } from "./submissions";

const { months, rotatingThemes } = monthsData;

export function getMonths(): Month[] {
  return months as Month[];
}

export function getCurrentMonth(): Month | null {
  const current = months.find((m) => m.status === "open");
  return current ? (current as Month) : null;
}

export function getMonthBySlug(monthYear: string): Month | null {
  const month = months.find((m) => m.monthYear === monthYear);
  return month ? (month as Month) : null;
}

export function getMonthWithStats(monthYear: string): MonthWithStats | null {
  const month = getMonthBySlug(monthYear);
  if (!month) return null;

  const submissions = getSubmissionsByMonth(monthYear);
  const featuredCount = submissions.filter((s) => s.isFeatured).length;

  return {
    ...month,
    submissionCount: submissions.length,
    featuredCount,
  };
}

export function getArchivedMonths(): MonthSummary[] {
  return months
    .filter((m) => m.status === "closed")
    .map((m) => {
      const submissions = getSubmissionsByMonth(m.monthYear);
      const featured = submissions.find((s) => s.isFeatured);

      // Format display name (e.g., "January 2025")
      const date = new Date(m.monthYear + "-01");
      const displayName = date.toLocaleDateString("en-NZ", {
        month: "long",
        year: "numeric",
      });

      return {
        id: m.id,
        monthYear: m.monthYear,
        displayName,
        rotatingCategoryName: m.rotatingCategory.name,
        submissionCount: submissions.length,
        featuredCount: submissions.filter((s) => s.isFeatured).length,
        coverImageUrl: featured?.thumbnailUrl || null,
      };
    })
    .sort((a, b) => b.monthYear.localeCompare(a.monthYear)); // Most recent first
}

export function getRotatingThemes(): RotatingTheme[] {
  return rotatingThemes as RotatingTheme[];
}

export function getRotatingThemeById(id: string): RotatingTheme | null {
  const theme = rotatingThemes.find((t) => t.id === id);
  return theme ? (theme as RotatingTheme) : null;
}

export function formatMonthYear(monthYear: string): string {
  const date = new Date(monthYear + "-01");
  return date.toLocaleDateString("en-NZ", {
    month: "long",
    year: "numeric",
  });
}
