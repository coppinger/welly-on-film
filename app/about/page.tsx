import Link from "next/link";
import type { Metadata } from "next";
import { Camera, Users, BookOpen, Gift, ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SITE_CONFIG, SUBMISSION_LIMITS, MONTHLY_SCHEDULE, FEATURED_COUNT } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about Welly on Film - Wellington's analogue film photography community.",
};

export default function AboutPage() {
  return (
    <div className="container py-12">
      {/* Hero */}
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">About {SITE_CONFIG.name}</h1>
        <p className="text-xl text-muted-foreground">
          {SITE_CONFIG.tagline}. Each month, local photographers submit film
          photos across themed categories. Three rotating community judges
          curate {FEATURED_COUNT.total} images for a small-batch print magazine.
        </p>
      </div>

      {/* Vision */}
      <section className="max-w-3xl mx-auto mb-16">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Our Vision
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-neutral dark:prose-invert">
            <p>
              This isn&apos;t just a magazine. It&apos;s fertile soil for community to
              grow from — photo walks, print swaps, camera lending, darkroom
              sessions, guest talks. The magazine is the seed; the community is
              what blooms.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Principles */}
      <section className="max-w-5xl mx-auto mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">Our Principles</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Participation over Perfection</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Prizes are raffled among participants, not awarded to
                &ldquo;winners.&rdquo; Everyone who submits has an equal chance to win.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Local-First</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Photographers, judges, sponsors, and prize partners are all
                Wellington-based. This is our community.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Slow and Intentional</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                A counterpoint to infinite scroll; a garden, not a feed. We
                celebrate the slow process of film photography.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Open Source</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Everything built here should be forkable for other communities.
                Take it and make it your own.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-3xl mx-auto mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>

        <div className="space-y-8">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h3 className="font-semibold mb-1">Submit Your Photos</h3>
              <p className="text-muted-foreground">
                Each month, submit up to {SUBMISSION_LIMITS.maxPerMonth} photos
                shot on analogue film. Choose from three category sets: Fixed,
                Rotating (the monthly theme), or Open.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h3 className="font-semibold mb-1">Community Judging</h3>
              <p className="text-muted-foreground">
                Three rotating community judges review all submissions and
                shortlist their favorites. They meet in person to select the
                final {FEATURED_COUNT.total} for the magazine.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <h3 className="font-semibold mb-1">Print Magazine</h3>
              <p className="text-muted-foreground">
                Featured photos are printed in a small-batch magazine,
                distributed locally. All submissions remain in the digital
                archive.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              4
            </div>
            <div>
              <h3 className="font-semibold mb-1">Prize Raffle</h3>
              <p className="text-muted-foreground">
                Everyone who submits at least one photo is entered into a
                raffle for prizes from local sponsors. Participation, not
                perfection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Monthly Timeline */}
      <section className="max-w-3xl mx-auto mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">Monthly Timeline</h2>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b">
                <div>
                  <p className="font-medium">Submissions Open</p>
                  <p className="text-sm text-muted-foreground">
                    1st of the month
                  </p>
                </div>
                <Camera className="h-5 w-5 text-muted-foreground" />
              </div>

              <div className="flex justify-between items-center py-2 border-b">
                <div>
                  <p className="font-medium">Submissions Close</p>
                  <p className="text-sm text-muted-foreground">
                    {MONTHLY_SCHEDULE.submissionsCloseDay}th of the month
                  </p>
                </div>
                <BookOpen className="h-5 w-5 text-muted-foreground" />
              </div>

              <div className="flex justify-between items-center py-2 border-b">
                <div>
                  <p className="font-medium">Judging Period</p>
                  <p className="text-sm text-muted-foreground">
                    {MONTHLY_SCHEDULE.submissionsCloseDay}th–{MONTHLY_SCHEDULE.judgingEndsDay}th
                  </p>
                </div>
                <Users className="h-5 w-5 text-muted-foreground" />
              </div>

              <div className="flex justify-between items-center py-2">
                <div>
                  <p className="font-medium">Magazine Release</p>
                  <p className="text-sm text-muted-foreground">
                    First week of next month
                  </p>
                </div>
                <Gift className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">
          Frequently Asked Questions
        </h2>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="film-only">
            <AccordionTrigger>Does it have to be film?</AccordionTrigger>
            <AccordionContent>
              Yes! {SITE_CONFIG.name} is specifically for analogue film
              photography. We operate on an honour system and trust our
              community. Digital or AI-generated images will be removed if
              identified.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="wellington">
            <AccordionTrigger>
              Do I have to be based in Wellington?
            </AccordionTrigger>
            <AccordionContent>
              We&apos;re a Wellington community, so we encourage local participation.
              That said, if you&apos;ve shot film in Wellington and want to share
              it, we&apos;d love to see it!
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="cost">
            <AccordionTrigger>Is there a cost to participate?</AccordionTrigger>
            <AccordionContent>
              No! Submitting photos is completely free. We&apos;re a not-for-profit
              community project. The print magazine is sold at cost to cover
              printing.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="judging">
            <AccordionTrigger>How are judges selected?</AccordionTrigger>
            <AccordionContent>
              Judges rotate monthly and are selected from the community. They
              don&apos;t need to be photographers—we value diverse perspectives.
              Interested in judging? Get in touch!
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="prizes">
            <AccordionTrigger>What are the prizes?</AccordionTrigger>
            <AccordionContent>
              Prizes vary each month and are donated by local sponsors. They
              might include film, prints, cafe vouchers, darkroom time, or
              other photography-related goodies. Remember: prizes are raffled,
              not awarded to &ldquo;winners.&rdquo;
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="copyright">
            <AccordionTrigger>Who owns my photos?</AccordionTrigger>
            <AccordionContent>
              You do! Photographers retain full copyright. By submitting, you
              grant {SITE_CONFIG.name} a license to display your work on the
              website, in the print magazine, and in the archive. You can
              delete your submissions at any time.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="edit">
            <AccordionTrigger>Can I edit my submission?</AccordionTrigger>
            <AccordionContent>
              You can edit metadata (description, tags, camera info) at any
              time. However, you cannot change the photo itself or its category
              after submission. You can delete a submission before the deadline
              and resubmit if needed.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto text-center">
        <Card className="bg-muted/50">
          <CardContent className="pt-8 pb-8">
            <h2 className="text-2xl font-bold mb-4">Ready to join?</h2>
            <p className="text-muted-foreground mb-6">
              Create an account and submit your first photo today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/submit">
                  Submit a Photo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/this-month/brief">View This Month&apos;s Brief</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
