'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { RoleSelector } from './RoleSelector';
import { createClient } from '@/lib/supabaseClient';

export function SignupForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('user');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const supabase = createClient();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Pass role in user_metadata so the Supabase SQL Trigger can pick it up
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          user_role: role
        }
      }
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Wait a brief moment to allow trigger to catch up, then redirect
    if (authData.user) {
      if (role === 'organizer') {
        router.push('/organizer/dashboard');
      } else if (role === 'business') {
        router.push('/business/dashboard');
      } else {
        router.push('/events');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="p-3 bg-red-100 text-red-600 rounded-md text-sm">{error}</div>}
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select your role</label>
          <RoleSelector selectedRole={role} onSelect={setRole} />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Full Name</label>
          <Input 
            type="text" 
            required 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Email address</label>
          <Input 
            type="email" 
            required 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Password</label>
          <Input 
            type="password" 
            required 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>
      
      <Button type="submit" className="w-full h-11" variant="primary" disabled={loading}>
        {loading ? 'Creating Account...' : 'Create Account'}
      </Button>
    </form>
  );
}
