'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { UserRole } from '@/hooks/useAuth';
import { 
  Home, 
  Calendar, 
  Settings, 
  PlusCircle, 
  ClipboardList, 
  Bookmark, 
  Compass,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface SidebarProps {
  role: UserRole;
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  const navItems = {
    user: [
      { name: 'Dashboard', href: '/user/dashboard', icon: Home },
      { name: 'Browse Events', href: '/events', icon: Compass },
      { name: 'Saved Events', href: '/user/dashboard', icon: Bookmark }, // mock path
      { name: 'Profile', href: '/profile', icon: Settings },
    ],
    organizer: [
      { name: 'Dashboard', href: '/organizer/dashboard', icon: Home },
      { name: 'My Events', href: '/organizer/my-events', icon: Calendar },
      { name: 'Create Event', href: '/organizer/create-event', icon: PlusCircle },
      { name: 'Applications', href: '/organizer/applications', icon: ClipboardList },
      { name: 'Profile', href: '/profile', icon: Settings },
    ],
    business: [
      { name: 'Dashboard', href: '/business/dashboard', icon: Home },
      { name: 'Browse Events', href: '/events', icon: Compass },
      { name: 'My Applications', href: '/business/applications', icon: ClipboardList },
      { name: 'Profile', href: '/profile', icon: Settings },
    ],
    admin: [
      { name: 'Admin Dashboard', href: '/admin/dashboard', icon: Home },
      { name: 'Browse Events', href: '/events', icon: Compass },
      { name: 'Profile', href: '/profile', icon: Settings },
    ]
  };

  const links = role ? navItems[role as keyof typeof navItems] : [];

  return (
    <div className="w-64 border-r border-border bg-card flex flex-col min-h-[calc(100vh-4rem)]">
      <div className="flex-1 py-6 px-4">
        <div className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className={cn("mr-3 h-5 w-5", isActive ? "text-primary" : "text-muted-foreground")} />
                {link.name}
              </Link>
            );
          })}
        </div>
      </div>
      <div className="p-4 border-t border-border">
        <button 
          onClick={logout}
          className="flex w-full items-center px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
