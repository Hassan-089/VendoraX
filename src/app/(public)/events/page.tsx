'use client';

import React, { useEffect, useState } from 'react';
import { EventCard } from '@/components/events/EventCard';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Search, Filter } from 'lucide-react';
import { createClient } from '@/lib/supabaseClient';

interface Event {
  id: string;
  title: string;
  city: string;
  start_date: string;
  expected_visitors: number;
  category: string | null;
  image_url: string | null;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const supabase = createClient();

  useEffect(() => {
    async function loadEvents() {
      // Fetch only "approved" events from Supabase
      let query = supabase
        .from('events')
        .select('id, title, city, start_date, expected_visitors, category, image_url')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (selectedCategory) query = query.eq('category', selectedCategory);
      if (selectedCity) query = query.eq('city', selectedCity);

      const { data: fetchedEvents, error } = await query;

      if (!error && fetchedEvents) {
        setEvents(fetchedEvents);
      }
      setLoading(false);
    }
    loadEvents();
  }, [supabase, selectedCategory, selectedCity]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl min-h-screen">
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Discover Events</h1>
        <p className="text-lg text-muted-foreground">Find the perfect events to attend or sponsor.</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input className="pl-10 h-12" placeholder="Search events by name, city, or category..." />
        </div>
        <div className="flex gap-4">
          <select className="flex h-12 w-full md:w-48 items-center justify-between rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
            <option value="">All Categories</option>
            <option value="Food & Beverage">Food & Beverage</option>
            <option value="Technology">Technology</option>
            <option value="Fashion & Lifestyle">Fashion & Lifestyle</option>
            <option value="Arts & Culture">Arts & Culture</option>
            <option value="Business & Corporate">Business & Corporate</option>
            <option value="Weddings & Lifestyle">Weddings & Lifestyle</option>
            <option value="Automotive">Automotive</option>
            <option value="Music & Entertainment">Music & Entertainment</option>
            <option value="Trade & Industry">Trade & Industry</option>
            <option value="Education & Literature">Education & Literature</option>
            <option value="Culture & Heritage">Culture & Heritage</option>
            <option value="Real Estate">Real Estate</option>
            <option value="Family & Entertainment">Family & Entertainment</option>
          </select>
          <select className="flex h-12 w-full md:w-48 items-center justify-between rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" value={selectedCity} onChange={e => setSelectedCity(e.target.value)}>
            <option value="">All Cities</option>
            <option value="Lahore">Lahore</option>
            <option value="Karachi">Karachi</option>
            <option value="Islamabad">Islamabad</option>
            <option value="Faisalabad">Faisalabad</option>
            <option value="Peshawar">Peshawar</option>
          </select>
          <Button variant="outline" className="h-12 px-4 whitespace-nowrap gap-2">
            <Filter className="w-4 h-4" /> Filters
          </Button>
        </div>
      </div>

      {/* Event Grid */}
      {loading ? (
        <div className="text-center py-20 text-muted-foreground">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">No approved events available right now. Check back later!</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {events.map((event) => (
            <EventCard 
              key={event.id} 
              id={event.id}
              title={event.title}
              city={event.city}
              date={event.start_date}
              visitors={event.expected_visitors.toString() + '+'}
              category={event.category || undefined}
              imageUrl={event.image_url || undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
