import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import DataTable from '../../components/common/DataTable';
import Badge from '../../components/common/Badge';
import Avatar from '../../components/common/Avatar';
import Modal from '../../components/common/Modal';
import { generateWhatsAppLink, interpolateTemplate } from '../../data/automations';
import {
  UserCheck,
  Send,
  Sparkles,
  ExternalLink,
  Tag,
  CheckCircle2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { isoFromToday, formatDate } from '../../utils/dates';

export default function AdminFormerMembers() {
  const { formerMembers, triggerSendMessage, showToast } = useGym();

  const [campaignModalOpen, setCampaignModalOpen] = useState(false);
  const [selectedFormer, setSelectedFormer] = useState(null);
  const [discountPercent, setDiscountPercent] = useState('25%');
  const [campaignValidity, setCampaignValidity] = useState(formatDate(isoFromToday(21)));
  const [targetScope, setTargetScope] = useState('all'); // 'all' or 'single'

  const [customMsgModalOpen, setCustomMsgModalOpen] = useState(false);
  const [customText, setCustomText] = useState('');

  const handleLaunchCampaign = (e) => {
    e.preventDefault();

    const recipients = targetScope === 'single' && selectedFormer
      ? [selectedFormer]
      : formerMembers;

    recipients.forEach(mem => {
      const template = "Hi {name}, we miss your energy at SHIVAY GYM! It's time for a fresh start. Use special code RESTART to get {discount} off on any 3, 6, or 12-month plan. Valid till {date}. Let's get lifting again!";
      const filledText = interpolateTemplate(template, {
        name: mem.name.split(' ')[0],
        discount: discountPercent,
        date: campaignValidity
      });

      triggerSendMessage({
        recipientId: mem.id,
        recipientName: mem.name,
        recipientPhone: mem.phone,
        text: filledText,
        channel: 'WhatsApp',
        automationId: 'AUTO-WINBACK',
        vars: { name: mem.name.split(' ')[0], discount: discountPercent, date: campaignValidity },
        automationTitle: 'Former Member Win-Back Campaign'
      });
    });

    setCampaignModalOpen(false);
  };

  const columns = [
    {
      key: 'name',
      label: 'Former Member',
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.name} size="sm" />
          <div>
            <div className="font-semibold text-[#F2F2F2]">{row.name}</div>
            <div className="text-[11px] text-[#9A9A9A] font-mono">{row.phone}</div>
          </div>
        </div>
      )
    },
    {
      key: 'reasonLeft',
      label: 'Reason for Leaving',
      render: (row) => (
        <div>
          <span className="text-xs text-[#E8A317] font-medium">{row.reasonLeft}</span>
          <div className="text-[10px] text-[#666666] truncate max-w-xs">{row.notes}</div>
        </div>
      )
    },
    {
      key: 'daysSinceLeft',
      label: 'Days Since Left',
      render: (row) => (
        <div className="text-xs">
          <span className="font-mono font-bold text-[#F2F2F2]">{row.daysSinceLeft} days</span>
          <div className="text-[10px] text-[#9A9A9A]">Left on {row.leftDate}</div>
        </div>
      )
    },
    {
      key: 'lastPlan',
      label: 'Past Plan',
      render: (row) => <span className="text-xs text-[#9A9A9A]">{row.lastPlan}</span>
    },
    {
      key: 'winBackStatus',
      label: 'Win-Back Status',
      render: (row) => {
        const v = row.winBackStatus.toLowerCase();
        let variant = 'default';
        if (v.includes('sent') || v.includes('warm')) variant = 'saffron';
        if (v.includes('responded')) variant = 'active';
        return <Badge variant={variant}>{row.winBackStatus}</Badge>;
      }
    },
    {
      label: 'Actions',
      sortable: false,
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedFormer(row);
              setTargetScope('single');
              setCampaignModalOpen(true);
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#E8590C]/15 border border-[#E8590C]/40 hover:bg-[#E8590C] hover:text-white text-xs font-medium text-[#E8590C] transition-colors"
          >
            <Tag className="w-3 h-3" />
            Send Offer
          </button>
          <a
            href={generateWhatsAppLink(row.phone, `Hi ${row.name}, team Shivay Gym checking in. We have a special re-joining welcome pass waiting for you!`)}
            target="_blank"
            rel="noreferrer"
            className="p-1.5 rounded bg-[#1E1E1E] border border-[#2A2A2A] hover:border-[#2F9E44] text-[#2F9E44]"
            title="Chat on WhatsApp"
          >
            <Send className="w-3.5 h-3.5" />
          </a>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#2A2A2A]">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold uppercase tracking-wide text-[#F2F2F2]">
            Former Members Archive ({formerMembers.length})
          </h1>
          <p className="text-xs text-[#9A9A9A]">
            Track members who left or stopped renewing. Target them with automated re-joining campaigns.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedFormer(null);
            setTargetScope('all');
            setCampaignModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#E8590C] hover:bg-[#D04F0A] text-xs font-semibold uppercase tracking-wider text-white transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          Launch Win-Back Campaign (All)
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg border border-[#2A2A2A] bg-[#161616]">
          <span className="text-[10px] uppercase text-[#9A9A9A] font-semibold">Total Churned</span>
          <div className="font-heading text-2xl font-bold text-[#F2F2F2] tabular-nums mt-0.5">{formerMembers.length}</div>
          <span className="text-[11px] text-[#666666]">Past 6 months</span>
        </div>
        <div className="p-4 rounded-lg border border-[#2A2A2A] bg-[#161616]">
          <span className="text-[10px] uppercase text-[#9A9A9A] font-semibold">Offers Dispatched</span>
          <div className="font-heading text-2xl font-bold text-[#E8590C] tabular-nums mt-0.5">
            {formerMembers.filter(f => f.winBackStatus.includes('Sent') || f.winBackStatus.includes('Responded')).length}
          </div>
          <span className="text-[11px] text-[#2F9E44]">33% response rate</span>
        </div>
        <div className="p-4 rounded-lg border border-[#2A2A2A] bg-[#161616]">
          <span className="text-[10px] uppercase text-[#9A9A9A] font-semibold">Warm Leads</span>
          <div className="font-heading text-2xl font-bold text-[#2F9E44] tabular-nums mt-0.5">
            {formerMembers.filter(f => f.winBackStatus === 'Warm Lead' || f.winBackStatus.includes('Considering')).length}
          </div>
          <span className="text-[11px] text-[#9A9A9A]">Likely to rejoin</span>
        </div>
        <div className="p-4 rounded-lg border border-[#2A2A2A] bg-[#161616]">
          <span className="text-[10px] uppercase text-[#9A9A9A] font-semibold">Top Reason</span>
          <div className="font-heading text-lg font-bold text-[#E8A317] truncate mt-0.5">Fees / Budget</div>
          <span className="text-[11px] text-[#666666]">Offer discount coupon</span>
        </div>
      </div>

      {/* Former Members Table */}
      <DataTable
        columns={columns}
        data={formerMembers}
        searchPlaceholder="Search former members by name, reason, or phone..."
        filterKey="reasonLeft"
        filterOptions={[
          { label: 'Relocated', value: 'Relocated to another city' },
          { label: 'Budget', value: 'Fees too high / Budget constraints' },
          { label: 'Busy Schedule', value: 'Busy work schedule' },
          { label: 'Medical', value: 'Medical / Injury / Pregnancy' }
        ]}
        exportFilename="former_members_winback.csv"
      />

      {/* WIN-BACK CAMPAIGN MODAL */}
      <Modal
        isOpen={campaignModalOpen}
        onClose={() => setCampaignModalOpen(false)}
        title={targetScope === 'single' ? `Send Win-Back Offer to ${selectedFormer?.name}` : "Launch Bulk Win-Back Campaign"}
        subtitle="Interpolates {name}, {discount}, and {date} variables and logs outreach"
      >
        <form onSubmit={handleLaunchCampaign} className="space-y-4">
          <div className="p-3 bg-[#1A1A1A] rounded border border-[#2A2A2A] text-xs space-y-1">
            <span className="text-[#9A9A9A]">Target Audience:</span>
            <div className="font-semibold text-[#F2F2F2]">
              {targetScope === 'single' ? `${selectedFormer?.name} (${selectedFormer?.phone})` : `All ${formerMembers.length} Former Members`}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Discount Offer</label>
              <select
                value={discountPercent}
                onChange={(e) => setDiscountPercent(e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
              >
                <option value="15%">15% Off Rejoining</option>
                <option value="20%">20% Off (Diwali Special)</option>
                <option value="25%">25% Off + Free Shaker (High Converting)</option>
                <option value="1 Month Free">1 Month Free with 6-Month Plan</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Offer Valid Till</label>
              <input
                type="text"
                value={campaignValidity}
                onChange={(e) => setCampaignValidity(e.target.value)}
                className="w-full px-3 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Live Message Preview</label>
            <div className="p-3 rounded-lg bg-[#141414] border border-[#2A2A2A] text-xs text-[#9A9A9A] font-mono leading-relaxed">
              Hi {selectedFormer?.name || '{name}'}, we miss your energy at SHIVAY GYM! It's time for a fresh start. Use special code RESTART to get <span className="text-[#E8590C] font-bold">{discountPercent}</span> off on any 3, 6, or 12-month plan. Valid till <span className="text-[#F2F2F2]">{campaignValidity}</span>. Let's get lifting again!
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#2A2A2A]">
            <button
              type="button"
              onClick={() => setCampaignModalOpen(false)}
              className="px-4 py-2 text-xs font-medium rounded-lg border border-[#2A2A2A] bg-[#1E1E1E] text-[#9A9A9A]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg bg-[#E8590C] hover:bg-[#D04F0A] text-white transition-colors"
            >
              Dispatch Win-Back Campaign
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

