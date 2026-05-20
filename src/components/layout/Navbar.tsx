'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';

export function Navbar() {
  const { user, logout, loading } = useAuth();

  const getDashboardLink = () => {
    switch (user?.role) {
      case 'organizer':
        return '/organizer/dashboard';
      case 'business':
        return '/business/dashboard';
      case 'admin':
        return '/admin/dashboard';
      case 'user':
      default:
        return '/user/dashboard';
    }
  };

  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur-lg bg-background/80 border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-2xl tracking-tighter text-primary">
            VendoraX
          </Link>
          <div className="hidden md:flex items-center gap-4 text-sm font-medium">
            <Link href="/events" className="hover:text-primary transition-colors">
              Explore Events
            </Link>
            <Link href="/events" className="hover:text-primary transition-colors">
              Categories
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {loading ? (
            <div className="flex gap-4">
              <div className="w-20 h-10 bg-muted animate-pulse rounded-md"></div>
              <div className="w-20 h-10 bg-muted animate-pulse rounded-md"></div>
            </div>
          ) : user ? (
            <>
              <Link href={getDashboardLink()}>
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Button variant="outline" onClick={logout}>Logout</Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link href="/signup">
                <Button variant="primary">Sign up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
