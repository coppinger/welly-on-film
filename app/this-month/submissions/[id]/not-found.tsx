import Link from "next/link";
import { ImageOff, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SubmissionNotFound() {
  return (
    <div className="container py-16">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <ImageOff className="h-6 w-6 text-muted-foreground" />
            </div>
            <CardTitle>Photo not found</CardTitle>
            <CardDescription>
              This submission may have been removed or doesn&apos;t exist.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground">
              If you followed a link here, it may be outdated.
            </p>
          </CardContent>
          <CardFooter className="justify-center">
            <Button asChild>
              <Link href="/this-month/submissions">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to submissions
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
