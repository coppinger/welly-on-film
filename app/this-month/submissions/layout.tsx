import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Submissions",
  description: `Browse this month's film photography submissions to ${SITE_CONFIG.name}. View photos from Wellington's analogue photography community.`,
  openGraph: {
    title: `Submissions | ${SITE_CONFIG.name}`,
    description: `Browse this month's film photography submissions from Wellington's analogue photography community.`,
  },
};

export default function SubmissionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
