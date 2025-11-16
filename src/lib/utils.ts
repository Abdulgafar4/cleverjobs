import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { supabase } from "@/integrations/supabase/client"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get the current authenticated user
 * @returns Promise with the user object or null if not authenticated
 */
export async function getCurrentUser() {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.user || null
}

/**
 * Get the current user's session
 * @returns Promise with the session object or null if not authenticated
 */
export async function getCurrentSession() {
  const { data: { session } } = await supabase.auth.getSession()
  return session || null
}

/**
 * Get the current user's metadata (includes user_type, first_name, etc.)
 * @returns Promise with user metadata or null if not authenticated
 */
export async function getCurrentUserMetadata() {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.user?.user_metadata || null
}

/**
 * Check if user is authenticated
 * @returns Promise<boolean>
 */
export async function isAuthenticated() {
  const { data: { session } } = await supabase.auth.getSession()
  return !!session
}

/**
 * Get the user type (jobseeker or employer)
 * @returns Promise with user type or null
 */
export async function getUserType(): Promise<'jobseeker' | 'employer' | null> {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.user?.user_metadata?.user_type || null
}

/**
 * Update user metadata
 * @param metadata - Object with metadata to update (will be merged with existing metadata)
 * @returns Promise with updated user data or error
 * 
 * @example
 * ```ts
 * await updateUserMetadata({
 *   first_name: 'John',
 *   last_name: 'Doe',
 *   phone: '+1234567890'
 * });
 * ```
 */
export async function updateUserMetadata(metadata: Record<string, any>) {
  const { data, error } = await supabase.auth.updateUser({
    data: metadata
  })
  
  if (error) {
    throw error
  }
  
  return data
}

/**
 * Update job seeker profile information
 * @param profileData - Job seeker profile data
 * @returns Promise with updated user data
 */
export async function updateJobSeekerProfile(profileData: {
  first_name?: string;
  last_name?: string;
  title?: string;
  bio?: string;
  skills?: string[];
  location?: string;
  phone?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  experience?: Array<{
    title?: string;
    company?: string;
    location?: string;
    period?: string;
    description?: string;
    achievements?: string[];
  }>;
  education?: Array<{
    degree?: string;
    school?: string;
    location?: string;
    period?: string;
    gpa?: string;
    honors?: string;
  }>;
  onboarding_completed?: boolean;
}) {
  return updateUserMetadata({
    ...profileData,
    onboarding_completed: profileData.onboarding_completed ?? true
  })
}

/**
 * Update employer/company profile information
 * @param profileData - Employer profile data
 * @returns Promise with updated user data
 */
export async function updateEmployerProfile(profileData: {
  company_name?: string;
  industry?: string;
  company_size?: string;
  company_website?: string;
  company_description?: string;
  company_location?: string;
  phone?: string;
  linkedin_url?: string;
  onboarding_completed?: boolean;
}) {
  return updateUserMetadata({
    ...profileData,
    onboarding_completed: profileData.onboarding_completed ?? true
  })
}
