// =============================================================================
// SHIVAY GYM — WhatsApp notification server
// -----------------------------------------------------------------------------
// • POST /api/whatsapp/send      send one message (used by the admin app)
// • POST /api/sync               app pushes members, automations, festivals
// • GET  /api/messages           delivery log with sent/delivered/read status
// • POST /api/automations/:id/run  run one automation right now
// • GET/POST /webhook            Meta webhook (verification + status updates)
// • Scheduler                    runs daily automations at their set time (IST)
//
// Zero dependencies — needs only Node.js 18 or newer:   node index.js
// =============================================================================
import http from 'node:http';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv, bool } from './lib/env.js';
import { Store } from './lib/store.js';
import { WhatsAppClient, normalizePhone } from './lib/whatsapp.js';
import { nowIn, dueRecipients, buildText, scheduleTime, minutesOf } from './lib/automations.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
loadEnv(__dirname);

const CONFIG = {
  port: Number(process.env.PORT || 8787),
  apiKey: process.env.ADMIN_API_KEY || '',
  allowedOrigins: (process.env.ALLOWED_ORIGINS || '*').split(',').map((s) => s.trim()).filter(Boolean),
  timezone: process.env.TIMEZONE || 'Asia/Kolkata',
  schedulerEnabled: bool(process.env.SCHEDULER_ENABLED, true),
  catchupMinutes: Number(process.env.SCHEDULER_CATCHUP_MINUTES || 120),
  sendDelayMs: Number(process.env.SEND_DELAY_MS || 400),
  verifyToken: process.env.WA_WEBHOOK_VERIFY_TOKEN || '',
  appSecret: process.env.WA_APP_SECRET || '',
  forceTestNumber: process.env.FORCE_TEST_NUMBER || '',
  dataDir: path.resolve(__dirname, process.env.DATA_DIR || 'data')
};

const wa = new WhatsAppClient({
  token: process.env.WA_ACCESS_TOKEN,
  phoneNumberId: process.env.WA_PHONE_NUMBER_ID,
  apiVersion: process.env.WA_API_VERSION || 'v23.0',
  countryCode: process.env.DEFAULT_COUNTRY_CODE || '91'
});

const store = new Store(CONFIG.dataDir);

function loadTemplates() {
  try {
    return JSON.parse(fs.readFileSync(path.join(__dirname, 'templates.json'), 'utf8'));
  } catch {
    return {};
  }
}

// -----------------------------------------------------------------------------
// Sending
// -----------------------------------------------------------------------------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Where the message really goes (test mode sends everything to the owner) */
function destination(phone, testModeFromApp, testNumberFromApp) {
  if (CONFIG.forceTestNumber) return normalizePhone(CONFIG.forceTestNumber);
  const testMode = testModeFromApp ?? store.data.testMode;
  if (testMode) {
    const t = normalizePhone(testNumberFromApp || store.data.testNumber);
    if (!t) throw new Error('Test mode is ON but no test number is set (Admin → Settings → WhatsApp Delivery).');
    return t;
  }
  const to = normalizePhone(phone);
  if (to.length < 11) throw new Error(`Invalid phone number: ${phone || '(empty)'}`);
  return to;
}

function templateParams(names, vars) {
  const fest = vars.festival || {};
  const value = {
    ...vars,
    festivalName: fest.name,
    festivalOffer: fest.attachedOffer || 'Wishing you good health',
    quote: vars.quoteEn
  };
  return names.map((n) => value[n] ?? '');
}

/**
 * Sends via approved template when one is mapped for the automation
 * (required to start a conversation), otherwise as plain text
 * (allowed only within 24h of the member's last message to the gym).
 */
async function deliver({ to, text, automationId, language = 'en', vars = {} }) {
  const tpl = loadTemplates()[automationId];
  const hiTpl = language === 'hi' && tpl?.hi?.name ? tpl.hi : null;
  const chosen = hiTpl ? { ...tpl, ...hiTpl } : tpl;
  if (chosen?.name) {
    const res = await wa.sendTemplate(to, chosen.name, chosen.language || 'en', templateParams(chosen.params || [], vars));
    return { ...res, sentAs: `template:${chosen.name}` };
  }
  const res = await wa.sendText(to, text);
  return { ...res, sentAs: 'text' };
}

async function sendAndLog({ phone, text, automationId, automationTitle, memberId, memberName, language, vars, testMode, testNumber, source }) {
  const base = { automationId, automationTitle, memberId, memberName, text, source };
  let to;
  try {
    to = destination(phone, testMode, testNumber);
  } catch (err) {
    store.addMessage({ ...base, to: phone, status: 'Failed', error: err.message });
    throw err;
  }
  try {
    const res = await deliver({ to, text, automationId, language, vars });
    const status = res.dryRun ? 'Dry Run' : 'Sent';
    store.addMessage({ ...base, to, waMessageId: res.id, status, sentAs: res.sentAs });
    return { id: res.id, to, status: res.dryRun ? 'dry-run' : 'sent', sentAs: res.sentAs };
  } catch (err) {
    store.addMessage({ ...base, to, status: 'Failed', error: err.message });
    throw err;
  }
}

async function runAutomation(auto, { source = 'scheduler', todayIso } = {}) {
  const today = todayIso || nowIn(CONFIG.timezone).iso;
  const recipients = dueRecipients(auto, store.data, today);
  let sent = 0;
  let failed = 0;
  for (const r of recipients) {
    const text = buildText(auto, r, store.data.gym?.name);
    try {
      await sendAndLog({
        phone: r.phone,
        text,
        automationId: auto.id,
        automationTitle: auto.id === 'AUTO-FESTIVAL' && r.vars.festival ? `${r.vars.festival.name} Wishes` : auto.title,
        memberId: r.id,
        memberName: r.name,
        language: r.language,
        vars: r.vars,
        source
      });
      sent += 1;
    } catch (err) {
      failed += 1;
      console.error(`[${auto.id}] ${r.name}: ${err.message}`);
    }
    await sleep(CONFIG.sendDelayMs);
  }
  console.log(`[scheduler] ${auto.id} on ${today}: ${sent} sent, ${failed} failed, ${recipients.length} due`);
  return { due: recipients.length, sent, failed };
}

// -----------------------------------------------------------------------------
// Scheduler: once a minute, run every enabled automation whose time has come
// and that has not run yet today.
// -----------------------------------------------------------------------------
let ticking = false;
async function tick() {
  if (ticking || !CONFIG.schedulerEnabled) return;
  ticking = true;
  try {
    const { iso, time } = nowIn(CONFIG.timezone);
    const nowMin = minutesOf(time);
    for (const auto of store.data.automations || []) {
      if (!auto.enabled || !auto.channels?.whatsapp) continue;
      const at = scheduleTime(auto);
      if (!at) continue;
      const late = nowMin - minutesOf(at);
      if (late < 0 || late > CONFIG.catchupMinutes) continue;
      if (store.data.runs[auto.id] === iso) continue;
      store.data.runs[auto.id] = iso; // mark first, so a crash never double-sends
      store.save();
      await runAutomation(auto, { todayIso: iso });
    }
  } catch (err) {
    console.error('[scheduler] error:', err);
  } finally {
    ticking = false;
  }
}

// -----------------------------------------------------------------------------
// HTTP helpers
// -----------------------------------------------------------------------------
function cors(req, res) {
  const origin = req.headers.origin;
  const any = CONFIG.allowedOrigins.includes('*');
  if (origin && (any || CONFIG.allowedOrigins.includes(origin))) {
    res.setHeader('Access-Control-Allow-Origin', any ? '*' : origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
}

function send(res, code, body) {
  res.writeHead(code, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

function readBody(req, limit = 5 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (c) => {
      size += c.length;
      if (size > limit) {
        reject(new Error('Body too large'));
        req.destroy();
      } else chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

const json = (buf) => {
  try {
    return JSON.parse(buf.toString('utf8') || '{}');
  } catch {
    return null;
  }
};

function authorized(req) {
  if (!CONFIG.apiKey) return true;
  const given = String(req.headers['x-api-key'] || '');
  const a = Buffer.from(given);
  const b = Buffer.from(CONFIG.apiKey);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function validSignature(req, raw) {
  if (!CONFIG.appSecret) return true; // signature check is optional but recommended
  const sig = String(req.headers['x-hub-signature-256'] || '');
  const expected = `sha256=${crypto.createHmac('sha256', CONFIG.appSecret).update(raw).digest('hex')}`;
  return sig.length === expected.length && crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
}

const STATUS_MAP = { sent: 'Sent', delivered: 'Delivered', read: 'Read', failed: 'Failed' };

// -----------------------------------------------------------------------------
// Routes
// -----------------------------------------------------------------------------
const server = http.createServer(async (req, res) => {
  cors(req, res);
  if (req.method === 'OPTIONS') return res.writeHead(204).end();

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const p = url.pathname.replace(/\/+$/, '') || '/';

  try {
    // ---- Meta webhook -------------------------------------------------------
    if (p === '/webhook' && req.method === 'GET') {
      const ok = url.searchParams.get('hub.mode') === 'subscribe' && CONFIG.verifyToken && url.searchParams.get('hub.verify_token') === CONFIG.verifyToken;
      if (!ok) return send(res, 403, { error: 'Verification failed' });
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      return res.end(url.searchParams.get('hub.challenge') || '');
    }
    if (p === '/webhook' && req.method === 'POST') {
      const raw = await readBody(req);
      if (!validSignature(req, raw)) return send(res, 401, { error: 'Bad signature' });
      const body = json(raw) || {};
      for (const entry of body.entry || []) {
        for (const change of entry.changes || []) {
          const v = change.value || {};
          for (const st of v.statuses || []) {
            const status = STATUS_MAP[st.status];
            if (status) store.updateByWaId(st.id, { status, error: st.errors?.[0]?.title || st.errors?.[0]?.message });
          }
          for (const msg of v.messages || []) {
            // Member wrote to the gym → 24-hour window for free-form replies is open
            store.data.inbound[msg.from] = Number(msg.timestamp || 0) * 1000 || Date.now();
            store.save();
          }
        }
      }
      return send(res, 200, { ok: true });
    }

    // ---- Health (no key needed, reveals nothing sensitive) -------------------
    if (p === '/api/health' && req.method === 'GET') {
      return send(res, 200, {
        ok: true,
        whatsappConfigured: wa.configured,
        schedulerEnabled: CONFIG.schedulerEnabled,
        timezone: CONFIG.timezone,
        now: nowIn(CONFIG.timezone),
        members: authorized(req) ? store.data.members.length : undefined,
        syncedAt: store.data.syncedAt
      });
    }

    if (!p.startsWith('/api/')) return send(res, 404, { error: 'Not found' });
    if (!authorized(req)) return send(res, 401, { error: 'Wrong or missing API key (x-api-key)' });

    // ---- Send one message ----------------------------------------------------
    if (p === '/api/whatsapp/send' && req.method === 'POST') {
      const b = json(await readBody(req));
      if (!b || !b.text) return send(res, 400, { error: 'text is required' });
      const member = store.data.members.find((m) => m.id === b.memberId);
      const out = await sendAndLog({
        phone: b.to,
        text: b.text,
        automationId: b.automationId,
        automationTitle: b.automationTitle,
        memberId: b.memberId,
        memberName: b.memberName,
        language: member?.preferredLanguage || 'en',
        vars: b.vars || {},
        testMode: typeof b.testMode === 'boolean' ? b.testMode : undefined,
        testNumber: typeof b.testNumber === 'string' ? b.testNumber : undefined,
        source: 'app'
      });
      return send(res, 200, out);
    }

    // ---- Sync gym data from the app -----------------------------------------
    if (p === '/api/sync' && req.method === 'POST') {
      const b = json(await readBody(req));
      if (!b) return send(res, 400, { error: 'Invalid JSON' });
      for (const k of ['members', 'formerMembers', 'automations', 'festivals', 'offers', 'quotes']) {
        if (Array.isArray(b[k])) store.data[k] = b[k];
      }
      if (b.gym) store.data.gym = { ...store.data.gym, ...b.gym };
      if (typeof b.testMode === 'boolean') store.data.testMode = b.testMode;
      if (typeof b.testNumber === 'string') store.data.testNumber = b.testNumber;
      store.data.syncedAt = new Date().toISOString();
      store.save();
      return send(res, 200, { ok: true, members: store.data.members.length, automations: store.data.automations.length });
    }

    // ---- Message log -------------------------------------------------------------
    if (p === '/api/messages' && req.method === 'GET') {
      const limit = Math.min(Number(url.searchParams.get('limit') || 200), 1000);
      return send(res, 200, { messages: store.data.messages.slice(0, limit) });
    }

    // ---- Run an automation now (for testing) --------------------------------------
    const run = p.match(/^\/api\/automations\/([^/]+)\/run$/);
    if (run && req.method === 'POST') {
      const auto = store.data.automations.find((a) => a.id === decodeURIComponent(run[1]));
      if (!auto) return send(res, 404, { error: 'Automation not found. Sync from the app first.' });
      const result = await runAutomation(auto, { source: 'scheduler' });
      return send(res, 200, result);
    }

    return send(res, 404, { error: 'Not found' });
  } catch (err) {
    console.error(`[${req.method} ${p}]`, err.message);
    return send(res, 500, { error: err.message });
  }
});

server.listen(CONFIG.port, () => {
  console.log(`\nSHIVAY GYM notification server on http://localhost:${CONFIG.port}`);
  console.log(`  WhatsApp API : ${wa.configured ? 'configured' : 'NOT configured → DRY RUN (messages are logged, not sent)'}`);
  console.log(`  Scheduler    : ${CONFIG.schedulerEnabled ? `on (${CONFIG.timezone})` : 'off'}`);
  console.log(`  API key      : ${CONFIG.apiKey ? 'required' : 'not set (set ADMIN_API_KEY before going online!)'}`);
  if (CONFIG.forceTestNumber) console.log(`  FORCE_TEST_NUMBER is set → every message goes to ${CONFIG.forceTestNumber}`);
});

if (CONFIG.schedulerEnabled) {
  setTimeout(tick, 3000);
  setInterval(tick, 60 * 1000);
}

const shutdown = () => {
  store.flush();
  process.exit(0);
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
