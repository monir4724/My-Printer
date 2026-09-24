/**
 * Report + export — load by ?id=, insert snapshot, then window.print().
 */

let applicationData = null;
let currentAppId = '';

function getAppIdFromUrl() {
  const fromQuery = (new URLSearchParams(window.location.search).get('id') || '').trim();
  if (fromQuery) return fromQuery;
  return (sessionStorage.getItem('currentAppId') || '').trim();
}

async function fetchApplication(appId) {
  if (!navigator.onLine) throw new Error('No internet connection.');

  const { data, error } = await supabaseClient
    .from(TABLES.APPLICATIONS)
    .select('*')
    .eq('id', appId)
    .single();

  if (error) throw new Error(error.message || 'Could not load application data.');
  return data;
}

function renderApplication(app) {
  document.getElementById('app-id').textContent = app.id;
  document.getElementById('generated-date').textContent = new Date()
    .toISOString()
    .slice(0, 10);

  document.getElementById('field-name').textContent = app.applicant_name;
  document.getElementById('field-email').textContent = app.applicant_email;
  document.getElementById('field-position').textContent = app.position;
  document.getElementById('field-department').textContent = app.department;
  document.getElementById('field-date').textContent = formatDate(app.applied_date);
  document.getElementById('field-notes').textContent = app.notes || '—';

  const badge = document.getElementById('field-status');
  badge.textContent = app.status;
  badge.className = 'status-badge ' + statusBadgeClass(app.status);

  document.title = buildPdfFileTitle(app);

  document.getElementById('report-content').hidden = false;
  document.getElementById('report-loading').hidden = true;
  document.getElementById('report-error').hidden = true;
}

function showFetchError(message) {
  const banner = document.getElementById('report-error');
  const msg = document.getElementById('report-error-msg');
  if (msg) msg.textContent = message || 'Could not load application data.';
  if (banner) banner.hidden = false;

  document.getElementById('report-loading').hidden = true;
  document.getElementById('report-content').hidden = true;

  const exportBtn = document.getElementById('export-btn');
  if (exportBtn) exportBtn.disabled = true;
}

function updatePrintFooter(email) {
  const footer = document.getElementById('print-footer');
  if (!footer) return;
  footer.textContent =
    'Exported by: ' + (email || 'unknown') + ' on ' + new Date().toLocaleString();
}

async function handleExport() {
  const exportBtn = document.getElementById('export-btn');
  const exportError = document.getElementById('export-error');
  const defaultLabel = 'Export & Save';

  if (exportError) {
    exportError.hidden = true;
    exportError.querySelector('.error-banner-text').textContent = '';
  }

  try {
    if (!navigator.onLine) throw new Error('No internet connection.');

    exportBtn.disabled = true;
    exportBtn.textContent = 'Saving...';

    const user = await getCurrentUser();
    if (!user) {
      alert('Session expired. Please login again.');
      window.location.replace('index.html?reason=session');
      return;
    }

    const { data: appData, error: fetchError } = await supabaseClient
      .from(TABLES.APPLICATIONS)
      .select('*')
      .eq('id', currentAppId)
      .single();

    if (fetchError || !appData) throw new Error('Failed to load application data.');

    applicationData = appData;

    const { error: insertError } = await supabaseClient.from(TABLES.EXPORT_SNAPSHOTS).insert({
      exported_by: user.id,
      exporter_email: user.email,
      application_id: currentAppId,
      snapshot_data: appData,
    });

    if (insertError) throw new Error('Snapshot save failed. Export cancelled.');

    updatePrintFooter(user.email);
    document.title = buildPdfFileTitle(appData);
    window.print();
  } catch (err) {
    const message = err.message || 'Export failed. Please try again.';
    alert(message);
    if (exportError) {
      exportError.querySelector('.error-banner-text').textContent = message;
      exportError.hidden = false;
    }
  } finally {
    if (!exportBtn) return;
    exportBtn.textContent = defaultLabel;
    exportBtn.disabled = !applicationData;
  }
}

async function initReportPage() {
  if (!supabaseClient) {
    showFetchError('Could not load auth library. Refresh and try again.');
    return;
  }

  const session = await requireAuth();
  if (!session) return;

  currentAppId = getAppIdFromUrl();
  if (!currentAppId) {
    window.location.replace('list.html');
    return;
  }

  watchAuthState(() => window.location.replace('index.html?reason=session'));

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) logoutBtn.addEventListener('click', () => signOut());

  const exportBtn = document.getElementById('export-btn');
  if (exportBtn) exportBtn.addEventListener('click', () => handleExport());

  try {
    applicationData = await fetchApplication(currentAppId);
    renderApplication(applicationData);
    sessionStorage.setItem('currentAppId', currentAppId);

    const user = await getCurrentUser();
    if (user) updatePrintFooter(user.email);
  } catch (err) {
    showFetchError(err.message || 'Could not load application data for ID: ' + currentAppId);
  }
}
