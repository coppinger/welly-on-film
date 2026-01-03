import type { CATEGORY_TYPES, FIXED_CATEGORIES } from "@/lib/constants";

export type CategoryTypeId = keyof typeof CATEGORY_TYPES;
export type FixedCategoryId = (typeof FIXED_CATEGORIES)[number]["id"];

export interface CategoryType {
  id: CategoryTypeId;
  name: string;
  description: string;
  photoCount: number;
}

export interface FixedCategory {
  id: FixedCategoryId;
  name: string;
  description: string;
}

export interface RotatingTheme {
  id: string;
  name: string;
  description: string;
  sponsorName?: string;
  sponsorUrl?: string;
}
