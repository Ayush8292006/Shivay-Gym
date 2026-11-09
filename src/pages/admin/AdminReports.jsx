import React from 'react';
import { useGym } from '../../context/GymContext';
import StatCard from '../../components/common/StatCard';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { Download, TrendingUp, Users, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export default function AdminReports() {
  const { members, formerMembers, monthlyRevenueHistory } = useGym();

  const totalMembers = members.length;
  const activeCount = members.filter(m => m.status === 'Active').length;
  const churnedCount = formerMembers.length;

  const retentionRate = Math.round((activeCount / (activeCount + churnedCount)) * 100);
  const churnRate = 100 - retentionRate;

  // Monthly retention trend mock data
  const retentionTrend = [
    { month: 'Jun', retention: 76, churn: 24 },
    { month: 'Jul', retention: 79, churn: 21 },
    { month: 'Aug', retention: 81, churn: 19 },
    { month: 'Sep', retention: 84, churn: 16 },
    { month: 'Oct', retention: 86, churn: 14 },
    { month: 'Nov', retention: 88, churn: 12 }
  ];

  const handleDownloadFullReport = () => {
    const reportData = [
      ['Metric', 'Value'],
      ['Total Active Members', activeCount],
      ['Retention Rate', `${retentionRate}%`],
      ['Churn Rate', `${churnRate}%`],
      ['November 2024 Revenue', '₹4,95,000'],
      ['Total Former Members', churnedCount]
    ].map(e => e.join(',')).join('\n');

    const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + reportData);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'shivay_gym_executive_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#2A2A2A]">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold uppercase tracking-wide text-[#F2F2F2]">
            Executive Reports & Retention Analytics
          </h1>
          <p className="text-xs text-[#9A9A9A]">
            Comprehensive churn rate, lifetime value (LTV), and seasonal attendance trends.
          </p>
        </div>

        <button
          onClick={handleDownloadFullReport}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#E8590C] hover:bg-[#D04F0A] text-xs font-semibold uppercase tracking-wider text-white transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          Download Executive CSV Report
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Retention Rate"
          value={`${retentionRate}%`}
          subtext="Industry benchmark: 72%"
          change="+12% vs last year"
          changeType="positive"
          accent={true}
        />
        <StatCard
          label="Monthly Churn Rate"
          value={`${churnRate}%`}
          subtext="Former members archived"
          change="Decreasing"
          changeType="positive"
        />
        <StatCard
          label="Average Lifetime Value (LTV)"
          value="₹16,400"
          subtext="Per registered member"
          change="+8% YoY"
          changeType="positive"
        />
        <StatCard
          label="Avg Member Tenancy"
          value="8.4 Mos"
          subtext="Continuous active renewals"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-lg border border-[#2A2A2A] bg-[#161616]">
          <h3 className="font-heading text-lg font-bold uppercase tracking-wider text-[#F2F2F2] mb-1">
            Retention Rate vs Churn Rate Trend (%)
          </h3>
          <p className="text-xs text-[#9A9A9A] mb-4">Past 6 months member loyalty improvements</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={retentionTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" stroke="#666666" tick={{ fill: '#9A9A9A', fontSize: 11 }} />
                <YAxis stroke="#666666" tick={{ fill: '#9A9A9A', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#2A2A2A', borderRadius: '8px', color: '#F2F2F2', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="retention" stroke="#2F9E44" strokeWidth={2.5} name="Retention %" />
                <Line type="monotone" dataKey="churn" stroke="#E03131" strokeWidth={2.5} name="Churn %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-5 rounded-lg border border-[#2A2A2A] bg-[#161616]">
          <h3 className="font-heading text-lg font-bold uppercase tracking-wider text-[#F2F2F2] mb-1">
            Monthly New Joins Acquisition
          </h3>
          <p className="text-xs text-[#9A9A9A] mb-4">New member admissions per calendar month</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenueHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" stroke="#666666" tick={{ fill: '#9A9A9A', fontSize: 11 }} />
                <YAxis stroke="#666666" tick={{ fill: '#9A9A9A', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#2A2A2A', borderRadius: '8px', color: '#F2F2F2', fontSize: '12px' }}
                />
                <Bar dataKey="newJoins" fill="#E8590C" name="New Members" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

