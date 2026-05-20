import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';

export default function UserDashboardPage() {
  return (
    <DashboardLayout allowedRoles={['user']}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Normal User Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recommended Events</CardTitle>
              <CardDescription>Events you might like</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Discover new events tailored to your interests.</p>
              <div className="space-y-4">
                <div className="p-3 bg-muted rounded-lg border border-border">Tech Conference 2026</div>
                <div className="p-3 bg-muted rounded-lg border border-border">Startup Weekend</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Saved Events</CardTitle>
              <CardDescription>Your bookmarked events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-24 flex items-center justify-center text-sm text-muted-foreground border-2 border-dashed border-border rounded-lg">
                No saved events yet
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Events you're attending</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-24 flex items-center justify-center text-sm text-muted-foreground border-2 border-dashed border-border rounded-lg">
                No upcoming events
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
