import React from 'react';
import Link from 'next/link';
import { blogs } from '@/lib/blogs';

interface BlogSectionProps {
  showCta?: boolean;
}

export function BlogSection({ showCta = true }: BlogSectionProps) {
  return (
    <section className="blog-section py-28 relative overflow-hidden">
      {/* Background decoration */}
      <div className="blog-bg-orb blog-bg-orb-1" />
      <div className="blog-bg-orb blog-bg-orb-2" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 blog-badge mb-4">
            <span className="blog-badge-dot" />
            <span>Latest Insights</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-5">
            Events &amp; Insights <span className="blog-heading-gradient">Across Pakistan</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your go-to guide for the most popular events in Lahore, Karachi, and Islamabad — curated for brands, organizers, and event-goers.
          </p>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogs.map((blog, i) => (
            <article key={blog.id} className="blog-card" style={{ animationDelay: `${i * 0.1}s` }}>
              {/* Card Header with gradient */}
              <div className="blog-card-header" style={{ background: blog.cityBg }}>
                <div className="blog-card-emoji">{blog.image}</div>
                <div className="blog-card-stats">
                  {blog.stats.map((s) => (
                    <span key={s} className="blog-stat-pill">{s}</span>
                  ))}
                </div>
              </div>

              {/* Card Body */}
              <div className="blog-card-body">
                <div className="blog-city-tag" style={{ color: blog.cityColor, background: `${blog.cityColor}15` }}>
                  📍 {blog.tag}
                </div>

                <h3 className="blog-card-title">{blog.title}</h3>
                <p className="blog-card-excerpt">{blog.excerpt}</p>

                {/* Keywords */}
                <div className="blog-keywords">
                  {blog.keywords.map((kw) => (
                    <span key={kw} className="blog-keyword">#{kw.replace(/\s+/g, '')}</span>
                  ))}
                </div>

                {/* Footer */}
                <div className="blog-card-footer">
                  <div className="blog-author">
                    <div className="blog-author-avatar" style={{ background: blog.cityBg }}>
                      {blog.author[0]}
                    </div>
                    <div>
                      <div className="blog-author-name">{blog.author}</div>
                      <div className="blog-author-role">{blog.authorRole}</div>
                    </div>
                  </div>
                  <div className="blog-meta">
                    <span>{blog.date}</span>
                    <span className="blog-meta-dot">·</span>
                    <span>{blog.readTime}</span>
                  </div>
                </div>

                <Link href={`/blog/${blog.id}`} className="blog-read-more" style={{ color: blog.cityColor }}>
                  Read Full Article →
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        {showCta && (
          <div className="text-center mt-14">
            <Link href="/blog" className="blog-view-all-btn">
              View All Articles
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
