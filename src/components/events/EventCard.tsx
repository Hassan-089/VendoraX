import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CalendarIcon, MapPinIcon, UsersIcon } from 'lucide-react';

interface EventCardProps {
  id: string;
  title: string;
  city: string;
  date: string;
  visitors: string;
  imageUrl?: string;
  category?: string;
}

export function EventCard({ id, title, city, date, visitors, imageUrl, category }: EventCardProps) {
  return (
    <Card className="overflow-hidden group hover:shadow-md transition-all flex flex-col h-full">
      <div className="h-48 bg-muted relative overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
        )}
        {category && (
          <span className="absolute top-4 right-4 bg-background/90 backdrop-blur px-3 py-1 text-xs font-semibold rounded-full border border-border">
            {category}
          </span>
        )}
      </div>
      <CardContent className="p-5 flex-1 flex flex-col">
        <h3 className="font-bold text-xl mb-3 line-clamp-2">{title}</h3>
        
        <div className="space-y-2 mb-6 flex-1">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPinIcon className="w-4 h-4 mr-2" />
            {city}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <CalendarIcon className="w-4 h-4 mr-2" />
            {date}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <UsersIcon className="w-4 h-4 mr-2" />
            {visitors} Expected Visitors
          </div>
        </div>
        
        <Link href={`/events/${id}`} className="mt-auto">
          <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            View Event
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
