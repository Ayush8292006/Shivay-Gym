import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import {
  interpolateTemplate,
  generateWhatsAppLink,
  dailyMorningQuotes
} from '../../data/automations';
import {
  MessageSquareCode,
  Send,
  Calendar,
  Clock,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
  Languages,
  CheckCircle2,
  Users,
  Search,
  Filter,
  Flame,
  ShieldCheck,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

/*
  =============================================================================
  PRODUCTION INTEGRATION NOTE (WhatsApp Business API & Scheduled Cron Jobs):
  -----------------------------------------------------------------------------
  To take this from prototype to live production:
  1. WhatsApp Business Cloud API / Gupshup / Twilio:
     Replace `triggerSendMessage()` with an API call to your backend:
     `POST /api/v1/messages/dispatch` -> calls Meta WhatsApp Graph API:
     `POST https://graph.facebook.com/v18.0/{PHONE_NUMBER_ID}/messages`
     with registered HSM templates (e.g. `shivay_good_morning`, `shivay_expiry_nudge`).
  2. SMS Gateway:
     Connect DLT-registered templates via MSG91, Textlocal, or Fast2SMS.
  3. Scheduled Cron Tasks:
     Deploy a Node.js / BullMQ / AWS EventBridge cron job that triggers every morning
     at 06:00 AM IST to run the daily morning quote rotation and queries members
     expiring in 7/3/1 days.
  =============================================================================
*/

export default function AdminAutomations() {
  const {
    automations,
    toggleAutomationState,
    updateAutomationTemplate,
    festivalCalendar,
    updateFestivalItem,
    members,
    formerMembers,
    sentMessages,
    triggerSendMessage,
    showToast
  } = useGym();

  const [activeTab, setActiveTab] = useState('rules'); // 'rules', 'festivals', 'scheduled', 'logs', 'bulk'
  const [selectedAuto, setSelectedAuto] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [sendNowModalOpen, setSendNowModalOpen] = useState(false);
  const [previewMemberIndex, setPreviewMemberIndex] = useState(0);

  // Bulk Messaging State
  const [bulkFilter, setBulkFilter] = useState('ALL_ACTIVE');
  const [bulkTemplateId, setBulkTemplateId] = useState(automations[0]?.id || 'AUTO-MORNING');
  const [bulkCustomText, setBulkCustomText] = useState('');
  const [bulkLang, setBulkLang] = useState('en');

  // Edit Automation Form
  const [editForm, setEditForm] = useState({
    scheduledTime: '',
    templateEn: '',
    templateHi: '',
    channels: { whatsapp: true, sms: false, push: true, email: false }
  });

  const handleOpenEdit = (auto) => {
    setSelectedAuto(auto);
    setEditForm({
      scheduledTime: auto.scheduledTime,
      templateEn: auto.templateEn,
      templateHi: auto.templateHi,
      channels: { ...auto.channels }
    });
    setEditModalOpen(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!selectedAuto) return;
    updateAutomationTemplate(selectedAuto.id, {
      scheduledTime: editForm.scheduledTime,
      templateEn: editForm.templateEn,
      templateHi: editForm.templateHi,
      channels: editForm.channels
    });
    setEditModalOpen(false);
  };

  const handleTriggerSendNow = (auto) => {
    setSelectedAuto(auto);
    setSendNowModalOpen(true);
  };

  const executeSendNow = () => {
    if (!selectedAuto) return;

    // Filter recipients based on automation target
    let targetList = [];
    if (selectedAuto.category === 'winback') {
      targetList = formerMembers;
    } else if (selectedAuto.id === 'AUTO-EXPIRY-7D') {
      targetList = members.filter(m => m.status === 'Expiring Soon');
    } else if (selectedAuto.id === 'AUTO-PAYMENT-DUE') {
      targetList = members.filter(m => m.duesPending > 0);
    } else if (selectedAuto.id === 'AUTO-INACTIVE-7D') {
      targetList = members.filter(m => m.status === 'Active' && m.attendanceStreak === 0);
    } else {
      // General active members
      targetList = members.filter(m => m.status === 'Active');
    }

    if (targetList.length === 0) {
      targetList = members.slice(0, 5); // fallback sample
    }

    const template = selectedAuto.activeLanguage === 'hi' ? selectedAuto.templateHi : selectedAuto.templateEn;

    targetList.forEach(m => {
      const interpolated = interpolateTemplate(template, {
        name: m.name,
        plan: m.plan,
        expiryDate: m.expiryDate,
        daysLeft: 7,
        amountDue: m.duesPending || 1500,
        discount: '20%'
      });

      triggerSendMessage({
        recipientId: m.id,
        recipientName: m.name,
        recipientPhone: m.phone,
        text: interpolated,
        channel: selectedAuto.channels.whatsapp ? 'WhatsApp' : 'SMS',
        automationTitle: selectedAuto.title
      });
    });

    setSendNowModalOpen(false);
    showToast(`Dispatched "${selectedAuto.title}" to ${targetList.length} recipients!`, 'success');
  };

  // Bulk Dispatch Handler
  const handleBulkDispatch = (e) => {
    e.preventDefault();

    let targets = [];
    if (bulkFilter === 'ALL_ACTIVE') targets = members.filter(m => m.status === 'Active');
    else if (bulkFilter === 'EXPIRING') targets = members.filter(m => m.status === 'Expiring Soon');
    else if (bulkFilter === 'FORMER') targets = formerMembers;
    else if (bulkFilter === 'DUES') targets = members.filter(m => m.duesPending > 0);
    else targets = members;

    const chosenAuto = automations.find(a => a.id === bulkTemplateId);
    const rawTemplate = bulkCustomText.trim()
      ? bulkCustomText
      : (bulkLang === 'hi' ? chosenAuto?.templateHi : chosenAuto?.templateEn);

    targets.forEach(m => {
      const interpolated = interpolateTemplate(rawTemplate, {
        name: m.name,
        plan: m.plan,
        expiryDate: m.expiryDate,
        amountDue: m.duesPending || 0,
        discount: '25%'
      });

      triggerSendMessage({
        recipientId: m.id,
        recipientName: m.name,
        recipientPhone: m.phone,
        text: interpolated,
        channel: 'WhatsApp',
        automationTitle: `Bulk Broadcast (${bulkFilter})`
      });
    });

    showToast(`Bulk message dispatched to ${targets.length} recipients!`, 'success');
  };

  // Upcoming simulated scheduled queue for next 30 days
  const upcomingScheduled = [
    {
      date: 'Tomorrow, 06:00 AM',
      title: 'Daily Good Morning Quote #19',
      recipients: `${members.filter(m => m.status === 'Active').length} Active Members`,
      channel: 'WhatsApp & App Push',
      preview: 'Rise early, lift heavy, conquer the day. Wishing you high energy at SHIVAY GYM today!'
    },
    {
      date: '10 Nov 2024, 10:30 AM',
      title: '7-Day Expiry Reminder Batch',
      recipients: `${members.filter(m => m.status === 'Expiring Soon').length} Members Expiring Soon`,
      channel: 'WhatsApp & SMS',
      preview: 'Hi {name}, your membership at SHIVAY GYM will expire in 7 days. Renew early to keep your streak!'
    },
    {
      date: '12 Nov 2024, 08:00 AM',
      title: 'Birthday Wishes Batch',
      recipients: '2 Birthday Celebrants',
      channel: 'WhatsApp',
      preview: 'Happy Birthday! Team SHIVAY GYM wishes you peak health. Enjoy a FREE PT session this week!'
    },
    {
      date: '15 Nov 2024, 17:00 PM',
      title: 'Inactivity Retention Nudge',
      recipients: '5 Inactive Members (7+ days)',
      channel: 'WhatsApp',
      preview: "Hey {name}, we haven't seen you at SHIVAY GYM in 7 days! Even a 30-min light workout will reset your momentum."
    },
    {
      date: '15 Nov 2024, 09:00 AM',
      title: 'Guru Nanak Jayanti Wishes & Offer',
      recipients: 'All Members',
      channel: 'WhatsApp',
      preview: 'Happy Guru Nanak Jayanti {name}! May Guru Sahib bless you with peace and disciplined mind & body.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#2A2A2A]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#E8590C]/15 text-[#E8590C] border border-[#E8590C]/30 mb-1">
            <Sparkles className="w-3 h-3" />
            Core System Feature
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold uppercase tracking-wide text-[#F2F2F2]">
            Messaging & Automation Center
          </h1>
          <p className="text-xs text-[#9A9A9A]">
            Auto-pilot member retention, daily motivation, expiry warnings, and Indian festival greetings.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('bulk')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#E8590C] hover:bg-[#D04F0A] text-xs font-semibold uppercase tracking-wider text-white transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
          Compose Bulk Broadcast
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#2A2A2A] pb-2 text-xs overflow-x-auto">
        {[
          { id: 'rules', label: `Active Automations (${automations.filter(a => a.enabled).length}/${automations.length})` },
          { id: 'festivals', label: `Indian Festival Calendar (${festivalCalendar.length})` },
          { id: 'scheduled', label: 'Upcoming Queue (30 Days)' },
          { id: 'logs', label: `Message Log (${sentMessages.length})` },
          { id: 'bulk', label: 'Bulk Campaign Dispatch' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
              activeTab === t.id
                ? 'bg-[#E8590C] text-white'
                : 'text-[#9A9A9A] hover:text-[#F2F2F2] hover:bg-[#1A1A1A]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: AUTOMATION RULES & TEMPLATES */}
      {activeTab === 'rules' && (
        <div className="space-y-4">
          <div className="p-4 rounded-lg border border-[#2A2A2A] bg-[#161616] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#9A9A9A]">
            <div>
              <span className="font-semibold text-[#F2F2F2]">Variable interpolation support:</span>{' '}
              <code className="text-[#E8590C]">{'{name}'}</code>,{' '}
              <code className="text-[#E8590C]">{'{gym}'}</code>,{' '}
              <code className="text-[#E8590C]">{'{plan}'}</code>,{' '}
              <code className="text-[#E8590C]">{'{expiry_date}'}</code>,{' '}
              <code className="text-[#E8590C]">{'{days_left}'}</code>,{' '}
              <code className="text-[#E8590C]">{'{amount_due}'}</code>,{' '}
              <code className="text-[#E8590C]">{'{discount}'}</code>
            </div>
            <span className="text-[11px] text-[#2F9E44]">All templates available in English & Hindi</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {automations.map((auto) => {
              const currentLang = auto.activeLanguage || 'en';
              const templateText = currentLang === 'hi' ? auto.templateHi : auto.templateEn;

              return (
                <div
                  key={auto.id}
                  className={`p-5 rounded-lg border flex flex-col justify-between transition-colors ${
                    auto.enabled
                      ? 'border-[#2A2A2A] bg-[#161616]'
                      : 'border-[#222222] bg-[#121212] opacity-60'
                  }`}
                >
                  <div>
                    {/* Top line: Category, Status Toggle, Title */}
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-[#E8590C] bg-[#E8590C]/15 px-2 py-0.5 rounded">
                            {auto.category}
                          </span>
                          <span className="text-xs text-[#9A9A9A] flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {auto.scheduledTime} ({auto.frequency})
                          </span>
                        </div>
                        <h3 className="font-heading text-lg font-bold uppercase text-[#F2F2F2]">
                          {auto.title}
                        </h3>
                      </div>

                      <button
                        onClick={() => toggleAutomationState(auto.id)}
                        className="text-[#9A9A9A] hover:text-[#F2F2F2]"
                        title={auto.enabled ? 'Click to Disable' : 'Click to Enable'}
                      >
                        {auto.enabled ? (
                          <ToggleRight className="w-7 h-7 text-[#2F9E44]" />
                        ) : (
                          <ToggleLeft className="w-7 h-7 text-[#666666]" />
                        )}
                      </button>
                    </div>

                    <p className="text-[11px] text-[#9A9A9A] mb-3">
                      {auto.description}
                    </p>

                    {/* Channels & Language Selector */}
                    <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#242424] text-[11px]">
                      <div className="flex items-center gap-2 text-[#9A9A9A]">
                        <span>Channels:</span>
                        {auto.channels.whatsapp && <span className="text-[#2F9E44] font-semibold">WhatsApp</span>}
                        {auto.channels.sms && <span className="text-[#4DABF7]">SMS</span>}
                        {auto.channels.push && <span className="text-[#E8A317]">Push</span>}
                      </div>

                      <div className="flex items-center gap-1 bg-[#1E1E1E] p-0.5 rounded border border-[#2A2A2A]">
                        <button
                          onClick={() => updateAutomationTemplate(auto.id, { activeLanguage: 'en' })}
                          className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                            currentLang === 'en' ? 'bg-[#E8590C] text-white' : 'text-[#9A9A9A]'
                          }`}
                        >
                          EN
                        </button>
                        <button
                          onClick={() => updateAutomationTemplate(auto.id, { activeLanguage: 'hi' })}
                          className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                            currentLang === 'hi' ? 'bg-[#E8590C] text-white' : 'text-[#9A9A9A]'
                          }`}
                        >
                          हिन्दी
                        </button>
                      </div>
                    </div>

                    {/* Template Box */}
                    <div className="p-3 rounded bg-[#121212] border border-[#242424] text-xs text-[#CCCCCC] font-mono leading-relaxed mb-4">
                      {templateText}
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-[#242424]">
                    <span className="text-[11px] text-[#666666]">
                      Target: {auto.targetAudience}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(auto)}
                        className="px-2.5 py-1 text-xs rounded border border-[#2A2A2A] bg-[#1E1E1E] hover:border-[#3A3A3A] text-[#9A9A9A] hover:text-[#F2F2F2] transition-colors"
                      >
                        Edit Template
                      </button>
                      <button
                        onClick={() => handleTriggerSendNow(auto)}
                        className="flex items-center gap-1 px-3 py-1 text-xs rounded bg-[#E8590C]/15 border border-[#E8590C]/40 hover:bg-[#E8590C] hover:text-white text-[#E8590C] font-semibold transition-colors"
                      >
                        <Send className="w-3 h-3" />
                        Send Now
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: EDITABLE FESTIVAL CALENDAR */}
      {activeTab === 'festivals' && (
        <div className="space-y-4">
          <div className="p-4 rounded-lg border border-[#2A2A2A] bg-[#161616] text-xs text-[#9A9A9A] leading-relaxed">
            <span className="font-semibold text-[#F2F2F2]">Editable Festival Calendar (25+ Events):</span>{' '}
            Lunar and regional festival dates change each calendar year. You can click on any festival below to edit the scheduled date, greeting text (English & Hindi), or attach an exclusive renewal offer.
          </div>

          <div className="overflow-x-auto rounded-lg border border-[#2A2A2A] bg-[#161616]">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-[#2A2A2A] bg-[#1A1A1A] text-[#9A9A9A] text-xs uppercase tracking-wider">
                  <th className="px-4 py-3">Festival / Occasion</th>
                  <th className="px-4 py-3">Scheduled Date</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Attached Offer</th>
                  <th className="px-4 py-3">Greeting Wish Preview</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#242424]">
                {festivalCalendar.map((fest) => (
                  <tr key={fest.id} className="hover:bg-[#1A1A1A] transition-colors text-xs">
                    <td className="px-4 py-3 font-semibold text-[#F2F2F2]">{fest.name}</td>
                    <td className="px-4 py-3 font-mono text-[#E8590C] font-medium">{fest.date}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-[#1E1E1E] text-[#9A9A9A] border border-[#2A2A2A]">
                        {fest.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#2F9E44] font-medium">{fest.attachedOffer || 'Standard Greeting'}</td>
                    <td className="px-4 py-3 text-[#9A9A9A] max-w-xs truncate">{fest.wishEn}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => {
                          const newDate = prompt(`Update scheduled date for ${fest.name} (YYYY-MM-DD):`, fest.date);
                          if (newDate && newDate.trim()) {
                            updateFestivalItem(fest.id, { date: newDate.trim() });
                          }
                        }}
                        className="px-2.5 py-1 rounded bg-[#1E1E1E] hover:bg-[#E8590C] hover:text-white border border-[#2A2A2A] text-xs text-[#F2F2F2] transition-colors"
                      >
                        Edit Date
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SCHEDULED QUEUE (30 DAYS) */}
      {activeTab === 'scheduled' && (
        <div className="space-y-4">
          <div className="p-4 rounded-lg border border-[#2A2A2A] bg-[#161616] text-xs text-[#9A9A9A]">
            Showing scheduled automated batches queued for the upcoming 30 days based on active automation rules.
          </div>

          <div className="divide-y divide-[#242424] rounded-lg border border-[#2A2A2A] bg-[#161616]">
            {upcomingScheduled.map((item, idx) => (
              <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[#E8590C] font-semibold">{item.date}</span>
                    <span className="text-[#666666]">•</span>
                    <span className="font-bold text-[#F2F2F2]">{item.title}</span>
                  </div>
                  <p className="text-[#9A9A9A] font-mono">{item.preview}</p>
                </div>
                <div className="text-right sm:flex-shrink-0">
                  <span className="inline-block px-2 py-0.5 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-[11px] text-[#2F9E44] font-medium">
                    {item.recipients}
                  </span>
                  <div className="text-[10px] text-[#666666] mt-0.5">{item.channel}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: MESSAGE DISPATCH LOG */}
      {activeTab === 'logs' && (
        <div className="space-y-4">
          <div className="p-4 rounded-lg border border-[#2A2A2A] bg-[#161616] flex items-center justify-between text-xs text-[#9A9A9A]">
            <span>Total Messages Dispatched: <strong className="text-[#F2F2F2]">{sentMessages.length}</strong></span>
            <span className="text-[#2F9E44]">WhatsApp Status: Connected (Simulation)</span>
          </div>

          <div className="overflow-x-auto rounded-lg border border-[#2A2A2A] bg-[#161616]">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-[#2A2A2A] bg-[#1A1A1A] text-[#9A9A9A] text-xs uppercase tracking-wider">
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">Recipient</th>
                  <th className="px-4 py-3">Automation / Reason</th>
                  <th className="px-4 py-3">Channel</th>
                  <th className="px-4 py-3">Message Text</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">WhatsApp Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#242424]">
                {sentMessages.map((msg) => (
                  <tr key={msg.id} className="hover:bg-[#1A1A1A] transition-colors text-xs">
                    <td className="px-4 py-3 font-mono text-[#9A9A9A] whitespace-nowrap">{msg.sentAt}</td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-[#F2F2F2]">{msg.recipientName}</div>
                      <div className="text-[10px] font-mono text-[#666666]">{msg.recipientPhone}</div>
                    </td>
                    <td className="px-4 py-3 text-[#9A9A9A] whitespace-nowrap">{msg.automationTitle}</td>
                    <td className="px-4 py-3 font-medium text-[#F2F2F2]">{msg.channel}</td>
                    <td className="px-4 py-3 text-[#CCCCCC] max-w-xs truncate font-mono">{msg.text}</td>
                    <td className="px-4 py-3">
                      <Badge variant="success">{msg.status || 'Delivered'}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {msg.recipientPhone && (
                        <a
                          href={generateWhatsAppLink(msg.recipientPhone, msg.text)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[#2F9E44] hover:underline"
                        >
                          wa.me <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: BULK CAMPAIGN DISPATCH */}
      {activeTab === 'bulk' && (
        <div className="p-6 rounded-lg border border-[#2A2A2A] bg-[#161616] max-w-3xl">
          <h2 className="font-heading text-xl font-bold uppercase tracking-wider text-[#F2F2F2] mb-1">
            Manual Bulk Outreach Dispatch
          </h2>
          <p className="text-xs text-[#9A9A9A] mb-6">
            Filter audience, choose standard template or compose custom text with variables, and dispatch instantly.
          </p>

          <form onSubmit={handleBulkDispatch} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Target Audience</label>
                <select
                  value={bulkFilter}
                  onChange={(e) => setBulkFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
                >
                  <option value="ALL_ACTIVE">All Active Members ({members.filter(m => m.status === 'Active').length})</option>
                  <option value="EXPIRING">Expiring in 7 Days ({members.filter(m => m.status === 'Expiring Soon').length})</option>
                  <option value="FORMER">Former Members ({formerMembers.length})</option>
                  <option value="DUES">Members with Balance Dues ({members.filter(m => m.duesPending > 0).length})</option>
                  <option value="ALL">Entire Member Directory ({members.length})</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Base Template</label>
                <select
                  value={bulkTemplateId}
                  onChange={(e) => setBulkTemplateId(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
                >
                  {automations.map(a => (
                    <option key={a.id} value={a.id}>{a.title}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-[#9A9A9A]">Template Language:</span>
              <div className="flex items-center gap-1 bg-[#1E1E1E] p-1 rounded border border-[#2A2A2A]">
                <button
                  type="button"
                  onClick={() => setBulkLang('en')}
                  className={`px-3 py-1 rounded text-xs font-semibold ${bulkLang === 'en' ? 'bg-[#E8590C] text-white' : 'text-[#9A9A9A]'}`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setBulkLang('hi')}
                  className={`px-3 py-1 rounded text-xs font-semibold ${bulkLang === 'hi' ? 'bg-[#E8590C] text-white' : 'text-[#9A9A9A]'}`}
                >
                  हिन्दी
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">
                Custom Message Override (Optional)
              </label>
              <textarea
                rows={4}
                value={bulkCustomText}
                onChange={(e) => setBulkCustomText(e.target.value)}
                placeholder="Leave blank to use base template, or type custom announcement using {name}, {gym}, {discount}..."
                className="w-full px-3 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
              />
            </div>

            <div className="p-3 rounded bg-[#121212] border border-[#242424] text-xs text-[#9A9A9A]">
              <span className="font-semibold text-[#F2F2F2]">Preview with sample member:</span>
              <p className="mt-1 font-mono text-[#E8590C]">
                {interpolateTemplate(
                  bulkCustomText.trim()
                    ? bulkCustomText
                    : (bulkLang === 'hi' ? automations.find(a => a.id === bulkTemplateId)?.templateHi : automations.find(a => a.id === bulkTemplateId)?.templateEn),
                  { name: 'Aarav Sharma', plan: 'Yearly Elite Strength', expiryDate: '15 Jan 2025', daysLeft: 7, amountDue: 1500, discount: '20%' }
                )}
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded bg-[#E8590C] hover:bg-[#D04F0A] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-lg shadow-[#E8590C]/20"
            >
              Confirm & Dispatch Broadcast Now
            </button>
          </form>
        </div>
      )}

      {/* EDIT TEMPLATE MODAL */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={`Edit Template: ${selectedAuto?.title}`}
        subtitle="Changes affect future automated dispatches and daily cron simulations"
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Scheduled Time (IST)</label>
              <input
                type="text"
                value={editForm.scheduledTime}
                onChange={(e) => setEditForm({ ...editForm, scheduledTime: e.target.value })}
                placeholder="e.g. 06:00"
                className="w-full px-3 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Dispatch Channels</label>
              <div className="flex items-center gap-3 pt-2 text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.channels.whatsapp}
                    onChange={(e) => setEditForm({
                      ...editForm,
                      channels: { ...editForm.channels, whatsapp: e.target.checked }
                    })}
                  />
                  WhatsApp
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.channels.sms}
                    onChange={(e) => setEditForm({
                      ...editForm,
                      channels: { ...editForm.channels, sms: e.target.checked }
                    })}
                  />
                  SMS
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.channels.push}
                    onChange={(e) => setEditForm({
                      ...editForm,
                      channels: { ...editForm.channels, push: e.target.checked }
                    })}
                  />
                  Push
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">English Template</label>
            <textarea
              rows={3}
              required
              value={editForm.templateEn}
              onChange={(e) => setEditForm({ ...editForm, templateEn: e.target.value })}
              className="w-full px-3 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Hindi Template (हिन्दी)</label>
            <textarea
              rows={3}
              required
              value={editForm.templateHi}
              onChange={(e) => setEditForm({ ...editForm, templateHi: e.target.value })}
              className="w-full px-3 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none font-mono"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#2A2A2A]">
            <button
              type="button"
              onClick={() => setEditModalOpen(false)}
              className="px-4 py-2 text-xs font-medium rounded-lg border border-[#2A2A2A] bg-[#1E1E1E] text-[#9A9A9A]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg bg-[#E8590C] hover:bg-[#D04F0A] text-white transition-colors"
            >
              Save Automation Settings
            </button>
          </div>
        </form>
      </Modal>

      {/* SEND NOW CONFIRMATION MODAL */}
      <Modal
        isOpen={sendNowModalOpen}
        onClose={() => setSendNowModalOpen(false)}
        title={`Trigger Immediate Dispatch: ${selectedAuto?.title}`}
        subtitle={`Target Audience: ${selectedAuto?.targetAudience}`}
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 bg-[#1A1A1A] rounded border border-[#2A2A2A] space-y-2">
            <span className="text-[#9A9A9A]">Interpolated Live Preview:</span>
            <div className="p-3 bg-[#121212] rounded border border-[#242424] text-[#F2F2F2] font-mono leading-relaxed">
              {interpolateTemplate(
                selectedAuto?.activeLanguage === 'hi' ? selectedAuto?.templateHi : selectedAuto?.templateEn,
                {
                  name: members[previewMemberIndex]?.name || 'Aarav Sharma',
                  plan: members[previewMemberIndex]?.plan || 'Yearly Elite Strength',
                  expiryDate: members[previewMemberIndex]?.expiryDate || '15 Jan 2025',
                  daysLeft: 7,
                  amountDue: 1500,
                  discount: '20%'
                }
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-[#9A9A9A]">
            <span>Channel: {selectedAuto?.channels.whatsapp ? 'WhatsApp API' : 'SMS Gateway'}</span>
            <span>Language: {selectedAuto?.activeLanguage === 'hi' ? 'Hindi' : 'English'}</span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#2A2A2A]">
            <button
              type="button"
              onClick={() => setSendNowModalOpen(false)}
              className="px-4 py-2 text-xs font-medium rounded-lg border border-[#2A2A2A] bg-[#1E1E1E] text-[#9A9A9A]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={executeSendNow}
              className="px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg bg-[#E8590C] hover:bg-[#D04F0A] text-white transition-colors"
            >
              Confirm Dispatch
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

