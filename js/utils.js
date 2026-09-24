/**
 * Shared UI helpers (list + report).
 */

function statusBadgeClass(status) {
  const s = (status || '').toLowerCase();
  if (s.includes('reject')) return 'status-badge--rejected';
  if (s.includes('approved') || s.includes('shortlist')) return 'status-badge--approved';
  if (s.includes('interview')) return 'status-badge--interview';
  if (s === 'applied' || s.includes('applied')) return 'status-badge--applied';
  return 'status-badge--review';
}

function formatDate(value) {
  if (!value) return '—';
  try {
    const raw = String(value);
    const d = new Date(raw.length <= 10 ? raw + 'T00:00:00' : raw);
    if (Number.isNaN(d.getTime())) return raw;
    return d.toLocaleDateString('en-CA');
  } catch {
    return String(value);
  }
}

/** Sort application IDs ascending (numeric when possible). */
function sortApplicationsById(rows) {
  return [...rows].sort((a, b) => {
    const aId = String(a.id ?? '');
    const bId = String(b.id ?? '');
    const aNum = Number(aId);
    const bNum = Number(bId);
    const aIsNum = aId !== '' && Number.isFinite(aNum);
    const bIsNum = bId !== '' && Number.isFinite(bNum);

    if (aIsNum && bIsNum) return aNum - bNum;
    if (aIsNum) return -1;
    if (bIsNum) return 1;
    return aId.localeCompare(bId, undefined, { numeric: true, sensitivity: 'base' });
  });
}

/** Default PDF filename from application id + name. */
function buildPdfFileTitle(app) {
  const safeName = String(app.applicant_name || 'Applicant')
    .trim()
    .replace(/[\\/:*?"<>|]+/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  const safeId = String(app.id || 'unknown')
    .replace(/[\\/:*?"<>|]+/g, '')
    .replace(/\s+/g, '-');
  return 'Application-' + safeId + '-' + safeName + '-My-Printer';
}
