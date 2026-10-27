"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { createClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";

export type UserRole = "user" | "organizer" | "business" | "admin" | null;

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  const revision = useRef(0);

  const applySession = useCallback(
    async (session: Session | null) => {
      const current = ++revision.current;
      try {
        if (!session) {
          setUser(null);
          return;
        }
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role, name")
          .eq("id", session.user.id)
          .single();
        if (current !== revision.current) return;
        if (error)
          console.error("Unable to load account profile:", error.message);
        const role = profile?.role;
        setUser({
          id: session.user.id,
          email: session.user.email ?? "",
          role: ["user", "business", "organizer", "admin"].includes(role)
            ? (role as UserRole)
            : "user",
          name: profile?.name ?? undefined,
        });
      } catch (error) {
        if (current === revision.current) setUser(null);
        console.error("Unable to load account:", error);
      } finally {
        if (current === revision.current) setLoading(false);
      }
    },
    [supabase],
  );

  const fetchSession = useCallback(async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) throw error;
      await applySession(session);
    } catch (error) {
      ++revision.current;
      setUser(null);
      setLoading(false);
      console.error("Unable to refresh account:", error);
    }
  }, [supabase, applySession]);

  useEffect(() => {
    let active = true;
    const sessionRevision = revision;
    const startupTimeout = setTimeout(() => {
      if (active) setLoading(false);
    }, 20000);
    let timer: ReturnType<typeof setTimeout> | undefined;
    // Supabase emits INITIAL_SESSION. Defer DB work until the auth callback
    // returns so it cannot deadlock on the client's auth lock.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        clearTimeout(startupTimeout);
        ++revision.current;
        if (!session) {
          setUser(null);
          setLoading(false);
        }
        clearTimeout(timer);
        timer = setTimeout(() => {
          if (active) void applySession(session);
        }, 0);
      },
    );
    return () => {
      active = false;
      ++sessionRevision.current;
      clearTimeout(startupTimeout);
      clearTimeout(timer);
      subscription.unsubscribe();
    };
  }, [supabase, applySession]);

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    ++revision.current;
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, logout, refreshUser: fetchSession }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
