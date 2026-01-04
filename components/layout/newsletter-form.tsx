"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterForm() {
  return (
    <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
      <Input
        type="email"
        placeholder="your@email.com"
        className="flex-1"
        aria-label="Email address"
      />
      <Button type="submit" variant="default">
        Subscribe
      </Button>
    </form>
  );
}
