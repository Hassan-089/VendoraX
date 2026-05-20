import React from 'react';
import Link from 'next/link';

const blogs = [
  {
    id: 'popular-events-lahore-2024',
    city: 'Lahore',
    cityColor: '#1e3a8a',
    cityBg: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
    tag: 'Popular Events in Lahore',
    title: 'Top 10 Popular Events in Lahore You Can\'t Miss in 2025',
    excerpt:
      'From the electrifying Lahore Literary Festival to massive food expos at Expo Centre, Lahore is Pakistan\'s undisputed capital of live events. Discover the biggest corporate expos, food festivals, music nights, and cultural melas that draw hundreds of thousands of visitors every year.',
    date: 'May 15, 2025',
    readTime: '6 min read',
    author: 'Zara Ahmed',
    authorRole: 'Event Correspondent',
    image: '🎪',
    stats: ['500K+ Attendees', '200+ Events/Year', '#1 Event City'],
    keywords: ['popular events in lahore', 'lahore festivals', 'lahore expo centre events'],
  },
  {
    id: 'popular-events-karachi-2024',
    city: 'Karachi',
    cityColor: '#7c3aed',
    cityBg: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
    tag: 'Popular Events in Karachi',
    title: 'Karachi\'s Most Popular Events: The Ultimate 2025 Guide',
    excerpt:
      'Karachi never sleeps, and neither does its event scene. From the Karachi Literature Festival at Beach Luxury Hotel to the massive Karachi Eat Food Festival, fashion weeks, and tech summits — this city hosts some of the most attended events in all of South Asia.',
    date: 'May 10, 2025',
    readTime: '8 min read',
    author: 'Hassan Mirza',
    authorRole: 'Culture Writer',
    image: '🌊',
    stats: ['1M+ Attendees', '350+ Events/Year', 'Business Capital'],
    keywords: ['popular events in karachi', 'karachi food festival', 'karachi literature festival'],
  },
  {
    id: 'popular-events-islamabad-2024',
    city: 'Islamabad',
    cityColor: '#059669',
    cityBg: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
    tag: 'Popular Events in Islamabad',
    title: 'Best Events in Islamabad 2025: Corporate, Cultural & More',
    excerpt:
      'Pakistan\'s capital is rapidly becoming a hotspot for premium events. From the Islamabad Literature Festival at PNCA to high-profile corporate summits at Pak-China Friendship Centre, diplomatic galas, and the beautiful Saidpur Village Cultural Mela — Islamabad is where exclusivity meets culture.',
    date: 'May 5, 2025',
    readTime: '5 min read',
    author: 'Ayesha Khan',
    authorRole: 'Lifestyle Editor',
    image: '🏛️',
    stats: ['300K+ Attendees', '150+ Events/Year', 'Capital of Culture'],
    keywords: ['popular events in islamabad', 'islamabad festivals', 'islamabad corporate events'],
  },
];

export function BlogSection() {
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
        <div className="text-center mt-14">
          <Link href="/blog" className="blog-view-all-btn">
            View All Articles
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
