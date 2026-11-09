# Shivay Gym – WhatsApp notification server

This small server sends the gym's WhatsApp messages automatically using Meta's official
**WhatsApp Business Cloud API**, and runs the daily automations on a schedule (IST):

| Time  | Automation | Who gets it |
|-------|------------|-------------|
| 06:00 | Good morning message (rotates 30+ quotes) | All active members |
| 07:00 | Festival / national day wish (+ attached offer) | Everyone, on each date in the Festival Calendar |
| 08:00 | Birthday wish | Members whose birthday is today |
| 09:00 / 10:30 / 11:00 / 18:00 / 14:00 | Expiry reminders: 1 day before, 7 days before, 3 days before, on the day, 3 days after | Members with that expiry date |
| 09:30 | Joining anniversary | Members who joined on this date in an earlier year |
| 11:30 (Mondays) | Fee / dues reminder | Members with pending dues |
| 17:00 | Inactivity nudge | Members whose last visit was exactly 7 days ago |

Times come from each automation's **Scheduled Time** in the admin app (Automations → Edit Template).
Win-back offers, welcome messages, holiday notices and offer broadcasts are sent from the app
whenever you press **Send**.

It needs **only Node.js 18+**. No `npm install` is required.

---

## 1. Run it (dry run first)

```bash
cd server
cp .env.example .env      # Windows: copy .env.example .env
node index.js
```

Without WhatsApp credentials the server runs in **DRY RUN** mode: it does everything except the
final send, and prints each message in the terminal. Use this to test the whole flow.

In the admin app: **Gym Settings → WhatsApp Delivery**
1. Choose **Automatic (WhatsApp Business API)**
2. Server URL `http://localhost:8787`, API key = `ADMIN_API_KEY` from `.env`
3. Keep **Test mode ON** and enter your own WhatsApp number
4. Click **Test connection**, then **Sync members to server**, then **Send test message**

## 2. Connect real WhatsApp (Meta Cloud API)

1. Go to <https://developers.facebook.com> → **My Apps → Create app** and pick the
   WhatsApp / "connect with customers through WhatsApp" use case. Link it to the gym's Meta Business account.
2. Open **WhatsApp → API Setup**. Meta gives you a free **test phone number**, a
   **Phone number ID** and a temporary **access token** (valid ~24 h).
3. Under "To", add your own WhatsApp number as a recipient and verify it with the code Meta sends.
4. Put the values in `server/.env`:
   ```
   WA_ACCESS_TOKEN=EAAG...
   WA_PHONE_NUMBER_ID=1234567890
   ```
   Restart the server. **Send test message** in the app now arrives on your phone
   (it uses Meta's ready-made `hello_world` template).
5. **Permanent token**: Meta Business Settings → **System users** → add a system user → assign
   the app → **Generate token** with `whatsapp_business_messaging` and
   `whatsapp_business_management` permissions. Replace the temporary token with it.
6. **Real business number**: in WhatsApp Manager add the gym's own number (it must not be
   active in the normal WhatsApp app), verify it, and use its Phone number ID.

## 3. Message templates (required for automatic messages)

WhatsApp lets a business send **free-text messages only within 24 hours after the member last
messaged the gym**. Reminders, offers and wishes start a new conversation, so each one needs a
**template approved by Meta**.

Create them in **WhatsApp Manager → Message templates → Create**, then write the template name in
`server/templates.json`. Templates for reminders and dues go in the **Utility** category. Offers,
wishes and good morning messages go in the **Marketing** category. Meta charges per template
message, so check the current rates for India in WhatsApp Manager.

Sample bodies you can submit (variables `{{1}}`, `{{2}}`… are filled from `params` in templates.json):

| Automation (templates.json key) | Suggested template name | Body | params |
|---|---|---|---|
| AUTO-EXPIRY-7D | `shivay_expiry_7d` | Hi {{1}}, your {{2}} membership at Shivay Gym expires on {{3}}. Renew at the reception or reply to this message to keep your training on track. | name, plan, expiryDate |
| AUTO-EXPIRY-3D | `shivay_expiry_3d` | Hi {{1}}, only {{2}} days are left on your Shivay Gym membership (ends {{3}}). Renew this week to avoid a break in training. | name, daysLeft, expiryDate |
| AUTO-EXPIRY-1D | `shivay_expiry_1d` | Hi {{1}}, your Shivay Gym membership ends tomorrow ({{2}}). Renew today at the front desk or by UPI. | name, expiryDate |
| AUTO-EXPIRY-0D | `shivay_expired_today` | Hi {{1}}, your Shivay Gym {{2}} membership expired today. Renew any day this week with no rejoining fee. | name, plan |
| AUTO-EXPIRY-POST3D | `shivay_rejoin_grace` | Hi {{1}}, your spot at Shivay Gym is waiting. Renew this week and get 15 extra days on your next plan. | name |
| AUTO-PAYMENT-DUE | `shivay_payment_due` | Dear {{1}}, ₹{{2}} is pending on your Shivay Gym account. Please pay by UPI or at the reception. Thank you! | name, amountDue |
| AUTO-WELCOME | `shivay_welcome` | Welcome to Shivay Gym, {{1}}! Timings: Mon–Sat 5:30 AM–10:30 PM, Sun 7 AM–2 PM. Please bring clean training shoes and a towel. | name |
| AUTO-MORNING | `shivay_good_morning` | Good morning {{1}}! {{2}} – Team Shivay Gym | name, quote |
| AUTO-BIRTHDAY | `shivay_birthday` | Happy Birthday {{1}}! Team Shivay Gym wishes you strength and great health. Enjoy a free personal training session this week. | name |
| AUTO-ANNIVERSARY | `shivay_anniversary` | Happy gym anniversary, {{1}}! Another year of hard work at Shivay Gym. Keep going strong! | name |
| AUTO-INACTIVE-7D | `shivay_missed_you` | Hi {{1}}, we haven't seen you at Shivay Gym this week. Even a 30-minute session today will bring your momentum back. | name |
| AUTO-WINBACK | `shivay_winback` | Hi {{1}}, we miss you at Shivay Gym! Rejoin with code RESTART and get {{2}} off any 3, 6 or 12-month plan. Valid till {{3}}. | name, discount, date |
| AUTO-FESTIVAL | `shivay_festival_wish` | Happy {{2}}, {{1}}! Warm wishes from all of us at Shivay Gym. {{3}} | name, festivalName, festivalOffer |

For Hindi, create a second template in Hindi and add it under `"hi"` for that automation
(members choose their language in the member app → Notifications).

If a template `name` is left empty, the server sends the app's text as a normal message. That
only works within the 24-hour window. Otherwise Meta returns error 131047, which the app shows in
the Message Log.

## 4. Delivery ticks (sent → delivered → read)

1. Deploy the server on a public **HTTPS** URL (see below), or for testing run
   `ngrok http 8787` and use the https address it prints.
2. Meta app → **WhatsApp → Configuration → Webhook**: Callback URL `https://YOUR-SERVER/webhook`,
   Verify token = `WA_WEBHOOK_VERIFY_TOKEN` from `.env`. Then subscribe to the **messages** field.
3. Set `WA_APP_SECRET` (Meta app → Settings → Basic → App secret) so webhook calls are signature-checked.

The app reads these statuses every 20 seconds and shows them in **Automations → Message Log**
and in the member's **Notifications** screen.

## 5. Going live checklist

- [ ] Server deployed on an always-on host with HTTPS (Render, Railway, a VPS, etc.). The scheduler
      only runs while the server is running. Free hosts that sleep will miss the morning message.
- [ ] `ADMIN_API_KEY` set to a long random value. `ALLOWED_ORIGINS` set to the admin app's URL.
- [ ] Permanent system-user token and the gym's real number.
- [ ] Templates approved and mapped in `templates.json`.
- [ ] Real member phone numbers entered, and members have agreed to receive WhatsApp messages
      (WhatsApp policy requires opt-in. Members can switch it off in the member app).
- [ ] Turn **Test mode OFF** in Settings → WhatsApp Delivery. Until then, every message goes to your own number.

## API (used by the app)

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/health` | Status (no key needed) |
| POST | `/api/whatsapp/send` | `{ to, text, automationId, memberId, memberName, vars }` |
| POST | `/api/sync` | App pushes members, automations, festivals, offers |
| GET | `/api/messages?limit=200` | Message log with delivery status |
| POST | `/api/automations/:id/run` | Run one automation for today's due members right now |
| GET/POST | `/webhook` | Meta webhook |

Every `/api/*` call except health needs the header `x-api-key: <ADMIN_API_KEY>`.
Data is saved in `server/data/store.json`.
