'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth';
import { ClipboardList, CheckCircle, XCircle, AlertCircle, Building, DollarSign } from 'lucide-react';

interface Application {
  id: string;
  event_id: string;
  package_id: string;
  business_id: string;
  status: string;
  message: string | null;
  created_at: string;
  events: { title: string } | null;
  stall_packages: { name: string; price: number; size: string } | null;
  profiles: { name: string | null } | null;
}

interface EventFilter {
  id: string;
  title: string;
}

function OrganizerApplicationsContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const initialEventId = searchParams.get('eventId') || '';
  const supabase = createClient();

  const [applications, setApplications] = useState<Application[]>([]);
  const [organizerEvents, setOrganizerEvents] = useState<EventFilter[]>([]);
  const [selectedEventFilter, setSelectedEventFilter] = useState(initialEventId);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadInitialData() {
      if (!user) return;

      try {
        // 1. Load organizer's events for filtering
        const { data: eventsData } = await supabase
          .from('events')
          .select('id, title')
          .eq('organizer_id', user.id);

        if (eventsData) {
          setOrganizerEvents(eventsData);
        }

        const eventIds = eventsData?.map((e: any) => e.id) || [];
        if (eventIds.length === 0) {
          setLoading(false);
          return;
        }

        // 2. Fetch stall applications
        await fetchApps(eventIds, selectedEventFilter);
      } catch (err) {
        console.error('Error loading organizer applications:', err);
      } finally {
        setLoading(false);
      }
    }

    loadInitialData();
  }, [user, selectedEventFilter, supabase]);

  const fetchApps = async (eventIds: string[], filterEventId: string) => {
    let query = supabase
      .from('stall_applications')
      .select(`
        id,
        event_id,
        package_id,
        business_id,
        status,
        message,
        created_at,
        events (title),
        stall_packages (name, price, size),
        profiles (name)
      `)
      .in('event_id', eventIds);

    if (filterEventId) {
      query = query.eq('event_id', filterEventId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error('Database query error:', error.message);
    }
    if (data) {
      setApplications(data as any);
    }
  };

  const handleUpdateStatus = async (appId: string, newStatus: 'approved' | 'rejected') => {
    setUpdatingId(appId);
    try {
      const { error } = await supabase
        .from('stall_applications')
        .update({ status: newStatus })
        .eq('id', appId);

      if (error) {
        alert('Failed to update status: ' + error.message);
      } else {
        // Local state update
        setApplications(prev => 
          prev.map(app => app.id === appId ? { ...app, status: newStatus } : app)
        );
      }
    } catch (err: any) {
      alert('Error updating status: ' + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-PK', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stall Applications</h1>
          <p className="text-muted-foreground">Review and approve booth bookings for your events.</p>
        </div>

        {organizerEvents.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Filter by Event:</span>
            <select
              value={selectedEventFilter}
              onChange={e => setSelectedEventFilter(e.target.value)}
              className="h-10 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Events</option>
              {organizerEvents.map(e => (
                <option key={e.id} value={e.id}>{e.title}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[30vh]">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : applications.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent className="space-y-4">
            <ClipboardList className="w-12 h-12 text-muted-foreground mx-auto opacity-50" />
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">No Applications Received</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                {selectedEventFilter 
                  ? 'There are no booking applications for this specific event yet.'
                  : 'No brands or exhibitors have applied to book stalls at your events yet.'}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {applications.map((app) => (
            <Card key={app.id} className="overflow-hidden border border-border shadow-sm">
              <div className="border-l-4 border-primary p-6">
                <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                  <div className="space-y-4 flex-grow">
                    {/* Header Details */}
                    <div>
                      <h3 className="text-lg font-bold text-foreground">
                        {app.events?.title || 'Unknown Event'}
                      </h3>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap text-sm text-muted-foreground font-medium">
                        <span className="flex items-center gap-1">
                          <Building className="w-4 h-4" />
                          Brand: <strong className="text-foreground">{app.profiles?.name || 'Anonymous Business'}</strong>
                        </span>
                        <span>•</span>
                        <span>Applied: {formatDate(app.created_at)}</span>
                      </div>
                    </div>

                    {/* Stall Package Info */}
                    <div className="bg-muted/40 p-4 rounded-xl border border-border flex flex-wrap gap-6 items-center">
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Requested Stall</p>
                        <p className="font-semibold text-foreground">{app.stall_packages?.name || 'Deleted Package'}</p>
                      </div>
                      <div className="border-r border-border h-8 hidden sm:block"></div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Size</p>
                        <p className="font-semibold text-foreground">{app.stall_packages?.size || 'N/A'}</p>
                      </div>
                      <div className="border-r border-border h-8 hidden sm:block"></div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Price</p>
                        <p className="font-semibold text-primary flex items-center">
                          <DollarSign className="w-3.5 h-3.5 -mr-0.5" />
                          {app.stall_packages?.price.toLocaleString() || '0'}
                        </p>
                      </div>
                    </div>

                    {/* Cover Note */}
                    {app.message && (
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Applicant Cover Note</p>
                        <p className="text-sm bg-background border border-border/80 px-3.5 py-2.5 rounded-lg text-foreground italic whitespace-pre-wrap leading-relaxed">
                          &ldquo;{app.message}&rdquo;
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions & Status */}
                  <div className="flex flex-row lg:flex-col lg:items-end justify-between items-center gap-4 shrink-0 w-full lg:w-auto pt-4 lg:pt-0 border-t border-border lg:border-t-0">
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold lg:text-right uppercase tracking-wider mb-1 hidden lg:block">Status</p>
                      {app.status === 'approved' ? (
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-sm font-semibold rounded-full">
                          <CheckCircle className="w-4 h-4 text-emerald-600" /> Approved
                        </span>
                      ) : app.status === 'rejected' ? (
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-800 border border-red-200 text-sm font-semibold rounded-full">
                          <XCircle className="w-4 h-4 text-red-600" /> Rejected
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 text-sm font-semibold rounded-full animate-pulse">
                          <AlertCircle className="w-4 h-4 text-amber-600" /> Pending Review
                        </span>
                      )}
                    </div>

                    {app.status === 'pending' && (
                      <div className="flex gap-2 w-full lg:w-auto">
                        <Button
                          variant="ghost"
                          onClick={() => handleUpdateStatus(app.id, 'rejected')}
                          disabled={updatingId === app.id}
                          className="hover:bg-red-50 hover:text-red-700 border border-transparent hover:border-red-200 text-muted-foreground font-semibold w-1/2 lg:w-auto"
                        >
                          Reject
                        </Button>
                        <Button
                          variant="primary"
                          onClick={() => handleUpdateStatus(app.id, 'approved')}
                          disabled={updatingId === app.id}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold w-1/2 lg:w-auto gap-1"
                        >
                          Approve
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function OrganizerApplicationsPage() {
  return (
    <DashboardLayout allowedRoles={['organizer']}>
      <Suspense fallback={
        <div className="flex justify-center items-center min-h-[30vh]">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <OrganizerApplicationsContent />
      </Suspense>
    </DashboardLayout>
  );
}
