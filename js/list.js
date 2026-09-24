/**
 * Applications list — fetch all rows, sort by id, open report.html?id=...
 */

async function fetchAllApplications() {
  if (!navigator.onLine) throw new Error('No internet connection.');

  const { data, error } = await supabaseClient
    .from(TABLES.APPLICATIONS)
    .select('id, applicant_name, position, department, status, applied_date');

  if (error) throw new Error(error.message || 'Could not load applications.');
  return sortApplicationsById(data || []);
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

  countEl.textContent = rows.length + (rows.length === 1 ? ' application' : ' applications');

  rows.forEach((app) => {
    const tr = document.createElement('tr');
    const appId = String(app.id);

    const cells = [
      { text: appId, className: 'mono' },
      { text: app.applicant_name || '—' },
      { text: app.position || '—' },
      { text: app.department || '—' },
    ];

    cells.forEach(({ text, className }) => {
      const td = document.createElement('td');
      if (className) td.className = className;
      td.textContent = text;
      tr.appendChild(td);
    });

    const statusTd = document.createElement('td');
    const badge = document.createElement('span');
    badge.className = 'status-badge ' + statusBadgeClass(app.status);
    badge.textContent = app.status || '—';
    statusTd.appendChild(badge);
    tr.appendChild(statusTd);

    const actionTd = document.createElement('td');
    const link = document.createElement('a');
    link.className = 'btn-link';
    link.href = 'report.html?id=' + encodeURIComponent(appId);
    link.textContent = 'View / Export';
    link.addEventListener('click', () => {
      sessionStorage.setItem('currentAppId', appId);
    });
    actionTd.appendChild(link);
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
    showListError('Could not load auth library. Refresh and try again.');
    return;
  }

  const session = await requireAuth();
  if (!session) return;

  watchAuthState(() => window.location.replace('index.html?reason=session'));

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) logoutBtn.addEventListener('click', () => signOut());

  try {
    renderApplications(await fetchAllApplications());
  } catch (err) {
    showListError(err.message || 'Could not load applications.');
  }
}
