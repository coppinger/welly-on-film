import Link from "next/link";
import { Camera, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE_CONFIG } from "@/lib/constants";
import { getCurrentMonth, getMonthWithStats } from "@/lib/data/months";
import { getSubmissionCards } from "@/lib/data/submissions";
import { PhotoGrid } from "@/components/gallery";
import { CurrentMonthCard } from "@/components/home";

export default function Home() {
  // Get current month data
  const currentMonth = getCurrentMonth();
  const monthStats = currentMonth ? getMonthWithStats(currentMonth.monthYear) : null;

  // Get recent submissions for the gallery preview
  const submissions = currentMonth
    ? getSubmissionCards(currentMonth.monthYear).slice(0, 8)
    : [];

  return (
    <div className="container py-12 md:py-24">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center gap-8 mb-16">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Camera className="h-8 w-8" />
          <span className="text-sm font-medium uppercase tracking-wider">
            {SITE_CONFIG.location}
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl">
          {SITE_CONFIG.name}
        </h1>

        <p className="text-xl text-muted-foreground max-w-2xl">
          {SITE_CONFIG.tagline}. A community platform for local film
          photographers to share their work, connect, and grow.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg">
            <Link href="/submit">
              Submit Your Photo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/about">How It Works</Link>
          </Button>
        </div>
      </section>

      {/* Current Month Card */}
      {currentMonth && (
        <section className="max-w-2xl mx-auto mb-16">
          <CurrentMonthCard
            month={currentMonth}
            submissionCount={monthStats?.submissionCount}
          />
        </section>
      )}

      {/* Recent Submissions Gallery */}
      <section className="mt-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Recent Submissions</h2>
          <Button asChild variant="ghost" size="sm">
            <Link href="/this-month/submissions">
              View All
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {submissions.length > 0 ? (
          <PhotoGrid submissions={submissions} priorityCount={4} />
        ) : (
          <div className="text-center py-12 border rounded-lg bg-muted/30">
            <p className="text-muted-foreground mb-4">
              No submissions yet this month. Be the first!
            </p>
            <Button asChild>
              <Link href="/submit">Submit a Photo</Link>
            </Button>
          </div>
        )}
      </section>

      {/* Archive Preview */}
      <section className="mt-16 pt-16 border-t">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Explore the Archive</h2>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Browse through months of stunning film photography from the Wellington community.
          </p>
          <Button asChild variant="outline">
            <Link href="/archive">View Archive</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
