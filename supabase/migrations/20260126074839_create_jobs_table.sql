-- Create jobs table
create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  company text not null,
  location text not null,
  type text not null, -- 'Full-time', 'Part-time', etc.
  salary text,
  description text,
  requirements text[], -- Array of strings
  posted_at timestamptz default now(),
  external_id text, -- ID from external source
  source text,      -- 'linkedin', 'indeed', etc.
  application_url text,
  featured boolean default false,
  logo_url text,
  
  -- Metadata
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Add indexes
create index if not exists jobs_search_idx on public.jobs using gin (to_tsvector('english', title || ' ' || company || ' ' || description));
create index if not exists jobs_external_id_idx on public.jobs (external_id);

-- Enable RLS
alter table public.jobs enable row level security;

-- Policies
-- Everyone can read jobs
create policy "Public jobs are viewable by everyone" 
  on public.jobs for select 
  using (true);

-- Only service role can insert/update/delete (for our scraper)
create policy "Service role can manage jobs" 
  on public.jobs for all 
  using (auth.role() = 'service_role');
