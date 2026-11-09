// Who gets each automation today + message text. Mirrors src/utils/automationTargets.js
// (exact mode: only the people who are due TODAY, so nobody gets the same reminder twice).

const DAY = 86400000;

/** Today's date (YYYY-MM-DD) and time (HH:MM) in the gym's timezone */
export function nowIn(timezone = 'Asia/Kolkata', date = new Date()) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', {
      timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false
    }).formatToParts(date).map((p) => [p.type, p.value])
  );
  const hour = parts.hour === '24' ? '00' : parts.hour;
  return { iso: `${parts.year}-${parts.month}-${parts.day}`, time: `${hour}:${parts.minute}` };
}

const toUTC = (iso) => {
  const m = String(iso || '').match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? Date.UTC(+m[1], +m[2] - 1, +m[3]) : null;
};

export function daysBetween(fromIso, toIso) {
  const a = toUTC(fromIso);
  const b = toUTC(toIso);
  return a === null || b === null ? null : Math.round((b - a) / DAY);
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export function formatDate(iso) {
  const m = String(iso || '').match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${m[3]} ${MONTHS[+m[2] - 1]} ${m[1]}` : iso || '';
}

function addDays(iso, n) {
  const t = toUTC(iso) + n * DAY;
  return new Date(t).toISOString().slice(0, 10);
}

export function interpolate(template, data = {}, gymName = 'SHIVAY GYM') {
  if (!template) return '';
  const map = {
    '{name}': data.name || 'Member',
    '{gym}': gymName,
    '{plan}': data.plan || 'membership',
    '{expiry_date}': data.expiryDate || 'soon',
    '{days_left}': data.daysLeft ?? 'few',
    '{offer}': data.offer || 'special offer',
    '{discount}': data.discount || '20%',
    '{amount_due}': data.amountDue ?? '0',
    '{trainer}': data.trainer || 'your coach',
    '{date}': data.date || '',
    '{occasion}': data.occasion || 'holiday'
  };
  let out = String(template);
  for (const [k, v] of Object.entries(map)) out = out.split(k).join(String(v));
  return out;
}

/**
 * Recipients that are due today for an automation.
 * Returns [{ id, name, phone, language, vars }]
 */
export function dueRecipients(auto, data, todayIso) {
  const members = (data.members || []).filter((m) => m.whatsappOptIn !== false);
  const left = (m) => daysBetween(todayIso, m.expiryDate);
  const reachable = (m) => m.status !== 'Left' && m.status !== 'Expired';
  const mmdd = todayIso.slice(5);

  const base = (m, extra = {}) => ({
    id: m.id,
    name: m.name,
    phone: m.phone,
    language: m.preferredLanguage || 'en',
    vars: {
      name: String(m.name || '').split(' ')[0],
      plan: m.plan || m.lastPlan,
      expiryDate: m.expiryDate ? formatDate(m.expiryDate) : undefined,
      daysLeft: m.expiryDate ? Math.max(left(m), 0) : undefined,
      amountDue: m.duesPending,
      trainer: m.trainer,
      discount: auto.discount,
      date: formatDate(addDays(todayIso, 14)),
      ...extra
    }
  });

  switch (auto.id) {
    case 'AUTO-MORNING': {
      const quotes = data.quotes || [];
      const dayNo = Math.floor(toUTC(todayIso) / DAY);
      const q = quotes.length ? quotes[dayNo % quotes.length] : null;
      return members.filter((m) => reachable(m) && m.status !== 'Frozen').map((m) => base(m, { quoteEn: q?.en, quoteHi: q?.hi }));
    }
    case 'AUTO-EXPIRY-7D': return members.filter((m) => m.status !== 'Left' && left(m) === 7).map((m) => base(m));
    case 'AUTO-EXPIRY-3D': return members.filter((m) => m.status !== 'Left' && left(m) === 3).map((m) => base(m));
    case 'AUTO-EXPIRY-1D': return members.filter((m) => m.status !== 'Left' && left(m) === 1).map((m) => base(m));
    case 'AUTO-EXPIRY-0D': return members.filter((m) => m.status !== 'Left' && left(m) === 0).map((m) => base(m));
    case 'AUTO-EXPIRY-POST3D': return members.filter((m) => m.status !== 'Left' && left(m) === -3).map((m) => base(m));
    case 'AUTO-BIRTHDAY': return members.filter((m) => m.status !== 'Left' && m.dob && m.dob.slice(5) === mmdd).map((m) => base(m));
    case 'AUTO-ANNIVERSARY':
      return members.filter((m) => reachable(m) && m.joinDate && m.joinDate.slice(5) === mmdd && m.joinDate.slice(0, 4) < todayIso.slice(0, 4)).map((m) => base(m));
    case 'AUTO-INACTIVE-7D':
      // exactly 7 days since last visit → one nudge, not a daily nag
      return members.filter((m) => reachable(m) && m.status !== 'Frozen' && m.lastVisit && daysBetween(m.lastVisit, todayIso) === 7).map((m) => base(m));
    case 'AUTO-PAYMENT-DUE': {
      // dues reminders go out on Mondays only
      const weekday = new Date(toUTC(todayIso)).getUTCDay();
      if (weekday !== 1) return [];
      return members.filter((m) => m.status !== 'Left' && (m.duesPending || 0) > 0).map((m) => base(m));
    }
    case 'AUTO-FESTIVAL': {
      const fest = (data.festivals || []).find((f) => f.date === todayIso && f.autoSchedule !== false);
      if (!fest) return [];
      return members.filter((m) => m.status !== 'Left').map((m) => base(m, { festival: fest }));
    }
    default:
      // Winback, welcome, holiday, session reminders are sent from the app on demand
      return [];
  }
}

export function buildText(auto, recipient, gymName) {
  const lang = recipient.language === 'hi' ? 'hi' : auto.activeLanguage === 'hi' ? 'hi' : 'en';
  const v = recipient.vars || {};
  if (auto.id === 'AUTO-FESTIVAL' && v.festival) {
    const wish = interpolate(lang === 'hi' ? v.festival.wishHi : v.festival.wishEn, v, gymName);
    const offer = v.festival.attachedOffer ? `\n\n${lang === 'hi' ? 'विशेष ऑफर' : 'Special offer'}: ${v.festival.attachedOffer}` : '';
    return wish + offer;
  }
  if (auto.id === 'AUTO-MORNING' && (v.quoteEn || v.quoteHi)) {
    return interpolate(lang === 'hi' ? v.quoteHi : v.quoteEn, v, gymName);
  }
  return interpolate(lang === 'hi' ? auto.templateHi : auto.templateEn, v, gymName);
}

/** HH:MM schedule? ("Immediate", "Manual", "1 Hour Before" are app-triggered) */
export function scheduleTime(auto) {
  const m = String(auto.scheduledTime || '').match(/^(\d{1,2}):(\d{2})$/);
  return m ? `${m[1].padStart(2, '0')}:${m[2]}` : null;
}

export function minutesOf(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}
