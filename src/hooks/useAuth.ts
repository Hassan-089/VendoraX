"use client";

import { useAuthContext } from "@/context/AuthContext";

export type { UserRole } from "@/context/AuthContext";

export function useAuth() {
  const { user, loading, logout, refreshUser } = useAuthContext();
  return { user, loading, logout, refreshUser };
}
