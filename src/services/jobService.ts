import { Job, JobListing, jobs, sampleJobListings, employerJobListings } from '@/lib/data';
import { supabase } from '@/integrations/supabase/client';

export interface JobFilters {
    query?: string;
    location?: string;
    type?: string[];
    remote?: boolean;
}

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const jobService = {
    // Get all jobs (simulating a search/filter capability)
    async getJobs(filters?: JobFilters): Promise<Job[]> {
        // Try fetching from Supabase first
        let query = (supabase.from('jobs') as any).select('*');
        
        if (filters) {
             if (filters.query) {
                // Simple ILIKE search on title for now (using text search would be better)
                query = query.ilike('title', `%${filters.query}%`);
             }
             if (filters.location) {
                query = query.ilike('location', `%${filters.location}%`);
             }
             // Add other filters as needed
        }
        
        const { data: realJobs, error } = await query;
        
        if (!error && realJobs && realJobs.length > 0) {
            return realJobs.map((job: any) => ({
                id: job.id,
                title: job.title,
                company: job.company,
                companyId: job.company.toLowerCase().replace(/\s+/g, '-'),
                location: job.location,
                type: job.type as any,
                salary: job.salary || 'Competitive',
                description: job.description || '',
                posted: new Date(job.posted_at).toLocaleDateString(),
                featured: job.featured,
                requirements: job.requirements || [],
                logo: job.logo_url || 'https://via.placeholder.com/50'
            }));
        }

        // Fallback to mock data if no real jobs found (or error)
        console.log("Using mock data due to empty DB or error:", error);
        await delay(500); 

        let filteredJobs = [...jobs];

        if (filters) {
            if (filters.query) {
                const q = filters.query.toLowerCase();
                filteredJobs = filteredJobs.filter(job =>
                    job.title.toLowerCase().includes(q) ||
                    job.company.toLowerCase().includes(q) ||
                    job.description.toLowerCase().includes(q)
                );
            }

            if (filters.location) {
                const l = filters.location.toLowerCase();
                filteredJobs = filteredJobs.filter(job =>
                    job.location.toLowerCase().includes(l)
                );
            }

            if (filters.type && filters.type.length > 0) {
                filteredJobs = filteredJobs.filter(job =>
                    filters.type?.includes(job.type)
                );
            }
        }

        return filteredJobs;
    },

    // Get a single job by ID
    async getJobById(id: string): Promise<Job | undefined> {
        await delay(300);
        return jobs.find(job => job.id === id);
    },

    // Get featured jobs (for landing page)
    async getFeaturedJobs(): Promise<Job[]> {
        await delay(300);
        return jobs.filter(job => job.featured);
    },

    // Get recent jobs (simulating a "recent" endpoint)
    async getRecentJobs(): Promise<Job[]> {
        await delay(300);
        // Return sorted by date (mock implementation just returns first 5)
        return jobs.slice(0, 5);
    },

    // Employer methods
    async getEmployerJobs(): Promise<JobListing[]> {
        await delay(500);
        return employerJobListings;
    },

    async getEmployerJobById(id: string): Promise<JobListing | undefined> {
        await delay(300);
        return employerJobListings.find(job => job.id === id);
    },

    async deleteJob(id: string): Promise<void> {
        await delay(500);
        // In a real app, this would delete from DB
        console.log(`Deleted job ${id}`);
    },

    async updateJob(id: string, data: any): Promise<void> {
        await delay(1000);
        // In a real app, this would update DB
        console.log(`Updated job ${id}`, data);
    }
};
