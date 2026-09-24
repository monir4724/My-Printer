# My Printer

Staff web app to view job applications and export a print-ready PDF, while saving an audit snapshot in Supabase.

**Repo:** [github.com/monir4724/My-Printer](https://github.com/monir4724/My-Printer)

---

## Features

- Supabase Auth (email + password)
- Applications list (sorted by ID)
- Application report with print stylesheet
- Export & Save → insert `export_snapshots` → `window.print()`
- Exporter identity + timestamp stored with each snapshot

---

## Stack

| Layer | Tech |
|-------|------|
| Frontend | HTML, CSS, Vanilla JS |
| Auth / DB | Supabase (Postgres + RLS) |
| PDF | Browser print |

---

## Structure

```
├── index.html      # Login
├── list.html       # Applications list
├── report.html     # Report + export (?id=)
├── css/
│   ├── style.css
│   └── print.css
├── js/
│   ├── supabase.js
│   ├── utils.js
│   ├── auth.js
│   ├── list.js
│   └── report.js
├── schema.sql
└── README.md
```

---

## Setup

1. Create a Supabase project
2. Run `schema.sql` in the SQL Editor
3. Auth → Email provider on, **Confirm email OFF**
4. Create a staff user (Authentication → Users)
5. Put project URL + anon key in `js/supabase.js` (already set for this project)
6. Run locally:

```bash
npx serve .
```

Open `http://localhost:3000` and sign in.

> Never commit the `service_role` key.

---

## Usage

1. Sign in  
2. Open an application from the list  
3. Click **Export & Save**  
4. Snapshot is stored → print dialog opens → Save as PDF  

---

## Live URL

> Add after deploy (Vercel / Netlify / GitHub Pages).
