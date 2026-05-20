'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { blogs } from '@/lib/blogs';
import { ArrowLeft, Calendar, Clock, MapPin, Tag, Sparkles, Send } from 'lucide-react';
import Link from 'next/link';

export default function BlogDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const blog = blogs.find(b => b.id === id);

  if (!blog) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Article Not Found</h2>
            <p className="text-muted-foreground">The article you are looking for does not exist or has been moved.</p>
            <Button variant="primary" onClick={() => router.push('/blog')}>
              Back to Blog
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl text-left">
          
          {/* Back button */}
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors mb-8 cursor-pointer">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {/* Article Header */}
          <article className="space-y-8">
            <div className="space-y-4">
              <span 
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                style={{ color: blog.cityColor, background: `${blog.cityColor}15` }}
              >
                <MapPin className="w-3.5 h-3.5" />
                {blog.tag}
              </span>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-foreground">
                {blog.title}
              </h1>

              {/* Author & Meta */}
              <div className="flex flex-wrap items-center justify-between gap-4 py-6 border-y border-border">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg"
                    style={{ background: blog.cityBg }}
                  >
                    {blog.author[0]}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-foreground">{blog.author}</p>
                    <p className="text-xs text-muted-foreground">{blog.authorRole}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {blog.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {blog.readTime}
                  </span>
                </div>
              </div>
            </div>

            {/* Featured Visual Banner / City Card */}
            <div 
              className="w-full h-64 md:h-80 rounded-3xl relative overflow-hidden flex items-center justify-center text-white shadow-lg"
              style={{ background: blog.cityBg }}
            >
              <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />
              <div className="relative z-10 text-center space-y-3">
                <span className="text-7xl block animate-bounce duration-1000">{blog.image}</span>
                <h3 className="text-2xl font-bold tracking-wider">{blog.city} Showcase</h3>
              </div>
            </div>

            {/* City Event Stats Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {blog.stats.map((stat, idx) => (
                <Card key={idx} className="border border-border/80 hover:border-primary/30 transition-colors">
                  <CardContent className="p-4 text-center">
                    <p className="text-sm font-bold text-foreground">{stat}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Article Content */}
            <div className="space-y-6 text-base sm:text-lg text-muted-foreground leading-relaxed">
              {blog.content.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {/* Keywords / Tags */}
            <div className="flex flex-wrap gap-2 pt-6">
              {blog.keywords.map((keyword) => (
                <span 
                  key={keyword}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-muted text-muted-foreground hover:text-foreground text-xs font-semibold rounded-lg transition-colors"
                >
                  <Tag className="w-3 h-3" />
                  #{keyword}
                </span>
              ))}
            </div>

            {/* Marketplace Call to Action Box */}
            <Card className="border-2 border-primary/20 bg-primary/5 rounded-2xl overflow-hidden mt-12">
              <CardContent className="p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                <div className="space-y-2">
                  <h3 className="text-lg sm:text-xl font-bold text-foreground flex items-center justify-center md:justify-start gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Exhibit in {blog.city}
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Looking to book stalls or sponsor the next big festival or corporate summit in {blog.city}? Join VendoraX today to secure premium spaces.
                  </p>
                </div>
                <Button 
                  variant="primary" 
                  onClick={() => router.push('/events')}
                  className="shrink-0 gap-1.5 px-6 shadow-md"
                >
                  Browse Stalls <Send className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>

          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
