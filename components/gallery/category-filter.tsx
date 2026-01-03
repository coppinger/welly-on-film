"use client";

import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CATEGORY_TYPES } from "@/lib/constants";
import type { CategoryTypeId } from "@/types";

interface CategoryFilterProps {
  value: CategoryTypeId | "all";
  onChange: (value: CategoryTypeId | "all") => void;
  counts?: Record<CategoryTypeId | "all", number>;
  className?: string;
}

export function CategoryFilter({
  value,
  onChange,
  counts,
  className,
}: CategoryFilterProps) {
  const categories = [
    { id: "all" as const, name: "All" },
    { id: "fixed" as const, name: CATEGORY_TYPES.fixed.name },
    { id: "rotating" as const, name: CATEGORY_TYPES.rotating.name },
    { id: "open" as const, name: CATEGORY_TYPES.open.name },
  ];

  return (
    <Tabs
      value={value}
      onValueChange={(v) => onChange(v as CategoryTypeId | "all")}
      className={className}
    >
      <TabsList className="w-full md:w-auto">
        {categories.map((category) => (
          <TabsTrigger
            key={category.id}
            value={category.id}
            className="flex-1 md:flex-initial gap-1.5"
          >
            {category.name}
            {counts && counts[category.id] !== undefined && (
              <span className="text-xs text-muted-foreground">
                ({counts[category.id]})
              </span>
            )}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
