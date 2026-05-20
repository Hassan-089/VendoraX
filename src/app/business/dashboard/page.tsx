import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { Compass } from 'lucide-react';

export default function BusinessDashboardPage() {
  return (
    <DashboardLayout allowedRoles={['business']}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Business Dashboard</h1>
            <p className="text-muted-foreground">Manage your brand's event sponsorships and stalls.</p>
          </div>
          <Link href="/events">
            <Button className="gap-2" variant="outline">
              <Compass className="w-4 h-4" /> Browse Events
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Active Applications</CardDescription>
              <CardTitle className="text-4xl">3</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Approved Stalls</CardDescription>
              <CardTitle className="text-4xl">1</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Upcoming Events</CardDescription>
              <CardTitle className="text-4xl">1</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <h2 className="text-xl font-bold tracking-tight mt-10 mb-4">Recent Activity</h2>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              <div className="flex items-center justify-between p-6">
                <div>
                  <h3 className="font-semibold text-lg">Tech Conference 2026 - Premium Booth</h3>
                  <div className="flex gap-2 items-center mt-1">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">Pending</span>
                    <p className="text-sm text-muted-foreground">Applied on Oct 1, 2026</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">View Details</Button>
              </div>
              <div className="flex items-center justify-between p-6">
                <div>
                  <h3 className="font-semibold text-lg">Startup Fest - Standard Stall</h3>
                  <div className="flex gap-2 items-center mt-1">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">Approved</span>
                    <p className="text-sm text-muted-foreground">Payment Pending</p>
                  </div>
                </div>
                <Button variant="primary" size="sm">Pay Now</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
