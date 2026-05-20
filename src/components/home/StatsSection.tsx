import React from 'react';

const stats = [
  { value: '500+', label: 'Event Organizers', icon: '🎪', color: '#1e3a8a' },
  { value: '2,400+', label: 'Active Events Listed', icon: '📅', color: '#7c3aed' },
  { value: '₨280M+', label: 'Sponsorship Deals Closed', icon: '💰', color: '#059669' },
  { value: '50K+', label: 'Brand Applications', icon: '🏢', color: '#dc2626' },
];

const cities = [
  { name: 'Lahore', events: '850+', icon: '🦁', color: '#1e3a8a' },
  { name: 'Karachi', events: '1,100+', icon: '🌊', color: '#7c3aed' },
  { name: 'Islamabad', events: '450+', icon: '🏛️', color: '#059669' },
  { name: 'Faisalabad', events: '200+', icon: '🏭', color: '#f59e0b' },
  { name: 'Multan', events: '150+', icon: '🕌', color: '#dc2626' },
  { name: 'Peshawar', events: '120+', icon: '⛰️', color: '#6366f1' },
];

export function StatsSection() {
  return (
    <section className="stats-section py-20 relative overflow-hidden">
      <div className="stats-bg-pattern" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Stats Row */}
        <div className="stats-grid">
          {stats.map((stat) => (
            <div key={stat.label} className="stat-card">
              <div className="stat-icon" style={{ background: `${stat.color}15`, color: stat.color }}>
                {stat.icon}
              </div>
              <div className="stat-value" style={{ color: stat.color }}>{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="stats-divider" />

        {/* Cities Row */}
        <div className="text-center mb-10">
          <h3 className="text-2xl font-bold tracking-tight text-foreground mb-2">
            Events Across All Major Pakistani Cities
          </h3>
          <p className="text-muted-foreground">From popular events in Lahore to Karachi and Islamabad — we cover it all.</p>
        </div>

        <div className="cities-grid">
          {cities.map((city) => (
            <div key={city.name} className="city-pill" style={{ borderColor: `${city.color}30`, background: `${city.color}08` }}>
              <span className="city-pill-icon">{city.icon}</span>
              <div>
                <div className="city-pill-name" style={{ color: city.color }}>{city.name}</div>
                <div className="city-pill-events">{city.events} events</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
