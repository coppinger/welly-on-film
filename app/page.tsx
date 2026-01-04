import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Camera, ArrowRight, Calendar, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SITE_CONFIG } from "@/lib/constants";
import { getCurrentMonth, getMonthWithStats, getArchivedMonths } from "@/lib/data/months";
import { getSubmissionCards } from "@/lib/data/submissions";
import { PhotoGrid } from "@/components/gallery";
import { CurrentMonthCard, HeroBackground, HowItWorksPreview, CommunityStats } from "@/components/home";

export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} - ${SITE_CONFIG.description}`,
  description: `${SITE_CONFIG.tagline}. A community platform for local film photographers to share their work, connect, and grow.`,
  openGraph: {
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    type: "website",
    locale: "en_NZ",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
  },
};

export default function Home() {
  // Get current month data
  const currentMonth = getCurrentMonth();
  const monthStats = currentMonth ? getMonthWithStats(currentMonth.monthYear) : null;

  // Get recent submissions for the gallery preview
  const submissions = currentMonth
    ? getSubmissionCards(currentMonth.monthYear).slice(0, 8)
    : [];

  // Get recent archived months for the archive preview
  const archivedMonths = getArchivedMonths().slice(0, 4);

  return (
    <div className="container py-12 md:py-24">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center text-center gap-8 mb-16 -mx-4 md:-mx-6 lg:-mx-8 px-4 md:px-6 lg:px-8 py-16 md:py-24">
        <HeroBackground />
        <div className="flex items-center gap-3 text-white/80">
          <Camera className="h-8 w-8" />
          <span className="text-sm font-medium uppercase tracking-wider">
            {SITE_CONFIG.location}
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl text-white drop-shadow-lg">
          {SITE_CONFIG.name}
        </h1>

        <p className="text-xl text-white/90 max-w-2xl drop-shadow-md">
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
          <Button asChild variant="outline" size="lg" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
            <Link href="/about">How It Works</Link>
          </Button>
        </div>
      </section>

      {/* How It Works Preview */}
      <HowItWorksPreview />

      {/* Current Month Card */}
      {currentMonth && (
        <section className="max-w-2xl mx-auto mb-16 mt-12">
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

      {/* Community Stats */}
      <CommunityStats />

      {/* Archive Preview */}
      <section className="mt-16 pt-16 border-t">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Explore the Archive</h2>
          <Button asChild variant="ghost" size="sm">
            <Link href="/archive">
              View All
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <p className="text-muted-foreground mb-8">
          Browse through months of stunning film photography from the Wellington community.
        </p>

        {archivedMonths.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {archivedMonths.map((month) => (
              <Link key={month.id} href={`/archive/${month.monthYear}`}>
                <Card className="overflow-hidden h-full hover:border-foreground/20 transition-colors">
                  <div className="relative aspect-[4/3] bg-muted">
                    {month.coverImageUrl ? (
                      <Image
                        src={month.coverImageUrl}
                        alt={month.displayName}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
                      </div>
                    )}
                  </div>
                  <CardHeader className="p-3 pb-2">
                    <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                      <Calendar className="h-3 w-3" />
                      <span className="text-xs">{month.displayName}</span>
                    </div>
                    <CardTitle className="text-sm">{month.rotatingCategoryName}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <Badge variant="secondary" className="text-xs">
                      {month.submissionCount} photos
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No archived months yet. Check back after the first month concludes!
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
