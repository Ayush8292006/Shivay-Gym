// JSON file store: gym data synced from the app + message log + scheduler runs.
// Good for one gym. For many gyms, move this to a real database.
import fs from 'node:fs';
import path from 'node:path';

const EMPTY = {
  gym: { name: 'SHIVAY GYM', timezone: 'Asia/Kolkata' },
  testMode: true,
  testNumber: '',
  members: [],
  formerMembers: [],
  automations: [],
  festivals: [],
  offers: [],
  quotes: [],
  messages: [],
  runs: {}, // { 'AUTO-MORNING': '2026-11-09' }
  inbound: {}, // { '919810123451': 1731130000000 } last message FROM the member (opens 24h window)
  syncedAt: null
};

export class Store {
  constructor(dir) {
    this.dir = dir;
    this.file = path.join(dir, 'store.json');
    fs.mkdirSync(dir, { recursive: true });
    this.data = { ...EMPTY };
    if (fs.existsSync(this.file)) {
      try {
        this.data = { ...EMPTY, ...JSON.parse(fs.readFileSync(this.file, 'utf8')) };
      } catch (err) {
        console.error('[store] could not read store.json, starting empty:', err.message);
      }
    }
    this.timer = null;
  }

  save() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      const tmp = `${this.file}.tmp`;
      fs.writeFileSync(tmp, JSON.stringify(this.data, null, 2));
      fs.renameSync(tmp, this.file);
    }, 200);
  }

  flush() {
    clearTimeout(this.timer);
    fs.writeFileSync(this.file, JSON.stringify(this.data, null, 2));
  }

  addMessage(msg) {
    const now = new Date().toISOString();
    const rec = { createdAt: now, updatedAt: now, ...msg };
    this.data.messages.unshift(rec);
    if (this.data.messages.length > 3000) this.data.messages.length = 3000;
    this.save();
    return rec;
  }

  updateByWaId(waMessageId, fields) {
    const rec = this.data.messages.find((m) => m.waMessageId === waMessageId);
    if (!rec) return null;
    Object.assign(rec, fields, { updatedAt: new Date().toISOString() });
    this.save();
    return rec;
  }
}
