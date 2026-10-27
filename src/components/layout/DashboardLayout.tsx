"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { useAuth } from "@/hooks/useAuth";

interface DashboardLayoutProps {
  children: React.ReactNode;
  allowedRoles?: ("user" | "organizer" | "business" | "admin")[];
}

export function DashboardLayout({
  children,
  allowedRoles,
}: DashboardLayoutProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (
        allowedRoles &&
        (!user.role || !allowedRoles.includes(user.role))
      ) {
        router.replace(`/${user.role || "user"}/dashboard`);
      }
    }
  }, [user, loading, router, allowedRoles]);

  if (
    loading ||
    !user ||
    (allowedRoles && (!user.role || !allowedRoles.includes(user.role)))
  ) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row flex-1 w-full max-w-7xl mx-auto">
      <Sidebar role={user.role} />
      <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-x-auto">
        {children}
      </div>
    </div>
  );
}
