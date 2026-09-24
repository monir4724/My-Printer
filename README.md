# My Printer

**Version:** [1.0.0](./VERSION) · [Changelog](./CHANGELOG.md)

Staff web app to view job applications and export a print-ready PDF, while saving an audit snapshot in Supabase.

---

## Links

| Resource | URL |
|----------|-----|
| **Live app** | https://my-printer-ten.vercel.app/ |
| **GitHub repo** | https://github.com/monir4724/My-Printer |
| **Walkthrough video** | https://youtu.be/pRe3ZkWMqJw |
| **Google Drive folder** | https://drive.google.com/drive/u/0/folders/1PzvOOrAiS7rK_ubQcLgO_-pVWluY1tyR |

---

## Features

- Supabase Auth (email + password)
- Applications list (sorted by ID ascending)
- Application report with print stylesheet
- **Export & Save** → insert `export_snapshots` (timestamp + exporter identity) → `window.print()`
- Unique PDF filenames per application

---

## Stack

| Layer | Tech |
|-------|------|
| Frontend | HTML, CSS, Vanilla JS |
| Auth / DB | Supabase (Postgres + RLS) |
| Hosting | [Vercel](https://my-printer-ten.vercel.app/) |
| PDF | Browser native print |

---

## Versioning

This project uses [Semantic Versioning](https://semver.org/):

| File | Purpose |
|------|---------|
| [`VERSION`](./VERSION) | Current version number |
| [`CHANGELOG.md`](./CHANGELOG.md) | Release history |
| Git tags (`v1.0.0`, …) | Tagged releases on GitHub |

**Current release:** `v1.0.0`

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
├── VERSION
├── CHANGELOG.md
└── README.md
```

---

## Setup

1. Create a Supabase project  
2. Run `schema.sql` in the SQL Editor  
3. Auth → Email provider **ON**, Confirm email **OFF**  
4. Create a staff user (Authentication → Users)  
5. Set project URL + anon key in `js/supabase.js`  
6. Run locally:

```bash
npx serve .
```

Open `http://localhost:3000` and sign in.

> Never commit the `service_role` key.

---

## Usage

1. Sign in at the [live app](https://my-printer-ten.vercel.app/)  
2. Open an application from the list  
3. Click **Export & Save**  
4. Snapshot is stored → print dialog opens → Save as PDF  

See the [walkthrough video](https://youtu.be/pRe3ZkWMqJw) for a full demo.

---

## License

Private coursework / challenge submission unless otherwise stated.
