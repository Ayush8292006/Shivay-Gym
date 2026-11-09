import React, { createContext, useContext, useState, useEffect } from 'react';
import { members as seedMembers } from '../data/members';
import { trainers as seedTrainers } from '../data/trainers';
import { plans as seedPlans, addOns as seedAddOns } from '../data/plans';
import { formerMembers as seedFormerMembers } from '../data/formerMembers';
import { defaultAutomations, initialFestivalCalendar, initialOffers, initialSentMessages, interpolateTemplate } from '../data/automations';
import { todayCheckIns as seedCheckIns, weeklyAttendanceTrend, peakHoursHeatmap } from '../data/attendance';
import { initialPaymentRecords, monthlyRevenueHistory } from '../data/payments';
import { gymClasses as seedClasses } from '../data/classes';
import { indianMealPlans, indianFoodDatabase, workoutSplits } from '../data/dietsWorkouts';
import { gymEquipment as seedEquipment, supplementStock as seedSupplements } from '../data/equipmentInventory';
import { monthlyExpenses as seedExpenses } from '../data/expenses';
import { initialLeads as seedLeads } from '../data/leads';
import { gymInfo } from '../data/gymInfo';

const GymContext = createContext(null);

const STORAGE_KEYS = {
  MEMBERS: 'shivay_members_v1',
  FORMER_MEMBERS: 'shivay_former_members_v1',
  TRAINERS: 'shivay_trainers_v1',
  PLANS: 'shivay_plans_v1',
  CLASSES: 'shivay_classes_v1',
  AUTOMATIONS: 'shivay_automations_v1',
  FESTIVALS: 'shivay_festivals_v1',
  OFFERS: 'shivay_offers_v1',
  MESSAGES: 'shivay_messages_v1',
  PAYMENTS: 'shivay_payments_v1',
  CHECK_INS: 'shivay_checkins_v1',
  LEADS: 'shivay_leads_v1',
  EXPENSES: 'shivay_expenses_v1',
  EQUIPMENT: 'shivay_equipment_v1',
  SUPPLEMENTS: 'shivay_supplements_v1',
  THEME: 'shivay_theme_v1',
  ACTIVE_MEMBER_ID: 'shivay_active_member_id_v1'
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
  const [members, setMembers] = useState(() => getStorage(STORAGE_KEYS.MEMBERS, seedMembers));
  const [formerMembers, setFormerMembers] = useState(() => getStorage(STORAGE_KEYS.FORMER_MEMBERS, seedFormerMembers));
  const [trainers, setTrainers] = useState(() => getStorage(STORAGE_KEYS.TRAINERS, seedTrainers));
  const [plans, setPlans] = useState(() => getStorage(STORAGE_KEYS.PLANS, seedPlans));
  const [classes, setClasses] = useState(() => getStorage(STORAGE_KEYS.CLASSES, seedClasses));
  const [automations, setAutomations] = useState(() => getStorage(STORAGE_KEYS.AUTOMATIONS, defaultAutomations));
  const [festivalCalendar, setFestivalCalendar] = useState(() => getStorage(STORAGE_KEYS.FESTIVALS, initialFestivalCalendar));
  const [offers, setOffers] = useState(() => getStorage(STORAGE_KEYS.OFFERS, initialOffers));
  const [sentMessages, setSentMessages] = useState(() => getStorage(STORAGE_KEYS.MESSAGES, initialSentMessages));
  const [payments, setPayments] = useState(() => getStorage(STORAGE_KEYS.PAYMENTS, initialPaymentRecords));
  const [todayCheckInsList, setTodayCheckInsList] = useState(() => getStorage(STORAGE_KEYS.CHECK_INS, seedCheckIns));
  const [leads, setLeads] = useState(() => getStorage(STORAGE_KEYS.LEADS, seedLeads));
  const [expenses, setExpenses] = useState(() => getStorage(STORAGE_KEYS.EXPENSES, seedExpenses));
  const [equipment, setEquipment] = useState(() => getStorage(STORAGE_KEYS.EQUIPMENT, seedEquipment));
  const [supplements, setSupplements] = useState(() => getStorage(STORAGE_KEYS.SUPPLEMENTS, seedSupplements));
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
    const nextId = `SHIV-${1000 + members.length + 1}`;
    const newMember = {
      id: nextId,
      duesPending: 0,
      attendanceStreak: 0,
      totalVisits: 0,
      lastVisit: null,
      status: 'Active',
      messageHistory: [
        {
          id: `MSG-WELCOME-${Date.now()}`,
          date: new Date().toISOString().replace('T', ' ').slice(0, 16),
          text: `Welcome to SHIVAY GYM, ${newMemberData.name}! We are honored to guide your strength journey.`,
          channel: 'WhatsApp',
          status: 'Delivered'
        }
      ],
      ...newMemberData
    };

    setMembers(prev => [newMember, ...prev]);
    showToast(`Member ${newMember.name} added successfully!`, 'success');
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

  // Messaging & Automation Execution
  const triggerSendMessage = ({ recipientId, recipientName, recipientPhone, text, automationTitle, channel = 'WhatsApp' }) => {
    const newMsg = {
      id: `MSG-${Date.now().toString().slice(-6)}`,
      recipientName,
      recipientPhone,
      recipientId,
      automationTitle: automationTitle || 'Direct Message',
      channel,
      text,
      sentAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      status: 'Sent'
    };

    setSentMessages(prev => [newMsg, ...prev]);

    // Also append to the member's message history so member app sees it in inbox!
    setMembers(prev => prev.map(m => {
      if (m.id === recipientId || m.name === recipientName) {
        const history = m.messageHistory || [];
        return {
          ...m,
          messageHistory: [{ id: newMsg.id, date: newMsg.sentAt, text, channel, status: 'Delivered' }, ...history]
        };
      }
      return m;
    }));

    showToast(`Message sent via ${channel} to ${recipientName}!`, 'success');
    return newMsg;
  };

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
    setMembers(seedMembers);
    setFormerMembers(seedFormerMembers);
    setTrainers(seedTrainers);
    setPlans(seedPlans);
    setClasses(seedClasses);
    setAutomations(defaultAutomations);
    setFestivalCalendar(initialFestivalCalendar);
    setOffers(initialOffers);
    setSentMessages(initialSentMessages);
    setPayments(initialPaymentRecords);
    setTodayCheckInsList(seedCheckIns);
    setLeads(seedLeads);
    setExpenses(seedExpenses);
    setEquipment(seedEquipment);
    setSupplements(seedSupplements);
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
    monthlyRevenueHistory,
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

