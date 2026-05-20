'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { useAuth } from '@/hooks/useAuth';

interface DashboardLayoutProps {
  children: React.ReactNode;
  allowedRoles?: ('user' | 'organizer' | 'business' | 'admin')[];
}

export function DashboardLayout({ children, allowedRoles }: DashboardLayoutProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (allowedRoles && !allowedRoles.includes(user.role as any)) {
        router.push('/login'); // Basic unauthorized redirect
      }
    }
  }, [user, loading, router, allowedRoles]);

  if (loading || !user) {
    return <div className="flex-1 flex items-center justify-center min-h-[50vh]">Loading...</div>;
  }

  return (
    <div className="flex flex-1 w-full max-w-7xl mx-auto">
      <Sidebar role={user.role} />
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
