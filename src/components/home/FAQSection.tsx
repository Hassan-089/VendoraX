'use client';

import React, { useState } from 'react';

const faqs = [
  {
    category: 'For Event Organizers',
    icon: '🎪',
    color: '#1e3a8a',
    questions: [
      {
        q: 'How do I list my event on VendoraX?',
        a: 'Simply sign up as an organizer, complete your profile, and use our step-by-step event wizard to list your event. You can add event details, stall packages, sponsorship tiers, and audience demographics. Listing your first event takes under 15 minutes.',
      },
      {
        q: 'What types of events can I list — is it only for Lahore, Karachi, and Islamabad?',
        a: 'VendoraX supports all major cities in Pakistan including Lahore, Karachi, Islamabad, Faisalabad, Multan, and more. Whether you\'re organizing a food festival, corporate summit, wedding expo, tech conference, or cultural mela — VendoraX has you covered.',
      },
      {
        q: 'How does the stall booking system work?',
        a: 'You define your stall layout, sizes, and pricing. Brands browse your event, see available stalls in real time, and submit applications. You review and approve bookings from your dashboard. Payment is handled securely through our platform.',
      },
      {
        q: 'Can I offer multiple sponsorship packages for a single event?',
        a: 'Absolutely. You can create Title Sponsor, Gold, Silver, and Digital packages — each with custom perks, exposure levels, and pricing. VendoraX\'s AI-powered recommendation engine also suggests the right brands for your event based on your audience profile.',
      },
    ],
  },
  {
    category: 'For Brands & Businesses',
    icon: '🏢',
    color: '#7c3aed',
    questions: [
      {
        q: 'How can my brand find the right events to sponsor in Lahore or Karachi?',
        a: 'Use VendoraX\'s smart discovery engine — filter events by city (Lahore, Karachi, Islamabad), industry, expected footfall, date, and budget. You\'ll see verified organizer profiles, past event data, and real audience demographics before committing.',
      },
      {
        q: 'What is the minimum budget needed to start sponsoring events?',
        a: 'There\'s no minimum — VendoraX has sponsorship opportunities starting from ₨25,000 for local events all the way to ₨5M+ for large-scale expos and festivals. You can filter specifically by budget range to find the perfect match for your marketing goals.',
      },
      {
        q: 'Is my payment secure on VendoraX?',
        a: 'Yes. VendoraX uses escrow-based payments — your funds are held securely and only released to the organizer after both parties confirm the agreement. We support all major Pakistani bank transfers, Easypaisa, JazzCash, and credit/debit cards.',
      },
    ],
  },
  {
    category: 'Platform & Pricing',
    icon: '💡',
    color: '#059669',
    questions: [
      {
        q: 'Is VendoraX free to use?',
        a: 'VendoraX is free to sign up for both organizers and brands. Organizers on the free plan can list up to 2 events. Our Pro plan (₨9,999/month) unlocks unlimited event listings, advanced analytics, priority placement, and dedicated account support.',
      },
      {
        q: 'Does VendoraX take a commission on sponsorship deals?',
        a: 'VendoraX charges a 5% platform fee on successfully completed transactions. This covers our payment processing, dispute resolution, and platform maintenance. There are no hidden charges — all fees are displayed transparently before any deal is closed.',
      },
      {
        q: 'What makes VendoraX different from just posting on social media?',
        a: 'Social media reaches everyone but converts very few. VendoraX connects you with a curated, verified audience of decision-makers — event organizers actively looking for brands and brands actively seeking events. Our platform includes proposal tools, contracts, analytics, and automated follow-ups that social media simply cannot offer.',
      },
      {
        q: 'Do you have customer support if I get stuck?',
        a: 'Yes! We offer live chat support (Monday–Saturday, 9 AM–9 PM PKT), email support at support@vendorax.pk, and WhatsApp Business support for Pro plan members. We also have a comprehensive help centre with step-by-step video guides.',
      },
    ],
  },
];

export function FAQSection() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <section className="faq-section py-28 relative overflow-hidden">
      <div className="faq-bg-gradient" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 faq-badge mb-4">
            <span>❓</span>
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-5">
            Everything You Need to <span className="faq-heading-gradient">Know</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Whether you&apos;re an event organizer in Lahore or a brand looking to sponsor events in Karachi — we&apos;ve got your questions answered.
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-12 max-w-4xl mx-auto">
          {faqs.map((category) => (
            <div key={category.category} className="faq-category">
              {/* Category Header */}
              <div className="faq-category-header" style={{ borderColor: `${category.color}40`, background: `${category.color}08` }}>
                <span className="faq-category-icon">{category.icon}</span>
                <h3 className="faq-category-title" style={{ color: category.color }}>
                  {category.category}
                </h3>
              </div>

              {/* Questions */}
              <div className="faq-items">
                {category.questions.map((faq, qi) => {
                  const key = `${category.category}-${qi}`;
                  const isOpen = openItems[key];
                  return (
                    <div
                      key={key}
                      className={`faq-item ${isOpen ? 'faq-item-open' : ''}`}
                      style={{ borderColor: isOpen ? `${category.color}30` : 'transparent' }}
                    >
                      <button
                        className="faq-question"
                        onClick={() => toggleItem(key)}
                        aria-expanded={isOpen}
                        id={`faq-btn-${key.replace(/\s/g, '-')}`}
                      >
                        <span>{faq.q}</span>
                        <span
                          className="faq-chevron"
                          style={{
                            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                            color: isOpen ? category.color : 'currentColor',
                          }}
                        >
                          ▼
                        </span>
                      </button>
                      {isOpen && (
                        <div className="faq-answer" style={{ borderColor: `${category.color}20` }}>
                          <p>{faq.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom help row */}
        <div className="faq-still-questions">
          <div className="faq-sq-icon">💬</div>
          <div>
            <div className="faq-sq-title">Still have questions?</div>
            <div className="faq-sq-subtitle">Our team is available Mon–Sat, 9 AM–9 PM PKT</div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href="mailto:support@vendorax.pk" className="faq-contact-btn faq-contact-btn-primary">
              Email Us
            </a>
            <a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer" className="faq-contact-btn faq-contact-btn-whatsapp">
              WhatsApp Chat
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
