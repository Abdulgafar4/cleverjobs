import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

interface UserMetadata {
  user_type?: 'jobseeker' | 'employer';
  first_name?: string;
  last_name?: string;
  company_name?: string;
  onboarding_completed?: boolean;
  title?: string;
  bio?: string;
  skills?: string[];
  industry?: string;
  company_size?: string;
  company_website?: string;
  company_description?: string;
  location?: string;
  phone?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  [key: string]: any;
}

interface UseUserReturn {
  user: User | null;
  session: Session | null;
  userMetadata: UserMetadata | null;
  userType: 'jobseeker' | 'employer' | null;
  loading: boolean;
  isAuthenticated: boolean;
  refresh: () => Promise<void>;
}

/**
 * Custom hook to get the current authenticated user
 * Automatically listens for auth state changes
 * 
 * @example
 * ```tsx
 * const { user, userType, loading, isAuthenticated, refresh } = useUser();
 * 
 * if (loading) return <div>Loading...</div>;
 * if (!isAuthenticated) return <div>Please sign in</div>;
 * 
 * // After updating metadata, refresh to get latest data
 * await updateUserMetadata({ first_name: 'John' });
 * await refresh();
 * 
 * return <div>Welcome, {user?.email}</div>;
 * ```
 */
export function useUser(): UseUserReturn {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setSession(session);
    setUser(session?.user ?? null);
  }, []);

  useEffect(() => {
    // Get initial session
    refreshUser().finally(() => setLoading(false));

    // Listen for auth changes (sign in, sign out, token refresh, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [refreshUser]);

  const userMetadata = (user?.user_metadata as UserMetadata) || null;
  const userType = userMetadata?.user_type || null;

  return {
    user,
    session,
    userMetadata,
    userType,
    loading,
    isAuthenticated: !!user,
    refresh: refreshUser,
  };
}
