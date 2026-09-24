-- My Printer — schema + seed
-- Run once in Supabase SQL Editor

drop table if exists export_snapshots;
drop table if exists applications;

create table applications (
  id               text primary key,
  applicant_name   text not null,
  applicant_email  text not null,
  position         text not null,
  department       text not null,
  applied_date     date not null,
  status           text not null,
  notes            text
);

alter table applications enable row level security;

create policy "Authenticated users can read applications"
  on applications for select
  to authenticated
  using (true);

create table export_snapshots (
  id               uuid primary key default gen_random_uuid(),
  exported_at      timestamptz default now(),
  exported_by      uuid references auth.users(id),
  exporter_email   text not null,
  application_id   text not null,
  snapshot_data    jsonb not null
);

alter table export_snapshots enable row level security;

create policy "Authenticated users can insert snapshots"
  on export_snapshots for insert
  to authenticated
  with check (exported_by = auth.uid());

create policy "Users can view own snapshots"
  on export_snapshots for select
  to authenticated
  using (exported_by = auth.uid());

insert into applications values (
  '1',
  'Rafiqul Islam',
  'rafiq@example.com',
  'Software Engineer',
  'Engineering',
  '2026-09-01',
  'Under Review',
  'Strong candidate — recommended for interview stage.'
);
