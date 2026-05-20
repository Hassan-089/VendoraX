'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { StallCard } from '@/components/events/StallCard';
import { Modal } from '@/components/ui/Modal';
import { MapPinIcon, CalendarIcon, UsersIcon, UserCircle, TagIcon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabaseClient';

interface EventDetail {
  id: string;
  title: string;
  description: string;
  city: string;
  venue: string;
  start_date: string;
  end_date: string;
  expected_visitors: number;
  category: string | null;
  image_url: string | null;
  organizer_id: string;
}

interface StallPackage {
  id: string;
  name: string;
  price: number;
  size: string;
  perks: string[];
}

interface Profile {
  name: string | null;
}

export default function EventDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const supabase = createClient();
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [stallPackages, setStallPackages] = useState<StallPackage[]>([]);
  const [organizerName, setOrganizerName] = useState<string>('Event Organizer');
  const [loading, setLoading] = useState(true);

  // Stall application states
  const [selectedPackage, setSelectedPackage] = useState<StallPackage | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState('');
  const [submittingApp, setSubmittingApp] = useState(false);

  const handleOpenApplyModal = (pkg: StallPackage) => {
    setSelectedPackage(pkg);
    setApplicationMessage('');
    setIsApplyModalOpen(true);
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackage || !event || !user) return;
    setSubmittingApp(true);
    
    try {
      const { error } = await supabase
        .from('stall_applications')
        .insert({
          event_id: event.id,
          package_id: selectedPackage.id,
          business_id: user.id,
          message: applicationMessage,
          status: 'pending'
        });
        
      if (error) {
        alert("Failed to submit application: " + error.message);
      } else {
        alert("Application submitted successfully!");
        setIsApplyModalOpen(false);
        router.push('/business/applications');
      }
    } catch (err: any) {
      alert("Error submitting application: " + err.message);
    } finally {
      setSubmittingApp(false);
    }
  };

  useEffect(() => {
    async function loadEvent() {
      if (!id) return;

      // 1. Fetch event details first (since we need organizer_id)
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

      if (eventError || !eventData) {
        setLoading(false);
        return;
      }

      setEvent(eventData);

      // 2. Fetch stall packages and organizer profile in parallel
      try {
        const [packagesResult, profileResult] = await Promise.all([
          supabase
            .from('stall_packages')
            .select('*')
            .eq('event_id', id)
            .order('price', { ascending: true }),
          supabase
            .from('profiles')
            .select('name')
            .eq('id', eventData.organizer_id)
            .single()
        ]);

        if (packagesResult.data) {
          setStallPackages(packagesResult.data);
        }
        if (profileResult.data?.name) {
          setOrganizerName(profileResult.data.name);
        }
      } catch (err) {
        console.error('Error loading related event details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadEvent();
  }, [id, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Event Not Found</h2>
          <p className="text-muted-foreground">This event may have been removed or doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-PK', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const dateDisplay = event.end_date && event.end_date !== event.start_date
    ? `${formatDate(event.start_date)} - ${formatDate(event.end_date)}`
    : formatDate(event.start_date);

  return (
    <div>
      {/* Banner */}
      <div className="w-full h-[45vh] min-h-[350px] relative flex items-end overflow-hidden">
        {event.image_url ? (
          <img src={event.image_url} alt={event.title} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
        <div className="container mx-auto px-4 pb-12 relative z-10 text-white">
          <div className="flex flex-wrap gap-3 mb-4">
            {event.category && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur rounded-full text-sm font-medium">
                <TagIcon className="w-3.5 h-3.5" />
                {event.category}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur rounded-full text-sm font-medium">
              <MapPinIcon className="w-3.5 h-3.5" />
              {event.city}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{event.title}</h1>
          <div className="flex flex-wrap gap-6 text-sm font-medium">
            <div className="flex items-center">
              <CalendarIcon className="w-5 h-5 mr-2 opacity-80" />
              {dateDisplay}
            </div>
            <div className="flex items-center">
              <MapPinIcon className="w-5 h-5 mr-2 opacity-80" />
              {event.venue}
            </div>
            <div className="flex items-center">
              <UsersIcon className="w-5 h-5 mr-2 opacity-80" />
              {event.expected_visitors.toLocaleString()}+ Expected
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            <section>
              <h2 className="text-2xl font-bold mb-4">About this Event</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </section>

            {stallPackages.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-6">Available Stall Packages</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {stallPackages.map(pkg => (
                    <StallCard 
                      key={pkg.id}
                      name={pkg.name}
                      price={pkg.price.toLocaleString()}
                      size={pkg.size}
                      perks={pkg.perks}
                      isBusiness={user?.role === 'business'}
                      onApply={() => handleOpenApplyModal(pkg)}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-4">Location Details</h3>
              <div className="flex items-start text-muted-foreground mb-4">
                <MapPinIcon className="w-5 h-5 mr-3 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-foreground">{event.venue}</p>
                  <p className="text-sm">{event.city}</p>
                </div>
              </div>
              <div className="h-48 rounded-lg bg-muted border border-border flex items-center justify-center text-sm text-muted-foreground">
                Map Integration (Coming Soon)
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-6 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center shrink-0">
                <UserCircle className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Organized by</p>
                <p className="font-semibold">{organizerName}</p>
              </div>
            </div>
            
            <Button className="w-full h-12 text-lg">
              Get Attendee Ticket
            </Button>
          </div>

        </div>
      </div>

      {/* Apply Modal */}
      {selectedPackage && (
        <Modal 
          isOpen={isApplyModalOpen} 
          onClose={() => setIsApplyModalOpen(false)} 
          title={`Apply for ${selectedPackage.name}`}
        >
          <form onSubmit={handleSubmitApplication} className="space-y-4 text-left">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                You are applying to book **{selectedPackage.name}** at **{event.title}** for **${selectedPackage.price.toLocaleString()}** (Size: {selectedPackage.size}).
              </p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold">Introduce your Business / Brand</label>
              <textarea
                required
                value={applicationMessage}
                onChange={e => setApplicationMessage(e.target.value)}
                placeholder="Briefly describe what your business sells, and why you are a great fit for this event..."
                className="w-full h-32 rounded-lg border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-foreground"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={() => setIsApplyModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={submittingApp}>
                {submittingApp ? 'Submitting...' : 'Submit Application'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
