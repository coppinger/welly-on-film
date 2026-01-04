// Site configuration
export const SITE_CONFIG = {
  name: "Welly on Film",
  description: "Wellington's analogue film photography community",
  tagline: "A hyper-local, not-for-profit analogue film magazine",
  location: "Wellington, New Zealand",
  url: "https://wellyonfilm.nz", // Update when deployed
} as const;

// Navigation links
export const NAV_LINKS = {
  main: [
    { label: "This Month", href: "/this-month/brief" },
    { label: "Archive", href: "/archive" },
    { label: "About", href: "/about" },
  ],
  auth: [
    { label: "Sign In", href: "/sign-in" },
    { label: "Sign Up", href: "/sign-up" },
  ],
  user: [
    { label: "Submit", href: "/submit" },
    { label: "Profile", href: "/profile" },
  ],
  admin: [
    { label: "Judging", href: "/judging" },
    { label: "Moderation", href: "/moderation" },
    { label: "Raffle", href: "/raffle" },
    { label: "Settings", href: "/settings" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/legal/privacy" },
    { label: "Terms of Use", href: "/legal/terms" },
  ],
} as const;

// Submission constraints
export const SUBMISSION_LIMITS = {
  maxPerMonth: 3,
  minImageDimension: 1500, // px on longest edge
  maxImageDimension: 8000, // px on longest edge
  maxFileSizeMB: 50,
  acceptedFormats: ["image/jpeg", "image/png", "image/tiff"] as const,
  acceptedExtensions: [".jpg", ".jpeg", ".png", ".tiff", ".tif"] as const,
} as const;

// Monthly schedule (days of month)
export const MONTHLY_SCHEDULE = {
  submissionsOpenDay: 1,
  submissionsCloseDay: 25,
  judgingEndsDay: 28,
  releaseWeek: 1, // First week of next month
} as const;

// Fixed categories (permanent, one photo selected from each)
export const FIXED_CATEGORIES = [
  { id: "love", name: "Love", description: "Moments of connection and affection" },
  { id: "nature", name: "Nature", description: "Wellington's natural beauty" },
  { id: "human", name: "Human", description: "People and portraits" },
  { id: "art", name: "Art", description: "Creative and artistic expressions" },
  { id: "architecture", name: "Architecture", description: "Buildings and urban structures" },
] as const;

// Category types
export const CATEGORY_TYPES = {
  fixed: {
    id: "fixed",
    name: "Fixed",
    description: "Consistent categories for intentional shooting. One photo selected from each sub-category.",
    photoCount: 5,
  },
  rotating: {
    id: "rotating",
    name: "Rotating",
    description: "A fresh prompt each month to challenge photographers.",
    photoCount: 5,
  },
  open: {
    id: "open",
    name: "Open",
    description: "Anything goes. For shots that don't fit elsewhere but deserve to be seen.",
    photoCount: 5,
  },
} as const;

// Featured counts for print magazine
export const FEATURED_COUNT = {
  fixed: 5, // 1 per sub-category
  rotating: 5,
  open: 5,
  total: 15,
} as const;

// Comment constraints
export const COMMENT_LIMITS = {
  maxLength: 500,
} as const;

// User roles
export const USER_ROLES = {
  photographer: "photographer",
  admin: "admin",
} as const;

// Month statuses
export const MONTH_STATUS = {
  open: "open",
  judging: "judging",
  closed: "closed",
} as const;

// Judge action types
export const JUDGE_ACTIONS = {
  pass: "pass",
  shortlist: "shortlist",
  flag: "flag",
} as const;

// Gallery grid configuration
export const GALLERY_GRID = {
  mobile: 2,
  tablet: 3,
  desktop: 4,
} as const;

// Image variants (for processing pipeline - Phase 2)
export const IMAGE_VARIANTS = {
  thumbnail: { maxDimension: 400, quality: 80, format: "webp" },
  medium: { maxDimension: 1200, quality: 85, format: "webp" },
  large: { maxDimension: 2400, quality: 90, format: "webp" },
  original: { quality: 100, format: "original" },
} as const;

// Unsplash configuration (for placeholder images)
export const UNSPLASH_CONFIG = {
  baseUrl: "https://api.unsplash.com",
  defaultQuery: "film photography wellington",
  fallbackQuery: "analog film photography",
  photosPerPage: 30,
} as const;

// Timezone (Wellington)
export const TIMEZONE = "Pacific/Auckland" as const;

// Social media links
export const SOCIAL_LINKS = {
  instagram: "https://instagram.com/wellyonfilm",
} as const;
