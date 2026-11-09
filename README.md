# SHIVAY GYM — Gym Management System (Production Prototype)

A high-performance, discipline-oriented gym management platform and member mobile companion built for **SHIVAY GYM**, Delhi NCR's premier strength training facility (Sector 14, Gurugram).

---

## 🚀 Live Demo Credentials

| Portal | Route | Demo Email | Demo Password | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Public Website** | `/` | — | — | Full 11-section landing page, plans, timetable & trial pass |
| **Owner / Admin Portal** | `/admin` | `admin@shivaygym.com` | `admin123` | Full gym operations, 60 members, billing, automations & attendance |
| **Member Companion App** | `/member` | `member@shivaygym.com` | `member123` | Digital pass QR, BMR/TDEE calculator, Indian meal logging & rest timer |

*Note: Use the **Prototype QuickNav Bar** at the top of the screen to seamlessly toggle between the Website, Admin Portal, and Member App with one click. You can also switch between different members (Aarav, Priya, Gurpreet, etc.) to view personalized profiles.*

---

## 🛠 Tech Stack

- **React JS** (JavaScript only, strictly `.jsx` and `.js` — no TypeScript)
- **Vite** for fast HMR and optimized production bundle chunking
- **Tailwind CSS** with custom dark palette (`#0E0E0E`, `#161616`, deep saffron `#E8590C`)
- **React Router v6** for multi-portal routing
- **Recharts** for monthly revenue trends, floor heatmaps, and macro donut charts
- **Lucide React** for functional line icons
- **LocalStorage Sync**: All actions (adding members, renewing passes, check-ins, WhatsApp dispatch logs, and meal records) persist automatically in browser storage. Click **"Reset"** in the top bar anytime to restore defaults.

---

## 🌟 Key Architecture & Features

### PART A: Public Landing Page (`/`)
1. **Hero Section**: Full-bleed real photograph of competition deadlift platforms with verified Unsplash CDN parameters, condensed bold typography, and trial pass triggers.
2. **About the Gym**: 8,500 sq ft facility metrics, CSCS & ISSA accredited coach ethos, and community etiquette standards.
3. **Facilities Grid**: Olympic iron zone, Concept2 rowers, functional turf, recovery steam suites, and parking.
4. **Membership Plans**: Monthly Starter, Quarterly Foundation, Half-Yearly Builder, Yearly Elite Strength, and Personal Training (PT) with transparent ₹ INR pricing.
5. **Coaches & Trainers**: 6 certified coaches with certifications, experience, shifts, and WhatsApp consultation links.
6. **Class Timetable**: Weekly schedule for Zumba, Yoga, HIIT, CrossFit, and Barbell Strength.
7. **Transformations Showcase**: Before / after progress milestones with member quotes and explicit consent disclaimers.
8. **Interactive BMI Calculator**: Free baseline diagnostic tool for prospective visitors.
9. **Testimonials**: Representative member feedback from doctors, powerlifters, and working professionals.
10. **Location & Timings**: Operating hours (5:30 AM – 10:30 PM), address, and direct WhatsApp booking.

---

### PART B: Owner / Admin Management Console (`/admin`)
1. **Executive Dashboard**:
   - 8 primary stats: Active members, expiring in 7 days, check-ins today, Nov MTD revenue (₹495k), and pending dues.
   - Monthly Revenue & Net Profit Area Chart (12-month trend).
   - Membership tier distribution donut chart.
   - 15-slot hourly floor density heatmap (peak hour: 7:00 PM).
   - "Needs Attention" live feed (expiring soon, dues pending, 7+ days inactive).
2. **Member Directory**:
   - 60 realistic Indian members with diverse ages, blood groups, join/expiry dates, and assigned trainers.
   - Real data table with multi-field search, status filters (Active, Expiring Soon, Expired, Frozen), column sorting, and CSV export.
   - Add/edit member form with validation.
   - One-click actions: Renew pass, freeze membership (7/15/30 days), mark as left, send message.
3. **Member Profile Dossier** (`/admin/members/:id`):
   - Personal details, emergency contacts, InBody bodyweight progress chart, assigned Indian diet & workout split, payment receipts, and dispatch logs.
4. **Former Members Archive** (`/admin/former-members`):
   - Churn tracking with reasons for leaving (fees, relocation, injury, work).
   - Win-back campaign launcher with custom discount code (`RESTART`) and auto-calculated validity dates.
5. **Messaging & Automation Center** (`/admin/automations`) *(Core Feature)*:
   - 11 configurable automated triggers: Daily Good Morning (30+ rotating quotes), 7d/3d/1d/0d/+3d expiry alerts, win-back offers, birthday wishes with PT gifts, joining anniversaries, 7-day inactivity nudges, payment dues, and welcome onboarding.
   - **Bilingual Support**: Instant toggle between English and Hindi (`हिन्दी`) for every template.
   - **Variable Engine**: `{name}`, `{gym}`, `{plan}`, `{expiry_date}`, `{days_left}`, `{amount_due}`, `{discount}`.
   - Real click-to-chat WhatsApp links (`https://wa.me/...`).
   - 30-day upcoming scheduled queue and real-time dispatch log.
6. **Indian Festival Calendar**:
   - 27 editable national days, festivals (Diwali, Holi, Eid, Navratri, Chhath Puja, Christmas), and health days (Yoga Day, Sports Day).
7. **Floor Attendance & QR Station** (`/admin/attendance`):
   - Real-time check-in stream, manual desk lookup, streak counter, and displayable reception QR code.
8. **Payments & GST Invoicing** (`/admin/payments`):
   - Record cash, UPI, or card payments.
   - Generates official tax invoices with 18% GST (SAC 999723) and printable receipt view.
9. **Leads & Enquiries** (`/admin/leads`):
   - Pipeline for walk-ins and Instagram trial leads, with one-click conversion into active members.
10. **Expenses & P&L** (`/admin/expenses`):
    - Rent, staff payroll, electricity, and maintenance vouchers with net operating margin calculation.
11. **Equipment & Supplements** (`/admin/equipment`):
    - Equipment inspection schedules and front-desk protein supplement inventory.
12. **Executive Reports** (`/admin/reports`):
    - Retention rate (88%), churn trend, and downloadable executive summary CSV.

---

### PART C: Member Mobile Companion (`/member`)
1. **Home Feed**:
   - Morning motivation, digital membership card with live progress bar and days left, habit streak counter, today's workout preview, and water tracker.
2. **Clinical BMR & TDEE Calculator** (`/member/calculator`):
   - Full implementation of the **Mifflin-St Jeor formula**:
     - $\text{BMR (Men)} = 10 \times \text{weight} + 6.25 \times \text{height} - 5 \times \text{age} + 5$
     - $\text{BMR (Women)} = 10 \times \text{weight} + 6.25 \times \text{height} - 5 \times \text{age} - 161$
   - TDEE activity multipliers (1.2 to 1.9), goal deficits/surpluses, protein target (2.0 g/kg), hydration volume, and macro donut chart.
3. **Indian Nutrition & Calorie Logger** (`/member/diet`):
   - Veg & non-veg Indian meal frameworks (poha, dal, paneer, roti, chicken, sattu, curd).
   - Searchable lookup database of 30+ Indian foods with gram serving sizes and calories.
   - Daily intake progress vs target calories and protein.
4. **Workout Splits & Rest Timer** (`/member/workout`):
   - Push/Pull/Legs, Upper/Lower, and Beginner splits.
   - Interactive exercise sets tracker and built-in **countdown rest timer** (60s, 90s, 120s) with active interval notification.
5. **Body Stats & Compound PRs** (`/member/progress`):
   - Weigh-in logging, InBody chart, and personal records for Bench, Squat, Deadlift, and OHP.
6. **Class Reservations** (`/member/bookings`):
   - One-tap booking for weekly studio classes.
7. **Receipts & Pass Renewal** (`/member/payments`):
   - Download invoices and renew subscriptions via UPI.
8. **Digital Membership QR Pass**:
   - Instant full-screen pass for biometric turnstile scanning at reception.
9. **Refer a Friend** (`/member/referral`):
   - Shareable referral code offering 15% discount to buddies and +1 month free extension.
10. **Pass Controls & Feedback** (`/member/profile`):
    - Self-service freeze requests and direct feedback box.

---

## 💻 Local Setup & Development

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build optimized production bundle
npm run build
```

---

## 📲 WhatsApp Notifications

Every reminder, offer, good morning message and festival wish can go to the member's WhatsApp.
Choose the mode in **Admin → Gym Settings → WhatsApp Delivery**:

| Mode | Setup | How it works |
|---|---|---|
| **Manual** (default) | None | Each message opens WhatsApp (phone / Desktop / Web) with the number and text filled in, and you press Send. Bulk sends open a step-by-step queue. |
| **Automatic** | Run `/server` + Meta WhatsApp Cloud API | Messages are sent by the server. Daily automations (06:00 good morning, expiry reminders, birthdays, festival wishes…) run on schedule even when the app is closed. Sent / delivered / read ticks show in the Message Log. |

**Test mode** is ON by default: every message goes to *your* number, because the demo members have made-up numbers. Turn it off only after real member numbers are entered.

```bash
# terminal 1 – the app
npm run dev
# terminal 2 – the WhatsApp server (Node 18+, no install needed)
cd server && cp .env.example .env && node index.js
```

Full Meta setup, template samples and the go-live checklist: **[server/README.md](server/README.md)**.

Members control it themselves in **Member App → Notifications**: WhatsApp on/off, their number, and English/Hindi.

### Dates always current
The demo data is re-dated on load (`src/utils/dates.js`), so expiries, "expiring in 7 days", last visits, payments and charts are always relative to today. Member status (Active / Expiring Soon / Expired) is calculated from the expiry date. The festival calendar covers Nov 2026 – Oct 2027. Lunar festival dates are marked and can be edited from Automations → Festival Calendar.
