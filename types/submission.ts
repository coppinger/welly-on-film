import type { CategoryTypeId, FixedCategoryId } from "./category";
import type { UserSummary } from "./user";

export interface SubmissionMetadata {
  camera: string | null;
  filmStock: string | null;
  location: string | null;
  description: string | null;
  tags: string[];
}

export interface Submission {
  id: string;
  userId: string;
  photoUrl: string;
  thumbnailUrl: string;
  categoryType: CategoryTypeId;
  // For fixed category, this is the specific sub-category (love, nature, etc.)
  // For rotating/open, this can be null or the rotating theme id
  category: FixedCategoryId | string | null;
  metadata: SubmissionMetadata;
  monthYear: string; // e.g., "2025-01"
  isFeatured: boolean;
  isRemoved: boolean;
  editedAt: string | null;
  deletedAt: string | null;
  createdAt: string;
}

export interface SubmissionWithUser extends Submission {
  user: UserSummary;
}

// For gallery display
export interface SubmissionCard {
  id: string;
  thumbnailUrl: string;
  categoryType: CategoryTypeId;
  user: UserSummary;
  isFeatured: boolean;
}

// For detail page
export interface SubmissionDetail extends SubmissionWithUser {
  viewCount: number;
  commentCount: number;
}
