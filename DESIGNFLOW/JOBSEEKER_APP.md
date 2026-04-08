## Jobseeker – Full App Design (Pages, Layouts, States)

### 0) Global Shell
- Top nav (global): Discover, Companies, Alerts, Resources, Profile
- Sidebar (in‑app): Dashboard, Jobs, Applications, Saved, Messages, Profile, Notifications, Account
- Container: max‑width 1200–1280px; 24px gutters; sticky top nav on scroll
- Common modules: `SearchBar`, `JobCard`, `JobCardSkeleton`, `ApplicationItem`, `StatRow`, `toaster`

### 1) Dashboard (Home)
- Layout: 2‑column (2/3 main, 1/3 rail)
- Header: “Welcome back, {first_name}” + context (“X new matches”)
- Main: Inline search; Personalize toggle; Suggested chips; Feed (JobCard list); Empty state
- Right rail: Quick actions (resume/profile/alerts), Suggested searches, Recent activity, Alerts preview
- States: Unprofiled (upload resume prompt), No results (broaden filters), Loading skeletons
- See `JOBSEEKER_DASHBOARD.md` for full details

### 2) Jobs (Browse/Search)
- Layout: Toolbar + 2‑column (filters rail + results)
- Toolbar: `SearchBar` (variant inline), chips for active filters, result count
- Filters rail: Location, Remote, Type, Salary range, Visa, Experience level
- Results: `JobCard` grid/list; pagination or infinite scroll
- Empty: “No jobs found” + actions (clear filters, try remote, broaden salary)
- States: Personalized ordering when toggle enabled; fallback to recency

### 3) Job Detail
- Header: title, company, location, type, salary (if present), Save, Apply button
- Subheader: match chips (“Matches: React, Node”), posted date, views (optional)
- Body tabs:
  - Overview: description, responsibilities, requirements, benefits
  - Company: about, culture, links, other open roles
  - Insights (optional): salary range, match explanation
- Right rail: Apply panel (resume selector, cover letter CTA), Similar jobs
- States: Already applied (show status), Login wall for apply/save if unauthenticated

### 4) Apply
- Stepper:
  - Step 1: Choose resume/profile; upload new or select default
  - Step 2: Cover letter (optional; AI assist button)
  - Step 3: Review & submit
- Confirmation screen: success message, similar jobs, manage alerts CTA
- Safeguards: unsaved changes warning; disabled submit until required fields ready

### 5) Applications
- Layout: List with filters (status, date, job type)
- Tabs: All, Active, Interviews, Offers, Archived
- List item: job/company, applied date, current status, quick actions (view/withdraw)
- Detail drawer/page:
  - Timeline (Submitted → Viewed → Interview → Offer → Decision)
  - Notes & reminders
  - Attachments (resume/cover)
  - Communication history (if applicable)
- Empty: “No applications yet” + CTA to Jobs / Suggested searches

### 6) Saved
- Tabs: Saved Jobs, Saved Searches & Alerts
- Saved Jobs: list of `JobCard` with unsave; bulk unsave; quick apply if available
- Saved Searches & Alerts:
  - List: query + filters snapshot; frequency (daily/weekly); toggle on/off
  - Create: from current filters; default to daily; editable name
- Empty: “Nothing saved yet” + CTA to create alert from profile skills

### 7) Messages (optional)
- Tabs: Inbox, Sent, Templates
- Threads list: job/company context, last message preview, unread badge
- Thread view: message bubbles, attachments, quick templates
- Templates: manage canned responses (follow‑up, thank you, etc.)
- Empty: Guidance copy; link to Applications

### 8) Profile
- Sections:
  - Overview: name, title, location, contact links
  - Resume Manager: upload/manage multiple; set default
  - Skills & Preferences: skills chips; job types; remote; salary; visa; location
  - Links: LinkedIn, portfolio, website
  - Privacy: profile visibility; data export/delete
- UX: inline edits; optimistic save; validation; toasts
- State: if empty, offer resume import to prefill

### 9) Notifications
- In‑app center: grouped by application, interviews, new matches
- Settings:
  - Categories: application updates, interviews, new matches, newsletters
  - Channels: in‑app (always on), email, web push; per‑category frequency
- Detail: per‑notification drill‑down to source (job, application)

### 10) Account
- Account & Security: email, password, sessions/devices
- Connected Apps: calendar, storage; revoke tokens
- Danger zone: delete account (requires confirmation)

### 11) Responsive Rules
- Desktop (≥1024): 2‑column patterns; persistent sidebar
- Tablet (≥768 <1024): collapsible sidebar; stacked rails
- Mobile (<768): single column; key CTAs sticky where helpful

### 12) Loading & Error
- Skeletons per list and panel; progressive hydration of rails
- Inline errors with retry; graceful degradation to non‑personalized lists

### 13) Accessibility
- Keyboard nav for search, tabs, and lists; focus rings
- ARIA for counts, status changes, and timelines
- Color contrast and motion‑reduced animations

### 14) Analytics (Key Events)
- jobs_browse_viewed, job_detail_viewed { job_id }
- apply_step_viewed { step }, apply_submitted { job_id }
- application_status_viewed { app_id }, application_withdrawn { app_id }
- save_job_toggled { job_id, saved }, saved_search_created { query }
- profile_updated { section }, resume_uploaded
- notification_settings_changed { category, channel }

### 15) Component Mapping (Implementation Hints)
- Reuse: `SearchBar`, `JobCard`, `JobCardSkeleton`, `ApplicationItem`, `StatRow`, `ui/toaster`
- New: `ApplyStepper`, `MatchChips`, `SuggestedChips`, `AlertsList`, `ActivityList`
- Routes: `/dashboard`, `/jobs`, `/jobs/:id`, `/apply/:jobId`, `/applications`, `/saved`, `/messages`, `/profile`, `/notifications`, `/account`



