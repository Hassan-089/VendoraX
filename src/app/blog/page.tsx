'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BlogSection } from '@/components/home/BlogSection';

export default function BlogIndexPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-16">
        <div className="bg-gradient-to-b from-primary/5 via-transparent to-transparent py-10">
          <div className="container mx-auto px-4 max-w-7xl text-left">
            <nav className="text-xs text-muted-foreground mb-4">
              <span className="hover:text-primary transition-colors cursor-pointer" onClick={() => window.location.href = '/'}>Home</span>
              <span className="mx-2">&gt;</span>
              <span className="font-semibold text-foreground">Blog</span>
            </nav>
          </div>
        </div>
        <BlogSection showCta={false} />
      </main>
      <Footer />
    </div>
  );
}
