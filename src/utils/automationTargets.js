// =============================================================================
// Who receives each automation, and with which variables.
// The same rules are mirrored in server/automations.js for the scheduler.
// =============================================================================
import { interpolateTemplate, dailyMorningQuotes } from '../data/automations';
import { daysUntil, formatDate, isoFromToday, isBirthdayToday, isJoinAnniversaryToday, startOfToday } from './dates';

const reachable = (m) => m.status !== 'Left' && m.status !== 'Expired';
const firstName = (name = '') => name.split(' ')[0] || name;

function dayOfYear() {
  const t = startOfToday();
  return Math.floor((t - new Date(t.getFullYear(), 0, 0)) / 86400000);
}

/** Today's festival(s) from the calendar */
export function festivalsOn(festivalCalendar = [], iso = isoFromToday(0)) {
  return festivalCalendar.filter((f) => f.date === iso);
}

/** Next upcoming festivals, soonest first */
export function upcomingFestivals(festivalCalendar = [], limit = 5) {
  return [...festivalCalendar]
    .map((f) => ({ ...f, inDays: daysUntil(f.date) }))
    .filter((f) => f.inDays !== null && f.inDays >= 0)
    .sort((a, b) => a.inDays - b.inDays)
    .slice(0, limit);
}

/**
 * @param auto       automation object
 * @param ctx        { members, formerMembers, festivalCalendar, offers }
 * @param options    { mode: 'exact' (what the scheduler sends today) | 'window' (manual "Send Now") , festival }
 * @returns [{ id, name, phone, vars }]
 */
export function getRecipients(auto, ctx, options = {}) {
  const { members = [], formerMembers = [], festivalCalendar = [] } = ctx;
  const mode = options.mode || 'window';
  const exact = mode === 'exact';
  const d = (m) => daysUntil(m.expiryDate);

  const base = (m, extra = {}) => ({
    id: m.id,
    name: m.name,
    phone: m.phone,
    language: m.preferredLanguage || 'en',
    vars: {
      name: firstName(m.name),
      plan: m.plan || m.lastPlan,
      expiryDate: m.expiryDate ? formatDate(m.expiryDate) : undefined,
      daysLeft: m.expiryDate ? Math.max(d(m), 0) : undefined,
      amountDue: m.duesPending,
      trainer: m.trainer,
      discount: auto.discount,
      date: formatDate(isoFromToday(14)),
      ...extra
    }
  });

  const between = (m, lo, hi) => {
    const x = d(m);
    return x !== null && x >= lo && x <= hi;
  };

  switch (auto.id) {
    case 'AUTO-MORNING': {
      const q = dailyMorningQuotes[dayOfYear() % dailyMorningQuotes.length];
      return members.filter(reachable).filter((m) => m.status !== 'Frozen').map((m) => base(m, { quoteEn: q?.en, quoteHi: q?.hi }));
    }
    case 'AUTO-EXPIRY-7D':
      return members.filter((m) => m.status !== 'Left' && (exact ? d(m) === 7 : between(m, 4, 7))).map((m) => base(m));
    case 'AUTO-EXPIRY-3D':
      return members.filter((m) => m.status !== 'Left' && (exact ? d(m) === 3 : between(m, 2, 3))).map((m) => base(m));
    case 'AUTO-EXPIRY-1D':
      return members.filter((m) => m.status !== 'Left' && d(m) === 1).map((m) => base(m));
    case 'AUTO-EXPIRY-0D':
      return members.filter((m) => m.status !== 'Left' && d(m) === 0).map((m) => base(m));
    case 'AUTO-EXPIRY-POST3D':
      return members.filter((m) => m.status !== 'Left' && (exact ? d(m) === -3 : between(m, -10, -1))).map((m) => base(m));
    case 'AUTO-WINBACK': {
      const former = formerMembers.map((f) => base(f));
      const lapsed = members.filter((m) => m.status === 'Left' || (d(m) !== null && d(m) < -30)).map((m) => base(m));
      const seen = new Set();
      return [...former, ...lapsed].filter((r) => {
        const key = String(r.phone).replace(/\D/g, '');
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }
    case 'AUTO-BIRTHDAY':
      return members.filter((m) => m.status !== 'Left' && isBirthdayToday(m.dob)).map((m) => base(m));
    case 'AUTO-ANNIVERSARY':
      return members.filter((m) => reachable(m) && isJoinAnniversaryToday(m.joinDate)).map((m) => base(m));
    case 'AUTO-INACTIVE-7D':
      return members
        .filter((m) => reachable(m) && m.status !== 'Frozen' && (!m.lastVisit || m.lastVisit <= isoFromToday(-7)))
        .map((m) => base(m));
    case 'AUTO-PAYMENT-DUE':
      return members.filter((m) => m.status !== 'Left' && (m.duesPending || 0) > 0).map((m) => base(m));
    case 'AUTO-WELCOME':
      return members
        .filter((m) => m.status !== 'Left' && m.joinDate && (exact ? m.joinDate === isoFromToday(0) : m.joinDate >= isoFromToday(-7)))
        .map((m) => base(m));
    case 'AUTO-SESSION-REMINDER':
      return members.filter((m) => reachable(m) && /personal|pt/i.test(m.plan || '')).map((m) => base(m));
    case 'AUTO-FESTIVAL': {
      const fest = options.festival || festivalsOn(festivalCalendar)[0];
      if (!fest) return [];
      return members
        .filter((m) => m.status !== 'Left')
        .map((m) => base(m, { festival: fest }));
    }
    case 'AUTO-HOLIDAY':
    default:
      return members.filter((m) => m.status !== 'Left').map((m) => base(m));
  }
}

/** Final message text for one recipient */
export function buildMessage(auto, recipient, langOverride) {
  const lang = langOverride || auto.activeLanguage || 'en';
  const v = recipient.vars || {};
  if (auto.id === 'AUTO-FESTIVAL' && v.festival) {
    const wish = interpolateTemplate(lang === 'hi' ? v.festival.wishHi : v.festival.wishEn, v);
    const offer = v.festival.attachedOffer ? `\n\n${lang === 'hi' ? 'विशेष ऑफर' : 'Special offer'}: ${v.festival.attachedOffer}` : '';
    return wish + offer;
  }
  if (auto.id === 'AUTO-MORNING' && (v.quoteEn || v.quoteHi)) {
    return interpolateTemplate(lang === 'hi' ? v.quoteHi : v.quoteEn, v);
  }
  return interpolateTemplate(lang === 'hi' ? auto.templateHi : auto.templateEn, v);
}

/** Upcoming scheduled sends for the next N days (for the "Upcoming Queue" tab) */
export function buildUpcomingQueue(automations, ctx, days = 30) {
  const out = [];
  const enabled = automations.filter((a) => a.enabled);
  const byId = Object.fromEntries(enabled.map((a) => [a.id, a]));
  const active = ctx.members.filter((m) => m.status !== 'Left');

  const push = (offset, auto, title, count, preview) => {
    if (!auto || count <= 0) return;
    const date = isoFromToday(offset);
    out.push({ offset, date, time: auto.scheduledTime, title, auto, count, preview });
  };

  for (let i = 1; i <= days; i++) {
    const iso = isoFromToday(i);
    const expiring = (n) => active.filter((m) => daysUntil(m.expiryDate) === n + i).length;
    if (i <= 7) push(i, byId['AUTO-MORNING'], 'Daily Good Morning', active.filter((m) => m.status !== 'Frozen' && m.status !== 'Expired').length, dailyMorningQuotes[(dayOfYear() + i) % dailyMorningQuotes.length]?.en);
    push(i, byId['AUTO-EXPIRY-7D'], '7-day expiry reminder', expiring(7), byId['AUTO-EXPIRY-7D']?.templateEn);
    push(i, byId['AUTO-EXPIRY-3D'], '3-day expiry reminder', expiring(3), byId['AUTO-EXPIRY-3D']?.templateEn);
    push(i, byId['AUTO-EXPIRY-1D'], 'Expires tomorrow reminder', expiring(1), byId['AUTO-EXPIRY-1D']?.templateEn);
    push(i, byId['AUTO-EXPIRY-0D'], 'Expired today notice', expiring(0), byId['AUTO-EXPIRY-0D']?.templateEn);
    const [, mm, dd] = iso.split('-');
    const birthdays = active.filter((m) => m.dob && m.dob.slice(5) === `${mm}-${dd}`).length;
    push(i, byId['AUTO-BIRTHDAY'], 'Birthday wishes', birthdays, byId['AUTO-BIRTHDAY']?.templateEn);
    festivalsOn(ctx.festivalCalendar, iso).forEach((f) =>
      push(i, byId['AUTO-FESTIVAL'], `${f.name} wishes${f.attachedOffer ? ' + offer' : ''}`, active.length, f.wishEn)
    );
  }
  return out.sort((a, b) => a.offset - b.offset || String(a.time).localeCompare(String(b.time)));
}
