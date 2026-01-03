"use client";

import { useCountdown, formatCountdown, getCountdownDescription } from "@/hooks/use-countdown";
import { cn } from "@/lib/utils";

interface CountdownDisplayProps {
  targetDate: string;
  className?: string;
  variant?: "default" | "compact";
}

export function CountdownDisplay({
  targetDate,
  className,
  variant = "default",
}: CountdownDisplayProps) {
  const countdown = useCountdown(targetDate);

  if (countdown.isExpired) {
    return (
      <div className={cn("text-muted-foreground", className)}>
        Submissions closed
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={cn("font-mono text-lg", className)}>
        {formatCountdown(countdown)}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      {/* Timer boxes */}
      <div className="flex gap-2 sm:gap-4">
        <TimeUnit value={countdown.days} label="Days" />
        <TimeUnit value={countdown.hours} label="Hours" />
        <TimeUnit value={countdown.minutes} label="Minutes" />
        <TimeUnit value={countdown.seconds} label="Seconds" />
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground">
        {getCountdownDescription(countdown)}
      </p>
    </div>
  );
}

interface TimeUnitProps {
  value: number;
  label: string;
}

function TimeUnit({ value, label }: TimeUnitProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-muted rounded-lg p-3 sm:p-4 min-w-[60px] sm:min-w-[80px]">
        <span className="font-mono text-2xl sm:text-3xl font-bold tabular-nums">
          {value.toString().padStart(2, "0")}
        </span>
      </div>
      <span className="text-xs text-muted-foreground mt-1">{label}</span>
    </div>
  );
}
