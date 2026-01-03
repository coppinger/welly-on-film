import Link from "next/link";
import { ArrowRight, Calendar, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CountdownDisplay } from "./countdown-display";
import { formatMonthYear } from "@/lib/data/months";
import type { Month } from "@/types";
import { FIXED_CATEGORIES, CATEGORY_TYPES } from "@/lib/constants";

interface CurrentMonthCardProps {
  month: Month;
  submissionCount?: number;
}

export function CurrentMonthCard({ month, submissionCount = 0 }: CurrentMonthCardProps) {
  const isJudging = month.status === "judging";
  const isClosed = month.status === "closed";

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <CardDescription>{formatMonthYear(month.monthYear)}</CardDescription>
          </div>
          {month.status === "open" && (
            <Badge variant="default" className="gap-1">
              <Sparkles className="h-3 w-3" />
              Open for submissions
            </Badge>
          )}
          {isJudging && (
            <Badge variant="secondary">Judging in progress</Badge>
          )}
        </div>
        <CardTitle className="text-2xl">This Month&apos;s Brief</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Rotating category highlight */}
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">
            {CATEGORY_TYPES.rotating.name} Theme
          </p>
          <p className="text-xl font-semibold">{month.rotatingCategory.name}</p>
          <p className="text-muted-foreground mt-1">
            {month.rotatingCategory.description}
          </p>
        </div>

        {/* Categories summary */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Categories this month:</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{CATEGORY_TYPES.fixed.name}</Badge>
            <Badge variant="outline">{month.rotatingCategory.name}</Badge>
            <Badge variant="outline">{CATEGORY_TYPES.open.name}</Badge>
          </div>
        </div>

        {/* Countdown or status */}
        {month.status === "open" && (
          <div className="border-t pt-6">
            <p className="text-sm text-muted-foreground text-center mb-4">
              Submissions close on
            </p>
            <CountdownDisplay targetDate={month.submissionsClose} />
          </div>
        )}

        {isJudging && (
          <div className="border-t pt-6 text-center">
            <p className="text-muted-foreground">
              Judging is in progress. Featured photos will be announced soon!
            </p>
          </div>
        )}

        {/* Stats */}
        {submissionCount > 0 && (
          <div className="text-center text-sm text-muted-foreground">
            {submissionCount} submission{submissionCount === 1 ? "" : "s"} so far
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild className="flex-1">
            <Link href="/this-month/brief">
              View Full Brief
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          {month.status === "open" && (
            <Button asChild variant="outline" className="flex-1">
              <Link href="/submit">Submit Photo</Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
