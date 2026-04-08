## Jobseeker Design Flow (Single Format)

- Entry & Onboarding
  - Role selection → Sign up/sign in
  - Upload resume (optional) → parse → confirm profile (title, skills, location)
  - Set preferences (job types, remote, salary range, visa)
  - Success → land on Dashboard

- Sidebar (Tabs & Contents)
  - Dashboard
    - Feed (personalized toggle)
    - Suggested Searches (from skills/title)
    - Recent Activity (applications, interviews, messages)
  - Jobs
    - Search & Filters (q, location, type, remote, salary, visa)
    - Results (JobCard with match chips; save/apply)
    - Job Detail (header, description, requirements, benefits, company, similar)
    - Apply (choose resume/profile, optional AI cover letter, review, submit, confirmation)
  - Applications
    - All, Active, Interviews, Offers, Archived
    - Application Detail (timeline, notes, reminders, attachments; withdraw/follow‑up)
  - Saved
    - Saved Jobs
    - Saved Searches & Alerts (email/web push frequencies)
  - Messages (optional)
    - Inbox, Sent, Templates (cover letters, quick replies)
  - Profile
    - Overview (name, title, location)
    - Resume Manager (multiple resumes; set default)
    - Skills & Preferences (job types, remote, salary, visa)
    - Links (LinkedIn, portfolio)
    - Privacy (visibility, data export/delete)
  - Notifications
    - In‑App (categories)
    - Email & Web Push (frequency, digest)
  - Account
    - Account & Security (email, password, sessions)
    - Connected Apps (calendar, storage)

- Key States & Guards
  - Unprofiled user → inline prompt to upload resume
  - Not authenticated → gate apply/save/alerts; preserve intent after login
  - Insufficient profile data → show non‑personalized feed fallback

- Navigation (IA)
  - Top nav: Discover, Companies, Alerts, Resources, Profile (global)
  - Sidebar drives in‑app sections listed above