import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGym } from '../../context/GymContext';
import Avatar from '../../components/common/Avatar';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { generateWhatsAppLink } from '../../data/automations';
import {
  ArrowLeft,
  Calendar,
  Phone,
  Mail,
  UserCheck,
  Dumbbell,
  Utensils,
  Receipt,
  MessageSquare,
  RefreshCw,
  Snowflake,
  UserX,
  ExternalLink,
  Flame,
  Clock,
  ShieldAlert,
  Send
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function AdminMemberDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    members,
    payments,
    renewMember,
    freezeMember,
    markMemberLeft,
    triggerSendMessage,
    plans
  } = useGym();

  const member = members.find(m => m.id === id);

  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'payments', 'measurements', 'messages'
  const [renewModalOpen, setRenewModalOpen] = useState(false);
  const [renewPlanId, setRenewPlanId] = useState('PLAN-12M');
  const [freezeModalOpen, setFreezeModalOpen] = useState(false);
  const [freezeDays, setFreezeDays] = useState(15);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [messageText, setMessageText] = useState('');

  if (!member) {
    return (
      <div className="p-8 text-center text-[#9A9A9A]">
        <h2 className="text-xl font-bold text-[#F2F2F2]">Member Not Found</h2>
        <p className="text-xs mt-1">No member matches ID: {id}</p>
        <button
          onClick={() => navigate('/admin/members')}
          className="mt-4 px-4 py-2 rounded bg-[#E8590C] text-white text-xs font-semibold"
        >
          Return to Member Directory
        </button>
      </div>
    );
  }

  // Member-specific payments
  const memberPayments = payments.filter(p => p.memberId === member.id || p.memberName === member.name);

  // Simulated weight progress history data for chart
  const weightProgressData = [
    { month: 'Jun', weight: (member.measurements?.weight || 75) + 3.8 },
    { month: 'Jul', weight: (member.measurements?.weight || 75) + 2.5 },
    { month: 'Aug', weight: (member.measurements?.weight || 75) + 1.2 },
    { month: 'Sep', weight: (member.measurements?.weight || 75) + 0.4 },
    { month: 'Oct', weight: (member.measurements?.weight || 75) - 0.2 },
    { month: 'Nov', weight: member.measurements?.weight || 75 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Bar with Back Button */}
      <div className="flex items-center justify-between pb-2 border-b border-[#2A2A2A]">
        <button
          onClick={() => navigate('/admin/members')}
          className="inline-flex items-center gap-1.5 text-xs text-[#9A9A9A] hover:text-[#F2F2F2] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Member Directory
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setMessageText(`Hi ${member.name}, Shivay Gym front desk here...`);
              setMessageModalOpen(true);
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] hover:border-[#2F9E44] hover:text-[#2F9E44] transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            Send Message
          </button>
          <button
            onClick={() => setRenewModalOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded bg-[#E8590C] hover:bg-[#D04F0A] text-xs font-semibold text-white transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Renew Plan
          </button>
          <button
            onClick={() => setFreezeModalOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#9A9A9A] hover:text-[#4DABF7] hover:border-[#4DABF7] transition-colors"
          >
            <Snowflake className="w-3.5 h-3.5" />
            Freeze
          </button>
          <button
            onClick={() => {
              if (window.confirm(`Mark ${member.name} as Left? This will archive them to Former Members.`)) {
                markMemberLeft(member.id, 'Manually marked left by admin');
                navigate('/admin/former-members');
              }
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#9A9A9A] hover:text-[#E03131] hover:border-[#E03131] transition-colors"
            title="Mark as Left"
          >
            <UserX className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Member Header Card */}
      <div className="p-6 rounded-lg border border-[#2A2A2A] bg-[#161616]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Avatar name={member.name} size="lg" />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="font-heading text-2xl font-bold uppercase text-[#F2F2F2]">
                  {member.name}
                </h1>
                <Badge variant={member.status}>{member.status}</Badge>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#9A9A9A]">
                <span className="font-mono text-[#E8590C] font-semibold">{member.id}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3" /> {member.phone}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3" /> {member.email}
                </span>
                <span>•</span>
                <span>{member.age} yrs • {member.gender} ({member.bloodGroup})</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-[#2A2A2A] pt-4 md:pt-0 md:pl-6">
            <div className="text-center">
              <div className="font-heading text-2xl font-bold text-[#E8590C] tabular-nums">
                {member.attendanceStreak}
              </div>
              <div className="text-[10px] uppercase text-[#9A9A9A]">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="font-heading text-2xl font-bold text-[#F2F2F2] tabular-nums">
                {member.totalVisits}
              </div>
              <div className="text-[10px] uppercase text-[#9A9A9A]">Total Visits</div>
            </div>
            <div className="text-center">
              <div className={`font-heading text-2xl font-bold tabular-nums ${member.duesPending > 0 ? 'text-[#E03131]' : 'text-[#2F9E44]'}`}>
                ₹{member.duesPending || 0}
              </div>
              <div className="text-[10px] uppercase text-[#9A9A9A]">Balance Dues</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#2A2A2A] pb-2 text-xs">
        {[
          { id: 'overview', label: 'Overview & Training' },
          { id: 'payments', label: `Payment History (${memberPayments.length})` },
          { id: 'measurements', label: 'Body Stats & Progress' },
          { id: 'messages', label: `Message Log (${member.messageHistory?.length || 0})` },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === t.id
                ? 'bg-[#E8590C] text-white'
                : 'text-[#9A9A9A] hover:text-[#F2F2F2] hover:bg-[#1A1A1A]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW & TRAINING */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6 lg:col-span-2">
            {/* Plan Info */}
            <div className="p-5 rounded-lg border border-[#2A2A2A] bg-[#161616] space-y-4">
              <h3 className="font-heading text-base font-bold uppercase tracking-wider text-[#F2F2F2]">
                Membership Details
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-[#9A9A9A]">Plan Tier:</span>
                  <div className="font-semibold text-[#F2F2F2] mt-0.5">{member.plan}</div>
                </div>
                <div>
                  <span className="text-[#9A9A9A]">Joined On:</span>
                  <div className="font-semibold text-[#F2F2F2] mt-0.5">{member.joinDate}</div>
                </div>
                <div>
                  <span className="text-[#9A9A9A]">Expires On:</span>
                  <div className="font-semibold text-[#E8590C] mt-0.5">{member.expiryDate}</div>
                </div>
                <div>
                  <span className="text-[#9A9A9A]">Floor Coach:</span>
                  <div className="font-semibold text-[#F2F2F2] mt-0.5">{member.trainer}</div>
                </div>
              </div>
            </div>

            {/* Assigned Diet & Workout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-lg border border-[#2A2A2A] bg-[#161616]">
                <div className="flex items-center gap-2 mb-2 text-[#E8590C]">
                  <Utensils className="w-4 h-4" />
                  <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-[#F2F2F2]">
                    Assigned Diet Protocol
                  </h4>
                </div>
                <p className="text-xs text-[#9A9A9A] leading-relaxed">
                  {member.assignedDiet || 'Custom Indian Nutrition Protocol'}
                </p>
              </div>

              <div className="p-5 rounded-lg border border-[#2A2A2A] bg-[#161616]">
                <div className="flex items-center gap-2 mb-2 text-[#E8590C]">
                  <Dumbbell className="w-4 h-4" />
                  <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-[#F2F2F2]">
                    Assigned Training Split
                  </h4>
                </div>
                <p className="text-xs text-[#9A9A9A] leading-relaxed">
                  {member.assignedWorkout || 'Push / Pull / Legs Hypertrophy Split'}
                </p>
              </div>
            </div>

            {/* Notes */}
            <div className="p-5 rounded-lg border border-[#2A2A2A] bg-[#161616]">
              <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-[#F2F2F2] mb-2">
                Coaching & Staff Notes
              </h4>
              <p className="text-xs text-[#9A9A9A] leading-relaxed bg-[#1E1E1E] p-3 rounded border border-[#2A2A2A]">
                {member.notes || 'No specific medical limitations. High discipline.'}
              </p>
            </div>
          </div>

          {/* Right Col: Emergency & Contact */}
          <div className="space-y-6">
            <div className="p-5 rounded-lg border border-[#2A2A2A] bg-[#161616]">
              <h3 className="font-heading text-base font-bold uppercase tracking-wider text-[#F2F2F2] mb-3">
                Emergency Contact
              </h3>
              <div className="space-y-2 text-xs text-[#9A9A9A]">
                <div>
                  <span className="text-[#666666]">Contact Name:</span>
                  <div className="font-semibold text-[#F2F2F2] mt-0.5">{member.emergencyContact?.name || 'Family Contact'}</div>
                </div>
                <div>
                  <span className="text-[#666666]">Contact Number:</span>
                  <div className="font-semibold text-[#F2F2F2] mt-0.5">{member.emergencyContact?.phone || member.phone}</div>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-lg border border-[#2A2A2A] bg-[#161616]">
              <h3 className="font-heading text-base font-bold uppercase tracking-wider text-[#F2F2F2] mb-3">
                Quick WhatsApp
              </h3>
              <p className="text-xs text-[#9A9A9A] mb-3">
                Send workout update or schedule form check directly to member.
              </p>
              <a
                href={generateWhatsAppLink(member.phone, `Hi ${member.name}, Shivay Gym front desk checking in on your workout consistency!`)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 w-full py-2 rounded bg-[#2F9E44] hover:bg-[#28883b] text-white text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                Open WhatsApp Chat <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PAYMENTS */}
      {activeTab === 'payments' && (
        <div className="p-5 rounded-lg border border-[#2A2A2A] bg-[#161616] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-base font-bold uppercase tracking-wider text-[#F2F2F2]">
              Invoices & Receipt Records
            </h3>
            <button
              onClick={() => setRenewModalOpen(true)}
              className="px-3 py-1.5 rounded bg-[#E8590C] text-xs font-semibold text-white uppercase tracking-wider"
            >
              Record New Payment
            </button>
          </div>

          <div className="divide-y divide-[#242424]">
            {memberPayments.length > 0 ? (
              memberPayments.map(p => (
                <div key={p.invoiceNumber} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="font-mono font-bold text-[#F2F2F2]">{p.invoiceNumber}</span>
                    <span className="text-[#9A9A9A] ml-2">({p.paymentDate})</span>
                    <div className="text-[11px] text-[#9A9A9A] mt-0.5">{p.planName} • {p.paymentMode}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-bold text-[#F2F2F2]">₹{p.amount.toLocaleString('en-IN')}</div>
                      <div className="text-[10px] text-[#666666]">GST: ₹{p.gstAmount}</div>
                    </div>
                    <Badge variant={p.status === 'Completed' ? 'success' : 'warning'}>{p.status}</Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-[#9A9A9A]">
                No payment receipts on file for this member. Click "Record New Payment" to add.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: MEASUREMENTS */}
      {activeTab === 'measurements' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {[
              { label: 'Weight', val: `${member.measurements?.weight || 74} kg` },
              { label: 'Height', val: `${member.measurements?.height || 176} cm` },
              { label: 'Body Fat', val: `${member.measurements?.bodyFat || 16}%` },
              { label: 'Chest', val: `${member.measurements?.chest || 40} in` },
              { label: 'Waist', val: `${member.measurements?.waist || 32} in` },
              { label: 'Arms', val: `${member.measurements?.arms || 15} in` },
              { label: 'Thighs', val: `${member.measurements?.thighs || 23} in` },
            ].map(m => (
              <div key={m.label} className="p-3 rounded-lg border border-[#2A2A2A] bg-[#161616] text-center">
                <span className="text-[10px] uppercase text-[#9A9A9A] font-semibold">{m.label}</span>
                <div className="font-heading text-xl font-bold text-[#F2F2F2] tabular-nums mt-0.5">{m.val}</div>
              </div>
            ))}
          </div>

          <div className="p-5 rounded-lg border border-[#2A2A2A] bg-[#161616]">
            <h3 className="font-heading text-base font-bold uppercase tracking-wider text-[#F2F2F2] mb-1">
              Bodyweight Progression (Past 6 Months)
            </h3>
            <p className="text-xs text-[#9A9A9A] mb-4">Tracking monthly InBody scan results</p>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weightProgressData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="month" stroke="#666666" tick={{ fill: '#9A9A9A', fontSize: 11 }} />
                  <YAxis domain={['dataMin - 2', 'dataMax + 2']} stroke="#666666" tick={{ fill: '#9A9A9A', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#2A2A2A', borderRadius: '8px', color: '#F2F2F2', fontSize: '12px' }}
                    formatter={(val) => [`${val} kg`, 'Weight']}
                  />
                  <Line type="monotone" dataKey="weight" stroke="#E8590C" strokeWidth={2.5} dot={{ fill: '#E8590C', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: MESSAGE HISTORY */}
      {activeTab === 'messages' && (
        <div className="p-5 rounded-lg border border-[#2A2A2A] bg-[#161616] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-base font-bold uppercase tracking-wider text-[#F2F2F2]">
              Outreach & Automated Dispatch Log
            </h3>
            <button
              onClick={() => {
                setMessageText(`Hi ${member.name}, reminder from Shivay Gym...`);
                setMessageModalOpen(true);
              }}
              className="px-3 py-1.5 rounded bg-[#E8590C] text-xs font-semibold text-white uppercase tracking-wider"
            >
              Compose Message
            </button>
          </div>

          <div className="divide-y divide-[#242424]">
            {member.messageHistory && member.messageHistory.length > 0 ? (
              member.messageHistory.map((m, idx) => (
                <div key={idx} className="py-3 text-xs space-y-1">
                  <div className="flex items-center justify-between text-[#9A9A9A]">
                    <span className="font-medium text-[#F2F2F2]">{m.channel || 'WhatsApp'}</span>
                    <span className="text-[11px]">{m.date} • Status: {m.status || 'Delivered'}</span>
                  </div>
                  <p className="text-[#9A9A9A] bg-[#1A1A1A] p-2.5 rounded border border-[#2A2A2A]">
                    {m.text}
                  </p>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-[#9A9A9A]">
                No messages logged yet. Use the Compose button to send WhatsApp/SMS.
              </div>
            )}
          </div>
        </div>
      )}

      {/* RENEW MODAL */}
      <Modal
        isOpen={renewModalOpen}
        onClose={() => setRenewModalOpen(false)}
        title={`Renew Membership: ${member.name}`}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const planObj = plans.find(p => p.id === renewPlanId) || plans[0];
            renewMember(member.id, planObj, planObj.price, 'UPI');
            setRenewModalOpen(false);
          }}
          className="space-y-4"
        >
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
              Confirm Renewal
            </button>
          </div>
        </form>
      </Modal>

      {/* FREEZE MODAL */}
      <Modal
        isOpen={freezeModalOpen}
        onClose={() => setFreezeModalOpen(false)}
        title={`Freeze Membership: ${member.name}`}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            freezeMember(member.id, Number(freezeDays), 'Admin Panel Action');
            setFreezeModalOpen(false);
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Days to Freeze</label>
            <select
              value={freezeDays}
              onChange={(e) => setFreezeDays(e.target.value)}
              className="w-full px-3 py-2.5 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-sm text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
            >
              <option value="7">7 Days</option>
              <option value="15">15 Days</option>
              <option value="30">30 Days</option>
            </select>
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
              className="px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg bg-[#4DABF7] text-black transition-colors"
            >
              Freeze Pass
            </button>
          </div>
        </form>
      </Modal>

      {/* MESSAGE MODAL */}
      <Modal
        isOpen={messageModalOpen}
        onClose={() => setMessageModalOpen(false)}
        title={`Send Message to ${member.name}`}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!messageText.trim()) return;
            triggerSendMessage({
              recipientId: member.id,
              recipientName: member.name,
              recipientPhone: member.phone,
              text: messageText,
              channel: 'WhatsApp',
              automationTitle: 'Direct Staff Message'
            });
            setMessageModalOpen(false);
          }}
          className="space-y-4"
        >
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
              Dispatch
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

