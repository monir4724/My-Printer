# My Printer

Staff-facing web app for viewing a job application summary and exporting it as a print-ready PDF, with an audit snapshot stored in Supabase.

**Challenge:** Email-friendly HTML Report Exporter

---

## Live URL

> Add your deployed URL here after publishing (Vercel / Netlify / GitHub Pages).

## Walkthrough Video

> Add your ≤5 min walkthrough video link here.

## Submission pack

See the `deliverables/` folder for:

- `sample-print.pdf` — sample PDF
- `screenshot.png` — print layout screenshot
- `schema.sql` — copy of SQL
- Checklists for Google Drive, snapshot evidence, and video script

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | HTML, CSS, Vanilla JavaScript |
| Auth | Supabase Auth (Email + Password) |
| Database | Supabase (PostgreSQL + RLS) |
| PDF | Browser native `window.print()` |

---

## Project Structure

```
my-printer/
├── index.html          # Login page
├── list.html           # All applications (after login)
├── report.html         # Report + export (?id=APP-...)
├── css/
│   ├── style.css       # Screen styles
│   └── print.css       # Print-only styles
├── js/
│   ├── supabase.js     # Supabase client (backend entry)
│   ├── auth.js         # Login / logout / session
│   ├── list.js         # Applications list
│   └── report.js       # Load application + export
├── schema.sql          # Tables + RLS + seed
├── backend-tests.sql   # RLS / FK verification scripts
└── README.md
```

---

## Backend (Supabase)

No custom server — the frontend talks to Supabase with the **anon** key. Access control is enforced by **RLS**, not JavaScript.

**Schema source of truth:** PRD v1.2.0 (`schema.sql`).

### Tables

| Table | Purpose |
|-------|---------|
| `applications` | Flat fields (name, email, position, dept, date, status, notes) |
| `export_snapshots` | Audit on export (`exported_by`, `exporter_email`, `snapshot_data`, `exported_at`) |

### Allowed client calls

| Action | Call |
|--------|------|
| Sign in | `auth.signInWithPassword` |
| Session | `auth.getSession` / `onAuthStateChange` / `signOut` |
| Fetch app | `from('applications').select('*').eq('id', APP_ID).single()` |
| Save snapshot | `from('export_snapshots').insert({ exported_by, exporter_email, application_id, snapshot_data })` |

---

## Setup Guide

### 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Project Settings → **API** — copy **Project URL** and **anon public** key.
3. Never copy or commit the **service_role** key.

### 2. Apply the database schema

1. Open **SQL Editor** and run the entire contents of `schema.sql`.
2. Confirm `applications` and `export_snapshots` exist with RLS enabled.
3. Confirm seed row `APP-2026-001` is present.

### 3. Auth setup

1. Authentication → Providers → **Email** enabled; disable unused providers.
2. Turn **OFF** “Confirm email” (MVP: admin-created staff accounts only).
3. Authentication → Users → **Add user** (e.g. `hr@example.com`).
4. No public signup page in MVP.

### 4. Verify backend (before relying on UI)

In SQL Editor, run checks from `backend-tests.sql` (anon → 0 rows; FK / spoof insert must fail). Also confirm export from the app creates a row owned by your user.

### 5. Add your Supabase credentials

Open `js/supabase.js` and replace the placeholders:

```js
const SUPABASE_URL = 'YOUR_PROJECT_URL';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';
```

> Never put the `service_role` key in frontend code, README, or git.

### 6. Run locally

Serve the folder with any static server, for example:

```bash
npx serve .
```

Then open the printed URL (e.g. `http://localhost:3000`) and log in with your test user.

### 7. Deploy

Deploy the folder to Vercel, Netlify, or GitHub Pages. Update the Live URL section above.

---

## How to Use

1. Open the app → login page
2. Sign in with your staff email + password
3. **Applications list** shows every row from Supabase (including CSV imports)
4. Click **View / Export** on any row
5. Click **Export & Save**
6. Snapshot is written to `export_snapshots`, then the browser print dialog opens
7. Choose **Save as PDF**

---

## Pre-Launch Checklist

- [ ] Supabase project created
- [ ] `SUPABASE_URL` and `SUPABASE_ANON_KEY` set in `js/supabase.js`
- [ ] Tables + RLS + seed data applied via `schema.sql`
- [ ] Email confirmation disabled
- [ ] Test user created and can log in
- [ ] Export creates a row in `export_snapshots`
- [ ] Navbar / Export button hidden in print preview
- [ ] “Exported by” footer visible in print
- [ ] Live URL working

---

*My Printer · WEB-07 · Moniruzzaman*
