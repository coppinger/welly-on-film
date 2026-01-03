import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Calendar, ArrowRight, ImageIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getArchivedMonths } from "@/lib/data/months";

export const metadata: Metadata = {
  title: "Archive",
  description: "Browse past months of film photography from the Wellington community.",
};

export default function ArchivePage() {
  const archivedMonths = getArchivedMonths();

  return (
    <div className="container py-12">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Archive</h1>
        <p className="text-lg text-muted-foreground">
          Browse through months of stunning film photography from the Wellington
          community. Each month features 15 curated images selected by our
          rotating judges.
        </p>
      </div>

      {/* Archive Grid */}
      {archivedMonths.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {archivedMonths.map((month) => (
            <Link key={month.id} href={`/archive/${month.monthYear}`}>
              <Card className="overflow-hidden h-full hover:border-foreground/20 transition-colors">
                {/* Cover Image */}
                <div className="relative aspect-[4/3] bg-muted">
                  {month.coverImageUrl ? (
                    <Image
                      src={month.coverImageUrl}
                      alt={month.displayName}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
                    </div>
                  )}
                </div>

                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">{month.displayName}</span>
                  </div>
                  <CardTitle className="text-lg">
                    {month.rotatingCategoryName}
                  </CardTitle>
                  <CardDescription>Rotating theme</CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Badge variant="secondary">
                        {month.featuredCount} featured
                      </Badge>
                      <Badge variant="outline">
                        {month.submissionCount} total
                      </Badge>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            No archived months yet. Check back after the first month concludes!
          </p>
        </div>
      )}
    </div>
  );
}
