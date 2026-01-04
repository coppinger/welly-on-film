import Link from "next/link";
import { Camera, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="container py-16">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <Camera className="h-6 w-6 text-muted-foreground" />
            </div>
            <CardTitle className="text-4xl font-bold">404</CardTitle>
            <CardDescription className="text-lg">
              Page not found
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
          </CardContent>
          <CardFooter className="flex gap-4 justify-center">
            <Button variant="outline" asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go back
              </Link>
            </Button>
            <Button asChild>
              <Link href="/this-month/submissions">
                <Search className="mr-2 h-4 w-4" />
                Browse photos
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
