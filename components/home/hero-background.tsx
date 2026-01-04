import Image from "next/image";
import { getArchivedMonths } from "@/lib/data/months";
import { getFeaturedSubmissions } from "@/lib/data/submissions";

export function HeroBackground() {
  // Get a featured image from the most recent closed month
  const archivedMonths = getArchivedMonths();

  // Find a featured submission to use as background
  let backgroundImage: string | null = null;

  for (const month of archivedMonths) {
    const featured = getFeaturedSubmissions(month.monthYear);
    if (featured.length > 0) {
      // Pick a random featured image
      const randomIndex = Math.floor(Math.random() * featured.length);
      backgroundImage = featured[randomIndex].photoUrl;
      break;
    }
  }

  // Fallback to cover image from archived month if no featured submissions
  if (!backgroundImage && archivedMonths.length > 0) {
    backgroundImage = archivedMonths[0].coverImageUrl;
  }

  if (!backgroundImage) {
    return null;
  }

  return (
    <div className="absolute inset-0 -z-10">
      <Image
        src={backgroundImage}
        alt=""
        fill
        className="object-cover"
        sizes="100vw"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/30" />
    </div>
  );
}
