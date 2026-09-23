/**
 * My Printer — Single Supabase client
 * anon key only — never put service_role here.
 *
 * CDN exposes global `supabase` (the SDK). Our app client is
 * named `supabaseClient` to avoid "already been declared".
 */

const SUPABASE_URL = 'https://xbuvmomyojgpduvkmgyx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhidXZtb215b2pncGR1dmttZ3l4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAxNzU3NDcsImV4cCI6MjEwNTc1MTc0N30.T2olpO0kNoCCq131kWKSmxECMa0kx2GuhG6Hpbkq-eM';

const TABLES = {
  APPLICATIONS: 'applications',
  EXPORT_SNAPSHOTS: 'export_snapshots',
};

const APP_ID = 'APP-2026-001';

/** True when placeholders were replaced with a real project */
function isSupabaseConfigured() {
  return (
    typeof SUPABASE_URL === 'string' &&
    SUPABASE_URL.startsWith('https://') &&
    !SUPABASE_URL.includes('YOUR_') &&
    typeof SUPABASE_ANON_KEY === 'string' &&
    SUPABASE_ANON_KEY.length > 40 &&
    !SUPABASE_ANON_KEY.includes('YOUR_')
  );
}

const supabaseSdk = window.supabase;

if (!supabaseSdk || typeof supabaseSdk.createClient !== 'function') {
  console.error('Supabase SDK failed to load. Check the CDN script tag.');
} else if (!isSupabaseConfigured()) {
  console.error('Supabase URL / anon key are not configured in js/supabase.js');
}

const supabaseClient = supabaseSdk
  ? supabaseSdk.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;
