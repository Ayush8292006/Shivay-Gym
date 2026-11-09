import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import { interpolateTemplate } from '../../data/automations';
import { buildWhatsAppLink as generateWhatsAppLink } from '../../services/whatsapp';
import { getRecipients, buildMessage, buildUpcomingQueue, upcomingFestivals } from '../../utils/automationTargets';
import { formatDate, daysUntil } from '../../utils/dates';
import { Link } from 'react-router-dom';
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
  WhatsApp delivery is handled in GymContext → triggerSendMessage().
  Manual mode opens WhatsApp with the text ready; server mode sends through
  /server (WhatsApp Business Cloud API) and the server also runs these
  automations on schedule. See server/README.md.
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
    showToast,
    whatsappConfig,
    offers
  } = useGym();
  const ctx = { members, formerMembers, festivalCalendar, offers };
  const [festivalEdit, setFestivalEdit] = useState(null);
  const [selectedFestival, setSelectedFestival] = useState(null);
  const [logFilter, setLogFilter] = useState('');

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

  const sendNowRecipients = selectedAuto
    ? getRecipients(selectedAuto, ctx, { mode: 'window', festival: selectedFestival })
    : [];

  const executeSendNow = () => {
    if (!selectedAuto) return;
    if (sendNowRecipients.length === 0) {
      showToast('Nobody matches this automation right now.', 'info');
      return;
    }
    const channel = selectedAuto.channels.whatsapp ? 'WhatsApp' : selectedAuto.channels.push ? 'Push' : 'SMS';
    sendNowRecipients.forEach((r) => {
      triggerSendMessage({
        recipientId: r.id,
        recipientName: r.name,
        recipientPhone: r.phone,
        text: buildMessage(selectedAuto, r),
        vars: r.vars,
        channel,
        automationId: selectedAuto.id,
        automationTitle: selectedFestival ? `${selectedFestival.name} Wishes` : selectedAuto.title
      });
    });
    setSendNowModalOpen(false);
    setSelectedFestival(null);
  };

  const sendFestivalNow = (fest) => {
    const auto = automations.find((a) => a.id === 'AUTO-FESTIVAL');
    if (!auto) return;
    setSelectedFestival(fest);
    setSelectedAuto(auto);
    setSendNowModalOpen(true);
  };

  // Bulk Dispatch Handler
  const bulkTargets = (filter) => {
    if (filter === 'ALL_ACTIVE') return members.filter(m => m.status === 'Active' || m.status === 'Expiring Soon');
    if (filter === 'EXPIRING') return members.filter(m => m.status === 'Expiring Soon');
    if (filter === 'EXPIRED') return members.filter(m => m.status === 'Expired');
    if (filter === 'FORMER') return formerMembers;
    if (filter === 'DUES') return members.filter(m => m.duesPending > 0);
    return members.filter(m => m.status !== 'Left');
  };

  const handleBulkDispatch = (e) => {
    e.preventDefault();

    const targets = bulkTargets(bulkFilter);
    if (!targets.length) {
      showToast('No members in this audience.', 'info');
      return;
    }
    const chosenAuto = automations.find(a => a.id === bulkTemplateId);
    targets.forEach(m => {
      const recipient = { vars: { name: m.name.split(' ')[0], plan: m.plan || m.lastPlan, expiryDate: m.expiryDate ? formatDate(m.expiryDate) : undefined, daysLeft: m.expiryDate ? Math.max(daysUntil(m.expiryDate), 0) : undefined, amountDue: m.duesPending || 0, discount: '25%', trainer: m.trainer } };
      const text = bulkCustomText.trim()
        ? interpolateTemplate(bulkCustomText, recipient.vars)
        : buildMessage(chosenAuto, recipient, bulkLang);
      triggerSendMessage({
        recipientId: m.id,
        recipientName: m.name,
        recipientPhone: m.phone,
        text,
        vars: recipient.vars,
        channel: 'WhatsApp',
        automationId: bulkCustomText.trim() ? 'CUSTOM' : chosenAuto?.id,
        automationTitle: `Bulk Broadcast (${bulkFilter.replace('_', ' ').toLowerCase()})`
      });
    });
  };

  // Upcoming queue, calculated from live member data & the festival calendar
  const upcomingScheduled = buildUpcomingQueue(automations, ctx, 30);
  const nextFestivals = upcomingFestivals(festivalCalendar, 4);

  const statusVariant = (st) => {
    const v = String(st || '').toLowerCase();
    if (v === 'read' || v === 'delivered') return 'success';
    if (v === 'failed') return 'danger';
    if (v === 'queued' || v === 'sending' || v === 'dry run') return 'warning';
    if (v.includes('opened') || v === 'sent') return 'saffron';
    return 'default';
  };

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

      {/* Delivery mode */}
      <div className={`p-3 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs ${
        whatsappConfig.mode === 'server' ? 'border-[#2F9E44]/40 bg-[#142918]' : 'border-[#2A2A2A] bg-[#161616]'
      }`}>
        <span className="text-[#CCCCCC]">
          <span className="font-semibold text-[#F2F2F2]">WhatsApp delivery: </span>
          {whatsappConfig.mode === 'server'
            ? 'Automatic via WhatsApp Business API. Scheduled automations run on the server at their set time.'
            : 'Manual — each message opens in WhatsApp with the text ready; you press Send.'}
          {whatsappConfig.testMode && <span className="ml-1 text-[#E8A317]">Test mode ON (messages go to your number).</span>}
        </span>
        <Link to="/admin/settings" className="text-[#E8590C] font-semibold whitespace-nowrap hover:underline">
          Change delivery settings →
        </Link>
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
              <code className="text-[#E8590C]">{'{discount}'}</code>,{' '}
              <code className="text-[#E8590C]">{'{trainer}'}</code>,{' '}
              <code className="text-[#E8590C]">{'{date}'}</code>
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
                      {auto.id === 'AUTO-FESTIVAL'
                        ? `Uses the greeting of each festival from the Festival Calendar. Next: ${nextFestivals[0] ? `${nextFestivals[0].name} (${formatDate(nextFestivals[0].date)})` : '—'}`
                        : auto.id === 'AUTO-MORNING'
                          ? `Rotates ${30}+ motivational messages. Today: “${buildMessage(auto, { vars: getRecipients(auto, ctx)[0]?.vars || { name: 'Aarav' } })}”`
                          : templateText}
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {nextFestivals.map((f) => (
              <div key={f.id} className="p-4 rounded-lg border border-[#2A2A2A] bg-[#161616]">
                <div className="text-[10px] uppercase tracking-wider text-[#9A9A9A]">
                  {f.inDays === 0 ? 'Today' : f.inDays === 1 ? 'Tomorrow' : `In ${f.inDays} days`}
                </div>
                <div className="font-heading text-lg font-bold uppercase text-[#F2F2F2] leading-tight mt-0.5">{f.name}</div>
                <div className="text-xs font-mono text-[#E8590C] mt-1">{formatDate(f.date)}</div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-lg border border-[#2A2A2A] bg-[#161616] text-xs text-[#9A9A9A] leading-relaxed">
            <span className="font-semibold text-[#F2F2F2]">Wishes go out automatically at 07:00 on each date.</span>{' '}
            Dates marked <span className="text-[#E8A317]">lunar</span> follow the Hindu / Islamic calendar and change every year —
            please confirm them with a local panchang and edit if needed.
          </div>

          <div className="overflow-x-auto rounded-lg border border-[#2A2A2A] bg-[#161616]">
            <table className="w-full text-left text-sm border-collapse min-w-[760px]">
              <thead>
                <tr className="border-b border-[#2A2A2A] bg-[#1A1A1A] text-[#9A9A9A] text-xs uppercase tracking-wider">
                  <th className="px-4 py-3">Festival / Occasion</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Attached Offer</th>
                  <th className="px-4 py-3">Greeting</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#242424]">
                {[...festivalCalendar].sort((a, b) => a.date.localeCompare(b.date)).map((fest) => {
                  const inDays = daysUntil(fest.date);
                  const past = inDays !== null && inDays < 0;
                  return (
                    <tr key={fest.id} className={`hover:bg-[#1A1A1A] transition-colors text-xs ${past ? 'opacity-50' : ''}`}>
                      <td className="px-4 py-3 font-semibold text-[#F2F2F2]">{fest.name}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-mono text-[#E8590C] font-medium">{formatDate(fest.date)}</div>
                        <div className="text-[10px] text-[#666666]">
                          {past ? 'Passed — update for next year' : inDays === 0 ? 'Today' : `in ${inDays} days`}
                          {fest.dateType === 'lunar' && <span className="text-[#E8A317]"> · lunar</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-[#1E1E1E] text-[#9A9A9A] border border-[#2A2A2A]">
                          {fest.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#2F9E44] font-medium">{fest.attachedOffer || 'Greeting only'}</td>
                      <td className="px-4 py-3 text-[#9A9A9A] max-w-xs truncate">{fest.wishEn}</td>
                      <td className="px-4 py-3 text-right whitespace-nowrap space-x-1.5">
                        <button
                          onClick={() => setFestivalEdit({ ...fest })}
                          className="px-2.5 py-1 rounded bg-[#1E1E1E] hover:border-[#3A3A3A] border border-[#2A2A2A] text-xs text-[#F2F2F2] transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => sendFestivalNow(fest)}
                          className="px-2.5 py-1 rounded bg-[#E8590C]/15 border border-[#E8590C]/40 hover:bg-[#E8590C] hover:text-white text-xs text-[#E8590C] font-semibold transition-colors"
                        >
                          Send now
                        </button>
                      </td>
                    </tr>
                  );
                })}
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
            {upcomingScheduled.length === 0 && (
              <div className="p-6 text-center text-xs text-[#9A9A9A]">No scheduled sends in the next 30 days.</div>
            )}
            {upcomingScheduled.map((item, idx) => (
              <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[#E8590C] font-semibold whitespace-nowrap">
                      {item.offset === 1 ? 'Tomorrow' : formatDate(item.date)}, {item.time}
                    </span>
                    <span className="text-[#666666]">•</span>
                    <span className="font-bold text-[#F2F2F2]">{item.title}</span>
                  </div>
                  <p className="text-[#9A9A9A] truncate">{item.preview}</p>
                </div>
                <div className="sm:text-right sm:flex-shrink-0">
                  <span className="inline-block px-2 py-0.5 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-[11px] text-[#2F9E44] font-medium">
                    {item.count} recipient{item.count > 1 ? 's' : ''}
                  </span>
                  <div className="text-[10px] text-[#666666] mt-0.5">
                    {[item.auto.channels.whatsapp && 'WhatsApp', item.auto.channels.push && 'App inbox'].filter(Boolean).join(' & ')}
                  </div>
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
            <input
              value={logFilter}
              onChange={(e) => setLogFilter(e.target.value)}
              placeholder="Search name or text..."
              className="px-3 py-1.5 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none w-48"
            />
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
                {sentMessages
                  .filter((msg) => !logFilter || `${msg.recipientName} ${msg.text} ${msg.automationTitle}`.toLowerCase().includes(logFilter.toLowerCase()))
                  .slice(0, 200)
                  .map((msg) => (
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
                      <Badge variant={statusVariant(msg.status)}>{msg.status || 'Delivered'}</Badge>
                      {msg.error && <div className="text-[10px] text-[#E03131] mt-1 max-w-[180px] truncate" title={msg.error}>{msg.error}</div>}
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
                  <option value="ALL_ACTIVE">All Active Members ({bulkTargets('ALL_ACTIVE').length})</option>
                  <option value="EXPIRING">Expiring in 7 Days ({bulkTargets('EXPIRING').length})</option>
                  <option value="EXPIRED">Expired, not renewed ({bulkTargets('EXPIRED').length})</option>
                  <option value="FORMER">Former Members ({bulkTargets('FORMER').length})</option>
                  <option value="DUES">Members with Balance Dues ({bulkTargets('DUES').length})</option>
                  <option value="ALL">Entire Member Directory ({bulkTargets('ALL').length})</option>
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
                {(() => {
                  const sample = bulkTargets(bulkFilter)[0] || members[0];
                  const vars = { name: sample?.name?.split(' ')[0], plan: sample?.plan || sample?.lastPlan, expiryDate: sample?.expiryDate ? formatDate(sample.expiryDate) : undefined, daysLeft: sample?.expiryDate ? Math.max(daysUntil(sample.expiryDate), 0) : undefined, amountDue: sample?.duesPending || 0, discount: '25%', trainer: sample?.trainer };
                  const auto = automations.find(a => a.id === bulkTemplateId);
                  return bulkCustomText.trim() ? interpolateTemplate(bulkCustomText, vars) : buildMessage(auto, { vars }, bulkLang);
                })()}
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded bg-[#E8590C] hover:bg-[#D04F0A] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-lg shadow-[#E8590C]/20"
            >
              Send to {bulkTargets(bulkFilter).length} member{bulkTargets(bulkFilter).length === 1 ? '' : 's'} on WhatsApp
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
        onClose={() => { setSendNowModalOpen(false); setSelectedFestival(null); }}
        title={selectedFestival ? `Send ${selectedFestival.name} wishes` : `Send now: ${selectedAuto?.title}`}
        subtitle={`Target Audience: ${selectedAuto?.targetAudience}`}
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 bg-[#1A1A1A] rounded border border-[#2A2A2A] space-y-2">
            <span className="text-[#9A9A9A]">
              Preview{sendNowRecipients[0] ? ` for ${sendNowRecipients[0].name}` : ''}:
            </span>
            <div className="p-3 bg-[#121212] rounded border border-[#242424] text-[#F2F2F2] leading-relaxed whitespace-pre-line">
              {sendNowRecipients[0]
                ? buildMessage(selectedAuto, sendNowRecipients[0])
                : 'No member matches this automation today.'}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-[#9A9A9A] mb-1.5">
              <span className="font-semibold text-[#F2F2F2]">{sendNowRecipients.length} recipient{sendNowRecipients.length === 1 ? '' : 's'}</span>
              <span>
                {selectedAuto?.channels.whatsapp ? 'WhatsApp' : 'App inbox'} · {selectedAuto?.activeLanguage === 'hi' ? 'Hindi' : 'English'}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
              {sendNowRecipients.slice(0, 40).map((r) => (
                <span key={r.id} className="px-2 py-0.5 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-[#CCCCCC]">{r.name}</span>
              ))}
              {sendNowRecipients.length > 40 && <span className="text-[#9A9A9A]">+{sendNowRecipients.length - 40} more</span>}
            </div>
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
              disabled={sendNowRecipients.length === 0}
              className="disabled:opacity-40 px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg bg-[#E8590C] hover:bg-[#D04F0A] text-white transition-colors"
            >
              Confirm Dispatch
            </button>
          </div>
        </div>
      </Modal>

      {/* FESTIVAL EDIT MODAL */}
      <Modal
        isOpen={!!festivalEdit}
        onClose={() => setFestivalEdit(null)}
        title={`Edit: ${festivalEdit?.name || ''}`}
        subtitle="Greeting is sent automatically at 07:00 on this date"
      >
        {festivalEdit && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const { id, ...fields } = festivalEdit;
              updateFestivalItem(id, fields);
              setFestivalEdit(null);
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={festivalEdit.date}
                  onChange={(e) => setFestivalEdit({ ...festivalEdit, date: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Attached offer (optional)</label>
                <input
                  type="text"
                  value={festivalEdit.attachedOffer || ''}
                  onChange={(e) => setFestivalEdit({ ...festivalEdit, attachedOffer: e.target.value })}
                  placeholder="e.g. 20% off on Yearly Plan"
                  className="w-full px-3 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Greeting (English)</label>
              <textarea
                rows={3}
                required
                value={festivalEdit.wishEn}
                onChange={(e) => setFestivalEdit({ ...festivalEdit, wishEn: e.target.value })}
                className="w-full px-3 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Greeting (हिन्दी)</label>
              <textarea
                rows={3}
                required
                value={festivalEdit.wishHi}
                onChange={(e) => setFestivalEdit({ ...festivalEdit, wishHi: e.target.value })}
                className="w-full px-3 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
              />
            </div>
            <label className="flex items-center gap-2 text-xs text-[#CCCCCC]">
              <input
                type="checkbox"
                checked={festivalEdit.autoSchedule !== false}
                onChange={(e) => setFestivalEdit({ ...festivalEdit, autoSchedule: e.target.checked })}
              />
              Send automatically on this date
            </label>
            <div className="flex justify-end gap-2 pt-2 border-t border-[#2A2A2A]">
              <button type="button" onClick={() => setFestivalEdit(null)} className="px-4 py-2 text-xs rounded-lg border border-[#2A2A2A] bg-[#1E1E1E] text-[#9A9A9A]">
                Cancel
              </button>
              <button type="submit" className="px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg bg-[#E8590C] hover:bg-[#D04F0A] text-white">
                Save
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}

