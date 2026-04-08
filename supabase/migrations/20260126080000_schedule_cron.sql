-- Enable pg_cron extension
create extension if not exists pg_cron;

-- Schedule the edge function to run every hour
-- Note: You need to replace PROJECT_REF and ANON_KEY/SERVICE_ROLE_KEY or use net.http_post
-- Since we are inside Supabase, we can use pg_net or just trust the edge function URL structure if available.
-- However, standard way is:

select
  cron.schedule(
    'fetch-external-jobs-hourly', -- name of the cron job
    '0 * * * *', -- every hour
    $$
    select
      net.http_post(
        url:='https://PROJECT_REF.supabase.co/functions/v1/fetch-external-jobs',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer SERVICE_ROLE_KEY"}'::jsonb,
        body:='{}'::jsonb
      ) as request_id;
    $$
  );
