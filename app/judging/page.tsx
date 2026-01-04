"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Star,
  Check,
  Flag,
  ArrowRight,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  Users,
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/auth-context";
import { getCurrentMonth } from "@/lib/data/months";
import { getSubmissionsWithUserByMonth } from "@/lib/data/submissions";
import {
  getSubmissionJudgingStatus,
  hasJudgeActedOnSubmission,
} from "@/lib/data/judges";
import { isUserJudgeForMonth, getJudgesForMonth } from "@/lib/data/users";
import { CATEGORY_TYPES, FIXED_CATEGORIES } from "@/lib/constants";
import type { SubmissionWithUser, CategoryTypeId } from "@/types";

type FilterType = "all" | "pending" | "reviewed" | "shortlisted" | "flagged";

function getCategoryLabel(submission: SubmissionWithUser): string {
  if (submission.categoryType === "fixed") {
    const cat = FIXED_CATEGORIES.find((c) => c.id === submission.category);
    return cat ? cat.name : "Fixed";
  }
  return CATEGORY_TYPES[submission.categoryType]?.name || submission.categoryType;
}

export default function JudgingPage() {
  const { user, isAuthenticated } = useAuth();
  const [filter, setFilter] = useState<FilterType>("all");
  const [categoryFilter, setCategoryFilter] = useState<CategoryTypeId | "all">("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flagDialogOpen, setFlagDialogOpen] = useState(false);
  const [flagReason, setFlagReason] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "single">("grid");

  const currentMonth = getCurrentMonth();
  const isJudge = user && currentMonth
    ? isUserJudgeForMonth(user.id, currentMonth.monthYear)
    : false;
  const judges = currentMonth ? getJudgesForMonth(currentMonth.monthYear) : [];

  // Get all submissions for current month
  const allSubmissions = currentMonth
    ? getSubmissionsWithUserByMonth(currentMonth.monthYear)
    : [];

  // Get judging status for each submission
  const submissionsWithStatus = useMemo(() => {
    return allSubmissions.map((sub) => ({
      ...sub,
      judgingStatus: getSubmissionJudgingStatus(sub.id),
      hasActed: user ? hasJudgeActedOnSubmission(user.id, sub.id) : false,
    }));
  }, [allSubmissions, user]);

  // Apply filters
  const filteredSubmissions = useMemo(() => {
    return submissionsWithStatus.filter((sub) => {
      // Category filter
      if (categoryFilter !== "all" && sub.categoryType !== categoryFilter) {
        return false;
      }

      // Status filter
      switch (filter) {
        case "pending":
          return !sub.hasActed;
        case "reviewed":
          return sub.hasActed;
        case "shortlisted":
          return sub.judgingStatus.shortlistCount > 0;
        case "flagged":
          return sub.judgingStatus.flagCount > 0;
        default:
          return true;
      }
    });
  }, [submissionsWithStatus, filter, categoryFilter]);

  const currentSubmission = filteredSubmissions[currentIndex];

  const handleAction = (action: "shortlist" | "pass" | "flag") => {
    if (action === "flag") {
      setFlagDialogOpen(true);
      return;
    }
    // In real app, would save to database
    console.log(`Action: ${action} on submission ${currentSubmission?.id}`);
    // Move to next
    if (currentIndex < filteredSubmissions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleFlagSubmit = () => {
    console.log(`Flagged submission ${currentSubmission?.id}: ${flagReason}`);
    setFlagDialogOpen(false);
    setFlagReason("");
    if (currentIndex < filteredSubmissions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Not authenticated or not a judge
  if (!isAuthenticated || !user) {
    return (
      <div className="container py-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Sign in required</CardTitle>
              <CardDescription>
                You need to sign in to access the judging interface
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

  if (!isJudge && user.role !== "admin") {
    return (
      <div className="container py-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Access restricted</CardTitle>
              <CardDescription>
                Only assigned judges can access the judging interface for this month.
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

  if (!currentMonth) {
    return (
      <div className="container py-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>No active month</CardTitle>
              <CardDescription>
                There is no active month for judging right now.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  const pendingCount = submissionsWithStatus.filter((s) => !s.hasActed).length;
  const shortlistedCount = submissionsWithStatus.filter(
    (s) => s.judgingStatus.shortlistCount > 0
  ).length;

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Judging Interface</h1>
          <p className="text-muted-foreground">
            Review submissions for {currentMonth.rotatingCategory.name} ({currentMonth.monthYear})
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Judge avatars */}
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div className="flex -space-x-2">
              {judges.map((judge) => (
                <Avatar key={judge.id} className="h-8 w-8 border-2 border-background">
                  <AvatarImage src={judge.avatarUrl || undefined} />
                  <AvatarFallback className="text-xs">
                    {judge.displayName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
          </div>

          {/* View toggle */}
          <div className="flex border rounded-lg">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              Grid
            </Button>
            <Button
              variant={viewMode === "single" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("single")}
            >
              Focus
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{allSubmissions.length}</div>
            <p className="text-sm text-muted-foreground">Total submissions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-sm text-muted-foreground">Pending review</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{shortlistedCount}</div>
            <p className="text-sm text-muted-foreground">Shortlisted</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {allSubmissions.length - pendingCount}
            </div>
            <p className="text-sm text-muted-foreground">Reviewed</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterType)}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="reviewed">Reviewed</TabsTrigger>
            <TabsTrigger value="shortlisted">Shortlisted</TabsTrigger>
            <TabsTrigger value="flagged">Flagged</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Tabs
            value={categoryFilter}
            onValueChange={(v) => setCategoryFilter(v as CategoryTypeId | "all")}
          >
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="fixed">Fixed</TabsTrigger>
              <TabsTrigger value="rotating">Rotating</TabsTrigger>
              <TabsTrigger value="open">Open</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {filteredSubmissions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No submissions match your filters</p>
          </CardContent>
        </Card>
      ) : viewMode === "grid" ? (
        /* Grid View */
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredSubmissions.map((submission) => (
            <Card
              key={submission.id}
              className="overflow-hidden group cursor-pointer"
              onClick={() => {
                setCurrentIndex(filteredSubmissions.indexOf(submission));
                setViewMode("single");
              }}
            >
              <div className="relative aspect-[4/3] bg-muted">
                <Image
                  src={submission.thumbnailUrl}
                  alt=""
                  fill
                  className="object-cover"
                />
                {/* Status badges */}
                <div className="absolute top-2 left-2 flex gap-1">
                  {submission.judgingStatus.shortlistCount > 0 && (
                    <Badge className="bg-yellow-500">
                      <Star className="h-3 w-3 mr-1" />
                      {submission.judgingStatus.shortlistCount}
                    </Badge>
                  )}
                  {submission.judgingStatus.flagCount > 0 && (
                    <Badge variant="destructive">
                      <Flag className="h-3 w-3 mr-1" />
                      {submission.judgingStatus.flagCount}
                    </Badge>
                  )}
                </div>
                {submission.hasActed && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary">
                      <Check className="h-3 w-3 mr-1" />
                      Reviewed
                    </Badge>
                  </div>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Eye className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {getCategoryLabel(submission)}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {submission.user.displayName}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Single/Focus View */
        <div className="max-w-4xl mx-auto">
          {currentSubmission && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={currentSubmission.user.avatarUrl || undefined} />
                    <AvatarFallback>
                      {currentSubmission.user.displayName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{currentSubmission.user.displayName}</p>
                    <Badge variant="outline">{getCategoryLabel(currentSubmission)}</Badge>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {currentIndex + 1} of {filteredSubmissions.length}
                </div>
              </CardHeader>

              <CardContent>
                <div className="relative aspect-[3/2] bg-muted rounded-lg overflow-hidden mb-4">
                  <Image
                    src={currentSubmission.photoUrl}
                    alt=""
                    fill
                    className="object-contain"
                  />
                </div>

                {/* Metadata */}
                <div className="grid gap-2 text-sm mb-4">
                  {currentSubmission.metadata.camera && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Camera</span>
                      <span>{currentSubmission.metadata.camera}</span>
                    </div>
                  )}
                  {currentSubmission.metadata.filmStock && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Film</span>
                      <span>{currentSubmission.metadata.filmStock}</span>
                    </div>
                  )}
                  {currentSubmission.metadata.location && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location</span>
                      <span>{currentSubmission.metadata.location}</span>
                    </div>
                  )}
                </div>

                {/* Current voting status */}
                <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">
                      {currentSubmission.judgingStatus.shortlistCount} shortlist
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">
                      {currentSubmission.judgingStatus.passCount} pass
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Flag className="h-4 w-4 text-red-500" />
                    <span className="text-sm">
                      {currentSubmission.judgingStatus.flagCount} flag
                    </span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex justify-between">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                    disabled={currentIndex === 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setCurrentIndex(
                        Math.min(filteredSubmissions.length - 1, currentIndex + 1)
                      )
                    }
                    disabled={currentIndex === filteredSubmissions.length - 1}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleAction("pass")}
                    disabled={currentSubmission.hasActed}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Pass
                  </Button>
                  <Button
                    variant="outline"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleAction("flag")}
                    disabled={currentSubmission.hasActed}
                  >
                    <Flag className="mr-2 h-4 w-4" />
                    Flag
                  </Button>
                  <Button
                    onClick={() => handleAction("shortlist")}
                    disabled={currentSubmission.hasActed}
                  >
                    <Star className="mr-2 h-4 w-4" />
                    Shortlist
                  </Button>
                </div>
              </CardFooter>
            </Card>
          )}
        </div>
      )}

      {/* Flag Dialog */}
      <Dialog open={flagDialogOpen} onOpenChange={setFlagDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Flag submission</DialogTitle>
            <DialogDescription>
              Please provide a reason for flagging this submission.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="flagReason">Reason</Label>
              <Textarea
                id="flagReason"
                placeholder="e.g., Not film photography, inappropriate content, copyright concern..."
                value={flagReason}
                onChange={(e) => setFlagReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFlagDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleFlagSubmit}
              disabled={!flagReason.trim()}
            >
              Flag submission
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
