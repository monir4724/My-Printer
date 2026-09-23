/**
 * My Printer — Applications list
 * Loads all rows from applications; open report via report.html?id=...
 */

function statusBadgeClass(status) {
  const s = (status || '').toLowerCase();
  if (s.includes('approved')) return 'status-badge--approved';
  if (s.includes('reject')) return 'status-badge--rejected';
  return 'status-badge--review';
}

async function fetchAllApplications() {
  if (!navigator.onLine) {
    throw new Error('No internet connection.');
  }

  const { data, error } = await supabaseClient
    .from(TABLES.APPLICATIONS)
    .select('id, applicant_name, position, department, status, applied_date')
    .order('id', { ascending: true });

  if (error) {
    throw new Error(error.message || 'Could not load applications.');
  }

  return data || [];
}

function renderApplications(rows) {
  const tbody = document.getElementById('apps-tbody');
  const countEl = document.getElementById('list-count');
  const wrap = document.getElementById('list-table-wrap');
  const loading = document.getElementById('list-loading');

  tbody.innerHTML = '';

  if (rows.length === 0) {
    countEl.textContent = 'No applications found.';
    loading.hidden = true;
    wrap.hidden = true;
    return;
  }

  countEl.textContent = rows.length + ' application' + (rows.length === 1 ? '' : 's');

  rows.forEach((app) => {
    const tr = document.createElement('tr');

    const idTd = document.createElement('td');
    idTd.className = 'mono';
    idTd.textContent = app.id;

    const nameTd = document.createElement('td');
    nameTd.textContent = app.applicant_name || '—';

    const posTd = document.createElement('td');
    posTd.textContent = app.position || '—';

    const deptTd = document.createElement('td');
    deptTd.textContent = app.department || '—';

    const statusTd = document.createElement('td');
    const badge = document.createElement('span');
    badge.className = 'status-badge ' + statusBadgeClass(app.status);
    badge.textContent = app.status || '—';
    statusTd.appendChild(badge);

    const actionTd = document.createElement('td');
    const link = document.createElement('a');
    link.className = 'btn-link';
    const appId = String(app.id);
    link.href = 'report.html?id=' + encodeURIComponent(appId);
    link.textContent = 'View / Export';
    link.addEventListener('click', () => {
      sessionStorage.setItem('currentAppId', appId);
    });
    actionTd.appendChild(link);

    tr.appendChild(idTd);
    tr.appendChild(nameTd);
    tr.appendChild(posTd);
    tr.appendChild(deptTd);
    tr.appendChild(statusTd);
    tr.appendChild(actionTd);
    tbody.appendChild(tr);
  });

  loading.hidden = true;
  wrap.hidden = false;
}

function showListError(message) {
  const banner = document.getElementById('list-error');
  const msg = document.getElementById('list-error-msg');
  if (msg) msg.textContent = message || 'Could not load applications.';
  if (banner) banner.hidden = false;
  document.getElementById('list-loading').hidden = true;
  document.getElementById('list-table-wrap').hidden = true;
  document.getElementById('list-count').textContent = '';
}

async function initListPage() {
  if (!supabaseClient) {
    showListError('Could not load auth library. Check your connection and refresh.');
    return;
  }

  const session = await requireAuth();
  if (!session) return;

  watchAuthState(() => {
    window.location.replace('index.html?reason=session');
  });

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => signOut());
  }

  try {
    const rows = await fetchAllApplications();
    renderApplications(rows);
  } catch (err) {
    showListError(err.message || 'Could not load applications.');
  }
}
