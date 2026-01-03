import usersData from "@/data/users.json";
import type { User, UserProfile, UserSummary, JudgeAssignment, RaffleWinner } from "@/types";

const { users, judgeAssignments, raffleWinners } = usersData;

export function getUsers(): User[] {
  return users.filter((u) => !u.deletedAt) as User[];
}

export function getUserById(id: string): User | null {
  const user = users.find((u) => u.id === id && !u.deletedAt);
  return user ? (user as User) : null;
}

export function getUserSummary(id: string): UserSummary | null {
  const user = getUserById(id);
  if (!user) return null;
  return {
    id: user.id,
    displayName: user.displayName,
    avatarUrl: user.avatarUrl,
  };
}

export function getUserProfile(id: string): UserProfile | null {
  const user = getUserById(id);
  if (!user) return null;

  // In real app, these would be calculated from submissions
  return {
    ...user,
    submissionCount: 0, // TODO: Calculate from submissions
    featuredCount: 0,   // TODO: Calculate from submissions
  };
}

export function getJudgesForMonth(monthYear: string): User[] {
  const judgeUserIds = judgeAssignments
    .filter((ja) => ja.monthYear === monthYear)
    .map((ja) => ja.userId);

  return users
    .filter((u) => judgeUserIds.includes(u.id) && !u.deletedAt) as User[];
}

export function isUserJudgeForMonth(userId: string, monthYear: string): boolean {
  return judgeAssignments.some(
    (ja) => ja.userId === userId && ja.monthYear === monthYear
  );
}

export function getJudgeAssignments(): JudgeAssignment[] {
  return judgeAssignments as JudgeAssignment[];
}

export function getRaffleWinners(): RaffleWinner[] {
  return raffleWinners as RaffleWinner[];
}

export function getRaffleWinnerForMonth(monthYear: string): RaffleWinner | null {
  const winner = raffleWinners.find((rw) => rw.monthYear === monthYear);
  return winner ? (winner as RaffleWinner) : null;
}
