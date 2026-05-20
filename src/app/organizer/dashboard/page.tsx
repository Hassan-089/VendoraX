'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { createClient } from '@/lib/supabaseClient';

interface Event {
  id: string;
  title: string;
  city: string;
  start_date: string;
  category: string | null;
}

export default function OrganizerDashboardPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadDashboardData() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Fetch events created by this organizer
        const { data: fetchedEvents, error } = await supabase
          .from('events')
          .select('id, title, city, start_date, category')
          .eq('organizer_id', session.user.id)
          .order('created_at', { ascending: false });

        if (!error && fetchedEvents) {
          setEvents(fetchedEvents);
        }
      }
      setLoading(false);
    }
    
    loadDashboardData();
  }, [supabase]);

  return (
    <DashboardLayout allowedRoles={['organizer']}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Organizer Dashboard</h1>
            <p className="text-muted-foreground">Manage your events and applications.</p>
          </div>
          <Link href="/organizer/create-event">
            <Button className="gap-2">
              <PlusCircle className="w-4 h-4" /> Create Event
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Events</CardDescription>
              <CardTitle className="text-4xl">
                {loading ? '...' : events.length} <span className="text-sm text-muted-foreground font-normal">/ 5 Limit</span>
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Views</CardDescription>
              <CardTitle className="text-4xl">0</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Stall Applications</CardDescription>
              <CardTitle className="text-4xl">0</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Revenue</CardDescription>
              <CardTitle className="text-4xl">$0</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <h2 className="text-xl font-bold tracking-tight mt-10 mb-4">Recent Events</h2>
        <Card>
          <CardContent className="p-0">
            {events.length === 0 && !loading && (
              <div className="p-8 text-center text-muted-foreground">
                You haven't created any events yet!
              </div>
            )}
            <div className="divide-y divide-border">
              {events.map((evt) => (
                <div key={evt.id} className="flex items-center justify-between p-6">
                  <div>
                    <h3 className="font-semibold">{evt.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {evt.city}
                      {evt.category && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {evt.category}
                        </span>
                      )}
                      {' • '}{evt.start_date}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">Manage</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
