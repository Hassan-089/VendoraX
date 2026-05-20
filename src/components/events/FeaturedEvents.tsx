'use client';

import React, { useEffect, useState } from 'react';
import { EventCard } from './EventCard';
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

export function FeaturedEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadEvents() {
      // Fetch only "approved" events from Supabase, limit to 3 for featured
      const { data: fetchedEvents, error } = await supabase
        .from('events')
        .select('id, title, city, start_date, expected_visitors, category, image_url')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(3);

      if (!error && fetchedEvents) {
        setEvents(fetchedEvents);
      }
      setLoading(false);
    }
    loadEvents();
  }, [supabase]);

  return (
    <section className="py-20 bg-muted/50 border-y border-border">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold tracking-tight mb-12 text-center">Featured Events</h2>
        
        {loading ? (
          <div className="text-center py-10 text-muted-foreground">Loading featured events...</div>
        ) : events.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">No featured events available at the moment.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
    </section>
  );
}
