import submissionsData from "@/data/submissions.json";
import monthsData from "@/data/months.json";

const { submissions } = submissionsData;
const { months } = monthsData;

export interface CommunityStats {
  totalSubmissions: number;
  uniquePhotographers: number;
  monthsPublished: number;
  featuredPhotos: number;
}

export function getCommunityStats(): CommunityStats {
  // Filter valid submissions (not removed or deleted)
  const validSubmissions = submissions.filter(
    (s) => !s.isRemoved && !s.deletedAt
  );

  // Count unique photographers
  const uniqueUserIds = new Set(validSubmissions.map((s) => s.userId));

  // Count closed months (published issues)
  const closedMonths = months.filter((m) => m.status === "closed");

  // Count featured photos
  const featuredPhotos = validSubmissions.filter((s) => s.isFeatured);

  return {
    totalSubmissions: validSubmissions.length,
    uniquePhotographers: uniqueUserIds.size,
    monthsPublished: closedMonths.length,
    featuredPhotos: featuredPhotos.length,
  };
}
