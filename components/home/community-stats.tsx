import { getCommunityStats } from "@/lib/data/stats";
import { Camera, Users, BookOpen } from "lucide-react";

export function CommunityStats() {
  const stats = getCommunityStats();

  // Don't show if we don't have meaningful stats yet
  if (stats.totalSubmissions === 0) {
    return null;
  }

  const statItems = [
    {
      icon: Camera,
      value: stats.totalSubmissions,
      label: "Photos Shared",
    },
    {
      icon: Users,
      value: stats.uniquePhotographers,
      label: "Photographers",
    },
    {
      icon: BookOpen,
      value: stats.monthsPublished,
      label: stats.monthsPublished === 1 ? "Issue Published" : "Issues Published",
    },
  ];

  return (
    <section className="py-12">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-lg text-muted-foreground mb-8">
          Join {stats.uniquePhotographers}+ photographers who&apos;ve shared{" "}
          {stats.totalSubmissions}+ photos across {stats.monthsPublished}{" "}
          {stats.monthsPublished === 1 ? "month" : "months"}
        </p>

        <div className="grid grid-cols-3 gap-4 md:gap-8">
          {statItems.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-2">
              <stat.icon className="h-5 w-5 text-muted-foreground" />
              <span className="text-3xl md:text-4xl font-bold">{stat.value}+</span>
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
