import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface StallCardProps {
  name: string;
  price: string;
  size: string;
  perks: string[];
  isBusiness?: boolean;
  onApply?: () => void;
}

export function StallCard({ name, price, size, perks, isBusiness = false, onApply }: StallCardProps) {
  return (
    <Card className="flex flex-col h-full hover:border-primary transition-colors">
      <CardHeader>
        <CardTitle className="text-xl">{name}</CardTitle>
        <div className="text-3xl font-bold mt-2">
          ${price}
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <div className="text-sm font-medium border-b border-border pb-2">
          Size: {size}
        </div>
        <ul className="space-y-2">
          {perks.map((perk, i) => (
            <li key={i} className="flex items-start text-sm text-muted-foreground">
              <span className="text-primary mr-2">✓</span>
              {perk}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          variant={isBusiness ? "primary" : "secondary"}
          disabled={!isBusiness}
          onClick={isBusiness ? onApply : undefined}
        >
          {isBusiness ? "Apply for Stall" : "Login as Business to Apply"}
        </Button>
      </CardFooter>
    </Card>
  );
}
