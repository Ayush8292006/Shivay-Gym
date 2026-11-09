// =============================================================================
// Date helpers for the prototype
// -----------------------------------------------------------------------------
// The demo data was authored as if "today" were 9 Nov 2024 (DEMO_ANCHOR).
// rebaseDates() shifts every date inside the seed data by the gap between the
// anchor and the real current date, so expiries, "expiring in 7 days", last
// visits, payments and charts always look current whenever the app is opened.
// =============================================================================

export const DEMO_ANCHOR = new Date(2024, 10, 9); // 9 Nov 2024 (local)

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

const DAY_MS = 24 * 60 * 60 * 1000;

export const DAY_OFFSET = Math.round((startOfToday() - DEMO_ANCHOR) / DAY_MS);
export const MONTH_OFFSET =
  (startOfToday().getFullYear() * 12 + startOfToday().getMonth()) -
  (DEMO_ANCHOR.getFullYear() * 12 + DEMO_ANCHOR.getMonth());

const pad = (n) => String(n).padStart(2, '0');

/** Local YYYY-MM-DD (avoids the UTC shift of toISOString in India) */
export function toISODate(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function parseISODate(str) {
  if (!str) return null;
  const m = String(str).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return null;
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
}

/** Date that is `days` away from today, as YYYY-MM-DD */
export function isoFromToday(days = 0) {
  const d = startOfToday();
  d.setDate(d.getDate() + days);
  return toISODate(d);
}

/** Whole days from today until the given ISO date (negative = in the past) */
export function daysUntil(isoDate) {
  const d = parseISODate(isoDate);
  if (!d) return null;
  return Math.round((d - startOfToday()) / DAY_MS);
}

/** "18 Nov 2026" */
export function formatDate(isoOrDate) {
  const d = isoOrDate instanceof Date ? isoOrDate : parseISODate(isoOrDate);
  if (!d) return isoOrDate || '';
  return `${pad(d.getDate())} ${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`;
}

/** "18 Nov" */
export function formatDayMonth(isoOrDate) {
  const d = isoOrDate instanceof Date ? isoOrDate : parseISODate(isoOrDate);
  if (!d) return isoOrDate || '';
  return `${pad(d.getDate())} ${MONTHS_SHORT[d.getMonth()]}`;
}

export function currentMonthLabel(long = false) {
  const d = startOfToday();
  return `${(long ? MONTHS_LONG : MONTHS_SHORT)[d.getMonth()]} ${d.getFullYear()}`;
}

function shiftDays(y, m, d) {
  const dt = new Date(Number(y), Number(m) - 1, Number(d));
  dt.setDate(dt.getDate() + DAY_OFFSET);
  return dt;
}

function shiftMonth(monthIndex, year) {
  const total = Number(year) * 12 + monthIndex + MONTH_OFFSET;
  return { m: ((total % 12) + 12) % 12, y: Math.floor(total / 12) };
}

const MONTH_ALT = `${MONTHS_LONG.join('|')}|${MONTHS_SHORT.join('|')}`;
// One regex, one pass, so a date is never shifted twice:
//  1) 2024-11-09   2) 09 Nov 2024   3) Nov 2024 / November 2024
const DATE_RE = new RegExp(
  `\\b(20\\d{2})-(\\d{2})-(\\d{2})\\b|\\b(\\d{1,2}) (${MONTHS_SHORT.join('|')}) (20\\d{2})\\b|\\b(${MONTH_ALT}) (20\\d{2})\\b`,
  'g'
);

/** Shift every date found inside a string */
export function rebaseText(str) {
  if (typeof str !== 'string' || DAY_OFFSET === 0) return str;
  return str.replace(DATE_RE, (match, y, mo, d, d2, mon2, y2, mon3, y3) => {
    if (y) return toISODate(shiftDays(y, mo, d)) ;
    if (d2) {
      const dt = shiftDays(y2, MONTHS_SHORT.indexOf(mon2) + 1, d2);
      return `${pad(dt.getDate())} ${MONTHS_SHORT[dt.getMonth()]} ${dt.getFullYear()}`;
    }
    if (mon3) {
      const isLong = MONTHS_LONG.includes(mon3);
      const idx = isLong ? MONTHS_LONG.indexOf(mon3) : MONTHS_SHORT.indexOf(mon3);
      const { m, y } = shiftMonth(idx, y3);
      return `${(isLong ? MONTHS_LONG : MONTHS_SHORT)[m]} ${y}`;
    }
    return match;
  });
}

/** Deep-shift every date string inside objects/arrays (used on seed data) */
export function rebaseDates(value, skipKeys = []) {
  if (DAY_OFFSET === 0) return value;
  if (typeof value === 'string') return rebaseText(value);
  if (Array.isArray(value)) return value.map((v) => rebaseDates(v, skipKeys));
  if (value && typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = skipKeys.includes(k) ? v : rebaseDates(v, skipKeys);
    }
    return out;
  }
  return value;
}

/**
 * Membership status from the expiry date, so "Expiring Soon" / "Expired"
 * stay correct every day. Frozen and Left are manual states and are kept.
 */
export function deriveMemberStatus(member) {
  if (!member) return member;
  if (member.status === 'Frozen' || member.status === 'Left') return member.status;
  const left = daysUntil(member.expiryDate);
  if (left === null) return member.status || 'Active';
  if (left < 0) return 'Expired';
  if (left <= 7) return 'Expiring Soon';
  return 'Active';
}

export function withDerivedStatus(members = []) {
  return members.map((m) => {
    const status = deriveMemberStatus(m);
    return status === m.status ? m : { ...m, status };
  });
}

export function isBirthdayToday(dob) {
  const d = parseISODate(dob);
  if (!d) return false;
  const t = startOfToday();
  return d.getDate() === t.getDate() && d.getMonth() === t.getMonth();
}

export function isJoinAnniversaryToday(joinDate) {
  const d = parseISODate(joinDate);
  if (!d) return false;
  const t = startOfToday();
  return d.getDate() === t.getDate() && d.getMonth() === t.getMonth() && d.getFullYear() < t.getFullYear();
}
