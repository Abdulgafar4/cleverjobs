
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      // Supabase API URL - Env var automatically injected by Supabase
      Deno.env.get('SUPABASE_URL') ?? '',
      // Supabase Service Role Key - Env var automatically injected by Supabase
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Rapid API Key from Env Var
    const rapidApiKey = Deno.env.get('RAPID_API_KEY')
    if (!rapidApiKey) {
      throw new Error('Missing RAPID_API_KEY environment variable')
    }

    // Default params
    const query = new URL(req.url).searchParams.get('query') || 'software engineer'
    const page = new URL(req.url).searchParams.get('page') || '1'

    console.log(`Fetching jobs for: ${query}, page: ${page}`)

    // 1. Fetch from RapidAPI (JSearch)
    const response = await fetch(`https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query)}&page=${page}&num_pages=1`, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": rapidApiKey,
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com"
      }
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('RapidAPI Error:', text);
      throw new Error(`RapidAPI responded with ${response.status}: ${text}`);
    }

    const data = await response.json();
    const externalJobs = data.data || [];

    // 2. Transform Data
    const jobsToInsert = externalJobs.map((job: any) => ({
      title: job.job_title,
      company: job.employer_name,
      location: `${job.job_city || ''}, ${job.job_country || ''}`.replace(/^, /, ''),
      type: job.job_employment_type || 'Full-time',
      salary: job.job_min_salary ? `$${job.job_min_salary}-${job.job_max_salary}` : null,
      description: job.job_description,
      external_id: job.job_id,
      source: 'rapidapi_jsearch',
      application_url: job.job_apply_link,
      logo_url: job.employer_logo,
      // Defaulting posted_at to now if not provided, or parsing valid dates
      posted_at: job.job_posted_at_datetime_utc ? new Date(job.job_posted_at_datetime_utc) : new Date(),
    }));

    if (jobsToInsert.length === 0) {
      return new Response(JSON.stringify({ message: "No jobs found", count: 0 }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 3. Upsert into Supabase (Dedup based on external_id if possible, but here we use ID. 
    // Ideally we should make external_id unique or primary key for upsert)
    // For now, we just insert. To prevent duplicates, we should check `external_id`.

    const { error: upsertError } = await supabaseClient
      .from('jobs')
      .upsert(jobsToInsert, { onConflict: 'external_id', ignoreDuplicates: false })

    if (upsertError) {
      console.error('Supabase Upsert Error:', upsertError)
      throw upsertError
    }

    return new Response(JSON.stringify({
      message: `Successfully fetched and stored ${jobsToInsert.length} jobs`,
      jobs: jobsToInsert
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error("Error processing request:", error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
