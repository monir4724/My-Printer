/**
 * Single Supabase client for the whole app.
 * Uses the anon key only — never put service_role in frontend code.
 *
 * CDN global is `supabase` (SDK). App client is `supabaseClient`.
 */

const SUPABASE_URL = 'https://xbuvmomyojgpduvkmgyx.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhidXZtb215b2pncGR1dmttZ3l4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAxNzU3NDcsImV4cCI6MjEwNTc1MTc0N30.T2olpO0kNoCCq131kWKSmxECMa0kx2GuhG6Hpbkq-eM';

const TABLES = {
  APPLICATIONS: 'applications',
  EXPORT_SNAPSHOTS: 'export_snapshots',
};

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
const supabaseClient =
  supabaseSdk && typeof supabaseSdk.createClient === 'function'
    ? supabaseSdk.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

if (!supabaseClient) {
  console.error('Supabase SDK failed to load or is not configured.');
}
