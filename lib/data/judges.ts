import judgeActionsData from "@/data/judge-actions.json";
import type { JudgeAction, SubmissionJudgingStatus } from "@/types";

const { judgeActions } = judgeActionsData;

export function getJudgeActions(): JudgeAction[] {
  return judgeActions as JudgeAction[];
}

export function getJudgeActionsBySubmission(submissionId: string): JudgeAction[] {
  return judgeActions.filter(
    (ja) => ja.submissionId === submissionId
  ) as JudgeAction[];
}

export function getJudgeActionsByJudge(judgeUserId: string): JudgeAction[] {
  return judgeActions.filter(
    (ja) => ja.judgeUserId === judgeUserId
  ) as JudgeAction[];
}

export function getSubmissionJudgingStatus(
  submissionId: string
): SubmissionJudgingStatus {
  const actions = getJudgeActionsBySubmission(submissionId);

  return {
    submissionId,
    shortlistCount: actions.filter((a) => a.action === "shortlist").length,
    flagCount: actions.filter((a) => a.action === "flag").length,
    passCount: actions.filter((a) => a.action === "pass").length,
    actions,
  };
}

export function getShortlistedSubmissionIds(minJudges: number = 1): string[] {
  // Group actions by submission
  const submissionActions = new Map<string, JudgeAction[]>();

  for (const action of judgeActions) {
    const existing = submissionActions.get(action.submissionId) || [];
    submissionActions.set(action.submissionId, [...existing, action as JudgeAction]);
  }

  // Find submissions with enough shortlist votes
  const shortlisted: string[] = [];

  submissionActions.forEach((actions, submissionId) => {
    const shortlistCount = actions.filter((a) => a.action === "shortlist").length;
    if (shortlistCount >= minJudges) {
      shortlisted.push(submissionId);
    }
  });

  return shortlisted;
}

export function getFlaggedSubmissionIds(): string[] {
  return [...new Set(
    judgeActions
      .filter((ja) => ja.action === "flag")
      .map((ja) => ja.submissionId)
  )];
}

export function hasJudgeActedOnSubmission(
  judgeUserId: string,
  submissionId: string
): boolean {
  return judgeActions.some(
    (ja) => ja.judgeUserId === judgeUserId && ja.submissionId === submissionId
  );
}
