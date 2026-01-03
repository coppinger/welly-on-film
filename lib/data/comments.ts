import commentsData from "@/data/comments.json";
import type { Comment, CommentWithUser } from "@/types";
import { getUserSummary } from "./users";

const { comments } = commentsData;

export function getComments(): Comment[] {
  return comments.filter((c) => !c.isFlagged) as Comment[];
}

export function getCommentById(id: string): Comment | null {
  const comment = comments.find((c) => c.id === id && !c.isFlagged);
  return comment ? (comment as Comment) : null;
}

export function getCommentsBySubmission(submissionId: string): CommentWithUser[] {
  const submissionComments = comments.filter(
    (c) => c.submissionId === submissionId && !c.isFlagged
  );

  return submissionComments
    .map((c) => {
      const user = getUserSummary(c.userId);
      if (!user) {
        // User was deleted, show as "Deleted User"
        return {
          ...c,
          user: {
            id: c.userId,
            displayName: "Deleted User",
            avatarUrl: null,
          },
        };
      }
      return { ...c, user };
    })
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    ) as CommentWithUser[];
}

export function getCommentCount(submissionId: string): number {
  return comments.filter(
    (c) => c.submissionId === submissionId && !c.isFlagged
  ).length;
}

export function getFlaggedComments(): Comment[] {
  return comments.filter((c) => c.isFlagged) as Comment[];
}
