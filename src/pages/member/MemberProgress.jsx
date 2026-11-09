import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import { TrendingUp, Award, Plus, Calendar } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function MemberProgress() {
  const { currentMember, showToast } = useGym();

  const [weightLogs, setWeightLogs] = useState([
    { date: '01 Jun', weight: (currentMember?.measurements?.weight || 75) + 3.4 },
    { date: '15 Jul', weight: (currentMember?.measurements?.weight || 75) + 2.1 },
    { date: '01 Sep', weight: (currentMember?.measurements?.weight || 75) + 1.0 },
    { date: '15 Oct', weight: (currentMember?.measurements?.weight || 75) + 0.3 },
    { date: 'Today', weight: currentMember?.measurements?.weight || 75 }
  ]);

  const [personalRecords, setPersonalRecords] = useState([
    { lift: 'Barbell Flat Bench Press', weight: '110 kg', date: '28 Oct 2024' },
    { lift: 'Barbell Back Squat', weight: '145 kg', date: '15 Oct 2024' },
    { lift: 'Conventional Deadlift', weight: '185 kg', date: '04 Nov 2024' },
    { lift: 'Standing Military Press', weight: '65 kg', date: '22 Sep 2024' },
  ]);

  const [newLogWeight, setNewLogWeight] = useState('');

  const handleAddWeight = (e) => {
    e.preventDefault();
    if (!newLogWeight) return;
    setWeightLogs([...weightLogs, { date: 'New', weight: Number(newLogWeight) }]);
    setNewLogWeight('');
    showToast('New weigh-in entry logged!', 'success');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold uppercase tracking-wide text-[#F2F2F2]">
          Progress & Personal Bests
        </h1>
        <p className="text-xs text-[#9A9A9A]">
          Track weekly weigh-ins, body measurement inches, and gym compound PRs.
        </p>
      </div>

      {/* Body Measurements Card */}
      <div className="p-5 rounded-xl border border-[#2A2A2A] bg-[#161616] space-y-4">
        <h3 className="font-heading text-base font-bold uppercase tracking-wider text-[#F2F2F2]">
          Current Body Measurements
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 bg-[#1E1E1E] rounded-lg border border-[#2A2A2A]">
            <span className="text-[10px] uppercase text-[#9A9A9A] font-semibold">Body Fat %</span>
            <div className="font-heading text-2xl font-bold text-[#E8590C] mt-0.5">
              {currentMember?.measurements?.bodyFat || 15.5}%
            </div>
          </div>
          <div className="p-3 bg-[#1E1E1E] rounded-lg border border-[#2A2A2A]">
            <span className="text-[10px] uppercase text-[#9A9A9A] font-semibold">Chest</span>
            <div className="font-heading text-2xl font-bold text-[#F2F2F2] mt-0.5">
              {currentMember?.measurements?.chest || 41} in
            </div>
          </div>
          <div className="p-3 bg-[#1E1E1E] rounded-lg border border-[#2A2A2A]">
            <span className="text-[10px] uppercase text-[#9A9A9A] font-semibold">Waist</span>
            <div className="font-heading text-2xl font-bold text-[#F2F2F2] mt-0.5">
              {currentMember?.measurements?.waist || 32} in
            </div>
          </div>
          <div className="p-3 bg-[#1E1E1E] rounded-lg border border-[#2A2A2A]">
            <span className="text-[10px] uppercase text-[#9A9A9A] font-semibold">Arms</span>
            <div className="font-heading text-2xl font-bold text-[#F2F2F2] mt-0.5">
              {currentMember?.measurements?.arms || 15.5} in
            </div>
          </div>
        </div>
      </div>

      {/* Weight Chart */}
      <div className="p-5 rounded-xl border border-[#2A2A2A] bg-[#161616] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading text-base font-bold uppercase tracking-wider text-[#F2F2F2]">
              Bodyweight Trend (kg)
            </h3>
            <p className="text-xs text-[#9A9A9A]">Consistent downward fat loss trajectory</p>
          </div>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weightLogs} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="date" stroke="#666666" tick={{ fill: '#9A9A9A', fontSize: 11 }} />
              <YAxis domain={['dataMin - 1', 'dataMax + 1']} stroke="#666666" tick={{ fill: '#9A9A9A', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#2A2A2A', borderRadius: '8px', color: '#F2F2F2', fontSize: '12px' }}
                formatter={(val) => [`${val} kg`, 'Weight']}
              />
              <Line type="monotone" dataKey="weight" stroke="#E8590C" strokeWidth={2.5} dot={{ fill: '#E8590C', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Log Weigh-in Input */}
        <form onSubmit={handleAddWeight} className="flex gap-2 pt-2 border-t border-[#242424]">
          <input
            type="number"
            step="0.1"
            required
            value={newLogWeight}
            onChange={(e) => setNewLogWeight(e.target.value)}
            placeholder="Log today's morning weight (kg)..."
            className="flex-1 px-3 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded bg-[#E8590C] hover:bg-[#D04F0A] text-white text-xs font-semibold uppercase tracking-wider"
          >
            Record
          </button>
        </form>
      </div>

      {/* Personal Records */}
      <div className="p-5 rounded-xl border border-[#2A2A2A] bg-[#161616] space-y-4">
        <div className="flex items-center gap-2 text-[#E8590C]">
          <Award className="w-5 h-5" />
          <h3 className="font-heading text-base font-bold uppercase tracking-wider text-[#F2F2F2]">
            Compound Personal Records (PR)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {personalRecords.map((pr, idx) => (
            <div key={idx} className="p-3.5 rounded-lg bg-[#1E1E1E] border border-[#2A2A2A] flex items-center justify-between">
              <div>
                <div className="font-semibold text-xs text-[#F2F2F2]">{pr.lift}</div>
                <div className="text-[10px] text-[#9A9A9A]">{pr.date}</div>
              </div>
              <span className="font-heading text-xl font-bold text-[#E8590C] tabular-nums">
                {pr.weight}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

