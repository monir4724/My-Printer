# Snapshot evidence (1 minute)

Judges need proof that Export creates a Supabase row with timestamp + exporter identity.

## Steps

1. Open the live or local app → login
2. Open any application → **Export & Save**
3. In Supabase → **Table Editor** → **`export_snapshots`**
4. Confirm a new row with:
   - `exported_at` (timestamp)
   - `exported_by` (UUID)
   - `exporter_email` (your staff email)
   - `application_id`
   - `snapshot_data` (JSON)
5. Take a screenshot of that table (full row visible)
6. Save it as:

```
deliverables/assets/screenshot-export-snapshots.png
```

Also copy into the Google Drive `assets/` folder.

## Why this wasn’t auto-filled

Pulling your live `export_snapshots` with the **service_role** key from this environment is blocked (security). You must capture it once from the Dashboard after a real Export click.
