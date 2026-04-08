# CleverJobs

A modern job marketplace built with React, Vite, Supabase, and Tailwind CSS.

CleverJobs supports job seekers and employers with a full workflow:
- Discover and search jobs
- View job and company profiles
- Sign in with Supabase authentication
- Job seeker onboarding and profile management
- Employer dashboard for posting, editing, and managing jobs
- Resume upload and parsing with optional AI enhancement
- FAQ and settings pages

## What this app does

The app provides a complete hiring experience:

- Landing page with featured jobs and employer spotlight
- Job search and filters across roles, locations, and tags
- Job detail pages with apply flow
- Company directory and company profile pages
- Employer job management, including post/edit/delete flows
- Candidate dashboard, profile management, and onboarding
- Resume parsing via local rule-based parser, with optional OpenAI AI parsing when `VITE_OPENAI_API_KEY` is configured

## Tech stack

- Vite
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui components
- React Router Dom
- TanStack React Query
- Supabase for auth and database
- OpenAI SDK (optional resume parsing)

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env.local` file at the project root with your Supabase values:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. (Optional) Add OpenAI if you want AI-powered resume parsing:

```env
VITE_OPENAI_API_KEY=your_openai_api_key
```

4. Start the development server:

```bash
npm run dev
```

5. Open the local preview URL shown by Vite.

## Available scripts

- `npm run dev` — start Vite dev server
- `npm run build` — produce production build
- `npm run preview` — preview the production build locally
- `npm run lint` — run ESLint

## Supabase setup

This application expects a Supabase project with a `jobs` table and user authentication enabled. The repository includes Supabase configuration and migration files under `supabase/`.

If you use Supabase locally or in your own project, make sure the following environment values are correct:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Key app routes

- `/` — landing page
- `/jobs` — job search
- `/jobs/:id` — job details
- `/apply/:id` — apply to a job
- `/post-job` — employer job posting
- `/jobs/manage` — employer job manager
- `/edit-job/:id` — edit job listing
- `/companies` — companies directory
- `/companies/:id` — company profile
- `/auth` — authentication
- `/onboarding` — user onboarding
- `/dashboard` — user dashboard
- `/profile` — user profile
- `/settings` — app settings
- `/faq` — frequently asked questions

## Notes

- Resume parsing supports PDF/DOCX uploads and falls back to a local parser if no OpenAI key is provided.
- The app is designed for both job seekers and employers.
- The codebase includes reusable UI primitives in `src/components/ui` and Supabase integration in `src/integrations/supabase/client.ts`.

## License

This project does not include a license file. Add one if you want to publish or share it publicly.
