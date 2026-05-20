import React from 'react';
import { UserRole } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { User, Briefcase, CalendarDays } from 'lucide-react';

interface RoleSelectorProps {
  selectedRole: UserRole;
  onSelect: (role: UserRole) => void;
}

export function RoleSelector({ selectedRole, onSelect }: RoleSelectorProps) {
  const roles = [
    {
      id: 'user',
      title: 'Normal User',
      description: 'Browse and discover events',
      icon: User,
    },
    {
      id: 'organizer',
      title: 'Event Organizer',
      description: 'List and manage your events',
      icon: CalendarDays,
    },
    {
      id: 'business',
      title: 'Business Owner',
      description: 'Book stalls and sponsorships',
      icon: Briefcase,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 mb-6">
      {roles.map((role) => {
        const Icon = role.icon;
        const isSelected = selectedRole === role.id;
        
        return (
          <div
            key={role.id}
            onClick={() => onSelect(role.id as UserRole)}
            className={cn(
              "flex items-center p-4 border rounded-xl cursor-pointer transition-all",
              isSelected 
                ? "border-primary bg-primary/5 ring-1 ring-primary shadow-sm" 
                : "border-border bg-card hover:bg-muted/50 hover:border-primary/50"
            )}
          >
            <div className={cn(
              "p-3 rounded-full mr-4 transition-colors",
              isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            )}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold">{role.title}</h4>
              <p className="text-sm text-muted-foreground">{role.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
