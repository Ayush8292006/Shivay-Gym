import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGym } from '../../context/GymContext';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import Avatar from '../../components/common/Avatar';
import {
  Users,
  UserCheck,
  AlertTriangle,
  Clock,
  TrendingUp,
  CreditCard,
  IndianRupee,
  ScanLine,
  Cake,
  Calendar,
  ArrowUpRight,
  Send
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function AdminDashboard() {
  const {
    members,
    todayCheckIns,
    payments,
    monthlyRevenueHistory,
    peakHoursHeatmap,
    triggerSendMessage
  } = useGym();
  const navigate = useNavigate();

  // Metrics Calculations
  const totalMembers = members.length;
  const activeMembers = members.filter(m => m.status === 'Active').length;
  const expiredMembers = members.filter(m => m.status === 'Expired').length;
  const expiringSoonMembers = members.filter(m => m.status === 'Expiring Soon').length;
  const frozenMembers = members.filter(m => m.status === 'Frozen').length;

  const duesPendingList = members.filter(m => m.duesPending > 0);
  const totalPendingDues = duesPendingList.reduce((acc, m) => acc + (m.duesPending || 0), 0);

  // Current month revenue
  const thisMonthRevenue = 495000; // Nov 2024
  const newJoinsThisMonth = 30;

  // Inactive 7+ days (Active status but lastVisit was earlier or streak 0)
  const inactiveMembers = members.filter(m => m.status === 'Active' && m.attendanceStreak === 0).slice(0, 5);

  // Plan distribution for Pie Chart
  const planDistribution = [
    { name: 'Yearly Elite', value: members.filter(m => m.planId === 'PLAN-12M').length, color: '#E8590C' },
    { name: 'Half-Yearly', value: members.filter(m => m.planId === 'PLAN-6M').length, color: '#2F9E44' },
    { name: 'Quarterly', value: members.filter(m => m.planId === 'PLAN-3M').length, color: '#4DABF7' },
    { name: 'Monthly', value: members.filter(m => m.planId === 'PLAN-1M').length, color: '#E8A317' },
    { name: 'Personal Training', value: members.filter(m => m.planId === 'PLAN-PT').length, color: '#B197FC' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner / Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#2A2A2A]">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold uppercase tracking-wide text-[#F2F2F2]">
            Management Dashboard
          </h1>
          <p className="text-xs text-[#9A9A9A]">
            Real-time floor check-ins, revenue metrics, and attention alerts.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/admin/attendance')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1E1E1E] border border-[#2A2A2A] text-xs font-medium text-[#F2F2F2] hover:border-[#E8590C] transition-colors"
          >
            <ScanLine className="w-3.5 h-3.5 text-[#E8590C]" />
            Live Check-In Desk
          </button>
          <button
            onClick={() => navigate('/admin/automations')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E8590C] hover:bg-[#D04F0A] text-xs font-semibold uppercase tracking-wider text-white transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            Automations Center
          </button>
        </div>
      </div>

      {/* 8 Primary Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Registered"
          value={totalMembers}
          subtext="Seed member cohort"
          onClick={() => navigate('/admin/members')}
        />
        <StatCard
          label="Active Members"
          value={activeMembers}
          subtext="Valid gym floor passes"
          change="+8 this week"
          changeType="positive"
          accent={true}
          onClick={() => navigate('/admin/members')}
        />
        <StatCard
          label="Expiring in 7 Days"
          value={expiringSoonMembers}
          subtext="Automated nudges sent"
          change="Action required"
          changeType="negative"
          onClick={() => navigate('/admin/members')}
        />
        <StatCard
          label="Expired Passes"
          value={expiredMembers}
          subtext="Win-back eligible"
          onClick={() => navigate('/admin/former-members')}
        />
        <StatCard
          label="Today's Check-ins"
          value={todayCheckIns.length}
          subtext="Peak hours active"
          change="+14% vs yesterday"
          changeType="positive"
          accent={true}
          onClick={() => navigate('/admin/attendance')}
        />
        <StatCard
          label="Revenue (Nov MTD)"
          value={`₹${(thisMonthRevenue / 1000).toFixed(0)}k`}
          subtext="Gross collection"
          change="+18% YoY"
          changeType="positive"
          onClick={() => navigate('/admin/payments')}
        />
        <StatCard
          label="Pending Dues"
          value={`₹${(totalPendingDues).toLocaleString('en-IN')}`}
          subtext={`${duesPendingList.length} members with dues`}
          change="Reminders active"
          changeType="negative"
          onClick={() => navigate('/admin/payments')}
        />
        <StatCard
          label="New Joins (This Mo)"
          value={newJoinsThisMonth}
          subtext="Trial conversions: 78%"
          change="+6 vs target"
          changeType="positive"
          onClick={() => navigate('/admin/leads')}
        />
      </div>

      {/* Charts Section: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Revenue Trend (2 cols) */}
        <div className="lg:col-span-2 p-5 rounded-lg border border-[#2A2A2A] bg-[#161616]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-heading text-lg font-bold uppercase tracking-wider text-[#F2F2F2]">
                Monthly Revenue & Profit (₹ INR)
              </h2>
              <p className="text-xs text-[#9A9A9A]">Past 12 months financial performance</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-[#9A9A9A]">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E8590C]"></span> Revenue
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2F9E44]"></span> Profit
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenueHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E8590C" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#E8590C" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2F9E44" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#2F9E44" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#666666" tick={{ fill: '#9A9A9A', fontSize: 11 }} />
                <YAxis stroke="#666666" tick={{ fill: '#9A9A9A', fontSize: 11 }} tickFormatter={(val) => `₹${val / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#2A2A2A', borderRadius: '8px', color: '#F2F2F2', fontSize: '12px' }}
                  formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, '']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#E8590C" strokeWidth={2} fillOpacity={1} fill="url(#revenueGrad)" name="Revenue" />
                <Area type="monotone" dataKey="profit" stroke="#2F9E44" strokeWidth={2} fillOpacity={1} fill="url(#profitGrad)" name="Net Profit" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Plan Distribution Pie Chart (1 col) */}
        <div className="p-5 rounded-lg border border-[#2A2A2A] bg-[#161616] flex flex-col justify-between">
          <div>
            <h2 className="font-heading text-lg font-bold uppercase tracking-wider text-[#F2F2F2] mb-1">
              Membership Split
            </h2>
            <p className="text-xs text-[#9A9A9A] mb-4">Active plan tier distribution</p>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={planDistribution}
                    innerRadius={45}
                    outerRadius={68}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {planDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#2A2A2A', borderRadius: '8px', color: '#F2F2F2', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-[#242424] text-xs">
            {planDistribution.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-[#9A9A9A]">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                  {item.name}
                </span>
                <span className="font-semibold text-[#F2F2F2]">{item.value} members</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Peak Hours Heatmap Bar */}
      <div className="p-5 rounded-lg border border-[#2A2A2A] bg-[#161616]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-heading text-lg font-bold uppercase tracking-wider text-[#F2F2F2]">
              Peak Floor Density (Hourly Check-ins)
            </h2>
            <p className="text-xs text-[#9A9A9A]">Helps staff plan floor assistance & prevent squat rack congestion</p>
          </div>
          <span className="text-xs text-[#E8590C] font-semibold">Peak: 07:00 PM (86 lifters)</span>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-15 gap-1.5">
          {peakHoursHeatmap.map((item, idx) => {
            const bgClass =
              item.intensity === 'peak'
                ? 'bg-[#E8590C] text-white font-bold'
                : item.intensity === 'high'
                ? 'bg-[#E8590C]/60 text-white'
                : item.intensity === 'medium'
                ? 'bg-[#1E1E1E] text-[#F2F2F2] border border-[#333333]'
                : 'bg-[#141414] text-[#666666]';

            return (
              <div
                key={idx}
                className={`p-2 rounded text-center transition-transform hover:scale-105 ${bgClass}`}
                title={`${item.hour}: ${item.count} check-ins`}
              >
                <div className="text-[10px] leading-tight truncate">{item.hour.split(' ')[0]}</div>
                <div className="text-sm font-heading font-bold tabular-nums mt-0.5">{item.count}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Grid: "Needs Attention" & "Today's Live Floor Attendance" */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Needs Attention Card */}
        <div className="p-5 rounded-lg border border-[#2A2A2A] bg-[#161616]">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#242424]">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#E8A317]" />
              <h2 className="font-heading text-lg font-bold uppercase tracking-wider text-[#F2F2F2]">
                Action Needed (Attention List)
              </h2>
            </div>
            <button
              onClick={() => navigate('/admin/members')}
              className="text-xs text-[#E8590C] hover:underline"
            >
              View All Members →
            </button>
          </div>

          <div className="space-y-3">
            {/* Expiring Soon items */}
            {members.filter(m => m.status === 'Expiring Soon').slice(0, 3).map(m => (
              <div key={m.id} className="flex items-center justify-between p-2.5 rounded-md bg-[#1A1A1A] border border-[#2A2A2A]">
                <div className="flex items-center gap-3">
                  <Avatar name={m.name} size="sm" />
                  <div>
                    <div className="text-xs font-semibold text-[#F2F2F2]">{m.name}</div>
                    <div className="text-[11px] text-[#9A9A9A]">Expires: {m.expiryDate} • {m.plan}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="expiring">Expires Soon</Badge>
                  <button
                    onClick={() => {
                      triggerSendMessage({
                        recipientId: m.id,
                        recipientName: m.name,
                        recipientPhone: m.phone,
                        text: `Hi ${m.name}, your Shivay Gym membership expires on ${m.expiryDate}. Renew today!`,
                        automationTitle: 'Expiry Alert'
                      });
                    }}
                    className="p-1.5 rounded bg-[#1E1E1E] hover:bg-[#E8590C] hover:text-white text-[#9A9A9A] transition-colors"
                    title="Send Expiry Reminder"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {/* Dues pending items */}
            {duesPendingList.slice(0, 2).map(m => (
              <div key={m.id} className="flex items-center justify-between p-2.5 rounded-md bg-[#1A1A1A] border border-[#2A2A2A]">
                <div className="flex items-center gap-3">
                  <Avatar name={m.name} size="sm" />
                  <div>
                    <div className="text-xs font-semibold text-[#F2F2F2]">{m.name}</div>
                    <div className="text-[11px] text-[#E03131] font-medium">Pending: ₹{m.duesPending}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="danger">Fee Due</Badge>
                  <button
                    onClick={() => {
                      triggerSendMessage({
                        recipientId: m.id,
                        recipientName: m.name,
                        recipientPhone: m.phone,
                        text: `Dear ${m.name}, reminder that ₹${m.duesPending} is pending against your Shivay Gym account.`,
                        automationTitle: 'Dues Alert'
                      });
                    }}
                    className="p-1.5 rounded bg-[#1E1E1E] hover:bg-[#E8590C] hover:text-white text-[#9A9A9A] transition-colors"
                    title="Send Due Reminder"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {/* Inactive 7+ days */}
            {inactiveMembers.slice(0, 2).map(m => (
              <div key={m.id} className="flex items-center justify-between p-2.5 rounded-md bg-[#1A1A1A] border border-[#2A2A2A]">
                <div className="flex items-center gap-3">
                  <Avatar name={m.name} size="sm" />
                  <div>
                    <div className="text-xs font-semibold text-[#F2F2F2]">{m.name}</div>
                    <div className="text-[11px] text-[#9A9A9A]">Inactive 7+ days • Last visit: {m.lastVisit || 'None'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="warning">Inactive</Badge>
                  <button
                    onClick={() => {
                      triggerSendMessage({
                        recipientId: m.id,
                        recipientName: m.name,
                        recipientPhone: m.phone,
                        text: `Hey ${m.name}, we haven't seen you at Shivay Gym this week! Let's get a light session in today.`,
                        automationTitle: 'Inactivity Nudge'
                      });
                    }}
                    className="p-1.5 rounded bg-[#1E1E1E] hover:bg-[#E8590C] hover:text-white text-[#9A9A9A] transition-colors"
                    title="Send Nudge"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Live Check-Ins Stream */}
        <div className="p-5 rounded-lg border border-[#2A2A2A] bg-[#161616]">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#242424]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#2F9E44] animate-ping"></span>
              <h2 className="font-heading text-lg font-bold uppercase tracking-wider text-[#F2F2F2]">
                Today's Floor Check-Ins ({todayCheckIns.length})
              </h2>
            </div>
            <button
              onClick={() => navigate('/admin/attendance')}
              className="text-xs text-[#E8590C] hover:underline"
            >
              Full Log →
            </button>
          </div>

          <div className="divide-y divide-[#242424] max-h-[320px] overflow-y-auto">
            {todayCheckIns.slice(0, 7).map((item) => (
              <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <Avatar name={item.name} size="xs" />
                  <div>
                    <div className="font-semibold text-[#F2F2F2]">{item.name}</div>
                    <div className="text-[11px] text-[#9A9A9A]">{item.plan}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-[#E8590C] font-medium">{item.time}</div>
                  <div className="text-[10px] text-[#666666]">{item.method}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
