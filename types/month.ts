import type { MONTH_STATUS } from "@/lib/constants";
import type { RotatingTheme } from "./category";

export type MonthStatus = (typeof MONTH_STATUS)[keyof typeof MONTH_STATUS];

export interface Month {
  id: string;
  monthYear: string; // e.g., "2025-01"
  rotatingCategory: RotatingTheme;
  submissionsOpen: string; // ISO datetime
  submissionsClose: string; // ISO datetime
  status: MonthStatus;
}

export interface MonthWithStats extends Month {
  submissionCount: number;
  featuredCount: number;
}

// For archive display
export interface MonthSummary {
  id: string;
  monthYear: string;
  displayName: string; // e.g., "January 2025"
  rotatingCategoryName: string;
  submissionCount: number;
  featuredCount: number;
  coverImageUrl: string | null;
}
