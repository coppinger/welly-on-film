import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE_CONFIG, SUBMISSION_LIMITS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: `Terms of use for ${SITE_CONFIG.name}.`,
};

export default function TermsOfUsePage() {
  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto">
        <Button asChild variant="ghost" size="sm" className="mb-6">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>

        <h1 className="text-3xl font-bold mb-2">Terms of Use</h1>
        <p className="text-muted-foreground mb-8">
          Last updated: January 2025
        </p>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using {SITE_CONFIG.name}, you agree to be bound by
            these Terms of Use. If you do not agree to these terms, please do
            not use the service.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            {SITE_CONFIG.name} is a community platform for analogue film
            photographers in {SITE_CONFIG.location}. We provide:
          </p>
          <ul>
            <li>A platform to submit and share film photography</li>
            <li>A community gallery and archive</li>
            <li>A monthly print magazine featuring selected submissions</li>
            <li>A monthly prize raffle for participants</li>
          </ul>

          <h2>3. User Accounts</h2>
          <p>
            To submit photos or comment, you must create an account. You are
            responsible for:
          </p>
          <ul>
            <li>Providing accurate account information</li>
            <li>Maintaining the security of your account</li>
            <li>All activity that occurs under your account</li>
          </ul>

          <h2>4. Submission Requirements</h2>
          <h3>4.1 Film Photography Only</h3>
          <p>
            All submissions must be photographs shot on analogue film. We
            operate on an honour system and trust our community. Digital or
            AI-generated images are not permitted.
          </p>
          <p>
            If a submission is identified as not being shot on film, it may be
            removed. Repeated violations may result in account suspension.
          </p>

          <h3>4.2 Technical Requirements</h3>
          <ul>
            <li>
              Accepted formats: {SUBMISSION_LIMITS.acceptedExtensions.join(", ")}
            </li>
            <li>
              Minimum dimension: {SUBMISSION_LIMITS.minImageDimension}px on
              longest edge
            </li>
            <li>Maximum file size: {SUBMISSION_LIMITS.maxFileSizeMB}MB</li>
            <li>
              Maximum submissions: {SUBMISSION_LIMITS.maxPerMonth} per person,
              per month
            </li>
          </ul>

          <h3>4.3 Content Ownership</h3>
          <p>
            <strong>You retain full copyright</strong> to your photographs. By
            submitting to {SITE_CONFIG.name}, you grant us a non-exclusive,
            royalty-free license to:
          </p>
          <ul>
            <li>Display your photos on our website</li>
            <li>Include your photos in our digital archive</li>
            <li>Print featured photos in our magazine (with credit)</li>
            <li>Use photos in promotional materials (with credit)</li>
          </ul>

          <h2>5. Community Guidelines</h2>
          <p>
            {SITE_CONFIG.name} is a welcoming community. The following content
            is not permitted:
          </p>
          <ul>
            <li>Hate speech, harassment, or discrimination</li>
            <li>Illegal content</li>
            <li>Explicit sexual content</li>
            <li>Violence or gore</li>
            <li>Content that infringes on others&apos; rights</li>
            <li>Spam or promotional content</li>
          </ul>
          <p>
            Comments should be encouraging, curious, or connecting — not
            evaluative. This is not a critique forum.
          </p>

          <h2>6. Moderation</h2>
          <p>
            We reserve the right to remove content that violates these terms or
            our community guidelines. Flagged content is hidden pending review.
          </p>
          <p>
            Repeated violations may result in temporary or permanent account
            suspension.
          </p>

          <h2>7. Prize Raffle</h2>
          <p>
            Everyone who submits at least one valid photo in a month is entered
            into that month&apos;s prize raffle. Winners are selected randomly.
            Users whose only submissions were flagged and removed are not
            eligible.
          </p>
          <p>
            Prizes are donated by local sponsors and vary each month. We make
            no guarantees about prize availability or value.
          </p>

          <h2>8. Account Deletion</h2>
          <p>You may delete your account at any time. When you do:</p>
          <ul>
            <li>Your personal information is removed</li>
            <li>
              Your submissions are marked as deleted (display a placeholder)
            </li>
            <li>Your comments show author as &ldquo;Deleted User&rdquo;</li>
          </ul>

          <h2>9. Disclaimer of Warranties</h2>
          <p>
            {SITE_CONFIG.name} is provided &ldquo;as is&rdquo; without warranties of any
            kind. We do not guarantee that the service will be uninterrupted,
            secure, or error-free.
          </p>

          <h2>10. Limitation of Liability</h2>
          <p>
            {SITE_CONFIG.name} and its operators are not liable for any
            indirect, incidental, special, consequential, or punitive damages
            arising from your use of the service.
          </p>

          <h2>11. Changes to Terms</h2>
          <p>
            We may update these terms from time to time. We will notify you of
            significant changes by email or through the service. Continued use
            after changes constitutes acceptance of the new terms.
          </p>

          <h2>12. Governing Law</h2>
          <p>
            These terms are governed by the laws of New Zealand. Any disputes
            shall be resolved in the courts of New Zealand.
          </p>

          <h2>13. Contact</h2>
          <p>
            Questions about these terms? Contact us at{" "}
            <a href={`mailto:hello@${SITE_CONFIG.url.replace("https://", "")}`}>
              hello@{SITE_CONFIG.url.replace("https://", "")}
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
