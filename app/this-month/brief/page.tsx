import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Calendar, Camera, Sparkles, Clock, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CountdownDisplay } from "@/components/home";
import { getCurrentMonth, formatMonthYear } from "@/lib/data/months";
import { getSubmissionsByMonth } from "@/lib/data/submissions";
import { FIXED_CATEGORIES, CATEGORY_TYPES, FEATURED_COUNT, SUBMISSION_LIMITS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "This Month's Brief",
  description: "View the current month's photography categories and submission guidelines.",
};

export default function BriefPage() {
  const currentMonth = getCurrentMonth();

  if (!currentMonth) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">No Active Month</h1>
        <p className="text-muted-foreground mb-6">
          There&apos;s no active submission period right now. Check back soon!
        </p>
        <Button asChild>
          <Link href="/archive">Browse Archive</Link>
        </Button>
      </div>
    );
  }

  const submissions = getSubmissionsByMonth(currentMonth.monthYear);
  const isJudging = currentMonth.status === "judging";
  const isOpen = currentMonth.status === "open";

  return (
    <div className="container py-12">
      {/* Header */}
      <div className="max-w-3xl mx-auto mb-12">
        <div className="flex items-center gap-2 text-muted-foreground mb-4">
          <Calendar className="h-5 w-5" />
          <span>{formatMonthYear(currentMonth.monthYear)}</span>
        </div>

        <h1 className="text-4xl font-bold mb-4">This Month&apos;s Brief</h1>

        <p className="text-lg text-muted-foreground">
          Submit your best analogue film photos across three category sets.
          Judges will select 15 photos for the print magazine.
        </p>
      </div>

      {/* Status Banner */}
      {isJudging && (
        <div className="max-w-3xl mx-auto mb-8">
          <Card className="border-yellow-500/50 bg-yellow-500/10">
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="font-medium">Judging in Progress</p>
                  <p className="text-sm text-muted-foreground">
                    Submissions are closed. Featured photos will be announced soon!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Countdown */}
      {isOpen && (
        <div className="max-w-3xl mx-auto mb-12 text-center">
          <p className="text-sm text-muted-foreground mb-4">Submissions close</p>
          <CountdownDisplay targetDate={currentMonth.submissionsClose} />
        </div>
      )}

      {/* Categories Grid */}
      <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-3 mb-12">
        {/* Fixed Category */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge variant="outline">{FEATURED_COUNT.fixed} photos selected</Badge>
            </div>
            <CardTitle className="text-xl">{CATEGORY_TYPES.fixed.name}</CardTitle>
            <CardDescription>{CATEGORY_TYPES.fixed.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">Sub-categories:</p>
            <div className="flex flex-wrap gap-2">
              {FIXED_CATEGORIES.map((cat) => (
                <Badge key={cat.id} variant="secondary">
                  {cat.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Rotating Category */}
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge>{FEATURED_COUNT.rotating} photos selected</Badge>
            </div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              {currentMonth.rotatingCategory.name}
            </CardTitle>
            <CardDescription>This month&apos;s rotating theme</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {currentMonth.rotatingCategory.description}
            </p>
          </CardContent>
        </Card>

        {/* Open Category */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge variant="outline">{FEATURED_COUNT.open} photos selected</Badge>
            </div>
            <CardTitle className="text-xl">{CATEGORY_TYPES.open.name}</CardTitle>
            <CardDescription>{CATEGORY_TYPES.open.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              For shots that don&apos;t fit elsewhere but deserve to be seen.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Submission Guidelines */}
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Submission Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="font-medium mb-1">Maximum Submissions</p>
                <p className="text-sm text-muted-foreground">
                  {SUBMISSION_LIMITS.maxPerMonth} photos per person, per month
                </p>
              </div>
              <div>
                <p className="font-medium mb-1">Film Only</p>
                <p className="text-sm text-muted-foreground">
                  All photos must be shot on analogue film (honour system)
                </p>
              </div>
              <div>
                <p className="font-medium mb-1">Image Requirements</p>
                <p className="text-sm text-muted-foreground">
                  Min {SUBMISSION_LIMITS.minImageDimension}px, max {SUBMISSION_LIMITS.maxFileSizeMB}MB
                </p>
              </div>
              <div>
                <p className="font-medium mb-1">Accepted Formats</p>
                <p className="text-sm text-muted-foreground">
                  JPEG, PNG, TIFF
                </p>
              </div>
            </div>

            <Separator />

            <div>
              <p className="font-medium mb-2">Optional Metadata</p>
              <p className="text-sm text-muted-foreground">
                You can add camera, film stock, location, and a short description
                to your submissions. This helps build the community and lets
                others learn from your choices.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CTA */}
      <div className="max-w-3xl mx-auto mt-12 text-center">
        {isOpen ? (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              {submissions.length} submission{submissions.length === 1 ? "" : "s"} so far this month
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/submit">
                  Submit Your Photo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/this-month/submissions">View Submissions</Link>
              </Button>
            </div>
          </div>
        ) : (
          <Button asChild variant="outline" size="lg">
            <Link href="/this-month/submissions">View Submissions</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
