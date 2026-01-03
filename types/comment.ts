import type { UserSummary } from "./user";

export interface Comment {
  id: string;
  submissionId: string;
  userId: string;
  body: string;
  isFlagged: boolean;
  createdAt: string;
}

export interface CommentWithUser extends Comment {
  user: UserSummary;
}
