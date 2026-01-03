import submissionsData from "@/data/submissions.json";
import commentsData from "@/data/comments.json";
import type {
  Submission,
  SubmissionWithUser,
  SubmissionCard,
  SubmissionDetail,
  CategoryTypeId,
} from "@/types";
import { getUserSummary } from "./users";

const { submissions } = submissionsData;
const { comments } = commentsData;

export function getSubmissions(): Submission[] {
  return submissions.filter((s) => !s.isRemoved && !s.deletedAt) as Submission[];
}

export function getSubmissionById(id: string): Submission | null {
  const submission = submissions.find(
    (s) => s.id === id && !s.isRemoved && !s.deletedAt
  );
  return submission ? (submission as Submission) : null;
}

export function getSubmissionWithUser(id: string): SubmissionWithUser | null {
  const submission = getSubmissionById(id);
  if (!submission) return null;

  const user = getUserSummary(submission.userId);
  if (!user) return null;

  return {
    ...submission,
    user,
  };
}

export function getSubmissionDetail(id: string): SubmissionDetail | null {
  const submissionWithUser = getSubmissionWithUser(id);
  if (!submissionWithUser) return null;

  const submissionComments = comments.filter(
    (c) => c.submissionId === id && !c.isFlagged
  );

  return {
    ...submissionWithUser,
    viewCount: Math.floor(Math.random() * 200) + 10, // Mock view count
    commentCount: submissionComments.length,
  };
}

export function getSubmissionsByMonth(monthYear: string): Submission[] {
  return submissions.filter(
    (s) => s.monthYear === monthYear && !s.isRemoved && !s.deletedAt
  ) as Submission[];
}

export function getSubmissionsWithUserByMonth(
  monthYear: string
): SubmissionWithUser[] {
  const monthSubmissions = getSubmissionsByMonth(monthYear);
  return monthSubmissions
    .map((s) => {
      const user = getUserSummary(s.userId);
      if (!user) return null;
      return { ...s, user };
    })
    .filter((s): s is SubmissionWithUser => s !== null);
}

export function getSubmissionCards(monthYear: string): SubmissionCard[] {
  const monthSubmissions = getSubmissionsWithUserByMonth(monthYear);
  return monthSubmissions.map((s) => ({
    id: s.id,
    thumbnailUrl: s.thumbnailUrl,
    categoryType: s.categoryType,
    user: s.user,
    isFeatured: s.isFeatured,
  }));
}

export function getSubmissionsByCategory(
  monthYear: string,
  categoryType: CategoryTypeId
): SubmissionWithUser[] {
  return getSubmissionsWithUserByMonth(monthYear).filter(
    (s) => s.categoryType === categoryType
  );
}

export function getFeaturedSubmissions(monthYear: string): SubmissionWithUser[] {
  return getSubmissionsWithUserByMonth(monthYear).filter((s) => s.isFeatured);
}

export function getSubmissionsByUser(userId: string): Submission[] {
  return submissions.filter(
    (s) => s.userId === userId && !s.isRemoved && !s.deletedAt
  ) as Submission[];
}

export function getOtherSubmissionsByUser(
  userId: string,
  excludeSubmissionId: string,
  limit: number = 4
): SubmissionCard[] {
  const userSubmissions = submissions.filter(
    (s) =>
      s.userId === userId &&
      s.id !== excludeSubmissionId &&
      !s.isRemoved &&
      !s.deletedAt
  );

  const user = getUserSummary(userId);
  if (!user) return [];

  return userSubmissions.slice(0, limit).map((s) => ({
    id: s.id,
    thumbnailUrl: s.thumbnailUrl,
    categoryType: s.categoryType as CategoryTypeId,
    user,
    isFeatured: s.isFeatured,
  }));
}

export function countSubmissionsByUserForMonth(
  userId: string,
  monthYear: string
): number {
  return submissions.filter(
    (s) =>
      s.userId === userId &&
      s.monthYear === monthYear &&
      !s.isRemoved &&
      !s.deletedAt
  ).length;
}
