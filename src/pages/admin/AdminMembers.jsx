import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useGym } from '../../context/GymContext';
import DataTable from '../../components/common/DataTable';
import Badge from '../../components/common/Badge';
import Avatar from '../../components/common/Avatar';
import Modal from '../../components/common/Modal';
import { generateWhatsAppLink } from '../../data/automations';
import {
  UserPlus,
  Send,
  RefreshCw,
  Snowflake,
  UserX,
  Eye,
  Filter,
  CheckCircle2,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

export default function AdminMembers() {
  const {
    members,
    plans,
    trainers,
    addMember,
    updateMember,
    renewMember,
    freezeMember,
    markMemberLeft,
    triggerSendMessage
  } = useGym();

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Modals state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [renewModalOpen, setRenewModalOpen] = useState(false);
  const [freezeModalOpen, setFreezeModalOpen] = useState(false);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  // Form states
  const [newMemberForm, setNewMemberForm] = useState({
    name: '',
    phone: '',
    email: '',
    age: 26,
    gender: 'Male',
    bloodGroup: 'B+',
    planId: 'PLAN-12M',
    trainerId: 'TR-01',
    emergencyContactName: '',
    emergencyContactPhone: '',
    assignedDiet: 'Fat Loss High Protein (Veg) 1600 kcal',
    assignedWorkout: 'Push / Pull / Legs Hypertrophy Split',
    notes: ''
  });

  const [renewPlanId, setRenewPlanId] = useState('PLAN-12M');
  const [renewMode, setRenewMode] = useState('UPI');
  const [freezeDays, setFreezeDays] = useState(15);
  const [freezeReason, setFreezeReason] = useState('Travel / Vacation');

  const [messageText, setMessageText] = useState('');
  const [messageChannel, setMessageChannel] = useState('WhatsApp');

  useEffect(() => {
    if (searchParams.get('add') === 'true') {
      setAddModalOpen(true);
    }
  }, [searchParams]);

  // Handle Add Member Submit
  const handleAddSubmit = (e) => {
    e.preventDefault();
    const planObj = plans.find(p => p.id === newMemberForm.planId) || plans[0];
    const trainerObj = trainers.find(t => t.id === newMemberForm.trainerId) || trainers[0];

    const today = new Date();
    const expiry = new Date(today);
    expiry.setMonth(expiry.getMonth() + planObj.durationMonths);

    addMember({
      name: newMemberForm.name,
      phone: newMemberForm.phone,
      email: newMemberForm.email || `${newMemberForm.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      age: Number(newMemberForm.age),
      gender: newMemberForm.gender,
      bloodGroup: newMemberForm.bloodGroup,
      plan: planObj.name,
      planId: planObj.id,
      joinDate: today.toISOString().split('T')[0],
      expiryDate: expiry.toISOString().split('T')[0],
      trainer: trainerObj.name,
      trainerId: trainerObj.id,
      emergencyContact: {
        name: newMemberForm.emergencyContactName || 'Family',
        phone: newMemberForm.emergencyContactPhone || newMemberForm.phone
      },
      assignedDiet: newMemberForm.assignedDiet,
      assignedWorkout: newMemberForm.assignedWorkout,
      notes: newMemberForm.notes
    });

    setAddModalOpen(false);
    setSearchParams({});
    setNewMemberForm({
      name: '',
      phone: '',
      email: '',
      age: 26,
      gender: 'Male',
      bloodGroup: 'B+',
      planId: 'PLAN-12M',
      trainerId: 'TR-01',
      emergencyContactName: '',
      emergencyContactPhone: '',
      assignedDiet: 'Fat Loss High Protein (Veg) 1600 kcal',
      assignedWorkout: 'Push / Pull / Legs Hypertrophy Split',
      notes: ''
    });
  };

  const handleRenewSubmit = (e) => {
    e.preventDefault();
    if (!selectedMember) return;
    const planObj = plans.find(p => p.id === renewPlanId) || plans[0];
    renewMember(selectedMember.id, planObj, planObj.price, renewMode);
    setRenewModalOpen(false);
  };

  const handleFreezeSubmit = (e) => {
    e.preventDefault();
    if (!selectedMember) return;
    freezeMember(selectedMember.id, Number(freezeDays), freezeReason);
    setFreezeModalOpen(false);
  };

  const handleSendMessageSubmit = (e) => {
    e.preventDefault();
    if (!selectedMember || !messageText.trim()) return;

    triggerSendMessage({
      recipientId: selectedMember.id,
      recipientName: selectedMember.name,
      recipientPhone: selectedMember.phone,
      text: messageText,
      channel: messageChannel,
      automationTitle: 'Direct Staff Message'
    });

    setMessageModalOpen(false);
    setMessageText('');
  };

  // Columns definition for DataTable
  const columns = [
    {
      key: 'name',
      label: 'Member',
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.name} size="sm" />
          <div>
            <div className="font-semibold text-[#F2F2F2] hover:text-[#E8590C] transition-colors">
              {row.name}
            </div>
            <div className="text-[11px] text-[#9A9A9A] font-mono">{row.id} • {row.phone}</div>
          </div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <Badge variant={row.status}>{row.status}</Badge>
    },
    {
      key: 'plan',
      label: 'Current Plan',
      render: (row) => (
        <div>
          <div className="text-xs font-medium text-[#F2F2F2]">{row.plan}</div>
          <div className="text-[11px] text-[#9A9A9A]">Expires: {row.expiryDate}</div>
        </div>
      )
    },
    {
      key: 'trainer',
      label: 'Trainer',
      render: (row) => <span className="text-xs text-[#9A9A9A]">{row.trainer}</span>
    },
    {
      key: 'attendanceStreak',
      label: 'Streak / Visits',
      render: (row) => (
        <div className="text-xs">
          <span className="font-semibold text-[#E8590C]">{row.attendanceStreak}d streak</span>
          <span className="text-[#666666] ml-1.5">({row.totalVisits} total)</span>
        </div>
      )
    },
    {
      key: 'duesPending',
      label: 'Dues',
      render: (row) => (
        row.duesPending > 0 ? (
          <span className="text-xs font-semibold text-[#E03131]">₹{row.duesPending}</span>
        ) : (
          <span className="text-xs text-[#2F9E44]">Clear</span>
        )
      )
    },
    {
      label: 'Actions',
      sortable: false,
      render: (row) => (
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => navigate(`/admin/members/${row.id}`)}
            className="p-1.5 rounded hover:bg-[#2A2A2A] text-[#9A9A9A] hover:text-[#F2F2F2]"
            title="View Member Profile"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setSelectedMember(row);
              setMessageText(`Hi ${row.name}, regarding your workout at Shivay Gym...`);
              setMessageModalOpen(true);
            }}
            className="p-1.5 rounded hover:bg-[#2A2A2A] text-[#9A9A9A] hover:text-[#2F9E44]"
            title="Send Message / WhatsApp"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setSelectedMember(row);
              setRenewModalOpen(true);
            }}
            className="p-1.5 rounded hover:bg-[#2A2A2A] text-[#9A9A9A] hover:text-[#E8590C]"
            title="Renew Plan"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setSelectedMember(row);
              setFreezeModalOpen(true);
            }}
            className="p-1.5 rounded hover:bg-[#2A2A2A] text-[#9A9A9A] hover:text-[#4DABF7]"
            title="Freeze Membership"
          >
            <Snowflake className="w-3.5 h-3.5" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#2A2A2A]">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold uppercase tracking-wide text-[#F2F2F2]">
            Member Directory ({members.length})
          </h1>
          <p className="text-xs text-[#9A9A9A]">
            Complete database of active, expiring, and frozen gym members.
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#E8590C] hover:bg-[#D04F0A] text-xs font-semibold uppercase tracking-wider text-white transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Register New Member
        </button>
      </div>

      {/* Main Data Table with built-in search, filters, pagination, and CSV export */}
      <DataTable
        columns={columns}
        data={members}
        searchPlaceholder="Search by name, phone, ID, or trainer..."
        filterKey="status"
        filterOptions={[
          { label: 'Active', value: 'Active' },
          { label: 'Expiring Soon', value: 'Expiring Soon' },
          { label: 'Expired', value: 'Expired' },
          { label: 'Frozen', value: 'Frozen' }
        ]}
        onRowClick={(row) => navigate(`/admin/members/${row.id}`)}
        exportFilename="shivay_gym_members.csv"
      />

      {/* ADD MEMBER MODAL */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => { setAddModalOpen(false); setSearchParams({}); }}
        title="Register New Gym Member"
        subtitle="Generates automated welcome WhatsApp message and creates digital QR card"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={newMemberForm.name}
                onChange={(e) => setNewMemberForm({ ...newMemberForm, name: e.target.value })}
                placeholder="e.g. Manpreet Dhillon"
                className="w-full px-3 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Mobile (+91) *</label>
              <input
                type="tel"
                required
                value={newMemberForm.phone}
                onChange={(e) => setNewMemberForm({ ...newMemberForm, phone: e.target.value })}
                placeholder="+91 98110 55443"
                className="w-full px-3 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Age</label>
              <input
                type="number"
                min="14"
                max="80"
                value={newMemberForm.age}
                onChange={(e) => setNewMemberForm({ ...newMemberForm, age: e.target.value })}
                className="w-full px-3 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Gender</label>
              <select
                value={newMemberForm.gender}
                onChange={(e) => setNewMemberForm({ ...newMemberForm, gender: e.target.value })}
                className="w-full px-2.5 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Blood Group</label>
              <select
                value={newMemberForm.bloodGroup}
                onChange={(e) => setNewMemberForm({ ...newMemberForm, bloodGroup: e.target.value })}
                className="w-full px-2.5 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
              >
                <option>B+</option>
                <option>O+</option>
                <option>A+</option>
                <option>AB+</option>
                <option>B-</option>
                <option>O-</option>
                <option>A-</option>
                <option>AB-</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Membership Plan</label>
              <select
                value={newMemberForm.planId}
                onChange={(e) => setNewMemberForm({ ...newMemberForm, planId: e.target.value })}
                className="w-full px-2.5 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
              >
                {plans.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} (₹{p.price.toLocaleString('en-IN')})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Assigned Trainer</label>
              <select
                value={newMemberForm.trainerId}
                onChange={(e) => setNewMemberForm({ ...newMemberForm, trainerId: e.target.value })}
                className="w-full px-2.5 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
              >
                {trainers.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.specialization})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Emergency Contact Person</label>
              <input
                type="text"
                value={newMemberForm.emergencyContactName}
                onChange={(e) => setNewMemberForm({ ...newMemberForm, emergencyContactName: e.target.value })}
                placeholder="Parent / Spouse name"
                className="w-full px-3 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Emergency Contact Number</label>
              <input
                type="tel"
                value={newMemberForm.emergencyContactPhone}
                onChange={(e) => setNewMemberForm({ ...newMemberForm, emergencyContactPhone: e.target.value })}
                placeholder="+91 98xxx xxxxx"
                className="w-full px-3 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Staff Notes / Medical Info</label>
            <textarea
              rows={2}
              value={newMemberForm.notes}
              onChange={(e) => setNewMemberForm({ ...newMemberForm, notes: e.target.value })}
              placeholder="e.g. Previous knee ligament surgery, beginner bench mechanics."
              className="w-full px-3 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#2A2A2A]">
            <button
              type="button"
              onClick={() => setAddModalOpen(false)}
              className="px-4 py-2 text-xs font-medium rounded-lg border border-[#2A2A2A] bg-[#1E1E1E] text-[#9A9A9A] hover:text-[#F2F2F2]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg bg-[#E8590C] hover:bg-[#D04F0A] text-white transition-colors"
            >
              Complete Registration
            </button>
          </div>
        </form>
      </Modal>

      {/* RENEW MEMBERSHIP MODAL */}
      <Modal
        isOpen={renewModalOpen}
        onClose={() => setRenewModalOpen(false)}
        title={`Renew Membership: ${selectedMember?.name}`}
        subtitle={`Current Expiry: ${selectedMember?.expiryDate}`}
      >
        <form onSubmit={handleRenewSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Select Renewal Plan</label>
            <select
              value={renewPlanId}
              onChange={(e) => setRenewPlanId(e.target.value)}
              className="w-full px-3 py-2.5 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-sm text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
            >
              {plans.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} — ₹{p.price.toLocaleString('en-IN')} ({p.durationMonths} Months)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Payment Method</label>
            <div className="grid grid-cols-3 gap-2">
              {['UPI', 'Credit Card', 'Cash'].map(mode => (
                <button
                  type="button"
                  key={mode}
                  onClick={() => setRenewMode(mode)}
                  className={`py-2 text-xs font-medium rounded border transition-colors ${
                    renewMode === mode
                      ? 'border-[#E8590C] bg-[#E8590C]/15 text-[#E8590C]'
                      : 'border-[#2A2A2A] bg-[#1E1E1E] text-[#9A9A9A]'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 bg-[#1E1E1E] rounded border border-[#2A2A2A] text-xs text-[#9A9A9A] flex items-center justify-between">
            <span>GST Invoice (18% included):</span>
            <span className="font-semibold text-[#F2F2F2]">
              ₹{plans.find(p => p.id === renewPlanId)?.price.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#2A2A2A]">
            <button
              type="button"
              onClick={() => setRenewModalOpen(false)}
              className="px-4 py-2 text-xs font-medium rounded-lg border border-[#2A2A2A] bg-[#1E1E1E] text-[#9A9A9A]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg bg-[#E8590C] hover:bg-[#D04F0A] text-white transition-colors"
            >
              Confirm & Generate Invoice
            </button>
          </div>
        </form>
      </Modal>

      {/* FREEZE MEMBERSHIP MODAL */}
      <Modal
        isOpen={freezeModalOpen}
        onClose={() => setFreezeModalOpen(false)}
        title={`Freeze Membership: ${selectedMember?.name}`}
        subtitle="Extends membership expiry date automatically by freeze duration"
      >
        <form onSubmit={handleFreezeSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Freeze Duration (Days)</label>
            <select
              value={freezeDays}
              onChange={(e) => setFreezeDays(e.target.value)}
              className="w-full px-3 py-2.5 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-sm text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
            >
              <option value="7">7 Days</option>
              <option value="15">15 Days (Recommended)</option>
              <option value="30">30 Days (Maximum Policy)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Reason for Freezing</label>
            <input
              type="text"
              required
              value={freezeReason}
              onChange={(e) => setFreezeReason(e.target.value)}
              placeholder="e.g. Travel, Knee recovery, Exams"
              className="w-full px-3 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#2A2A2A]">
            <button
              type="button"
              onClick={() => setFreezeModalOpen(false)}
              className="px-4 py-2 text-xs font-medium rounded-lg border border-[#2A2A2A] bg-[#1E1E1E] text-[#9A9A9A]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg bg-[#4DABF7] hover:bg-[#3b8fd3] text-black transition-colors"
            >
              Freeze Pass
            </button>
          </div>
        </form>
      </Modal>

      {/* DIRECT MESSAGE MODAL */}
      <Modal
        isOpen={messageModalOpen}
        onClose={() => setMessageModalOpen(false)}
        title={`Message ${selectedMember?.name}`}
        subtitle={`Phone: ${selectedMember?.phone}`}
      >
        <form onSubmit={handleSendMessageSubmit} className="space-y-4">
          <div className="flex items-center gap-2">
            {['WhatsApp', 'SMS', 'Push notification'].map(c => (
              <button
                type="button"
                key={c}
                onClick={() => setMessageChannel(c)}
                className={`px-3 py-1.5 rounded text-xs font-medium border transition-colors ${
                  messageChannel === c
                    ? 'border-[#E8590C] bg-[#E8590C]/15 text-[#E8590C]'
                    : 'border-[#2A2A2A] bg-[#1E1E1E] text-[#9A9A9A]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Message Content</label>
            <textarea
              rows={4}
              required
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="w-full px-3 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
            />
          </div>

          {messageChannel === 'WhatsApp' && (
            <div className="p-3 bg-[#1A1A1A] rounded border border-[#2A2A2A] text-xs text-[#9A9A9A] flex items-center justify-between">
              <span>Direct WhatsApp Click-to-Chat:</span>
              <a
                href={generateWhatsAppLink(selectedMember?.phone, messageText)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-[#2F9E44] font-semibold hover:underline"
              >
                Open in WhatsApp Web <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#2A2A2A]">
            <button
              type="button"
              onClick={() => setMessageModalOpen(false)}
              className="px-4 py-2 text-xs font-medium rounded-lg border border-[#2A2A2A] bg-[#1E1E1E] text-[#9A9A9A]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg bg-[#E8590C] hover:bg-[#D04F0A] text-white transition-colors"
            >
              Send Message
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

