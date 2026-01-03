import type { USER_ROLES } from "@/lib/constants";

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  role: UserRole;
  createdAt: string;
  deletedAt: string | null;
}

export interface UserProfile extends User {
  submissionCount: number;
  featuredCount: number;
}

export interface JudgeAssignment {
  id: string;
  userId: string;
  monthYear: string; // e.g., "2025-01"
  createdAt: string;
}

export interface RaffleWinner {
  id: string;
  userId: string;
  monthYear: string;
  createdAt: string;
}

// For display purposes (e.g., in comments, photo credits)
export interface UserSummary {
  id: string;
  displayName: string;
  avatarUrl: string | null;
}
