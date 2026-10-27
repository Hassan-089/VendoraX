"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { SeoAssistant } from "@/components/events/SeoAssistant";
import { createClient } from "@/lib/supabaseClient";

export default function CreateEventPage() {
  const [error, setError] = useState<string | null>(null);
  const [eventCount, setEventCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSeoOpen, setIsSeoOpen] = useState(false);
  const EVENT_LIMIT = 5;
  const router = useRouter();
  const supabase = createClient();

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [venue, setVenue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [expectedVisitors, setExpectedVisitors] = useState("");

  // Packages State
  const [packages, setPackages] = useState([
    { name: "", price: "", size: "", perks: "" },
  ]);

  useEffect(() => {
    async function checkLimits() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        const { count, error } = await supabase
          .from("events")
          .select("*", { count: "exact", head: true })
          .eq("organizer_id", session.user.id);

        if (!error && count !== null) {
          setEventCount(count);
        }
      }
      setLoading(false);
    }

    checkLimits();
  }, [supabase]);

  const handleAddPackage = () => {
    setPackages([...packages, { name: "", price: "", size: "", perks: "" }]);
  };

  const updatePackage = (index: number, field: string, value: string) => {
    const newPackages = [...packages];
    newPackages[index] = { ...newPackages[index], [field]: value };
    setPackages(newPackages);
  };

  const [savedPartial, setSavedPartial] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || savedPartial || eventCount >= EVENT_LIMIT) return;
    setError(null);
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          city,
          venue,
          category,
          start_date: startDate,
          end_date: endDate,
          expected_visitors: expectedVisitors,
          packages: packages
            .filter((pkg) => pkg.name || pkg.price || pkg.size || pkg.perks)
            .map((pkg) => ({
              ...pkg,
              perks: pkg.perks
                .split(",")
                .map((value) => value.trim())
                .filter(Boolean),
            })),
        }),
      });
      const result = await response.json();
      if (result.partial) {
        setSavedPartial(true);
        setError(result.error);
        return;
      }
      if (!response.ok)
        throw new Error(result.error || "Unable to save your event.");
      router.push("/organizer/my-events");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to save your event. Check My Events before retrying.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout allowedRoles={["organizer"]}>
        <div className="pt-20 text-center">Loading Data...</div>
      </DashboardLayout>
    );
  }

  if (eventCount >= EVENT_LIMIT) {
    return (
      <DashboardLayout allowedRoles={["organizer"]}>
        <div className="max-w-2xl mx-auto mt-10">
          <Card className="border-destructive/50">
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">!</span>
              </div>
              <h2 className="text-xl font-semibold mb-2">Limit Reached</h2>
              <p className="text-muted-foreground mb-6">
                You have reached the maximum limit of {EVENT_LIMIT} events. You
                cannot create any more events on your current plan.
              </p>
              <Button
                onClick={() => router.push("/organizer/dashboard")}
                variant="outline"
              >
                Return to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout allowedRoles={["organizer"]}>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Create a New Event
          </h1>
          <p className="text-muted-foreground">
            Fill out the details to list your event on the marketplace.
          </p>
        </div>

        <div className="flex justify-between items-center bg-muted/50 p-4 rounded-lg border border-border">
          <span className="text-sm">Event Limit Quota</span>
          <span className="text-sm font-semibold">
            {eventCount} / {EVENT_LIMIT} Events Created
          </span>
        </div>

        <form className="space-y-8" onSubmit={handleSubmit}>
          {error && (
            <p role="alert" className="text-red-600">
              {error}
            </p>
          )}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Event Title</label>
                <Input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Tech Conference 2026"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Description</label>
                  <button
                    type="button"
                    onClick={() => setIsSeoOpen(true)}
                    className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1 bg-primary/10 hover:bg-primary/25 px-2.5 py-1 rounded-md"
                  >
                    <span>✨ SEO Assistant</span>
                  </button>
                </div>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full h-32 rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  placeholder="Describe your event..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">City</label>
                  <Input
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Lahore"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Venue</label>
                  <Input
                    required
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    placeholder="Expo Centre Lahore"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="flex h-10 w-full items-center rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <option value="">Select a category</option>
                  <option value="Food & Beverage">Food & Beverage</option>
                  <option value="Technology">Technology</option>
                  <option value="Fashion & Lifestyle">
                    Fashion & Lifestyle
                  </option>
                  <option value="Arts & Culture">Arts & Culture</option>
                  <option value="Business & Corporate">
                    Business & Corporate
                  </option>
                  <option value="Weddings & Lifestyle">
                    Weddings & Lifestyle
                  </option>
                  <option value="Automotive">Automotive</option>
                  <option value="Music & Entertainment">
                    Music & Entertainment
                  </option>
                  <option value="Trade & Industry">Trade & Industry</option>
                  <option value="Education & Literature">
                    Education & Literature
                  </option>
                  <option value="Culture & Heritage">Culture & Heritage</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Family & Entertainment">
                    Family & Entertainment
                  </option>
                </select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Date and Time</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date</label>
                <Input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">End Date</label>
                <Input
                  type="date"
                  min={startDate || undefined}
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Expected attendance (your estimate)
                </label>
                <Input
                  type="number"
                  min="1"
                  step="1"
                  required
                  value={expectedVisitors}
                  onChange={(e) => setExpectedVisitors(e.target.value)}
                  placeholder="5000"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Stall Packages</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {packages.map((pkg, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg border-border relative group"
                >
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Package Name
                      </label>
                      <Input
                        value={pkg.name}
                        onChange={(e) =>
                          updatePackage(index, "name", e.target.value)
                        }
                        placeholder="Standard Booth"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Price (PKR)</label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={pkg.price}
                        onChange={(e) =>
                          updatePackage(index, "price", e.target.value)
                        }
                        placeholder="500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Booth Size</label>
                      <Input
                        value={pkg.size}
                        onChange={(e) =>
                          updatePackage(index, "size", e.target.value)
                        }
                        placeholder="10x10 ft"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Perks (comma separated)
                      </label>
                      <Input
                        value={pkg.perks}
                        onChange={(e) =>
                          updatePackage(index, "perks", e.target.value)
                        }
                        placeholder="2 Chairs, 1 Table, WiFi"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                className="w-full border-dashed"
                onClick={handleAddPackage}
              >
                + Add Another Package
              </Button>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4 pb-10">
            <Button
              variant="ghost"
              type="button"
              onClick={() => router.push("/organizer/dashboard")}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={isSubmitting || savedPartial}
            >
              {isSubmitting ? "Submitting..." : "Submit for review"}
            </Button>
          </div>
        </form>

        <Modal
          isOpen={isSeoOpen}
          onClose={() => setIsSeoOpen(false)}
          title="✨ SEO Description Assistant"
        >
          <SeoAssistant
            title={title}
            category={category}
            city={city}
            venue={venue}
            currentDescription={description}
            onApplyDescription={(desc) => setDescription(desc)}
            onClose={() => setIsSeoOpen(false)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
}
