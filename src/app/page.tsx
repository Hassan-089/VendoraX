import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { FeaturedEvents } from '@/components/events/FeaturedEvents';
import { BlogSection } from '@/components/home/BlogSection';
import { CaseStudiesSection } from '@/components/home/CaseStudiesSection';
import { FAQSection } from '@/components/home/FAQSection';
import { StatsSection } from '@/components/home/StatsSection';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'VendoraX — Pakistan\'s #1 Event Sponsorship & Stall Marketplace',
  description:
    'Discover popular events in Lahore, Karachi, and Islamabad. VendoraX connects event organizers with brands for sponsorships, stall bookings, and digital packages. Join 500+ organizers today.',
  keywords: [
    'popular events in lahore',
    'popular events in karachi',
    'popular events in islamabad',
    'event sponsorship pakistan',
    'event organizer lahore',
    'stall booking events pakistan',
    'brand sponsorship events',
    'vendorax',
  ],
};

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* ===== HERO SECTION ===== */}
      <section className="hero-section relative px-4 py-32 md:py-44 overflow-hidden">
        {/* Video Background */}
        <div className="hero-video-wrapper">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="hero-video"
            poster="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1920&q=80"
          >
            <source src="https://videos.pexels.com/video-files/3045163/3045163-uhd_2560_1440_24fps.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Dark cinematic overlay */}
        <div className="hero-overlay" />
        <div className="hero-overlay-gradient" />

        {/* Animated floating light particles */}
        <div className="hero-particles">
          <div className="hero-particle hero-particle-1" />
          <div className="hero-particle hero-particle-2" />
          <div className="hero-particle hero-particle-3" />
          <div className="hero-particle hero-particle-4" />
          <div className="hero-particle hero-particle-5" />
          <div className="hero-particle hero-particle-6" />
          <div className="hero-particle hero-particle-7" />
          <div className="hero-particle hero-particle-8" />
        </div>

        {/* Animated glow rings */}
        <div className="hero-glow-ring hero-glow-ring-1" />
        <div className="hero-glow-ring hero-glow-ring-2" />

        <div className="container mx-auto text-center max-w-5xl relative z-10">
          {/* Live badge */}
          <div className="hero-live-badge">
            <span className="hero-live-dot" />
            <span>Live Events Listed Daily Across Pakistan</span>
          </div>

          <h1 className="hero-title">
            Connect Brands With{' '}
            <span className="hero-title-gradient">Events</span>{' '}
            Across Pakistan
          </h1>

          <p className="hero-subtitle">
            The premier marketplace for event organizers, businesses, and attendees to discover,
            sponsor, and experience incredible moments — from popular events in Lahore to
            Karachi and Islamabad.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <Link href="/events">
              <Button size="lg" className="hero-btn-primary h-14 text-lg px-10">
                🎪 Explore Events
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="outline" size="lg" className="hero-btn-outline h-14 text-lg px-10">
                📋 List Your Event
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="hero-trust-row">
            {[
              { icon: '✅', text: '500+ Verified Organizers' },
              { icon: '🏢', text: '2,400+ Active Events' },
              { icon: '💰', text: '₨280M+ in Deals Closed' },
            ].map((item) => (
              <div key={item.text} className="hero-trust-item">
                <span>{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <StatsSection />

      {/* ===== FEATURED EVENTS ===== */}
      <FeaturedEvents />

      {/* ===== BENEFITS SECTION ===== */}
      <section className="benefits-section py-28 relative overflow-hidden">
        <div className="benefits-bg" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 benefits-badge mb-4">
              <span>🚀</span>
              <span>Why VendoraX?</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-5">
              Built for <span className="benefits-heading-gradient">Pakistan&apos;s Event Industry</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Whether you organize festivals in Lahore or launch products in Karachi — VendoraX is your growth engine.
            </p>
          </div>

          <div className="benefits-grid">
            {/* For Organizers */}
            <div className="benefit-card benefit-card-blue">
              <div className="benefit-card-header">
                <div className="benefit-card-icon">🎪</div>
                <h3 className="benefit-card-title">For Event Organizers</h3>
              </div>
              <ul className="benefit-list">
                {[
                  'List unlimited events with our Pro plan',
                  'Sell stalls, sponsorships & digital packages to brands directly',
                  'Real-time stall availability & booking management',
                  'Track engagement metrics and manage applications in one dashboard',
                  'AI-powered brand matching for your event category',
                ].map((item) => (
                  <li key={item} className="benefit-item">
                    <span className="benefit-check benefit-check-blue">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/signup?role=organizer" className="benefit-cta benefit-cta-blue">
                Start as Organizer →
              </Link>
            </div>

            {/* For Brands */}
            <div className="benefit-card benefit-card-purple">
              <div className="benefit-card-header">
                <div className="benefit-card-icon">🏢</div>
                <h3 className="benefit-card-title">For Brands & Businesses</h3>
              </div>
              <ul className="benefit-list">
                {[
                  'Discover events targeted to your precise demographic',
                  'Filter by city — Lahore, Karachi, Islamabad & more',
                  'Apply for stalls and manage bookings seamlessly',
                  'Escrow-based secure payments — pay with confidence',
                  'Boost ROI by partnering with trending high-traffic events',
                ].map((item) => (
                  <li key={item} className="benefit-item">
                    <span className="benefit-check benefit-check-purple">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/signup?role=business" className="benefit-cta benefit-cta-purple">
                Start as a Brand →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CASE STUDIES ===== */}
      <CaseStudiesSection />

      {/* ===== BLOG SECTION ===== */}
      <BlogSection />

      {/* ===== FAQ SECTION ===== */}
      <FAQSection />

      {/* ===== TRUSTED BY SECTION ===== */}
      <section className="trusted-section py-20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="trusted-title">Trusted by Leading Pakistani &amp; Global Brands</h2>
          </div>
          <div className="trusted-logos-row">
            {[
              { src: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d2/Pizza_Hut_logo.svg/512px-Pizza_Hut_logo.svg.png', alt: 'Pizza Hut', h: 'h-10' },
              { src: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/bf/KFC_logo.svg/512px-KFC_logo.svg.png', alt: 'KFC', h: 'h-12' },
              { src: "https://upload.wikimedia.org/wikipedia/en/thumb/3/36/McDonald%27s_Golden_Arches.svg/512px-McDonald%27s_Golden_Arches.svg.png", alt: "McDonald's", h: 'h-10' },
              { src: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/512px-Starbucks_Corporation_Logo_2011.svg.png', alt: 'Starbucks', h: 'h-12' },
              { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Burger_King_2020.svg/512px-Burger_King_2020.svg.png', alt: 'Burger King', h: 'h-12' },
            ].map((logo) => (
              <img
                key={logo.alt}
                src={logo.src}
                alt={logo.alt}
                className={`${logo.h} object-contain grayscale hover:grayscale-0 transition-all duration-500 opacity-60 hover:opacity-100`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA SECTION ===== */}
      <section className="final-cta-section py-28 relative overflow-hidden">
        <div className="final-cta-bg" />
        <div className="final-cta-blob-1" />
        <div className="final-cta-blob-2" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="final-cta-title">
            Your Event Deserves to Be Seen
          </h2>
          <p className="final-cta-subtitle">
            Join 500+ event organizers from Lahore, Karachi, and Islamabad who use VendoraX to connect with the right brands and fill every stall.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup?role=organizer">
              <Button size="lg" className="final-cta-btn-primary h-14 text-lg px-10">
                🚀 Get Started Free
              </Button>
            </Link>
            <Link href="/events">
              <Button variant="outline" size="lg" className="final-cta-btn-outline h-14 text-lg px-10">
                🎪 Browse Events
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
