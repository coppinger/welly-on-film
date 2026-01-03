import Link from "next/link";
import { Camera } from "lucide-react";
import { SITE_CONFIG, NAV_LINKS } from "@/lib/constants";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/40">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
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

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t">
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
