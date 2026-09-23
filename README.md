# My Printer

Staff-facing web app for viewing a job application summary and exporting it as a print-ready PDF, with an audit snapshot stored in Supabase.

**Challenge:** Email-friendly HTML Report Exporter

**Repo:** https://github.com/monir4724/My-Printer

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
├── report.html         # Report + export (?id=...)
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
├── deliverables/       # Submission assets + checklists
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

---

## Setup Guide

### 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Project Settings → **API** — copy **Project URL** and **anon public** key.
3. Never copy or commit the **service_role** key.

### 2. Apply the database schema

1. Open **SQL Editor** and run the entire contents of `schema.sql`.
2. Confirm `applications` and `export_snapshots` exist with RLS enabled.

### 3. Auth setup

1. Authentication → Providers → **Email** enabled.
2. Turn **OFF** “Confirm email”.
3. Authentication → Users → **Add user**.

### 4. Credentials

`js/supabase.js` already has project URL + anon key for this deployment. Never put `service_role` in the repo.

### 5. Run locally

```bash
npx serve .
```

Open `http://localhost:3000` and sign in with your staff user.

### 6. Deploy

Deploy to Vercel, Netlify, or GitHub Pages. Update the Live URL section above.

---

## How to Use

1. Sign in
2. Applications list loads from Supabase
3. **View / Export** on any row
4. **Export & Save** → snapshot insert → print dialog → Save as PDF

---

*My Printer · WEB-07 · Moniruzzaman*
