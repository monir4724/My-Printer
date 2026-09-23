-- ============================================================
-- My Printer — Optional RLS checks (after schema.sql + Auth user)
-- ============================================================

-- 1) Seed present?
select * from applications where id = 'APP-2026-001';

-- 2) Anon must see 0 rows
begin;
  set local role anon;
  select count(*) as applications_as_anon from applications;
  select count(*) as snapshots_as_anon from export_snapshots;
rollback;

-- 3) FK / spoof tests: run from the logged-in app, or set JWT claims
--    (see comments in previous backend-tests notes)
