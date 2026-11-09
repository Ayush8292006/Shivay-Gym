// =============================================================================
// WhatsApp delivery service
// -----------------------------------------------------------------------------
// Two delivery modes (choose in Admin → Gym Settings → WhatsApp Delivery):
//
// 1. "manual"  – No setup. Every message opens WhatsApp (web / desktop / phone)
//                with the member's number and the text already filled in.
//                The owner just presses Send. Bulk sends open a step-by-step
//                queue so the browser never blocks pop-ups.
//
// 2. "server"  – Fully automatic. Messages go to the Shivay notification
//                server (/server folder), which calls the official
//                WhatsApp Business Cloud API (Meta) and also runs the daily
//                automations (good morning, expiry reminders, festival wishes,
//                birthdays...) on its own schedule, even when this app is closed.
//
// The access token for the WhatsApp API lives ONLY on the server (.env).
// It must never be placed in this frontend code.
// =============================================================================

const CONFIG_KEY = 'shivay_whatsapp_config_v2';

export const DEFAULT_WHATSAPP_CONFIG = {
  mode: 'manual', // 'manual' | 'server'
  serverUrl: 'http://localhost:8787',
  apiKey: '', // must match ADMIN_API_KEY in server/.env
  // Safety switch: while ON, every message is delivered to the test number
  // instead of the member (demo members have made-up phone numbers).
  testMode: true,
  testNumber: '',
  defaultCountryCode: '91'
};

export function loadWhatsAppConfig() {
  try {
    const saved = JSON.parse(localStorage.getItem(CONFIG_KEY) || 'null');
    return { ...DEFAULT_WHATSAPP_CONFIG, ...(saved || {}) };
  } catch {
    return { ...DEFAULT_WHATSAPP_CONFIG };
  }
}

export function saveWhatsAppConfig(config) {
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  } catch {
    /* storage unavailable – keep in memory only */
  }
}

/** "+91 98101 23451" → "919810123451" (E.164 without +) */
export function normalizePhone(phone, countryCode = '91') {
  let digits = String(phone || '').replace(/[^0-9]/g, '');
  if (!digits) return '';
  if (digits.startsWith('00')) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
  if (digits.length === 10) digits = `${countryCode}${digits}`;
  return digits;
}

export function isValidWhatsAppNumber(phone) {
  const d = normalizePhone(phone);
  return d.length >= 11 && d.length <= 15;
}

/** Click-to-chat link that works on phone, WhatsApp Desktop and WhatsApp Web */
export function buildWhatsAppLink(phone, message = '') {
  const to = normalizePhone(phone);
  const text = encodeURIComponent(message || '');
  return to ? `https://wa.me/${to}?text=${text}` : `https://wa.me/?text=${text}`;
}

/** Resolve the real destination, respecting test mode */
export function resolveRecipient(config, phone) {
  if (config.testMode) return normalizePhone(config.testNumber, config.defaultCountryCode);
  return normalizePhone(phone, config.defaultCountryCode);
}

function baseUrl(config) {
  return String(config.serverUrl || '').replace(/\/+$/, '');
}

function headers(config) {
  return {
    'Content-Type': 'application/json',
    ...(config.apiKey ? { 'x-api-key': config.apiKey } : {})
  };
}

async function request(config, path, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.timeout || 15000);
  try {
    const res = await fetch(`${baseUrl(config)}${path}`, {
      ...options,
      headers: headers(config),
      signal: controller.signal
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `Server responded ${res.status}`);
    return data;
  } catch (err) {
    if (err.name === 'AbortError') throw new Error('Notification server did not respond (timeout)');
    if (err instanceof TypeError) throw new Error(`Cannot reach notification server at ${baseUrl(config)}`);
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

export function checkServer(config) {
  return request(config, '/api/health', { method: 'GET', timeout: 6000 });
}

/**
 * Send one WhatsApp message through the Shivay server.
 * payload: { to, text, automationId, memberId, memberName, vars }
 * The server decides whether to send an approved template (needed for
 * business-initiated messages) or plain text (inside the 24h service window).
 */
export function sendViaServer(config, payload) {
  return request(config, '/api/whatsapp/send', {
    method: 'POST',
    body: JSON.stringify({ ...payload, testMode: config.testMode, testNumber: config.testNumber })
  });
}

/** Push the gym data the server scheduler needs (members, automations, festivals...) */
export function syncToServer(config, data) {
  return request(config, '/api/sync', { method: 'POST', body: JSON.stringify(data), timeout: 20000 });
}

/** Delivery statuses (sent / delivered / read / failed) reported by Meta webhooks */
export function fetchServerStatuses(config) {
  return request(config, '/api/messages?limit=300', { method: 'GET', timeout: 8000 });
}

export function runAutomationOnServer(config, automationId) {
  return request(config, `/api/automations/${encodeURIComponent(automationId)}/run`, { method: 'POST', body: '{}' });
}
