# Changelog

All notable changes to **My Printer** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project follows [Semantic Versioning](https://semver.org/).

## [1.0.0] — 2026-09-24

### Added
- Staff login with Supabase Auth (email + password)
- Applications list with numeric ID sorting
- Application summary report page (`report.html?id=`)
- Export & Save: insert into `export_snapshots`, then browser print/PDF
- Print stylesheet (`css/print.css`) with clean page-break rules
- Unique PDF default filenames (id + applicant name)
- Database schema + seed (`schema.sql`) with RLS policies
- Shared helpers in `js/utils.js`

### Links
- Live: https://my-printer-ten.vercel.app/
- Repo: https://github.com/monir4724/My-Printer
- Walkthrough: https://youtu.be/pRe3ZkWMqJw
- Drive: https://drive.google.com/drive/u/0/folders/1PzvOOrAiS7rK_ubQcLgO_-pVWluY1tyR

[1.0.0]: https://github.com/monir4724/My-Printer/releases/tag/v1.0.0
