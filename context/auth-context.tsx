"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { User, UserRole } from "@/types";

// Mock users for development - switch between these to test different roles
const MOCK_USERS: Record<string, User> = {
  photographer: {
    id: "user_001",
    email: "sarah@example.com",
    displayName: "Sarah Chen",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    bio: "Wellington-based photographer. Shooting mostly on Kodak Portra.",
    role: "photographer",
    createdAt: "2024-06-15T10:00:00+12:00",
    deletedAt: null,
  },
  admin: {
    id: "user_006",
    email: "admin@wellyonfilm.nz",
    displayName: "Admin",
    avatarUrl: null,
    bio: null,
    role: "admin",
    createdAt: "2024-01-01T00:00:00+13:00",
    deletedAt: null,
  },
};

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string) => Promise<void>;
  signUp: (email: string, displayName: string) => Promise<void>;
  signOut: () => void;
  // Dev helpers
  switchUser: (role: UserRole | "guest") => void;
  availableRoles: (UserRole | "guest")[];
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
  // Initial user for testing - default to signed out
  initialRole?: UserRole | "guest";
}

export function AuthProvider({
  children,
  initialRole = "guest",
}: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(
    initialRole === "guest" ? null : MOCK_USERS[initialRole] || null
  );
  const [isLoading, setIsLoading] = useState(false);

  const isAuthenticated = user !== null;
  const availableRoles: (UserRole | "guest")[] = ["guest", "photographer", "admin"];

  const signIn = useCallback(async (email: string) => {
    setIsLoading(true);
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // For mock: sign in as photographer by default
    setUser(MOCK_USERS.photographer);
    setIsLoading(false);
  }, []);

  const signUp = useCallback(async (email: string, displayName: string) => {
    setIsLoading(true);
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // For mock: create a new "photographer" user
    const newUser: User = {
      id: `user_${Date.now()}`,
      email,
      displayName,
      avatarUrl: null,
      bio: null,
      role: "photographer",
      createdAt: new Date().toISOString(),
      deletedAt: null,
    };
    setUser(newUser);
    setIsLoading(false);
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
  }, []);

  // Dev helper to switch between user types
  const switchUser = useCallback((role: UserRole | "guest") => {
    if (role === "guest") {
      setUser(null);
    } else {
      setUser(MOCK_USERS[role] || null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        signIn,
        signUp,
        signOut,
        switchUser,
        availableRoles,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
