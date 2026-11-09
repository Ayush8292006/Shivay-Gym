// WhatsApp Business Cloud API client (Meta Graph API), using Node's built-in fetch.
// Docs: https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-messages

export function normalizePhone(phone, countryCode = '91') {
  let digits = String(phone || '').replace(/[^0-9]/g, '');
  if (!digits) return '';
  if (digits.startsWith('00')) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
  if (digits.length === 10) digits = `${countryCode}${digits}`;
  return digits;
}

export class WhatsAppClient {
  constructor({ token, phoneNumberId, apiVersion = 'v23.0', countryCode = '91' }) {
    this.token = token;
    this.phoneNumberId = phoneNumberId;
    this.apiVersion = apiVersion;
    this.countryCode = countryCode;
  }

  get configured() {
    return Boolean(this.token && this.phoneNumberId);
  }

  async #post(body) {
    if (!this.configured) {
      // DRY RUN: no credentials yet – pretend it worked so the whole flow can be tested
      const id = `dry-run-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
      console.log(`[whatsapp:dry-run] → ${body.to}: ${body.type === 'text' ? body.text.body : `template ${body.template.name}`}`);
      return { id, dryRun: true };
    }
    const url = `https://graph.facebook.com/${this.apiVersion}/${this.phoneNumberId}/messages`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${this.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const e = data.error || {};
      const hint = HINTS[e.code] || '';
      const err = new Error(`${e.message || `WhatsApp API error ${res.status}`}${e.code ? ` (code ${e.code})` : ''}${hint ? ` — ${hint}` : ''}`);
      err.code = e.code;
      throw err;
    }
    return { id: data.messages?.[0]?.id };
  }

  sendText(to, text) {
    return this.#post({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: normalizePhone(to, this.countryCode),
      type: 'text',
      text: { preview_url: false, body: String(text).slice(0, 4096) }
    });
  }

  /** params: array of strings for {{1}}, {{2}}... in the template body */
  sendTemplate(to, name, language = 'en', params = []) {
    const template = { name, language: { code: language } };
    if (params.length) {
      template.components = [
        { type: 'body', parameters: params.map((p) => ({ type: 'text', text: String(p ?? '').slice(0, 1000) || '-' })) }
      ];
    }
    return this.#post({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: normalizePhone(to, this.countryCode),
      type: 'template',
      template
    });
  }
}

// Friendly explanations for the most common Cloud API errors
const HINTS = {
  131047: 'More than 24 hours since this person last messaged you. Use an approved template for this automation (server/templates.json).',
  131026: 'Number is not on WhatsApp or cannot receive messages.',
  131030: 'With the Meta test number you can only message numbers added to the "To" list in the WhatsApp API Setup page.',
  132001: 'Template name/language not found. Check it is approved in WhatsApp Manager and the name matches templates.json.',
  132000: 'Template parameter count does not match the approved template.',
  190: 'Access token expired or invalid. Create a permanent System User token.',
  10: 'Permission missing on the token (whatsapp_business_messaging).',
  131056: 'Too many messages to the same number in a short time.'
};
