'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth';
import { PlusCircle, ExternalLink, Calendar, MapPin, ClipboardList, Tag } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  city: string;
  venue: string;
  start_date: string;
  end_date: string;
  expected_visitors: number;
  category: string | null;
  status: string;
}

export default function OrganizerMyEventsPage() {
  const { user } = useAuth();
  const supabase = createClient();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrganizerEvents() {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('organizer_id', user.id)
          .order('start_date', { ascending: false });

        if (data) {
          setEvents(data);
        }
      } catch (err) {
        console.error('Error loading events:', err);
      } finally {
        setLoading(false);
      }
    }

    loadOrganizerEvents();
  }, [user, supabase]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-PK', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-100 text-rose-800 border border-rose-200">
            Rejected
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 border border-amber-200 animate-pulse">
            Pending
          </span>
        );
    }
  };

  return (
    <DashboardLayout allowedRoles={['organizer']}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Events</h1>
            <p className="text-muted-foreground">Manage and track your published events and applications.</p>
          </div>
          <Link href="/organizer/create-event">
            <Button className="gap-2" variant="primary">
              <PlusCircle className="w-4 h-4" /> Create Event
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[30vh]">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : events.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent className="space-y-4">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto opacity-50" />
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">No Events Found</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  You haven&apos;t created any events yet. Click the button below to get started!
                </p>
              </div>
              <Link href="/organizer/create-event" className="inline-block mt-2">
                <Button variant="primary">Create Your First Event</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {events.map((event) => (
              <Card key={event.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h2 className="text-xl font-bold text-foreground">{event.title}</h2>
                        {getStatusBadge(event.status)}
                      </div>
                      
                      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 shrink-0" />
                          {event.venue}, {event.city}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 shrink-0" />
                          {formatDate(event.start_date)}
                          {event.end_date && event.end_date !== event.start_date && ` - ${formatDate(event.end_date)}`}
                        </span>
                        {event.category && (
                          <span className="flex items-center gap-1.5">
                            <Tag className="w-4 h-4 shrink-0" />
                            {event.category}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0 w-full lg:w-auto">
                      <Link href={`/events/${event.id}`} className="w-full sm:w-auto">
                        <Button variant="outline" className="w-full gap-2">
                          <ExternalLink className="w-4 h-4" /> View Live Page
                        </Button>
                      </Link>
                      <Link href={`/organizer/applications?eventId=${event.id}`} className="w-full sm:w-auto">
                        <Button variant="primary" className="w-full gap-2">
                          <ClipboardList className="w-4 h-4" /> View Applications
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
