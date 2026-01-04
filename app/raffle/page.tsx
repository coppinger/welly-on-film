"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Gift,
  Shuffle,
  Trophy,
  Users,
  ArrowRight,
  Shield,
  Sparkles,
  Check,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/auth-context";
import { getMonths, formatMonthYear } from "@/lib/data/months";
import { getSubmissionsByMonth } from "@/lib/data/submissions";
import { getUserById, getRaffleWinnerForMonth, getRaffleWinners } from "@/lib/data/users";
import type { User } from "@/types";

export default function RafflePage() {
  const { user, isAuthenticated } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<User | null>(null);
  const [spinningName, setSpinningName] = useState<string>("");

  const isAdmin = user?.role === "admin";
  const months = getMonths();
  const raffleWinners = getRaffleWinners();

  // Get unique participants for selected month
  const participants = selectedMonth
    ? [...new Set(getSubmissionsByMonth(selectedMonth).map((s) => s.userId))]
        .map((id) => getUserById(id))
        .filter((u): u is User => u !== null)
    : [];

  // Check if raffle already run for selected month
  const existingWinner = selectedMonth
    ? getRaffleWinnerForMonth(selectedMonth)
    : null;

  const existingWinnerUser = existingWinner
    ? getUserById(existingWinner.userId)
    : null;

  // Spinning animation effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSpinning && participants.length > 0) {
      interval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * participants.length);
        setSpinningName(participants[randomIndex].displayName);
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isSpinning, participants]);

  const runRaffle = useCallback(() => {
    if (participants.length === 0) return;

    setIsSpinning(true);
    setWinner(null);

    // Animate for 3 seconds then pick winner
    setTimeout(() => {
      setIsSpinning(false);
      const randomIndex = Math.floor(Math.random() * participants.length);
      const selectedWinner = participants[randomIndex];
      setWinner(selectedWinner);
      setSpinningName("");
    }, 3000);
  }, [participants]);

  // Not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="container py-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Sign in required</CardTitle>
              <CardDescription>
                You need to sign in to access the raffle picker
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/sign-in">
                  Sign in
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  // Not admin
  if (!isAdmin) {
    return (
      <div className="container py-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <Shield className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <CardTitle>Admin access required</CardTitle>
              <CardDescription>
                Only administrators can run the raffle.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href="/">Return home</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <Gift className="mx-auto h-12 w-12 text-primary mb-4" />
          <h1 className="text-3xl font-bold mb-2">Raffle Picker</h1>
          <p className="text-muted-foreground">
            Randomly select a winner from all participants
          </p>
        </div>

        {/* Month selector */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Select Month</CardTitle>
            <CardDescription>
              Choose a month to run the raffle for
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger>
                <SelectValue placeholder="Select a month..." />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month.id} value={month.monthYear}>
                    {formatMonthYear(month.monthYear)} - {month.rotatingCategory.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedMonth && (
              <div className="mt-4 flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{participants.length} participants</span>
                </div>
                {existingWinner && (
                  <Badge variant="secondary">
                    <Check className="h-3 w-3 mr-1" />
                    Raffle completed
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Existing winner display */}
        {existingWinnerUser && (
          <Card className="mb-8 border-yellow-500/50 bg-yellow-50/50 dark:bg-yellow-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Previous Winner
              </CardTitle>
              <CardDescription>
                The raffle for {formatMonthYear(selectedMonth)} has already been run
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={existingWinnerUser.avatarUrl || undefined} />
                  <AvatarFallback className="text-xl">
                    {existingWinnerUser.displayName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xl font-bold">{existingWinnerUser.displayName}</p>
                  <p className="text-muted-foreground">{existingWinnerUser.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Raffle spinner */}
        {selectedMonth && participants.length > 0 && !existingWinner && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Spin the Wheel</CardTitle>
              <CardDescription>
                Click to randomly select a winner from {participants.length} eligible participants
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center py-8">
              {/* Spinner display */}
              <div className="relative mx-auto w-48 h-48 rounded-full border-4 border-dashed border-primary/30 flex items-center justify-center mb-6">
                {isSpinning ? (
                  <div className="animate-pulse">
                    <Sparkles className="h-12 w-12 text-primary mb-2 mx-auto animate-spin" />
                    <p className="text-lg font-bold">{spinningName}</p>
                  </div>
                ) : winner ? (
                  <div className="text-center">
                    <Avatar className="h-20 w-20 mx-auto mb-2">
                      <AvatarImage src={winner.avatarUrl || undefined} />
                      <AvatarFallback className="text-2xl">
                        {winner.displayName.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <Trophy className="h-6 w-6 text-yellow-500 mx-auto" />
                  </div>
                ) : (
                  <Shuffle className="h-16 w-16 text-muted-foreground" />
                )}
              </div>

              {/* Winner announcement */}
              {winner && !isSpinning && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">The winner is...</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {winner.displayName}
                  </p>
                  <p className="text-sm text-muted-foreground">{winner.email}</p>
                </div>
              )}

              <Button
                size="lg"
                onClick={runRaffle}
                disabled={isSpinning || participants.length === 0}
                className="min-w-[200px]"
              >
                {isSpinning ? (
                  <>
                    <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                    Picking...
                  </>
                ) : winner ? (
                  <>
                    <Shuffle className="mr-2 h-4 w-4" />
                    Spin Again
                  </>
                ) : (
                  <>
                    <Gift className="mr-2 h-4 w-4" />
                    Start Raffle
                  </>
                )}
              </Button>

              {winner && !isSpinning && (
                <div className="mt-4">
                  <Button variant="outline" disabled>
                    <Check className="mr-2 h-4 w-4" />
                    Save Winner (Coming in Phase 2)
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* No participants */}
        {selectedMonth && participants.length === 0 && (
          <Card className="mb-8">
            <CardContent className="py-12 text-center">
              <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">No participants</h3>
              <p className="text-muted-foreground">
                There are no submissions for this month yet
              </p>
            </CardContent>
          </Card>
        )}

        {/* Participant list */}
        {selectedMonth && participants.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Eligible Participants
              </CardTitle>
              <CardDescription>
                Everyone who submitted at least one photo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 sm:grid-cols-2">
                {participants.map((participant) => (
                  <div
                    key={participant.id}
                    className={`flex items-center gap-3 p-2 rounded-lg ${
                      winner?.id === participant.id
                        ? "bg-green-50 dark:bg-green-950/30 ring-2 ring-green-500"
                        : "bg-muted/50"
                    }`}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={participant.avatarUrl || undefined} />
                      <AvatarFallback className="text-xs">
                        {participant.displayName.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium truncate">
                      {participant.displayName}
                    </span>
                    {winner?.id === participant.id && (
                      <Trophy className="h-4 w-4 text-yellow-500 ml-auto" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Separator className="my-8" />

        {/* Past winners */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Past Winners
            </CardTitle>
          </CardHeader>
          <CardContent>
            {raffleWinners.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No raffle winners yet
              </p>
            ) : (
              <div className="space-y-3">
                {raffleWinners.map((rw) => {
                  const winnerUser = getUserById(rw.userId);
                  if (!winnerUser) return null;
                  return (
                    <div
                      key={rw.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Trophy className="h-5 w-5 text-yellow-500" />
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={winnerUser.avatarUrl || undefined} />
                          <AvatarFallback className="text-xs">
                            {winnerUser.displayName.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{winnerUser.displayName}</span>
                      </div>
                      <Badge variant="outline">{formatMonthYear(rw.monthYear)}</Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
