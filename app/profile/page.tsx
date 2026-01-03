"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Camera,
  Star,
  Calendar,
  Settings,
  Grid,
  LogOut,
  ArrowRight,
  Mail,
  User,
  Loader2,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/auth-context";
import { getSubmissionsByUser } from "@/lib/data/submissions";
import { SITE_CONFIG, CATEGORY_TYPES, FIXED_CATEGORIES } from "@/lib/constants";
import type { Submission } from "@/types";

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-NZ", {
    month: "long",
    year: "numeric",
  });
}

function getCategoryLabel(submission: Submission): string {
  if (submission.categoryType === "fixed") {
    const cat = FIXED_CATEGORIES.find((c) => c.id === submission.category);
    return cat ? cat.name : "Fixed";
  }
  return CATEGORY_TYPES[submission.categoryType]?.name || submission.categoryType;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, signOut, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("submissions");

  // Form state for settings
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Get user's submissions
  const submissions = user ? getSubmissionsByUser(user.id) : [];
  const featuredCount = submissions.filter((s) => s.isFeatured).length;

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSignOut = () => {
    signOut();
    router.push("/");
  };

  // Not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="container py-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Sign in to view your profile</CardTitle>
              <CardDescription>
                Access your submissions and account settings
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex flex-col gap-4">
              <Button asChild className="w-full">
                <Link href="/sign-in">
                  Sign in
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                Don&apos;t have an account?{" "}
                <Link href="/sign-up" className="underline hover:text-foreground">
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        {/* Profile header */}
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center mb-8">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user.avatarUrl || undefined} alt={user.displayName} />
            <AvatarFallback className="text-2xl">
              {user.displayName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold">{user.displayName}</h1>
              {user.role === "admin" && (
                <Badge variant="secondary">Admin</Badge>
              )}
            </div>
            {user.bio && (
              <p className="text-muted-foreground mb-3">{user.bio}</p>
            )}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Camera className="h-4 w-4" />
                <span>{submissions.length} submissions</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4" />
                <span>{featuredCount} featured</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Joined {formatDate(user.createdAt)}</span>
              </div>
            </div>
          </div>

          <Button asChild>
            <Link href="/submit">
              Submit Photo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <Separator className="mb-8" />

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="submissions" className="gap-2">
              <Grid className="h-4 w-4" />
              Submissions
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Submissions tab */}
          <TabsContent value="submissions">
            {submissions.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Camera className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">No submissions yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Share your film photography with the community
                  </p>
                  <Button asChild>
                    <Link href="/submit">
                      Submit your first photo
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {submissions.map((submission) => (
                  <Link
                    key={submission.id}
                    href={`/this-month/submissions/${submission.id}`}
                    className="group"
                  >
                    <Card className="overflow-hidden hover:ring-2 hover:ring-primary/50 transition-all">
                      <div className="relative aspect-[4/3] bg-muted">
                        <Image
                          src={submission.thumbnailUrl}
                          alt={submission.metadata.description || "Photo"}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {submission.isFeatured && (
                          <Badge className="absolute top-2 left-2">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </div>
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {getCategoryLabel(submission)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(submission.createdAt)}
                          </span>
                        </div>
                        {submission.metadata.camera && (
                          <p className="text-sm text-muted-foreground mt-1 truncate">
                            {submission.metadata.camera}
                            {submission.metadata.filmStock &&
                              ` • ${submission.metadata.filmStock}`}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Settings tab */}
          <TabsContent value="settings">
            <div className="max-w-xl">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                  <CardDescription>
                    Update your display name and bio
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleSaveSettings}>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Display name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="displayName"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          className="pl-10"
                          placeholder="Your name"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          value={user.email}
                          disabled
                          className="pl-10 bg-muted"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Email cannot be changed
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell us about yourself and your photography..."
                        rows={3}
                      />
                      <p className="text-xs text-muted-foreground">
                        Optional • Displayed on your profile
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between">
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : saveSuccess ? (
                        "Saved!"
                      ) : (
                        <>
                          <Pencil className="mr-2 h-4 w-4" />
                          Save changes
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Account</CardTitle>
                  <CardDescription>Manage your account</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </Button>
                </CardContent>
              </Card>

              <Card className="mt-6 border-destructive/50">
                <CardHeader>
                  <CardTitle className="text-destructive">Danger Zone</CardTitle>
                  <CardDescription>
                    Irreversible actions for your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="destructive" disabled>
                    Delete account
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Account deletion coming in Phase 2
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
