'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabaseClient';

interface Event {
  id: string;
  title: string;
  city: string;
  start_date: string;
  status: string;
  category: string | null;
}

export default function AdminDashboardPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchPendingEvents();
  }, [supabase]);

  async function fetchPendingEvents() {
    setLoading(true);
    const { data: fetchedEvents, error } = await supabase
      .from('events')
      .select('id, title, city, start_date, status, category')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (!error && fetchedEvents) {
      setEvents(fetchedEvents);
    }
    setLoading(false);
  }

  const handleApprove = async (eventId: string) => {
    const { error } = await supabase
      .from('events')
      .update({ status: 'approved' })
      .eq('id', eventId);

    if (!error) {
      // Remove the approved event from the list
      setEvents(events.filter(e => e.id !== eventId));
    } else {
      console.error("Failed to approve event:", error);
      alert("Failed to approve event. Check console for details.");
    }
  };

  return (
    <DashboardLayout allowedRoles={['admin']}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Review and approve newly created events.</p>
        </div>

        <h2 className="text-xl font-bold tracking-tight mt-10 mb-4">Pending Events</h2>
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">Loading pending events...</div>
            ) : events.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No pending events to approve.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {events.map((evt) => (
                  <div key={evt.id} className="flex items-center justify-between p-6 hover:bg-muted/50 transition-colors">
                    <div>
                      <h3 className="font-semibold text-lg">{evt.title}</h3>
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
                    <div className="flex gap-3">
                      <Button onClick={() => handleApprove(evt.id)} variant="primary" size="sm" className="bg-green-600 hover:bg-green-700 text-white border-0">
                        Allow Event
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
