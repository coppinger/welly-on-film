"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Upload,
  Camera,
  MapPin,
  Film,
  Tag,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle,
  X,
  AlertCircle,
  ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/auth-context";
import { getCurrentMonth } from "@/lib/data/months";
import { countSubmissionsByUserForMonth } from "@/lib/data/submissions";
import {
  SITE_CONFIG,
  SUBMISSION_LIMITS,
  FIXED_CATEGORIES,
  CATEGORY_TYPES,
} from "@/lib/constants";
import type { CategoryTypeId, FixedCategoryId } from "@/types";

type Step = "upload" | "category" | "metadata" | "review" | "success";

interface SubmissionForm {
  imageFile: File | null;
  imagePreview: string | null;
  categoryType: CategoryTypeId | null;
  fixedCategory: FixedCategoryId | null;
  camera: string;
  filmStock: string;
  location: string;
  description: string;
  tags: string[];
}

const initialForm: SubmissionForm = {
  imageFile: null,
  imagePreview: null,
  categoryType: null,
  fixedCategory: null,
  camera: "",
  filmStock: "",
  location: "",
  description: "",
  tags: [],
};

export default function SubmitPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [step, setStep] = useState<Step>("upload");
  const [form, setForm] = useState<SubmissionForm>(initialForm);
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const currentMonth = getCurrentMonth();
  const userSubmissionCount = user && currentMonth
    ? countSubmissionsByUserForMonth(user.id, currentMonth.monthYear)
    : 0;
  const remainingSubmissions = SUBMISSION_LIMITS.maxPerMonth - userSubmissionCount;

  // Handle file drop/select
  const handleFileSelect = useCallback((file: File) => {
    setErrors({});

    // Validate file type
    if (!SUBMISSION_LIMITS.acceptedFormats.includes(file.type as typeof SUBMISSION_LIMITS.acceptedFormats[number])) {
      setErrors({ file: "Please upload a JPEG, PNG, or TIFF image" });
      return;
    }

    // Validate file size
    if (file.size > SUBMISSION_LIMITS.maxFileSizeMB * 1024 * 1024) {
      setErrors({ file: `File size must be under ${SUBMISSION_LIMITS.maxFileSizeMB}MB` });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setForm((prev) => ({
        ...prev,
        imageFile: file,
        imagePreview: e.target?.result as string,
      }));
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const removeImage = () => {
    setForm((prev) => ({
      ...prev,
      imageFile: null,
      imagePreview: null,
    }));
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !form.tags.includes(tag) && form.tags.length < 5) {
      setForm((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove),
    }));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const nextStep = () => {
    const steps: Step[] = ["upload", "category", "metadata", "review", "success"];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const steps: Step[] = ["upload", "category", "metadata", "review", "success"];
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1]);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setStep("success");
  };

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="container py-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Sign in to submit</CardTitle>
              <CardDescription>
                You need an account to submit photos to {SITE_CONFIG.name}
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

  // No current month open
  if (!currentMonth || currentMonth.status !== "open") {
    return (
      <div className="container py-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Submissions closed</CardTitle>
              <CardDescription>
                Submissions for this month are currently closed. Check back when
                the next month opens!
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href="/this-month/brief">View this month&apos;s brief</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  // Reached submission limit
  if (remainingSubmissions <= 0) {
    return (
      <div className="container py-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Limit reached</CardTitle>
              <CardDescription>
                You&apos;ve already submitted {SUBMISSION_LIMITS.maxPerMonth} photos
                this month. Check back next month!
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex flex-col gap-4">
              <Button asChild variant="outline" className="w-full">
                <Link href="/profile">View your submissions</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  // Success state
  if (step === "success") {
    return (
      <div className="container py-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle>Photo submitted!</CardTitle>
              <CardDescription>
                Your photo has been submitted successfully.
                {remainingSubmissions - 1 > 0 && (
                  <> You have {remainingSubmissions - 1} submission{remainingSubmissions - 1 !== 1 ? "s" : ""} remaining this month.</>
                )}
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex flex-col gap-4">
              <Button
                onClick={() => {
                  setForm(initialForm);
                  setStep("upload");
                }}
                className="w-full"
                disabled={remainingSubmissions - 1 <= 0}
              >
                Submit another photo
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/this-month/submissions">View all submissions</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Submit a photo</h1>
          <p className="text-muted-foreground">
            {remainingSubmissions} of {SUBMISSION_LIMITS.maxPerMonth} submissions
            remaining this month
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {["upload", "category", "metadata", "review"].map((s, i) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === s
                    ? "bg-primary text-primary-foreground"
                    : ["upload", "category", "metadata", "review"].indexOf(step) > i
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {i + 1}
              </div>
              {i < 3 && (
                <div
                  className={`w-8 h-0.5 ${
                    ["upload", "category", "metadata", "review"].indexOf(step) > i
                      ? "bg-primary/20"
                      : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Upload */}
        {step === "upload" && (
          <Card>
            <CardHeader>
              <CardTitle>Upload your photo</CardTitle>
              <CardDescription>
                JPEG, PNG, or TIFF • Max {SUBMISSION_LIMITS.maxFileSizeMB}MB •
                Min {SUBMISSION_LIMITS.minImageDimension}px on longest edge
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!form.imagePreview ? (
                <div
                  className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => document.getElementById("file-input")?.click()}
                >
                  <input
                    id="file-input"
                    type="file"
                    accept={SUBMISSION_LIMITS.acceptedExtensions.join(",")}
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                  <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="font-medium mb-1">
                    Drop your photo here or click to browse
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Analogue film photos only
                  </p>
                </div>
              ) : (
                <div className="relative">
                  <div className="relative aspect-[4/3] bg-muted rounded-lg overflow-hidden">
                    <Image
                      src={form.imagePreview}
                      alt="Preview"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    {form.imageFile?.name}
                  </p>
                </div>
              )}

              {errors.file && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{errors.file}</AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter>
              <Button
                onClick={nextStep}
                disabled={!form.imagePreview}
                className="ml-auto"
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Step 2: Category */}
        {step === "category" && (
          <Card>
            <CardHeader>
              <CardTitle>Choose a category</CardTitle>
              <CardDescription>
                Select the category that best fits your photo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup
                value={form.categoryType || ""}
                onValueChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    categoryType: value as CategoryTypeId,
                    fixedCategory: null,
                  }))
                }
              >
                {/* Fixed category */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 rounded-lg border hover:border-primary/50 transition-colors">
                    <RadioGroupItem value="fixed" id="fixed" />
                    <div className="flex-1">
                      <Label htmlFor="fixed" className="cursor-pointer">
                        <span className="font-medium">
                          {CATEGORY_TYPES.fixed.name}
                        </span>
                        <p className="text-sm text-muted-foreground font-normal mt-1">
                          {CATEGORY_TYPES.fixed.description}
                        </p>
                      </Label>
                    </div>
                  </div>

                  {form.categoryType === "fixed" && (
                    <div className="ml-8 grid grid-cols-2 gap-2">
                      {FIXED_CATEGORIES.map((cat) => (
                        <Button
                          key={cat.id}
                          variant={
                            form.fixedCategory === cat.id ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              fixedCategory: cat.id,
                            }))
                          }
                          className="justify-start"
                        >
                          {cat.name}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Rotating category */}
                <div className="flex items-center space-x-3 p-4 rounded-lg border hover:border-primary/50 transition-colors">
                  <RadioGroupItem value="rotating" id="rotating" />
                  <div className="flex-1">
                    <Label htmlFor="rotating" className="cursor-pointer">
                      <span className="font-medium">
                        {CATEGORY_TYPES.rotating.name}: {currentMonth.rotatingCategory.name}
                      </span>
                      <p className="text-sm text-muted-foreground font-normal mt-1">
                        {currentMonth.rotatingCategory.description}
                      </p>
                    </Label>
                  </div>
                </div>

                {/* Open category */}
                <div className="flex items-center space-x-3 p-4 rounded-lg border hover:border-primary/50 transition-colors">
                  <RadioGroupItem value="open" id="open" />
                  <div className="flex-1">
                    <Label htmlFor="open" className="cursor-pointer">
                      <span className="font-medium">{CATEGORY_TYPES.open.name}</span>
                      <p className="text-sm text-muted-foreground font-normal mt-1">
                        {CATEGORY_TYPES.open.description}
                      </p>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={prevStep}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={nextStep}
                disabled={
                  !form.categoryType ||
                  (form.categoryType === "fixed" && !form.fixedCategory)
                }
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Step 3: Metadata */}
        {step === "metadata" && (
          <Card>
            <CardHeader>
              <CardTitle>Photo details</CardTitle>
              <CardDescription>
                Add some context to help others appreciate your photo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="camera">Camera</Label>
                  <div className="relative">
                    <Camera className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="camera"
                      placeholder="e.g., Canon AE-1"
                      value={form.camera}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, camera: e.target.value }))
                      }
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="filmStock">Film stock</Label>
                  <div className="relative">
                    <Film className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="filmStock"
                      placeholder="e.g., Kodak Portra 400"
                      value={form.filmStock}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, filmStock: e.target.value }))
                      }
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    placeholder="e.g., Cuba Street, Wellington"
                    value={form.location}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, location: e.target.value }))
                    }
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Tell us about this photo..."
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, description: e.target.value }))
                  }
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (optional)</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="tags"
                      placeholder="Add a tag and press Enter"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                      className="pl-10"
                      disabled={form.tags.length >= 5}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addTag}
                    disabled={!tagInput.trim() || form.tags.length >= 5}
                  >
                    Add
                  </Button>
                </div>
                {form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="gap-1">
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Up to 5 tags • {5 - form.tags.length} remaining
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={prevStep}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button onClick={nextStep}>
                Review
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Step 4: Review */}
        {step === "review" && (
          <Card>
            <CardHeader>
              <CardTitle>Review your submission</CardTitle>
              <CardDescription>
                Make sure everything looks good before submitting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Image preview */}
              {form.imagePreview && (
                <div className="relative aspect-[4/3] bg-muted rounded-lg overflow-hidden">
                  <Image
                    src={form.imagePreview}
                    alt="Preview"
                    fill
                    className="object-contain"
                  />
                </div>
              )}

              {/* Details */}
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-medium">
                    {form.categoryType === "fixed"
                      ? `Fixed: ${FIXED_CATEGORIES.find((c) => c.id === form.fixedCategory)?.name}`
                      : form.categoryType === "rotating"
                      ? `Rotating: ${currentMonth.rotatingCategory.name}`
                      : "Open"}
                  </span>
                </div>

                {form.camera && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Camera</span>
                    <span>{form.camera}</span>
                  </div>
                )}

                {form.filmStock && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Film stock</span>
                    <span>{form.filmStock}</span>
                  </div>
                )}

                {form.location && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Location</span>
                    <span>{form.location}</span>
                  </div>
                )}

                {form.description && (
                  <div className="py-2 border-b">
                    <span className="text-muted-foreground block mb-1">
                      Description
                    </span>
                    <p className="text-sm">{form.description}</p>
                  </div>
                )}

                {form.tags.length > 0 && (
                  <div className="py-2">
                    <span className="text-muted-foreground block mb-2">Tags</span>
                    <div className="flex flex-wrap gap-2">
                      {form.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Alert>
                <Upload className="h-4 w-4" />
                <AlertTitle>Ready to submit</AlertTitle>
                <AlertDescription>
                  By submitting, you confirm this is an original film photograph
                  and you have the rights to share it.
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={prevStep}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit photo
                    <CheckCircle className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
