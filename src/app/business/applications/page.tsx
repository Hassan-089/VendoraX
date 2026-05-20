'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth';
import { ClipboardList, Compass, CheckCircle, XCircle, AlertCircle, Calendar, MapPin } from 'lucide-react';

interface Application {
  id: string;
  status: string;
  message: string | null;
  created_at: string;
  events: { title: string; city: string; venue: string; start_date: string } | null;
  stall_packages: { name: string; price: number; size: string } | null;
}

export default function BusinessApplicationsPage() {
  const { user } = useAuth();
  const supabase = createClient();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBusinessApplications() {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('stall_applications')
          .select(`
            id,
            status,
            message,
            created_at,
            events (title, city, venue, start_date),
            stall_packages (name, price, size)
          `)
          .eq('business_id', user.id)
          .order('created_at', { ascending: false });

        if (data) {
          setApplications(data as any);
        }
      } catch (err) {
        console.error('Error loading business applications:', err);
      } finally {
        setLoading(false);
      }
    }

    loadBusinessApplications();
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
          <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold rounded-full">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Approved (Payment Pending)
          </span>
        );
      case 'rejected':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-rose-100 text-rose-800 border border-rose-200 text-xs font-semibold rounded-full">
            <XCircle className="w-3.5 h-3.5 text-rose-600" /> Rejected
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold rounded-full animate-pulse">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" /> Pending Review
          </span>
        );
    }
  };

  const handlePayment = (appId: string, price: number) => {
    alert(`Checkout Flow Coming Soon!\nProcessing payment of $${price.toLocaleString()} for Stall Booking application.`);
  };

  return (
    <DashboardLayout allowedRoles={['business']}>
      <div className="space-y-6 text-left">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Applications</h1>
            <p className="text-muted-foreground">Track and complete bookings for applied stall packages.</p>
          </div>
          <Link href="/events">
            <Button className="gap-2" variant="outline">
              <Compass className="w-4 h-4" /> Browse Events
            </Button>
          </Link>
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
                <h3 className="text-lg font-semibold">No Applications Found</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  You haven&apos;t applied for any event stalls yet. Browse our marketplace and submit your first request!
                </p>
              </div>
              <Link href="/events" className="inline-block mt-2">
                <Button variant="primary">Browse Upcoming Events</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {applications.map((app) => (
              <Card key={app.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div className="space-y-4 flex-1">
                      {/* Event details */}
                      <div>
                        <h2 className="text-xl font-bold text-foreground">
                          {app.events?.title || 'Deleted Event'}
                        </h2>
                        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground mt-1 font-semibold uppercase tracking-wider">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {app.events?.venue}, {app.events?.city}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            Start Date: {app.events ? formatDate(app.events.start_date) : 'N/A'}
                          </span>
                        </div>
                      </div>

                      {/* Package details */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-y border-border py-4">
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Stall Package</p>
                          <p className="font-semibold text-foreground">{app.stall_packages?.name || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Stall Size</p>
                          <p className="font-semibold text-foreground">{app.stall_packages?.size || 'N/A'}</p>
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Stall Cost</p>
                          <p className="font-bold text-primary">${app.stall_packages?.price.toLocaleString() || '0'}</p>
                        </div>
                      </div>

                      {app.message && (
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-0.5">Your Cover Note</p>
                          <p className="text-sm italic text-muted-foreground bg-muted/30 px-3 py-2 rounded-lg border border-border/50">
                            &ldquo;{app.message}&rdquo;
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Actions and Status */}
                    <div className="flex flex-row lg:flex-col lg:items-end justify-between items-center gap-4 shrink-0 w-full lg:w-auto pt-4 lg:pt-0 border-t border-border lg:border-t-0">
                      <div>
                        <p className="text-xs text-muted-foreground font-semibold lg:text-right uppercase tracking-wider mb-1 hidden lg:block">Status</p>
                        {getStatusBadge(app.status)}
                      </div>

                      {app.status === 'approved' && (
                        <Button 
                          variant="primary" 
                          onClick={() => handlePayment(app.id, app.stall_packages?.price || 0)}
                          className="w-full sm:w-auto mt-2 font-bold px-6 shadow-sm"
                        >
                          Pay Now
                        </Button>
                      )}
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
