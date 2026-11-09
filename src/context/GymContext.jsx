import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { members as seedMembers } from '../data/members';
import { trainers as seedTrainers } from '../data/trainers';
import { plans as seedPlans, addOns as seedAddOns } from '../data/plans';
import { formerMembers as seedFormerMembers } from '../data/formerMembers';
import { defaultAutomations, initialFestivalCalendar, initialOffers, initialSentMessages, interpolateTemplate, dailyMorningQuotes } from '../data/automations';
import { todayCheckIns as seedCheckIns, weeklyAttendanceTrend, peakHoursHeatmap } from '../data/attendance';
import { initialPaymentRecords, monthlyRevenueHistory } from '../data/payments';
import { gymClasses as seedClasses } from '../data/classes';
import { indianMealPlans, indianFoodDatabase, workoutSplits } from '../data/dietsWorkouts';
import { gymEquipment as seedEquipment, supplementStock as seedSupplements } from '../data/equipmentInventory';
import { monthlyExpenses as seedExpenses } from '../data/expenses';
import { initialLeads as seedLeads } from '../data/leads';
import { gymInfo } from '../data/gymInfo';
import { buildMessage } from '../utils/automationTargets';
import { rebaseDates, withDerivedStatus, startOfToday, toISODate } from '../utils/dates';
import {
  loadWhatsAppConfig,
  saveWhatsAppConfig,
  sendViaServer,
  syncToServer,
  fetchServerStatuses,
  buildWhatsAppLink
} from '../services/whatsapp';

// -----------------------------------------------------------------------------
// Seed data, re-dated so the demo always looks "current" (see utils/dates.js)
// -----------------------------------------------------------------------------
const pad2 = (n) => String(n).padStart(2, '0');
function withDemoProfileFields(list) {
  const t = startOfToday();
  return list.map((m, i) => {
    // Two demo members always have their birthday today, so the birthday automation has someone to greet
    const birthdayToday = m.id === 'SHIV-1003' || m.id === 'SHIV-1012';
    const month = birthdayToday ? t.getMonth() + 1 : ((i * 5) % 12) + 1;
    const day = birthdayToday ? t.getDate() : ((i * 7) % 28) + 1;
    const year = t.getFullYear() - (m.age || 25);
    return {
      dob: m.dob || `${year}-${pad2(month)}-${pad2(day)}`,
      whatsappOptIn: m.whatsappOptIn ?? true,
      preferredLanguage: m.preferredLanguage || 'en',
      ...m
    };
  });
}

const SEED = {
  members: withDerivedStatus(withDemoProfileFields(rebaseDates(seedMembers))),
  formerMembers: rebaseDates(seedFormerMembers),
  offers: rebaseDates(initialOffers),
  sentMessages: rebaseDates(initialSentMessages),
  payments: rebaseDates(initialPaymentRecords, ['invoiceNumber']),
  checkIns: rebaseDates(seedCheckIns),
  leads: rebaseDates(seedLeads),
  expenses: rebaseDates(seedExpenses),
  equipment: rebaseDates(seedEquipment),
  supplements: rebaseDates(seedSupplements),
  revenueHistory: rebaseDates(monthlyRevenueHistory)
};

const GymContext = createContext(null);

const STORAGE_KEYS = {
  MEMBERS: 'shivay_members_v2',
  FORMER_MEMBERS: 'shivay_former_members_v2',
  TRAINERS: 'shivay_trainers_v2',
  PLANS: 'shivay_plans_v2',
  CLASSES: 'shivay_classes_v2',
  AUTOMATIONS: 'shivay_automations_v2',
  FESTIVALS: 'shivay_festivals_v2',
  OFFERS: 'shivay_offers_v2',
  MESSAGES: 'shivay_messages_v2',
  PAYMENTS: 'shivay_payments_v2',
  CHECK_INS: 'shivay_checkins_v2',
  LEADS: 'shivay_leads_v2',
  EXPENSES: 'shivay_expenses_v2',
  EQUIPMENT: 'shivay_equipment_v2',
  SUPPLEMENTS: 'shivay_supplements_v2',
  THEME: 'shivay_theme_v2',
  ACTIVE_MEMBER_ID: 'shivay_active_member_id_v2',
  STORE_DATE: 'shivay_store_date_v2'
};

function getStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
  } catch (err) {
    console.error(`Error loading key ${key}:`, err);
  }
  return fallback;
}

export function GymProvider({ children }) {
  // Theme State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'dark';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Toast System
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3800);
  };

  // Primary State collections
  const [members, setMembers] = useState(() => withDerivedStatus(getStorage(STORAGE_KEYS.MEMBERS, SEED.members)));
  const [formerMembers, setFormerMembers] = useState(() => getStorage(STORAGE_KEYS.FORMER_MEMBERS, SEED.formerMembers));
  const [trainers, setTrainers] = useState(() => getStorage(STORAGE_KEYS.TRAINERS, seedTrainers));
  const [plans, setPlans] = useState(() => getStorage(STORAGE_KEYS.PLANS, seedPlans));
  const [classes, setClasses] = useState(() => getStorage(STORAGE_KEYS.CLASSES, seedClasses));
  const [automations, setAutomations] = useState(() => {
    const saved = getStorage(STORAGE_KEYS.AUTOMATIONS, defaultAutomations);
    // add any automation introduced after the user's data was saved
    const missing = defaultAutomations.filter(d => !saved.some(a => a.id === d.id));
    return missing.length ? [...saved, ...missing] : saved;
  });
  const [festivalCalendar, setFestivalCalendar] = useState(() => getStorage(STORAGE_KEYS.FESTIVALS, initialFestivalCalendar));
  const [offers, setOffers] = useState(() => getStorage(STORAGE_KEYS.OFFERS, SEED.offers));
  const [sentMessages, setSentMessages] = useState(() => getStorage(STORAGE_KEYS.MESSAGES, SEED.sentMessages));
  const [payments, setPayments] = useState(() => getStorage(STORAGE_KEYS.PAYMENTS, SEED.payments));
  const [todayCheckInsList, setTodayCheckInsList] = useState(() => getStorage(STORAGE_KEYS.CHECK_INS, SEED.checkIns));
  const [leads, setLeads] = useState(() => getStorage(STORAGE_KEYS.LEADS, SEED.leads));
  const [expenses, setExpenses] = useState(() => getStorage(STORAGE_KEYS.EXPENSES, SEED.expenses));
  const [equipment, setEquipment] = useState(() => getStorage(STORAGE_KEYS.EQUIPMENT, SEED.equipment));
  const [supplements, setSupplements] = useState(() => getStorage(STORAGE_KEYS.SUPPLEMENTS, SEED.supplements));
  const [activeMemberId, setActiveMemberId] = useState(() => getStorage(STORAGE_KEYS.ACTIVE_MEMBER_ID, 'SHIV-1001'));

  // Sync to localStorage
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members)); }, [members]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.FORMER_MEMBERS, JSON.stringify(formerMembers)); }, [formerMembers]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.TRAINERS, JSON.stringify(trainers)); }, [trainers]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(plans)); }, [plans]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(classes)); }, [classes]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.AUTOMATIONS, JSON.stringify(automations)); }, [automations]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.FESTIVALS, JSON.stringify(festivalCalendar)); }, [festivalCalendar]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.OFFERS, JSON.stringify(offers)); }, [offers]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(sentMessages)); }, [sentMessages]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments)); }, [payments]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.CHECK_INS, JSON.stringify(todayCheckInsList)); }, [todayCheckInsList]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads)); }, [leads]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses)); }, [expenses]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.EQUIPMENT, JSON.stringify(equipment)); }, [equipment]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.SUPPLEMENTS, JSON.stringify(supplements)); }, [supplements]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.ACTIVE_MEMBER_ID, JSON.stringify(activeMemberId)); }, [activeMemberId]);

  // Member Operations
  const addMember = (newMemberData) => {
    const maxNum = members.reduce((mx, m) => Math.max(mx, parseInt(String(m.id).replace(/\D/g, ''), 10) || 0), 1000);
    const nextId = `SHIV-${maxNum + 1}`;
    const newMember = {
      id: nextId,
      duesPending: 0,
      attendanceStreak: 0,
      totalVisits: 0,
      lastVisit: null,
      status: 'Active',
      addedInApp: true,
      whatsappOptIn: true,
      preferredLanguage: 'en',
      messageHistory: [],
      ...newMemberData
    };

    setMembers(prev => [newMember, ...prev]);
    showToast(`Member ${newMember.name} added successfully!`, 'success');

    // Welcome message on WhatsApp (AUTO-WELCOME)
    const welcome = automations.find(a => a.id === 'AUTO-WELCOME');
    if (welcome?.enabled && newMember.phone) {
      const recipient = { vars: { name: newMember.name.split(' ')[0], plan: newMember.plan, trainer: newMember.trainer } };
      triggerSendMessage({
        recipientId: newMember.id,
        recipientName: newMember.name,
        recipientPhone: newMember.phone,
        text: buildMessage(welcome, recipient),
        vars: recipient.vars,
        automationId: 'AUTO-WELCOME',
        automationTitle: welcome.title,
        channel: welcome.channels?.whatsapp ? 'WhatsApp' : 'Push'
      });
    }
    return newMember;
  };

  const updateMember = (id, updatedFields) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, ...updatedFields } : m));
    showToast(`Member profile updated successfully.`, 'success');
  };

  const renewMember = (id, planObj, amountPaid, paymentMode = 'UPI') => {
    const today = new Date();
    const duration = planObj.durationMonths || 1;
    const expiryDate = new Date(today);
    expiryDate.setMonth(expiryDate.getMonth() + duration);
    const expiryStr = expiryDate.toISOString().split('T')[0];

    setMembers(prev => prev.map(m => {
      if (m.id === id) {
        return {
          ...m,
          plan: planObj.name,
          planId: planObj.id,
          expiryDate: expiryStr,
          status: 'Active',
          duesPending: 0
        };
      }
      return m;
    }));

    // Record invoice
    const invNumber = `INV-${Date.now().toString().slice(-6)}`;
    const base = amountPaid / 1.18;
    const gst = amountPaid - base;

    const newPayment = {
      invoiceNumber: invNumber,
      memberId: id,
      memberName: members.find(m => m.id === id)?.name || 'Member',
      planName: planObj.name,
      amount: amountPaid,
      baseAmount: Math.round(base * 100) / 100,
      gstRatePct: 18,
      gstAmount: Math.round(gst * 100) / 100,
      paymentMode,
      transactionRef: `${paymentMode.toUpperCase()}/${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      paymentDate: today.toISOString().split('T')[0],
      status: 'Completed',
      notes: `Membership renewal for ${planObj.name}`
    };

    setPayments(prev => [newPayment, ...prev]);
    showToast(`Membership renewed till ${expiryStr}! Invoice generated.`, 'success');
  };

  const freezeMember = (id, days = 15, reason = 'Medical / Travel') => {
    setMembers(prev => prev.map(m => {
      if (m.id === id) {
        const curExp = new Date(m.expiryDate || Date.now());
        curExp.setDate(curExp.getDate() + days);
        return {
          ...m,
          status: 'Frozen',
          expiryDate: curExp.toISOString().split('T')[0],
          notes: `${m.notes ? m.notes + ' | ' : ''}Frozen for ${days} days (${reason}) on ${new Date().toLocaleDateString()}`
        };
      }
      return m;
    }));
    showToast(`Membership frozen for ${days} days. Expiry extended.`, 'warning');
  };

  const markMemberLeft = (id, reason = 'Personal') => {
    const memberObj = members.find(m => m.id === id);
    if (!memberObj) return;

    // Add to former members
    const newFormer = {
      id: `FORMER-${formerMembers.length + 1}`,
      name: memberObj.name,
      phone: memberObj.phone,
      email: memberObj.email,
      lastPlan: memberObj.plan,
      leftDate: new Date().toISOString().split('T')[0],
      daysSinceLeft: 0,
      reasonLeft: reason,
      totalMonthsAttended: 3,
      lastTrainer: memberObj.trainer,
      winBackStatus: 'Not Contacted',
      notes: memberObj.notes
    };

    setFormerMembers(prev => [newFormer, ...prev]);
    setMembers(prev => prev.map(m => m.id === id ? { ...m, status: 'Left' } : m));
    showToast(`Member marked as Left & moved to Former Members list.`, 'info');
  };

  // ---------------------------------------------------------------------------
  // WhatsApp delivery
  // ---------------------------------------------------------------------------
  const [whatsappConfig, setWhatsappConfigState] = useState(() => loadWhatsAppConfig());
  const updateWhatsappConfig = (fields) => {
    setWhatsappConfigState(prev => {
      const next = { ...prev, ...fields };
      saveWhatsAppConfig(next);
      return next;
    });
  };

  // Manual-mode queue: bulk messages are opened one by one in WhatsApp
  const [waQueue, setWaQueue] = useState(null); // { title, items: [...], index }
  const pendingBatch = useRef([]);
  const configRef = useRef(whatsappConfig);
  configRef.current = whatsappConfig;
  const membersRef = useRef(members);
  membersRef.current = members;

  const patchMessage = (msgId, fields) => {
    setSentMessages(prev => prev.map(m => (m.id === msgId ? { ...m, ...fields } : m)));
    if (fields.status) {
      setMembers(prev => prev.map(m => {
        if (!m.messageHistory?.some(h => h.id === msgId)) return m;
        return { ...m, messageHistory: m.messageHistory.map(h => (h.id === msgId ? { ...h, status: fields.status } : h)) };
      }));
    }
  };

  const msgCounter = useRef(0);
  const newMessageId = () => {
    msgCounter.current += 1;
    return `MSG-${Date.now().toString(36).toUpperCase()}-${msgCounter.current}`;
  };

  // Records the message in the log + member inbox (member app → Notifications)
  const logMessage = ({ recipientId, recipientName, recipientPhone, text, automationTitle, automationId, channel, status }) => {
    const newMsg = {
      id: newMessageId(),
      recipientName,
      recipientPhone,
      recipientId,
      automationTitle: automationTitle || 'Direct Message',
      automationId: automationId || null,
      channel,
      text,
      sentAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      status
    };
    setSentMessages(prev => [newMsg, ...prev]);
    setMembers(prev => prev.map(m => {
      if (m.id === recipientId) {
        const history = m.messageHistory || [];
        return {
          ...m,
          messageHistory: [{ id: newMsg.id, date: newMsg.sentAt, text, channel, status, title: newMsg.automationTitle }, ...history]
        };
      }
      return m;
    }));
    return newMsg;
  };

  const flushBatch = async () => {
    const batch = pendingBatch.current;
    pendingBatch.current = [];
    if (!batch.length) return;
    const cfg = configRef.current;

    const whatsappItems = [];
    let skippedOptOut = 0;
    let otherChannel = 0;
    batch.forEach(item => {
      const member = membersRef.current.find(m => m.id === item.recipientId);
      if (item.channel !== 'WhatsApp') {
        logMessage({ ...item, status: item.channel === 'Push' ? 'Delivered' : 'Logged' });
        otherChannel += 1;
        return;
      }
      if (member && member.whatsappOptIn === false) {
        // Respect the member's choice: in-app inbox only
        logMessage({ ...item, channel: 'App Inbox', status: 'Delivered' });
        skippedOptOut += 1;
        return;
      }
      whatsappItems.push(item);
    });

    if (!whatsappItems.length) {
      showToast(
        skippedOptOut
          ? `${skippedOptOut} member(s) turned WhatsApp off — sent to their app inbox instead.`
          : `${otherChannel} message(s) delivered to member app inbox.`,
        'info'
      );
      return;
    }

    if (cfg.mode === 'server') {
      if (cfg.testMode && !normalizePhoneSafe(cfg.testNumber)) {
        whatsappItems.forEach(item => logMessage({ ...item, status: 'Failed' }));
        showToast('Test mode is ON but no test WhatsApp number is set (Settings → WhatsApp Delivery).', 'danger');
        return;
      }
      showToast(`Sending ${whatsappItems.length} WhatsApp message(s) via server...`, 'info');
      let ok = 0;
      let dry = 0;
      let failed = 0;
      let lastError = '';
      for (const item of whatsappItems) {
        const rec = logMessage({ ...item, status: 'Sending' });
        try {
          const res = await sendViaServer(cfg, {
            to: item.recipientPhone,
            text: item.text,
            automationId: item.automationId,
            memberId: item.recipientId,
            memberName: item.recipientName,
            vars: item.vars || {}
          });
          patchMessage(rec.id, { status: res.status === 'dry-run' ? 'Dry Run' : 'Sent', waMessageId: res.id, deliveredTo: res.to, sentAs: res.sentAs });
          ok += 1;
          if (res.status === 'dry-run') dry += 1;
        } catch (err) {
          patchMessage(rec.id, { status: 'Failed', error: err.message });
          failed += 1;
          lastError = err.message;
        }
      }
      showToast(
        failed
          ? `WhatsApp: ${ok} sent, ${failed} failed. ${lastError}`
          : dry
            ? `Dry run: ${dry} message(s) logged by the server. Add WhatsApp API keys in server/.env to really send.`
            : `WhatsApp: ${ok} message(s) sent${cfg.testMode ? ' to your test number' : ''}.`,
        failed ? 'danger' : 'success'
      );
      return;
    }

    // Manual mode
    const records = whatsappItems.map(item => {
      const rec = logMessage({ ...item, status: 'Queued' });
      return { ...item, msgId: rec.id, to: cfg.testMode && cfg.testNumber ? cfg.testNumber : item.recipientPhone };
    });

    if (records.length === 1) {
      // Single message: open WhatsApp straight away (still inside the click's user activation)
      const r = records[0];
      const win = window.open(buildWhatsAppLink(r.to, r.text), '_blank');
      if (win) {
        try { win.opener = null; } catch { /* cross-origin */ }
        patchMessage(r.msgId, { status: 'Opened in WhatsApp' });
        showToast(`WhatsApp opened for ${r.recipientName} — press Send in WhatsApp.`, 'success');
        return;
      }
    }
    setWaQueue({ title: records[0].automationTitle || 'WhatsApp messages', items: records, index: 0, done: [] });
  };

  const normalizePhoneSafe = (p) => String(p || '').replace(/[^0-9]/g, '').length >= 10;

  /**
   * Send a message to a member. Calls made in the same click are grouped
   * into one batch (bulk send). Delivery depends on Settings → WhatsApp Delivery.
   */
  const triggerSendMessage = ({ recipientId, recipientName, recipientPhone, text, automationTitle, automationId, vars, channel = 'WhatsApp' }) => {
    pendingBatch.current.push({ recipientId, recipientName, recipientPhone, text, automationTitle, automationId, vars, channel });
    if (pendingBatch.current.length === 1) queueMicrotask(flushBatch);
    return { queued: true };
  };

  const markQueueItemSent = (msgId) => {
    patchMessage(msgId, { status: 'Opened in WhatsApp' });
    setWaQueue(q => (q ? { ...q, done: [...q.done, msgId], index: Math.min(q.index + 1, q.items.length) } : q));
  };
  const skipQueueItem = () => setWaQueue(q => (q ? { ...q, index: Math.min(q.index + 1, q.items.length) } : q));
  const closeQueue = () => setWaQueue(null);

  // Server mode: keep the server's copy of members/automations/festivals fresh
  // so it can run scheduled automations on its own.
  const syncPayloadRef = useRef(null);
  syncPayloadRef.current = { members, formerMembers, automations, festivalCalendar, offers, gymInfo };
  const [serverSync, setServerSync] = useState({ state: 'idle', at: null, error: null });
  const syncNow = async () => {
    const cfg = configRef.current;
    if (cfg.mode !== 'server') return;
    setServerSync(s => ({ ...s, state: 'syncing' }));
    try {
      const p = syncPayloadRef.current;
      await syncToServer(cfg, {
        gym: { name: p.gymInfo?.name || 'SHIVAY GYM', timezone: 'Asia/Kolkata' },
        testMode: cfg.testMode,
        testNumber: cfg.testNumber,
        members: p.members.map(m => ({
          id: m.id, name: m.name, phone: m.phone, plan: m.plan, status: m.status,
          joinDate: m.joinDate, expiryDate: m.expiryDate, dob: m.dob, lastVisit: m.lastVisit,
          duesPending: m.duesPending, trainer: m.trainer, whatsappOptIn: m.whatsappOptIn !== false,
          preferredLanguage: m.preferredLanguage || 'en'
        })),
        formerMembers: p.formerMembers.map(f => ({ id: f.id, name: f.name, phone: f.phone, lastPlan: f.lastPlan, leftDate: f.leftDate })),
        automations: p.automations,
        festivals: p.festivalCalendar,
        offers: p.offers,
        quotes: dailyMorningQuotes
      });
      setServerSync({ state: 'ok', at: new Date().toLocaleTimeString('en-IN'), error: null });
    } catch (err) {
      setServerSync({ state: 'error', at: new Date().toLocaleTimeString('en-IN'), error: err.message });
    }
  };
  useEffect(() => {
    if (whatsappConfig.mode !== 'server') return undefined;
    const t = setTimeout(syncNow, 2500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [whatsappConfig.mode, whatsappConfig.serverUrl, whatsappConfig.testMode, whatsappConfig.testNumber, members, formerMembers, automations, festivalCalendar, offers]);

  // Server mode: pull delivered / read / failed statuses from Meta webhooks,
  // plus messages the server's scheduler sent automatically.
  useEffect(() => {
    if (whatsappConfig.mode !== 'server') return undefined;
    let stop = false;
    const poll = async () => {
      try {
        const data = await fetchServerStatuses(configRef.current);
        if (stop || !data?.messages) return;
        const byWaId = new Map(data.messages.filter(m => m.waMessageId).map(m => [m.waMessageId, m]));
        setSentMessages(prev => {
          const known = new Set(prev.map(m => m.waMessageId).filter(Boolean));
          const updated = prev.map(m => {
            const srv = m.waMessageId && byWaId.get(m.waMessageId);
            return srv && srv.status && srv.status !== m.status ? { ...m, status: srv.status, error: srv.error || m.error } : m;
          });
          // Messages the server sent by itself (scheduled automations)
          const scheduled = data.messages
            .filter(m => m.source === 'scheduler' && m.waMessageId && !known.has(m.waMessageId))
            .map(m => ({
              id: `SRV-${m.waMessageId}`,
              waMessageId: m.waMessageId,
              recipientId: m.memberId,
              recipientName: m.memberName,
              recipientPhone: m.to,
              automationTitle: m.automationTitle || 'Scheduled Automation',
              automationId: m.automationId,
              channel: 'WhatsApp',
              text: m.text,
              sentAt: new Date(m.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
              status: m.status
            }));
          return scheduled.length ? [...scheduled, ...updated] : updated;
        });
      } catch {
        /* server offline – try again next tick */
      }
    };
    poll();
    const iv = setInterval(poll, 20000);
    return () => { stop = true; clearInterval(iv); };
  }, [whatsappConfig.mode, whatsappConfig.serverUrl]);

  const toggleAutomationState = (autoId) => {
    setAutomations(prev => prev.map(a => a.id === autoId ? { ...a, enabled: !a.enabled } : a));
    showToast(`Automation updated.`, 'info');
  };

  const updateAutomationTemplate = (autoId, fields) => {
    setAutomations(prev => prev.map(a => a.id === autoId ? { ...a, ...fields } : a));
    showToast(`Automation settings saved.`, 'success');
  };

  const updateFestivalItem = (festId, updatedFields) => {
    setFestivalCalendar(prev => prev.map(f => f.id === festId ? { ...f, ...updatedFields } : f));
    showToast(`Festival calendar updated!`, 'success');
  };

  // Check-In Operations
  const checkInMember = (memberId, method = 'QR Scan') => {
    const target = members.find(m => m.id === memberId || m.phone.includes(memberId));
    if (!target) {
      showToast(`Member not found with ID/Phone: ${memberId}`, 'danger');
      return false;
    }

    if (target.status === 'Expired') {
      showToast(`Access Denied! ${target.name}'s membership has EXPIRED.`, 'danger');
      return false;
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const newCheckIn = {
      id: `CHK-${Date.now().toString().slice(-5)}`,
      memberId: target.id,
      name: target.name,
      time: timeStr,
      method,
      plan: target.plan
    };

    setTodayCheckInsList(prev => [newCheckIn, ...prev]);

    // Update streak and lastVisit
    setMembers(prev => prev.map(m => {
      if (m.id === target.id) {
        return {
          ...m,
          attendanceStreak: (m.attendanceStreak || 0) + 1,
          totalVisits: (m.totalVisits || 0) + 1,
          lastVisit: now.toISOString().split('T')[0]
        };
      }
      return m;
    }));

    showToast(`Check-in successful! Welcome, ${target.name} (Streak: ${target.attendanceStreak + 1} days)`, 'success');
    return true;
  };

  // Payments
  const recordManualPayment = ({ memberId, memberName, planName, amount, paymentMode, notes = '' }) => {
    const invNumber = `INV-${Date.now().toString().slice(-6)}`;
    const base = amount / 1.18;
    const gst = amount - base;

    const newPayment = {
      invoiceNumber: invNumber,
      memberId,
      memberName,
      planName,
      amount: Number(amount),
      baseAmount: Math.round(base * 100) / 100,
      gstRatePct: 18,
      gstAmount: Math.round(gst * 100) / 100,
      paymentMode,
      transactionRef: `${paymentMode.toUpperCase()}/TXN${Math.floor(100000 + Math.random() * 900000)}`,
      paymentDate: new Date().toISOString().split('T')[0],
      status: 'Completed',
      notes
    };

    setPayments(prev => [newPayment, ...prev]);

    // Clear or reduce member dues if any
    setMembers(prev => prev.map(m => {
      if (m.id === memberId) {
        const remaining = Math.max(0, (m.duesPending || 0) - Number(amount));
        return { ...m, duesPending: remaining };
      }
      return m;
    }));

    showToast(`Payment of ₹${amount} recorded with invoice ${invNumber}!`, 'success');
    return newPayment;
  };

  // Leads
  const addLead = (leadData) => {
    const newLead = {
      id: `LEAD-${leads.length + 1 < 10 ? '0' + (leads.length + 1) : leads.length + 1}`,
      enquiryDate: new Date().toISOString().split('T')[0],
      status: 'Trial Booked',
      ...leadData
    };
    setLeads(prev => [newLead, ...prev]);
    showToast(`New lead ${newLead.name} added!`, 'success');
  };

  const convertLeadToMember = (leadId, planId) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    const planObj = plans.find(p => p.id === planId) || plans[0];
    const today = new Date();
    const expiry = new Date(today);
    expiry.setMonth(expiry.getMonth() + planObj.durationMonths);

    const newMem = addMember({
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      age: 26,
      gender: 'Male',
      bloodGroup: 'B+',
      plan: planObj.name,
      planId: planObj.id,
      joinDate: today.toISOString().split('T')[0],
      expiryDate: expiry.toISOString().split('T')[0],
      trainer: lead.assignedTrainer || 'Vikram Chauhan',
      trainerId: 'TR-01',
      notes: `Converted from lead source: ${lead.source}`
    });

    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: 'Converted' } : l));
    showToast(`Lead ${lead.name} successfully enrolled as member ${newMem.id}!`, 'success');
  };

  // Active Member for Member App (switchable)
  const currentMember = members.find(m => m.id === activeMemberId) || members[0];

  // Reset to initial demo data
  const resetToDemoData = () => {
    Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
    setMembers(SEED.members);
    setFormerMembers(SEED.formerMembers);
    setTrainers(seedTrainers);
    setPlans(seedPlans);
    setClasses(seedClasses);
    setAutomations(defaultAutomations);
    setFestivalCalendar(initialFestivalCalendar);
    setOffers(SEED.offers);
    setSentMessages(SEED.sentMessages);
    setPayments(SEED.payments);
    setTodayCheckInsList(SEED.checkIns);
    setLeads(SEED.leads);
    setExpenses(SEED.expenses);
    setEquipment(SEED.equipment);
    setSupplements(SEED.supplements);
    setActiveMemberId('SHIV-1001');
    showToast('Prototype data reset to fresh defaults!', 'info');
  };

  const value = {
    theme,
    toggleTheme,
    toast,
    showToast,
    gymInfo,
    members,
    formerMembers,
    trainers,
    plans,
    addOns: seedAddOns,
    classes,
    automations,
    festivalCalendar,
    offers,
    sentMessages,
    payments,
    todayCheckIns: todayCheckInsList,
    leads,
    expenses,
    equipment,
    supplements,
    monthlyRevenueHistory: SEED.revenueHistory,
    peakHoursHeatmap,
    weeklyAttendanceTrend,
    indianMealPlans,
    indianFoodDatabase,
    workoutSplits,
    activeMemberId,
    setActiveMemberId,
    currentMember,
    // Methods
    addMember,
    updateMember,
    renewMember,
    freezeMember,
    markMemberLeft,
    triggerSendMessage,
    whatsappConfig,
    updateWhatsappConfig,
    waQueue,
    markQueueItemSent,
    skipQueueItem,
    closeQueue,
    serverSync,
    syncNow,
    toggleAutomationState,
    updateAutomationTemplate,
    updateFestivalItem,
    checkInMember,
    recordManualPayment,
    addLead,
    convertLeadToMember,
    resetToDemoData,
    setOffers,
    setExpenses,
    setEquipment,
    setSupplements
  };

  return <GymContext.Provider value={value}>{children}</GymContext.Provider>;
}

export function useGym() {
  const context = useContext(GymContext);
  if (!context) {
    throw new Error('useGym must be used within a GymProvider');
  }
  return context;
}

