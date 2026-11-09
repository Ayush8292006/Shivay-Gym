import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import DataTable from '../../components/common/DataTable';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { generateWhatsAppLink } from '../../data/automations';
import { UserPlus, UserCheck, Phone, Plus, Send, Calendar, CheckCircle2 } from 'lucide-react';
import { isoFromToday } from '../../utils/dates';

export default function AdminLeads() {
  const { leads, addLead, convertLeadToMember, plans, trainers, showToast } = useGym();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [convertModalOpen, setConvertModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedPlanId, setSelectedPlanId] = useState('PLAN-12M');

  const [leadForm, setLeadForm] = useState({
    name: '',
    phone: '',
    email: '',
    interest: 'Yearly Elite Strength',
    source: 'Walk-in',
    assignedTrainer: 'Vikram Chauhan',
    followUpDate: isoFromToday(3),
    notes: ''
  });

  const handleAddLead = (e) => {
    e.preventDefault();
    addLead(leadForm);
    setAddModalOpen(false);
    setLeadForm({
      name: '',
      phone: '',
      email: '',
      interest: 'Yearly Elite Strength',
      source: 'Walk-in',
      assignedTrainer: 'Vikram Chauhan',
      followUpDate: isoFromToday(3),
      notes: ''
    });
  };

  const handleConvert = (e) => {
    e.preventDefault();
    if (!selectedLead) return;
    convertLeadToMember(selectedLead.id, selectedPlanId);
    setConvertModalOpen(false);
  };

  const columns = [
    {
      key: 'name',
      label: 'Prospect / Lead',
      render: (row) => (
        <div>
          <div className="font-semibold text-[#F2F2F2]">{row.name}</div>
          <div className="text-[11px] text-[#9A9A9A] font-mono">{row.phone}</div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => {
        let v = 'default';
        if (row.status === 'Converted') v = 'success';
        else if (row.status === 'Ready to Join') v = 'saffron';
        else if (row.status.includes('Trial')) v = 'expiring';
        return <Badge variant={v}>{row.status}</Badge>;
      }
    },
    {
      key: 'interest',
      label: 'Interest / Plan',
      render: (row) => <span className="text-xs text-[#9A9A9A]">{row.interest}</span>
    },
    {
      key: 'source',
      label: 'Acquisition Channel',
      render: (row) => (
        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#1E1E1E] text-[#F2F2F2] border border-[#2A2A2A]">
          {row.source}
        </span>
      )
    },
    {
      key: 'followUpDate',
      label: 'Follow Up',
      render: (row) => (
        <span className="text-xs font-mono text-[#E8590C]">
          {row.followUpDate || 'None set'}
        </span>
      )
    },
    {
      label: 'Actions',
      sortable: false,
      render: (row) => (
        <div className="flex items-center gap-2">
          {row.status !== 'Converted' && (
            <button
              onClick={() => {
                setSelectedLead(row);
                setConvertModalOpen(true);
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#E8590C] hover:bg-[#D04F0A] text-xs font-semibold uppercase tracking-wider text-white transition-colors"
            >
              <UserCheck className="w-3 h-3" />
              Enroll
            </button>
          )}
          <a
            href={generateWhatsAppLink(row.phone, `Hi ${row.name}, team Shivay Gym following up regarding your gym trial. When would you like to visit?`)}
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
            Leads, Enquiries & Free Trials ({leads.length})
          </h1>
          <p className="text-xs text-[#9A9A9A]">
            Pipeline management for walk-ins, website trial registrations, and member referrals.
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#E8590C] hover:bg-[#D04F0A] text-xs font-semibold uppercase tracking-wider text-white transition-colors"
        >
          <Plus className="w-4 h-4" />
          Log New Enquiry
        </button>
      </div>

      <DataTable
        columns={columns}
        data={leads}
        searchPlaceholder="Search leads by name, phone, or channel..."
        filterKey="status"
        filterOptions={[
          { label: 'Trial Booked', value: 'Trial Booked' },
          { label: 'Attended Trial', value: 'Attended Trial' },
          { label: 'Ready to Join', value: 'Ready to Join' },
          { label: 'Converted', value: 'Converted' }
        ]}
        exportFilename="leads_pipeline.csv"
      />

      {/* LOG ENQUIRY MODAL */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Log Walk-In or Online Enquiry"
      >
        <form onSubmit={handleAddLead} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Full Name</label>
              <input
                type="text"
                required
                value={leadForm.name}
                onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                placeholder="e.g. Yashvardhan Singhania"
                className="w-full px-3 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Mobile Phone</label>
              <input
                type="tel"
                required
                value={leadForm.phone}
                onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                placeholder="+91 98110 00000"
                className="w-full px-3 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Channel Source</label>
              <select
                value={leadForm.source}
                onChange={(e) => setLeadForm({ ...leadForm, source: e.target.value })}
                className="w-full px-2.5 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
              >
                <option>Walk-in</option>
                <option>Instagram Ad</option>
                <option>Google Maps</option>
                <option>Member Referral</option>
                <option>WhatsApp Enquiry</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Assigned Coach</label>
              <select
                value={leadForm.assignedTrainer}
                onChange={(e) => setLeadForm({ ...leadForm, assignedTrainer: e.target.value })}
                className="w-full px-2.5 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
              >
                {trainers.map(t => (
                  <option key={t.id} value={t.name}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#2A2A2A]">
            <button
              type="button"
              onClick={() => setAddModalOpen(false)}
              className="px-4 py-2 text-xs font-medium rounded-lg border border-[#2A2A2A] bg-[#1E1E1E] text-[#9A9A9A]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg bg-[#E8590C] hover:bg-[#D04F0A] text-white transition-colors"
            >
              Save Enquiry
            </button>
          </div>
        </form>
      </Modal>

      {/* CONVERT TO MEMBER MODAL */}
      <Modal
        isOpen={convertModalOpen}
        onClose={() => setConvertModalOpen(false)}
        title={`Enroll Lead as Member: ${selectedLead?.name}`}
      >
        <form onSubmit={handleConvert} className="space-y-4">
          <div>
            <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Select Membership Plan</label>
            <select
              value={selectedPlanId}
              onChange={(e) => setSelectedPlanId(e.target.value)}
              className="w-full px-3 py-2.5 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-sm text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
            >
              {plans.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} — ₹{p.price.toLocaleString('en-IN')} ({p.durationMonths} Months)
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 bg-[#1A1A1A] rounded border border-[#2A2A2A] text-xs text-[#9A9A9A]">
            Enrolling will immediately issue a member ID, generate their digital barcode pass, and trigger the official welcome message.
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#2A2A2A]">
            <button
              type="button"
              onClick={() => setConvertModalOpen(false)}
              className="px-4 py-2 text-xs font-medium rounded-lg border border-[#2A2A2A] bg-[#1E1E1E] text-[#9A9A9A]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg bg-[#2F9E44] hover:bg-[#28883b] text-white transition-colors"
            >
              Enroll & Activate Pass
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

