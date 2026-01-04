"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Camera, User, Bug } from "lucide-react";
import { cn } from "@/lib/utils";
import { SITE_CONFIG, NAV_LINKS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/auth-context";

export function SiteHeader() {
  const pathname = usePathname();
  const { user, isAuthenticated, signOut, switchUser, availableRoles } = useAuth();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Camera className="h-6 w-6" />
          <span className="font-semibold text-lg hidden sm:inline-block">
            {SITE_CONFIG.name}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.main.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-foreground/80",
                isActive(link.href)
                  ? "text-foreground"
                  : "text-foreground/60"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth / User Menu */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated && user ? (
            <>
              <Button asChild variant="default" size="sm">
                <Link href="/submit">Submit</Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                    <span className="sr-only">User menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.displayName}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  {user.role === "admin" && (
                    <>
                      <DropdownMenuSeparator />
                      {NAV_LINKS.admin.map((link) => (
                        <DropdownMenuItem key={link.href} asChild>
                          <Link href={link.href}>{link.label}</Link>
                        </DropdownMenuItem>
                      ))}
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button asChild variant="default" size="sm">
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Dev Role Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Bug className="h-4 w-4" />
              <span className="hidden sm:inline">Dev</span>
              <Badge variant="secondary" className="text-xs">
                {user?.role || "guest"}
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Switch Role</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {availableRoles.map((role) => (
              <DropdownMenuItem
                key={role}
                onClick={() => switchUser(role)}
                className={cn(
                  "capitalize",
                  (user?.role || "guest") === role && "bg-accent"
                )}
              >
                {role}
                {(user?.role || "guest") === role && " (current)"}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px]">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                {SITE_CONFIG.name}
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-4 mt-8">
              {NAV_LINKS.main.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-lg font-medium transition-colors hover:text-foreground/80",
                    isActive(link.href)
                      ? "text-foreground"
                      : "text-foreground/60"
                  )}
                >
                  {link.label}
                </Link>
              ))}

              <div className="h-px bg-border my-2" />

              {isAuthenticated && user ? (
                <>
                  <Link
                    href="/submit"
                    className="text-lg font-medium text-foreground"
                  >
                    Submit
                  </Link>
                  <Link
                    href="/profile"
                    className={cn(
                      "text-lg font-medium transition-colors hover:text-foreground/80",
                      isActive("/profile")
                        ? "text-foreground"
                        : "text-foreground/60"
                    )}
                  >
                    Profile
                  </Link>
                  {user.role === "admin" && (
                    <>
                      <div className="h-px bg-border my-2" />
                      <p className="text-sm text-muted-foreground">Admin</p>
                      {NAV_LINKS.admin.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={cn(
                            "text-lg font-medium transition-colors hover:text-foreground/80",
                            isActive(link.href)
                              ? "text-foreground"
                              : "text-foreground/60"
                          )}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </>
                  )}
                  <div className="h-px bg-border my-2" />
                  <button
                    onClick={signOut}
                    className="text-lg font-medium text-foreground/60 hover:text-foreground/80 text-left"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    className="text-lg font-medium text-foreground/60"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    className="text-lg font-medium text-foreground"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
