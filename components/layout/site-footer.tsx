import Link from "next/link";
import { Camera, Instagram } from "lucide-react";
import { SITE_CONFIG, NAV_LINKS, SOCIAL_LINKS } from "@/lib/constants";
import { NewsletterForm } from "./newsletter-form";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/40">
      <div className="container py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="sm:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Camera className="h-6 w-6" />
              <span className="font-semibold text-lg">{SITE_CONFIG.name}</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm">
              {SITE_CONFIG.tagline}. A community platform for analogue film
              photographers in {SITE_CONFIG.location}.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold mb-4">Explore</h3>
            <nav className="flex flex-col gap-2">
              {NAV_LINKS.main.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <nav className="flex gap-3">
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-md bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </nav>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <nav className="flex flex-col gap-2">
              {NAV_LINKS.legal.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-8 border-t">
          <div className="max-w-md">
            <h3 className="font-semibold mb-2">Stay Updated</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get notified about new monthly briefs and featured photos.
            </p>
            <NewsletterForm />
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; {currentYear} {SITE_CONFIG.name}. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">
              Made with film and love in Wellington, NZ
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
