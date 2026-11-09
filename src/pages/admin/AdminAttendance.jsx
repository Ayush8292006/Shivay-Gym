import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import Avatar from '../../components/common/Avatar';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { generateWhatsAppLink } from '../../data/automations';
import {
  QrCode,
  ScanLine,
  CheckCircle2,
  Clock,
  Flame,
  AlertTriangle,
  Send,
  Users,
  Search,
  ExternalLink
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function AdminAttendance() {
  const {
    todayCheckIns,
    members,
    checkInMember,
    weeklyAttendanceTrend,
    peakHoursHeatmap,
    triggerSendMessage
  } = useGym();

  const [inputVal, setInputVal] = useState('');
  const [showGymQRModal, setShowGymQRModal] = useState(false);
  const [activeTab, setActiveTab] = useState('today'); // 'today', 'weekly', 'inactive'

  const handleManualCheckIn = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    checkInMember(inputVal.trim(), 'Manual Reception');
    setInputVal('');
  };

  // Flagged inactive members
  const inactive7Days = members.filter(m => m.status === 'Active' && m.attendanceStreak === 0);
  const inactive15Days = members.filter(m => m.status === 'Active' && (!m.lastVisit || m.lastVisit < '2024-10-25'));
  const inactive30Days = members.filter(m => m.status === 'Active' && (!m.lastVisit || m.lastVisit < '2024-10-10'));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#2A2A2A]">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold uppercase tracking-wide text-[#F2F2F2]">
            Attendance & Floor Traffic
          </h1>
          <p className="text-xs text-[#9A9A9A]">
            Turnstile biometric sync, QR scanner terminal, and member streak tracking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowGymQRModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#1E1E1E] border border-[#2A2A2A] hover:border-[#E8590C] text-xs font-medium text-[#F2F2F2] transition-colors"
          >
            <QrCode className="w-4 h-4 text-[#E8590C]" />
            Display Reception Check-In QR
          </button>
        </div>
      </div>

      {/* Manual Check-in Terminal Input */}
      <div className="p-5 rounded-lg border border-[#2A2A2A] bg-[#161616]">
        <h3 className="font-heading text-base font-bold uppercase tracking-wider text-[#F2F2F2] mb-1">
          Front Desk Attendance Logger
        </h3>
        <p className="text-xs text-[#9A9A9A] mb-4">
          Type Member ID (e.g. SHIV-1002) or phone number, or scan member's digital QR pass.
        </p>

        <form onSubmit={handleManualCheckIn} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <ScanLine className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9A9A9A]" />
            <input
              type="text"
              required
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Enter Member ID (SHIV-1001) or 10-digit mobile..."
              className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#1E1E1E] border border-[#2A2A2A] text-sm text-[#F2F2F2] placeholder-[#666666] focus:border-[#E8590C] focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg bg-[#E8590C] hover:bg-[#D04F0A] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
          >
            Log Entry
          </button>
        </form>

        <div className="mt-3 flex items-center gap-2 text-xs text-[#9A9A9A]">
          <span>Fast Check-in Demo:</span>
          {members.slice(0, 4).map(m => (
            <button
              key={m.id}
              onClick={() => checkInMember(m.id, 'One-Click Desk')}
              className="px-2 py-0.5 rounded bg-[#2A2A2A] hover:bg-[#E8590C] hover:text-white text-[11px] text-[#F2F2F2] transition-colors"
            >
              + {m.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg border border-[#2A2A2A] bg-[#161616]">
          <span className="text-[10px] uppercase text-[#9A9A9A] font-semibold">Today's Check-ins</span>
          <div className="font-heading text-3xl font-bold text-[#E8590C] tabular-nums mt-0.5">{todayCheckIns.length}</div>
          <span className="text-[11px] text-[#2F9E44]">+12% vs last Friday</span>
        </div>
        <div className="p-4 rounded-lg border border-[#2A2A2A] bg-[#161616]">
          <span className="text-[10px] uppercase text-[#9A9A9A] font-semibold">Average Morning Crowd</span>
          <div className="font-heading text-3xl font-bold text-[#F2F2F2] tabular-nums mt-0.5">64</div>
          <span className="text-[11px] text-[#9A9A9A]">06:00 AM - 09:00 AM</span>
        </div>
        <div className="p-4 rounded-lg border border-[#2A2A2A] bg-[#161616]">
          <span className="text-[10px] uppercase text-[#9A9A9A] font-semibold">Average Evening Crowd</span>
          <div className="font-heading text-3xl font-bold text-[#F2F2F2] tabular-nums mt-0.5">82</div>
          <span className="text-[11px] text-[#9A9A9A]">06:00 PM - 09:00 PM</span>
        </div>
        <div className="p-4 rounded-lg border border-[#2A2A2A] bg-[#161616]">
          <span className="text-[10px] uppercase text-[#9A9A9A] font-semibold">Flagged Inactive (7d+)</span>
          <div className="font-heading text-3xl font-bold text-[#E03131] tabular-nums mt-0.5">{inactive7Days.length}</div>
          <span className="text-[11px] text-[#9A9A9A]">Auto-nudge sent</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#2A2A2A] pb-2 text-xs">
        <button
          onClick={() => setActiveTab('today')}
          className={`px-3 py-1.5 rounded font-medium transition-colors ${
            activeTab === 'today' ? 'bg-[#E8590C] text-white' : 'text-[#9A9A9A] hover:text-[#F2F2F2]'
          }`}
        >
          Today's Log ({todayCheckIns.length})
        </button>
        <button
          onClick={() => setActiveTab('weekly')}
          className={`px-3 py-1.5 rounded font-medium transition-colors ${
            activeTab === 'weekly' ? 'bg-[#E8590C] text-white' : 'text-[#9A9A9A] hover:text-[#F2F2F2]'
          }`}
        >
          Weekly Attendance Analytics
        </button>
        <button
          onClick={() => setActiveTab('inactive')}
          className={`px-3 py-1.5 rounded font-medium transition-colors ${
            activeTab === 'inactive' ? 'bg-[#E8590C] text-white' : 'text-[#9A9A9A] hover:text-[#F2F2F2]'
          }`}
        >
          Inactive Member Retention Flags ({inactive7Days.length})
        </button>
      </div>

      {/* TAB 1: TODAY'S LOG */}
      {activeTab === 'today' && (
        <div className="rounded-lg border border-[#2A2A2A] bg-[#161616] overflow-hidden">
          <div className="p-4 border-b border-[#2A2A2A] flex items-center justify-between text-xs">
            <span className="font-semibold text-[#F2F2F2]">Live Turnstile Check-In Stream</span>
            <span className="text-[#2F9E44] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#2F9E44] animate-pulse"></span>
              Live Synced
            </span>
          </div>

          <div className="divide-y divide-[#242424] max-h-[480px] overflow-y-auto">
            {todayCheckIns.map(chk => (
              <div key={chk.id} className="p-4 flex items-center justify-between text-xs hover:bg-[#1A1A1A] transition-colors">
                <div className="flex items-center gap-3">
                  <Avatar name={chk.name} size="sm" />
                  <div>
                    <div className="font-semibold text-[#F2F2F2]">{chk.name}</div>
                    <div className="text-[11px] text-[#9A9A9A]">{chk.memberId} • {chk.plan}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono text-[#E8590C] font-semibold">{chk.time}</div>
                  <span className="text-[10px] text-[#666666]">{chk.method}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: WEEKLY ANALYTICS & PEAK HOURS */}
      {activeTab === 'weekly' && (
        <div className="space-y-6">
          <div className="p-5 rounded-lg border border-[#2A2A2A] bg-[#161616]">
            <h3 className="font-heading text-lg font-bold uppercase tracking-wider text-[#F2F2F2] mb-1">
              Daily Attendance Breakdown (Morning vs Evening)
            </h3>
            <p className="text-xs text-[#9A9A9A] mb-4">Past 7 days volume distribution</p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyAttendanceTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="day" stroke="#666666" tick={{ fill: '#9A9A9A', fontSize: 11 }} />
                  <YAxis stroke="#666666" tick={{ fill: '#9A9A9A', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#2A2A2A', borderRadius: '8px', color: '#F2F2F2', fontSize: '12px' }}
                  />
                  <Bar dataKey="morning" fill="#E8590C" name="Morning Shift" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="evening" fill="#4DABF7" name="Evening Shift" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: INACTIVE MEMBERS FLAGGED */}
      {activeTab === 'inactive' && (
        <div className="space-y-4">
          <div className="p-4 rounded-lg border border-[#2A2A2A] bg-[#161616] text-xs text-[#9A9A9A]">
            <strong className="text-[#F2F2F2]">Retention Risk Alert:</strong> Members who haven't checked in for 7+ days are at a 65% risk of churn when their subscription ends. Dispatch the one-click inactivity nudge to reset their momentum.
          </div>

          <div className="divide-y divide-[#242424] rounded-lg border border-[#2A2A2A] bg-[#161616]">
            {inactive7Days.map(m => (
              <div key={m.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <Avatar name={m.name} size="sm" />
                  <div>
                    <div className="font-semibold text-[#F2F2F2]">{m.name}</div>
                    <div className="text-[11px] text-[#9A9A9A]">
                      {m.plan} • Coach: {m.trainer} • Last Visit: {m.lastVisit || 'Not logged yet'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="warning">Inactive 7+ Days</Badge>
                  <a
                    href={generateWhatsAppLink(m.phone, `Hey ${m.name}, we haven't seen you at Shivay Gym this week! Everything alright? Consistency is where results happen. Even a 30-min light workout today will reset your momentum!`)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 rounded bg-[#2F9E44] hover:bg-[#28883b] text-white text-xs font-semibold transition-colors"
                  >
                    <Send className="w-3 h-3" />
                    Send WhatsApp Nudge
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GYM RECEPTION QR MODAL */}
      <Modal
        isOpen={showGymQRModal}
        onClose={() => setShowGymQRModal(false)}
        title="Shivay Gym Front Desk Check-In QR"
        subtitle="Display this on the tablet at front desk or print for turnstile scanning"
      >
        <div className="text-center p-4 space-y-4">
          <div className="mx-auto w-56 h-56 bg-white p-4 rounded-xl flex items-center justify-center shadow-xl">
            <div className="w-full h-full border-4 border-black p-3 flex flex-col items-center justify-between">
              <div className="flex justify-between w-full">
                <div className="w-10 h-10 bg-black"></div>
                <div className="w-10 h-10 bg-black"></div>
              </div>
              <div className="text-black font-heading uppercase text-lg font-bold tracking-widest">
                SHIVAY CHECKIN
              </div>
              <div className="flex justify-between w-full">
                <div className="w-10 h-10 bg-black"></div>
                <div className="w-6 h-6 bg-black self-end"></div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-heading text-lg font-bold text-[#F2F2F2]">Sector 14 Biometric Station</h4>
            <p className="text-xs text-[#9A9A9A] mt-1">
              Members can open the Shivay Member App on their phone and tap "Scan QR" to record instantaneous turnstile entry.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}

