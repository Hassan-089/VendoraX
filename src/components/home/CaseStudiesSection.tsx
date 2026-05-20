import React from 'react';
import Link from 'next/link';

const caseStudies = [
  {
    id: 'events-by-amna',
    company: 'Events by Amna',
    location: 'Lahore, Punjab',
    logo: 'EA',
    logoGradient: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
    industry: 'Weddings & Corporate',
    founded: '2015',
    tagline: 'Lahore\'s Most Trusted Wedding & Corporate Event Company',
    challenge:
      'Events by Amna was struggling to connect with brands willing to sponsor their high-profile corporate dinners and product launches in Lahore. Their sales cycle was slow and sponsor outreach was entirely manual.',
    solution:
      'By listing on VendoraX, they gained access to 200+ verified brands actively seeking sponsorship opportunities at Lahore events. Their team used VendoraX\'s proposal tools to send polished decks in minutes.',
    results: [
      { metric: '340%', label: 'Increase in Sponsor Inquiries' },
      { metric: '18', label: 'New Brand Partners in 3 Months' },
      { metric: '₨4.2M', label: 'Additional Revenue Generated' },
    ],
    quote: '"VendoraX transformed how we approach sponsorships. We went from cold emails to warm inbound leads within weeks."',
    quotePerson: 'Amna Raza, Founder',
    events: ['Lahore Business Summit', 'DHA Wedding Expo', 'Gulberg Corporate Gala'],
    color: '#1e3a8a',
  },
  {
    id: 'planners-guild-lahore',
    company: 'Planners Guild Lahore',
    location: 'DHA Phase 5, Lahore',
    logo: 'PG',
    logoGradient: 'linear-gradient(135deg, #7c3aed, #a855f7)',
    industry: 'Food Festivals & Expos',
    founded: '2018',
    tagline: 'Lahore\'s Premier Food Festival & Expo Organizers',
    challenge:
      'Planners Guild ran massive food festivals at Expo Centre Lahore attracting 30,000+ attendees, but their stall-filling process was chaotic — they relied on WhatsApp groups to coordinate 80+ food brands.',
    solution:
      'VendoraX\'s stall management system allowed them to list all their upcoming events with real-time stall availability. Brands could browse, apply, and book stalls digitally — reducing admin time by 70%.',
    results: [
      { metric: '70%', label: 'Less Admin Overhead' },
      { metric: '95%', label: 'Stall Occupancy Rate' },
      { metric: '₨8.7M', label: 'Revenue from Digital Stall Bookings' },
    ],
    quote: '"Managing stalls for 80 brands used to take weeks. With VendoraX, we get fully booked in 3 days."',
    quotePerson: 'Bilal Tahir, Operations Head',
    events: ['Lahore Eat Festival', 'DHA Food Week', 'Expo Centre Trade Fair'],
    color: '#7c3aed',
  },
  {
    id: 'the-event-co-lahore',
    company: 'The Event Co. Lahore',
    location: 'Model Town, Lahore',
    logo: 'EC',
    logoGradient: 'linear-gradient(135deg, #dc2626, #f97316)',
    industry: 'Music & Entertainment',
    founded: '2019',
    tagline: 'Lahore\'s Fastest Growing Entertainment Events Company',
    challenge:
      'As one of the organizers behind popular concerts and music nights in Lahore, The Event Co. needed to attract premium beverage, lifestyle, and tech brands for sponsorships but lacked a professional platform to showcase their reach.',
    solution:
      'VendoraX enabled them to build a comprehensive event profile with audience demographics, past attendee data, and social proof. Premium brands could instantly see the value and apply directly.',
    results: [
      { metric: '5x', label: 'More Brand Sponsorship Applications' },
      { metric: '₨12M', label: 'Sponsorship Deals Closed via Platform' },
      { metric: '92%', label: 'Brand Satisfaction Score' },
    ],
    quote: '"Before VendoraX, brands wouldn\'t take us seriously. Now we\'re getting calls from multinational companies."',
    quotePerson: 'Saad Malik, CEO',
    events: ['Lahore Music Night', 'F-10 Cultural Fest', 'Liberty Roundabout Live'],
    color: '#dc2626',
  },
];

export function CaseStudiesSection() {
  return (
    <section className="case-studies-section py-28 relative overflow-hidden">
      {/* Decorative grid */}
      <div className="case-studies-grid-bg" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 cs-badge mb-4">
            <span>⭐</span>
            <span>Success Stories</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-5">
            How Lahore&apos;s Best Event Organizers{' '}
            <span className="cs-heading-gradient">Grow with VendoraX</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real results from real event companies in Lahore — see how VendoraX transforms sponsorship &amp; stall management.
          </p>
        </div>

        {/* Case Study Cards */}
        <div className="space-y-10">
          {caseStudies.map((cs, i) => (
            <div
              key={cs.id}
              className={`cs-card ${i % 2 === 1 ? 'cs-card-reverse' : ''}`}
            >
              {/* Left: Company Info */}
              <div className="cs-info-panel">
                <div className="cs-logo-wrap">
                  <div className="cs-logo" style={{ background: cs.logoGradient }}>
                    {cs.logo}
                  </div>
                  <div>
                    <h3 className="cs-company-name">{cs.company}</h3>
                    <div className="cs-location">📍 {cs.location}</div>
                  </div>
                </div>

                <p className="cs-tagline">{cs.tagline}</p>

                <div className="cs-meta-row">
                  <div className="cs-meta-item">
                    <span className="cs-meta-label">Industry</span>
                    <span className="cs-meta-value">{cs.industry}</span>
                  </div>
                  <div className="cs-meta-item">
                    <span className="cs-meta-label">Founded</span>
                    <span className="cs-meta-value">{cs.founded}</span>
                  </div>
                </div>

                <div className="cs-events-list">
                  <div className="cs-meta-label mb-2">Key Events</div>
                  {cs.events.map((ev) => (
                    <span key={ev} className="cs-event-tag" style={{ color: cs.color, borderColor: `${cs.color}30`, background: `${cs.color}08` }}>
                      {ev}
                    </span>
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="cs-quote" style={{ borderColor: cs.color }}>
                  <p className="cs-quote-text">{cs.quote}</p>
                  <footer className="cs-quote-person" style={{ color: cs.color }}>— {cs.quotePerson}</footer>
                </blockquote>
              </div>

              {/* Right: Results */}
              <div className="cs-results-panel">
                <div className="cs-results-header">
                  <div className="cs-challenge-block">
                    <h4 className="cs-block-title">🔴 The Challenge</h4>
                    <p className="cs-block-text">{cs.challenge}</p>
                  </div>
                  <div className="cs-solution-block">
                    <h4 className="cs-block-title">✅ The VendoraX Solution</h4>
                    <p className="cs-block-text">{cs.solution}</p>
                  </div>
                </div>

                {/* Metrics */}
                <div className="cs-metrics-grid">
                  {cs.results.map((r) => (
                    <div key={r.label} className="cs-metric-card" style={{ borderColor: `${cs.color}30` }}>
                      <div className="cs-metric-value" style={{ color: cs.color }}>{r.metric}</div>
                      <div className="cs-metric-label">{r.label}</div>
                    </div>
                  ))}
                </div>

                <Link href={`/case-studies/${cs.id}`} className="cs-read-more" style={{ background: cs.logoGradient }}>
                  Read Full Case Study →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="cs-bottom-cta">
          <div className="cs-cta-content">
            <h3 className="cs-cta-title">Ready to be our next success story?</h3>
            <p className="cs-cta-subtitle">Join 500+ event organizers across Pakistan who grow their revenue with VendoraX.</p>
          </div>
          <Link href="/signup" className="cs-cta-btn">
            Start Free Today →
          </Link>
        </div>
      </div>
    </section>
  );
}
