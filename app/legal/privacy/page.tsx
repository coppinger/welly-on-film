import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy policy for ${SITE_CONFIG.name}.`,
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto">
        <Button asChild variant="ghost" size="sm" className="mb-6">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>

        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">
          Last updated: January 2025
        </p>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>1. Information We Collect</h2>
          <p>
            {SITE_CONFIG.name} collects the following information when you
            create an account and use our service:
          </p>
          <ul>
            <li>
              <strong>Account information:</strong> Email address and display
              name (required). Avatar and bio (optional).
            </li>
            <li>
              <strong>Submissions:</strong> Photos you upload, along with any
              metadata you provide (camera, film stock, location, description,
              tags).
            </li>
            <li>
              <strong>Comments:</strong> Any comments you post on submissions.
            </li>
            <li>
              <strong>Usage data:</strong> Basic analytics about how you use
              the site (page views, submissions, etc.).
            </li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul>
            <li>Provide and maintain the {SITE_CONFIG.name} service</li>
            <li>Display your submissions on the website and in our archive</li>
            <li>
              Print featured submissions in our monthly magazine (with credit)
            </li>
            <li>Contact you about your account or submissions if needed</li>
            <li>Run the monthly prize raffle</li>
            <li>Improve the service based on usage patterns</li>
          </ul>

          <h2>3. Photo Usage</h2>
          <p>
            By submitting photos to {SITE_CONFIG.name}, you grant us a
            non-exclusive license to:
          </p>
          <ul>
            <li>Display your photos on the {SITE_CONFIG.name} website</li>
            <li>Include your photos in our digital archive</li>
            <li>
              Print featured photos in our monthly magazine (with credit to
              you)
            </li>
            <li>
              Use photos in promotional materials for {SITE_CONFIG.name} (with
              credit)
            </li>
          </ul>
          <p>
            <strong>You retain full copyright</strong> to your photos. You can
            delete your submissions at any time.
          </p>

          <h2>4. Data Sharing</h2>
          <p>
            We do not sell, trade, or rent your personal information to third
            parties. We may share information with:
          </p>
          <ul>
            <li>
              <strong>Service providers:</strong> Third-party services that
              help us operate the platform (hosting, image storage, email).
            </li>
            <li>
              <strong>Legal requirements:</strong> If required by law or to
              protect the rights, property, or safety of {SITE_CONFIG.name} or
              others.
            </li>
          </ul>

          <h2>5. Data Retention</h2>
          <p>
            We retain your data as long as your account is active. Submissions
            remain in the archive unless you delete them or your account.
          </p>
          <p>
            When you delete your account, your personal information is removed.
            Your submissions are marked as deleted and display a placeholder
            image. Comments you made show author as &ldquo;Deleted User.&rdquo;
          </p>

          <h2>6. Your Rights</h2>
          <p>Under the NZ Privacy Act 2020, you have the right to:</p>
          <ul>
            <li>Access the personal information we hold about you</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your personal information</li>
            <li>Withdraw consent for data processing</li>
          </ul>
          <p>
            To exercise these rights, please contact us at{" "}
            <a href={`mailto:privacy@${SITE_CONFIG.url.replace("https://", "")}`}>
              privacy@{SITE_CONFIG.url.replace("https://", "")}
            </a>
            .
          </p>

          <h2>7. Cookies</h2>
          <p>
            We use essential cookies to maintain your session and remember your
            preferences. We do not use tracking cookies for advertising.
          </p>

          <h2>8. Security</h2>
          <p>
            We implement appropriate security measures to protect your
            information. However, no method of transmission over the Internet is
            100% secure.
          </p>

          <h2>9. Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. We will notify
            you of significant changes by email or through the service.
          </p>

          <h2>10. Contact Us</h2>
          <p>
            If you have questions about this privacy policy, please contact us
            at{" "}
            <a href={`mailto:privacy@${SITE_CONFIG.url.replace("https://", "")}`}>
              privacy@{SITE_CONFIG.url.replace("https://", "")}
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
