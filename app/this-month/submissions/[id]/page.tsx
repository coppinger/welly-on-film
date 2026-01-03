import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  ArrowLeft,
  Camera,
  Film,
  MapPin,
  Calendar,
  Star,
  Flag,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PhotoGrid } from "@/components/gallery";
import { getSubmissionDetail, getOtherSubmissionsByUser } from "@/lib/data/submissions";
import { getCommentsBySubmission } from "@/lib/data/comments";
import { formatMonthYear } from "@/lib/data/months";
import { CATEGORY_TYPES, FIXED_CATEGORIES } from "@/lib/constants";
import type { CategoryTypeId } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

function getCategoryLabel(categoryType: CategoryTypeId, category: string | null): string {
  if (categoryType === "fixed" && category) {
    const fixedCat = FIXED_CATEGORIES.find((c) => c.id === category);
    return fixedCat ? `${CATEGORY_TYPES.fixed.name}: ${fixedCat.name}` : CATEGORY_TYPES.fixed.name;
  }
  return CATEGORY_TYPES[categoryType]?.name || categoryType;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-NZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const submission = getSubmissionDetail(id);

  if (!submission) {
    return { title: "Photo Not Found" };
  }

  return {
    title: `Photo by ${submission.user.displayName}`,
    description: submission.metadata.description || `A film photograph submitted to Welly on Film`,
  };
}

export default async function PhotoDetailPage({ params }: PageProps) {
  const { id } = await params;
  const submission = getSubmissionDetail(id);

  if (!submission) {
    notFound();
  }

  const comments = getCommentsBySubmission(id);
  const otherByUser = getOtherSubmissionsByUser(submission.userId, id, 4);

  return (
    <div className="container py-8">
      {/* Back navigation */}
      <Button asChild variant="ghost" size="sm" className="mb-6">
        <Link href="/this-month/submissions">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Gallery
        </Link>
      </Button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Image */}
        <div className="lg:col-span-2">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-muted">
            <Image
              src={submission.photoUrl}
              alt={`Photo by ${submission.user.displayName}`}
              fill
              className="object-contain"
              priority
              sizes="(max-width: 1024px) 100vw, 66vw"
            />
          </div>

          {/* Featured badge */}
          {submission.isFeatured && (
            <div className="mt-4">
              <Badge className="gap-1 bg-yellow-500 text-yellow-950">
                <Star className="h-3 w-3 fill-current" />
                Featured in Print Magazine
              </Badge>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Photographer */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={submission.user.avatarUrl || undefined} />
                  <AvatarFallback>
                    {getInitials(submission.user.displayName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{submission.user.displayName}</p>
                  <p className="text-sm text-muted-foreground">Photographer</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category & Date */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {getCategoryLabel(submission.categoryType, submission.category)}
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{formatMonthYear(submission.monthYear)}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Submitted {formatDate(submission.createdAt)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Technical Details */}
          {(submission.metadata.camera ||
            submission.metadata.filmStock ||
            submission.metadata.location) && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {submission.metadata.camera && (
                  <div className="flex items-center gap-2 text-sm">
                    <Camera className="h-4 w-4 text-muted-foreground" />
                    <span>{submission.metadata.camera}</span>
                  </div>
                )}
                {submission.metadata.filmStock && (
                  <div className="flex items-center gap-2 text-sm">
                    <Film className="h-4 w-4 text-muted-foreground" />
                    <span>{submission.metadata.filmStock}</span>
                  </div>
                )}
                {submission.metadata.location && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{submission.metadata.location}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Description */}
          {submission.metadata.description && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">About this photo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {submission.metadata.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Tags */}
          {submission.metadata.tags && submission.metadata.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {submission.metadata.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Report button */}
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <Flag className="mr-2 h-4 w-4" />
            Report
          </Button>
        </div>
      </div>

      {/* Comments Section */}
      <section className="mt-12">
        <Separator className="mb-8" />

        <div className="max-w-2xl">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Comments ({comments.length})
          </h2>

          {comments.length > 0 ? (
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.user.avatarUrl || undefined} />
                    <AvatarFallback className="text-xs">
                      {getInitials(comment.user.displayName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-medium text-sm">
                        {comment.user.displayName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm mt-1">{comment.body}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No comments yet.</p>
          )}

          {/* Add comment prompt */}
          <div className="mt-8 p-4 bg-muted/50 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">
              Sign in to leave a comment
            </p>
            <Button asChild variant="outline" size="sm" className="mt-2">
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* More from this photographer */}
      {otherByUser.length > 0 && (
        <section className="mt-12">
          <Separator className="mb-8" />

          <h2 className="text-xl font-semibold mb-6">
            More from {submission.user.displayName}
          </h2>

          <PhotoGrid
            submissions={otherByUser}
            showUser={false}
            className="md:grid-cols-4"
          />
        </section>
      )}
    </div>
  );
}
