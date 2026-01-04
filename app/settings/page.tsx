"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Settings,
  Calendar,
  Users,
  Palette,
  Save,
  ArrowRight,
  Shield,
  Plus,
  X,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/context/auth-context";
import {
  getCurrentMonth,
  getMonths,
  getRotatingThemes,
  formatMonthYear,
} from "@/lib/data/months";
import { getUsers, getJudgesForMonth } from "@/lib/data/users";
import { MONTH_STATUS } from "@/lib/constants";
import type { User, MonthStatus } from "@/types";

export default function SettingsPage() {
  const { user, isAuthenticated } = useAuth();
  const isAdmin = user?.role === "admin";

  const currentMonth = getCurrentMonth();
  const months = getMonths();
  const rotatingThemes = getRotatingThemes();
  const allUsers = getUsers().filter((u) => u.role === "photographer");
  const currentJudges = currentMonth
    ? getJudgesForMonth(currentMonth.monthYear)
    : [];

  // Form state
  const [selectedMonth, setSelectedMonth] = useState(currentMonth?.monthYear || "");
  const [status, setStatus] = useState<MonthStatus>(currentMonth?.status || "open");
  const [themeName, setThemeName] = useState(currentMonth?.rotatingCategory.name || "");
  const [themeDescription, setThemeDescription] = useState(
    currentMonth?.rotatingCategory.description || ""
  );
  const [judges, setJudges] = useState<User[]>(currentJudges);
  const [selectedJudge, setSelectedJudge] = useState<string>("");

  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableJudges = allUsers.filter(
    (u) => !judges.some((j) => j.id === u.id)
  );

  const addJudge = () => {
    if (!selectedJudge) return;
    const judgeUser = allUsers.find((u) => u.id === selectedJudge);
    if (judgeUser && judges.length < 3) {
      setJudges([...judges, judgeUser]);
      setSelectedJudge("");
    }
  };

  const removeJudge = (judgeId: string) => {
    setJudges(judges.filter((j) => j.id !== judgeId));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSaveSuccess(false);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In real app, would save to database
    console.log("Saving settings:", {
      month: selectedMonth,
      status,
      theme: { name: themeName, description: themeDescription },
      judges: judges.map((j) => j.id),
    });

    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="container py-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Sign in required</CardTitle>
              <CardDescription>
                You need to sign in to access settings
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
                Only administrators can access settings.
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
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Monthly Settings</h1>
            <p className="text-muted-foreground">
              Configure the current month&apos;s theme, judges, and status
            </p>
          </div>
          <Settings className="h-8 w-8 text-muted-foreground" />
        </div>

        {/* Success/Error alerts */}
        {saveSuccess && (
          <Alert className="mb-6 border-green-500 bg-green-50 dark:bg-green-950/30">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertDescription>Settings saved successfully!</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Month selector */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Select Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger>
                <SelectValue placeholder="Select a month..." />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month.id} value={month.monthYear}>
                    {formatMonthYear(month.monthYear)}
                    {month.status === "open" && " (Current)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {selectedMonth && (
          <>
            {/* Status */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Month Status</CardTitle>
                <CardDescription>
                  Control whether submissions are open, in judging, or closed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  {Object.values(MONTH_STATUS).map((s) => (
                    <Button
                      key={s}
                      variant={status === s ? "default" : "outline"}
                      onClick={() => setStatus(s)}
                      className="capitalize"
                    >
                      {s}
                    </Button>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  {status === "open" && "Photographers can submit photos"}
                  {status === "judging" && "Submissions closed, judges are reviewing"}
                  {status === "closed" && "Month is finalized and archived"}
                </p>
              </CardContent>
            </Card>

            {/* Rotating Theme */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Rotating Theme
                </CardTitle>
                <CardDescription>
                  The monthly creative prompt for photographers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="themeName">Theme Name</Label>
                  <div className="flex gap-2">
                    <Input
                      id="themeName"
                      value={themeName}
                      onChange={(e) => setThemeName(e.target.value)}
                      placeholder="e.g., Rain, After Dark, Coastline..."
                    />
                    <Select
                      value=""
                      onValueChange={(value) => {
                        const theme = rotatingThemes.find((t) => t.id === value);
                        if (theme) {
                          setThemeName(theme.name);
                          setThemeDescription(theme.description);
                        }
                      }}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Use preset..." />
                      </SelectTrigger>
                      <SelectContent>
                        {rotatingThemes.map((theme) => (
                          <SelectItem key={theme.id} value={theme.id}>
                            {theme.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="themeDescription">Description</Label>
                  <Textarea
                    id="themeDescription"
                    value={themeDescription}
                    onChange={(e) => setThemeDescription(e.target.value)}
                    placeholder="Describe what photographers should capture..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Judges */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Judges
                </CardTitle>
                <CardDescription>
                  Assign up to 3 community members as judges for this month
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Current judges */}
                {judges.length > 0 ? (
                  <div className="space-y-2">
                    {judges.map((judge) => (
                      <div
                        key={judge.id}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={judge.avatarUrl || undefined} />
                            <AvatarFallback>
                              {judge.displayName.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{judge.displayName}</p>
                            <p className="text-sm text-muted-foreground">
                              {judge.email}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeJudge(judge.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No judges assigned yet
                  </p>
                )}

                {/* Add judge */}
                {judges.length < 3 && (
                  <div className="flex gap-2">
                    <Select value={selectedJudge} onValueChange={setSelectedJudge}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select a user..." />
                      </SelectTrigger>
                      <SelectContent>
                        {availableJudges.map((u) => (
                          <SelectItem key={u.id} value={u.id}>
                            {u.displayName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button onClick={addJudge} disabled={!selectedJudge}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                )}

                <p className="text-sm text-muted-foreground">
                  {judges.length}/3 judges assigned
                </p>
              </CardContent>
            </Card>

            <Separator className="my-6" />

            {/* Save button */}
            <div className="flex justify-end">
              <Button onClick={handleSave} disabled={isSaving} size="lg">
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>

            {/* Info */}
            <p className="text-sm text-muted-foreground text-center mt-6">
              Changes will take effect immediately. Saving is mocked in Phase 1.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
