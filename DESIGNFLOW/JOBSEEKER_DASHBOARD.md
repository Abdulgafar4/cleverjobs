## Jobseeker Dashboard – Design Spec (based on agreed flow)

### 1) Objectives
- Surface the most relevant jobs immediately (personalized feed).
- Provide fast access to key actions (resume/profile, saved, alerts).
- Summarize recent activity (applications, interviews, messages).
- Guide unprofiled users to complete profile/resume upload.

### 2) Page Layout (Desktop)
- Global top nav: Discover, Companies, Alerts, Resources, Profile
- Content container (max‑width 1200–1280px)
- Two‑column grid:
  - Left/main (≈ 2/3): Feed and search context
  - Right/rail (≈ 1/3): Quick Actions, Suggested Searches, Activity, Alerts preview

High‑level wireframe (not to scale):

```
[Top Nav: Discover | Companies | Alerts | Resources | Profile]

|---------------------------------------------------------------|
|  H1: Welcome back, {first_name}                               |
|  Sub: Here's what's new for your profile and preferences      |
|---------------------------------------------------------------|
| Main (2/3)                         | Right Rail (1/3)         |
|------------------------------------|--------------------------|
| [Inline SearchBar + filters]       | Quick Actions            |
|                                    | - Upload/replace resume  |
| [Personalize toggle ON/OFF]        | - Edit profile           |
|                                    | - Manage alerts          |
| [Chips: skills/title suggestions]  |                          |
|                                    | Suggested Searches       |
| [Feed: JobCard list]               | - “React developer”      |
|  - Match chips                     | - “Remote frontend”      |
|  - Save/Apply actions              | - “Senior Node.js”       |
|  - Infinite scroll/pagination      |                          |
|                                    | Recent Activity          |
| [Empty state + guidance]           | - Applications updates   |
|                                    | - Interviews upcoming    |
|                                    |                          |
|                                    | Alerts Preview           |
|                                    | - New matches today      |
|------------------------------------|--------------------------|
```

### 3) Main Area – Components & Behavior
- Header
  - Title: “Welcome back, {first_name}”
  - Subtitle: Contextual message (e.g., “3 new matches since yesterday”)
- Inline Search
  - Use existing `SearchBar` with `variant="inline"`
  - Pre‑filled using user preferences when available (location/type)
- Personalization Controls
  - Toggle: “Personalize for me” (default ON if profile has skills/title)
  - Tooltip: explains how personalization works and how to improve results
- Suggested Chips
  - Derived from `userMetadata.title` and `userMetadata.skills` (top 5)
  - Clicking applies a quick search (updates feed)
- Feed
  - Use existing `JobCard` and `JobCardSkeleton`
  - Ordering: personalized score desc; fallback to recency
  - Pagination or infinite scroll (keep first load snappy with 10–15)
- Empty States
  - No profile: prompt to upload resume or edit profile
  - No results: suggest broadening filters or turning personalization off

### 4) Right Rail – Modules
- Quick Actions (cards/buttons)
  - Upload/replace resume (to resume manager)
  - Edit profile (to profile overview)
  - Manage alerts (to saved searches & alerts)
- Suggested Searches
  - Up to 5 auto‑generated queries; include “Remote” and user’s location variant
- Recent Activity
  - Applications: last 3 with status chips; “View all” → Applications tab
  - Interviews: next 1–2 upcoming; “See schedule” if applicable
- Alerts Preview
  - “New matches today” count; CTA to Alerts section

### 5) Responsive Behavior
- Tablet (≥768px <1024px)
  - Stack right rail under main or switch to 1/2–1/2 when space allows
- Mobile (<768px)
  - Single column; order: Search → Toggle → Suggested Chips → Feed → Quick Actions → Activity → Alerts
  - Keep CTAs sticky minimal (e.g., a floating “Upload resume” on first visit)

### 6) Loading, Error, and Skeletons
- Initial load: show `JobCardSkeleton` list (6–8) while fetching personalization
- Modules: skeleton placeholders (3 lines for lists, single for counters)
- Error: inline message with retry button; feed should degrade to non‑personalized results

### 7) Empty‑State Details
- No profile/skills:
  - Hero card: “Boost your matches — upload your resume”
  - Secondary: “Or update your profile skills and preferences”
- No results (filters too strict):
  - Message: “No matches yet — try widening filters or turning off personalization”
  - Chips: “Clear filters”, “Remote”, “Any type”

### 8) Accessibility & UX
- Keyboard: Search input autofocus; toggle reachable via tab
- ARIA: announce feed updates, counts (“12 jobs found”), and status changes
- Color contrast: chips and match badges must meet WCAG AA

### 9) Analytics Events (frontend)
- dashboard_viewed
- feed_personalize_toggle_changed { on|off }
- suggested_chip_clicked { term }
- jobcard_viewed { job_id } (throttled)
- jobcard_action_clicked { job_id, action: save|apply }
- quick_action_clicked { action }

### 10) Data Dependencies
- `useUser()` → `userMetadata` (title, skills, location, preferences)
- Jobs dataset/API → list with title, company, description, location, type
- Optional: personalization scoring helper (client‑side rule‑based to start)

### 11) Component Mapping (reuse where possible)
- Search: `SearchBar` (inline)
- Feed: `JobCard`, `JobCardSkeleton`
- Notices/Toasts: existing `toaster` from `ui`
- Activity list: new lightweight list component or reuse `ApplicationItem` summary

### 12) Visual Style Notes
- Use existing “glass” and container classes for consistency
- Section cards with subtle borders; right rail uses stacked cards with 16–20px spacing
- Chips compact (height 32px), wrap to two lines max

### 13) Future Enhancements
- Explainability chips on JobCard (“Matches: React, Node, AWS”)
- Inline resume score banner when gaps vs viewed job are detected
- “Because you viewed/applied…” carousel under the feed



