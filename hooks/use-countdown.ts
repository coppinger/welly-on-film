"use client";

import { useState, useEffect, useCallback } from "react";

interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  totalSeconds: number;
}

export function useCountdown(targetDate: string | Date): CountdownResult {
  const calculateTimeLeft = useCallback((): CountdownResult => {
    const target = typeof targetDate === "string" ? new Date(targetDate) : targetDate;
    const now = new Date();
    const difference = target.getTime() - now.getTime();

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: true,
        totalSeconds: 0,
      };
    }

    const totalSeconds = Math.floor(difference / 1000);
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return {
      days,
      hours,
      minutes,
      seconds,
      isExpired: false,
      totalSeconds,
    };
  }, [targetDate]);

  const [timeLeft, setTimeLeft] = useState<CountdownResult>(calculateTimeLeft);

  useEffect(() => {
    // Update immediately
    setTimeLeft(calculateTimeLeft());

    // Then update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  return timeLeft;
}

// Format countdown for display
export function formatCountdown(countdown: CountdownResult): string {
  if (countdown.isExpired) {
    return "Submissions closed";
  }

  const parts: string[] = [];

  if (countdown.days > 0) {
    parts.push(`${countdown.days}d`);
  }
  if (countdown.hours > 0 || countdown.days > 0) {
    parts.push(`${countdown.hours}h`);
  }
  if (countdown.minutes > 0 || countdown.hours > 0 || countdown.days > 0) {
    parts.push(`${countdown.minutes}m`);
  }
  parts.push(`${countdown.seconds}s`);

  return parts.join(" ");
}

// Get a human-readable description
export function getCountdownDescription(countdown: CountdownResult): string {
  if (countdown.isExpired) {
    return "Submissions are now closed";
  }

  if (countdown.days > 7) {
    return `${countdown.days} days remaining`;
  }

  if (countdown.days > 0) {
    return `${countdown.days} day${countdown.days === 1 ? "" : "s"} and ${countdown.hours} hour${countdown.hours === 1 ? "" : "s"} remaining`;
  }

  if (countdown.hours > 0) {
    return `${countdown.hours} hour${countdown.hours === 1 ? "" : "s"} and ${countdown.minutes} minute${countdown.minutes === 1 ? "" : "s"} remaining`;
  }

  if (countdown.minutes > 0) {
    return `${countdown.minutes} minute${countdown.minutes === 1 ? "" : "s"} remaining`;
  }

  return `${countdown.seconds} second${countdown.seconds === 1 ? "" : "s"} remaining`;
}
