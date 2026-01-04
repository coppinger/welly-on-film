import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/constants";
import { getMonths } from "@/lib/data/months";
import { getSubmissions } from "@/lib/data/submissions";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONFIG.url;
  const months = getMonths();
  const submissions = getSubmissions();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/this-month/brief`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/this-month/submissions`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/archive`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/legal/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/legal/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Archive month pages
  const archivePages: MetadataRoute.Sitemap = months
    .filter((m) => m.status === "closed")
    .map((month) => ({
      url: `${baseUrl}/archive/${month.monthYear}`,
      lastModified: new Date(month.submissionsClose),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    }));

  // Submission detail pages
  const submissionPages: MetadataRoute.Sitemap = submissions.map((sub) => ({
    url: `${baseUrl}/this-month/submissions/${sub.id}`,
    lastModified: new Date(sub.createdAt),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  return [...staticPages, ...archivePages, ...submissionPages];
}
