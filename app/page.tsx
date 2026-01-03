import Link from "next/link";
import { Camera, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE_CONFIG } from "@/lib/constants";

export default function Home() {
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

      {/* Placeholder for current month info */}
      <section className="border rounded-lg p-8 text-center bg-muted/30">
        <h2 className="text-2xl font-semibold mb-4">This Month: January 2025</h2>
        <p className="text-muted-foreground mb-4">
          Rotating theme: <strong>Rain</strong> — Capture Wellington&apos;s famous
          weather
        </p>
        <p className="text-sm text-muted-foreground">
          Submissions close January 25th
        </p>
        <Button asChild className="mt-6">
          <Link href="/this-month/brief">View The Brief</Link>
        </Button>
      </section>

      {/* Placeholder for gallery preview */}
      <section className="mt-16">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Recent Submissions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Placeholder cards */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-muted rounded-lg animate-pulse"
            />
          ))}
        </div>
        <div className="text-center mt-8">
          <Button asChild variant="outline">
            <Link href="/this-month/submissions">View All Submissions</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
