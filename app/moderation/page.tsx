"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Flag,
  Check,
  X,
  ArrowRight,
  AlertTriangle,
  Eye,
  Clock,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/context/auth-context";
import { getCurrentMonth } from "@/lib/data/months";
import { getSubmissionsWithUserByMonth } from "@/lib/data/submissions";
import { getSubmissionJudgingStatus, getFlaggedSubmissionIds } from "@/lib/data/judges";
import { CATEGORY_TYPES, FIXED_CATEGORIES } from "@/lib/constants";
import type { SubmissionWithUser } from "@/types";

type FilterType = "flagged" | "all" | "removed";

function getCategoryLabel(submission: SubmissionWithUser): string {
  if (submission.categoryType === "fixed") {
    const cat = FIXED_CATEGORIES.find((c) => c.id === submission.category);
    return cat ? cat.name : "Fixed";
  }
  return CATEGORY_TYPES[submission.categoryType]?.name || submission.categoryType;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-NZ", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ModerationPage() {
  const { user, isAuthenticated } = useAuth();
  const [filter, setFilter] = useState<FilterType>("flagged");
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionWithUser | null>(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "remove">("approve");

  const currentMonth = getCurrentMonth();
  const isAdmin = user?.role === "admin";

  // Get all submissions
  const allSubmissions = currentMonth
    ? getSubmissionsWithUserByMonth(currentMonth.monthYear)
    : [];

  // Get flagged submission IDs
  const flaggedIds = getFlaggedSubmissionIds();

  // Add judging status to submissions
  const submissionsWithStatus = useMemo(() => {
    return allSubmissions.map((sub) => ({
      ...sub,
      judgingStatus: getSubmissionJudgingStatus(sub.id),
      isFlagged: flaggedIds.includes(sub.id),
    }));
  }, [allSubmissions, flaggedIds]);

  // Apply filters
  const filteredSubmissions = useMemo(() => {
    switch (filter) {
      case "flagged":
        return submissionsWithStatus.filter((s) => s.isFlagged && !s.isRemoved);
      case "removed":
        return submissionsWithStatus.filter((s) => s.isRemoved);
      default:
        return submissionsWithStatus;
    }
  }, [submissionsWithStatus, filter]);

  const handleAction = (submission: SubmissionWithUser, action: "approve" | "remove") => {
    setSelectedSubmission(submission);
    setActionType(action);
    setActionDialogOpen(true);
  };

  const confirmAction = () => {
    // In real app, would save to database
    console.log(`${actionType} submission ${selectedSubmission?.id}`);
    setActionDialogOpen(false);
    setSelectedSubmission(null);
  };

  // Not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="container py-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Sign in required</CardTitle>
              <CardDescription>
                You need to sign in to access the moderation queue
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/sign-in">
                  Sign in
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  // Not admin
  if (!isAdmin) {
    return (
      <div className="container py-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <Shield className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <CardTitle>Admin access required</CardTitle>
              <CardDescription>
                Only administrators can access the moderation queue.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href="/">Return home</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  const flaggedCount = submissionsWithStatus.filter((s) => s.isFlagged && !s.isRemoved).length;

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Moderation Queue</h1>
          <p className="text-muted-foreground">
            Review flagged and reported submissions
          </p>
        </div>

        <Badge variant={flaggedCount > 0 ? "destructive" : "secondary"} className="text-lg px-4 py-2">
          <Flag className="h-4 w-4 mr-2" />
          {flaggedCount} pending
        </Badge>
      </div>

      {/* Alert for pending items */}
      {flaggedCount > 0 && (
        <Alert className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Action required</AlertTitle>
          <AlertDescription>
            There are {flaggedCount} flagged submissions awaiting review. Flagged items
            may contain inappropriate content or policy violations.
          </AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterType)} className="mb-6">
        <TabsList>
          <TabsTrigger value="flagged">
            Flagged ({submissionsWithStatus.filter((s) => s.isFlagged && !s.isRemoved).length})
          </TabsTrigger>
          <TabsTrigger value="all">
            All ({allSubmissions.length})
          </TabsTrigger>
          <TabsTrigger value="removed">
            Removed ({submissionsWithStatus.filter((s) => s.isRemoved).length})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Submissions list */}
      {filteredSubmissions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Check className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <h3 className="font-semibold mb-2">All clear!</h3>
            <p className="text-muted-foreground">
              {filter === "flagged"
                ? "No flagged submissions to review"
                : filter === "removed"
                ? "No removed submissions"
                : "No submissions found"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredSubmissions.map((submission) => (
            <Card key={submission.id} className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {/* Image */}
                <div className="relative w-full md:w-64 aspect-[4/3] md:aspect-square bg-muted flex-shrink-0">
                  <Image
                    src={submission.thumbnailUrl}
                    alt=""
                    fill
                    className="object-cover"
                  />
                  {submission.isRemoved && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                      <Badge variant="destructive">Removed</Badge>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={submission.user.avatarUrl || undefined} />
                        <AvatarFallback>
                          {submission.user.displayName.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{submission.user.displayName}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatDate(submission.createdAt)}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline">{getCategoryLabel(submission)}</Badge>
                  </div>

                  {/* Metadata */}
                  {(submission.metadata.camera || submission.metadata.filmStock) && (
                    <p className="text-sm text-muted-foreground mb-3">
                      {[submission.metadata.camera, submission.metadata.filmStock]
                        .filter(Boolean)
                        .join(" • ")}
                    </p>
                  )}

                  {/* Flag info */}
                  {submission.isFlagged && (
                    <div className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-950 rounded mb-3">
                      <Flag className="h-4 w-4 text-red-500" />
                      <span className="text-sm">
                        Flagged by {submission.judgingStatus.flagCount} judge(s)
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  {!submission.isRemoved && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <Link href={`/this-month/submissions/${submission.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAction(submission, "approve")}
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleAction(submission, "remove")}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Action confirmation dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve" ? "Approve submission" : "Remove submission"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "approve"
                ? "This will clear all flags and keep the submission visible."
                : "This will hide the submission from all public views. The user will be notified."}
            </DialogDescription>
          </DialogHeader>

          {selectedSubmission && (
            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <div className="relative w-20 h-20 rounded overflow-hidden">
                <Image
                  src={selectedSubmission.thumbnailUrl}
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-medium">{selectedSubmission.user.displayName}</p>
                <p className="text-sm text-muted-foreground">
                  {getCategoryLabel(selectedSubmission)}
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={actionType === "remove" ? "destructive" : "default"}
              onClick={confirmAction}
            >
              {actionType === "approve" ? "Approve" : "Remove"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
