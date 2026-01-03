import type { JUDGE_ACTIONS } from "@/lib/constants";

export type JudgeActionType = (typeof JUDGE_ACTIONS)[keyof typeof JUDGE_ACTIONS];

export interface JudgeAction {
  id: string;
  submissionId: string;
  judgeUserId: string;
  action: JudgeActionType;
  flagReason: string | null;
  createdAt: string;
  updatedAt: string;
}

// For judging interface - shows consensus among judges
export interface SubmissionJudgingStatus {
  submissionId: string;
  shortlistCount: number; // 0-3
  flagCount: number;
  passCount: number;
  actions: JudgeAction[];
}
