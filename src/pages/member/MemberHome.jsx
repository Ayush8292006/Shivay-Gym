import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGym } from '../../context/GymContext';
import Avatar from '../../components/common/Avatar';
import Badge from '../../components/common/Badge';
import {
  Flame,
  Droplets,
  Plus,
  Minus,
  Dumbbell,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Gift,
  QrCode,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function MemberHome() {
  const { currentMember, offers, gymInfo } = useGym();
  const navigate = useNavigate();

  // Water tracker local state (glasses of 250ml)
  const [waterGlasses, setWaterGlasses] = useState(6);
  const targetWaterGlasses = 12; // 3 Litres

  // Calculate days left in membership
  const calculateDaysLeft = (expiryDateStr) => {
    if (!expiryDateStr) return 0;
    const diff = new Date(expiryDateStr) - new Date();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const daysLeft = calculateDaysLeft(currentMember?.expiryDate);
  const progressPercent = Math.min(100, Math.max(10, Math.round((daysLeft / 365) * 100)));

  return (
    <div className="space-y-6">
      {/* 1. Motivation Quote Banner */}
      <div className="p-4 rounded-xl border border-[#E8590C]/30 bg-[#E8590C]/10 text-xs text-[#F2F2F2]">
        <div className="flex items-center gap-1.5 text-[#E8590C] font-bold uppercase tracking-wider text-[11px] mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          Today's Floor Mindset
        </div>
        <p className="italic leading-relaxed">
          "The iron never lies to you. 200 pounds is always 200 pounds. Show up for yourself today!"
        </p>
      </div>

      {/* 2. Membership Card with Digital QR & Days Left */}
      <div className="p-5 rounded-xl border border-[#2A2A2A] bg-gradient-to-br from-[#1A1A1A] to-[#141414] shadow-xl relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-[#E8590C]">
              {gymInfo.name} PASS
            </div>
            <h2 className="font-heading text-xl font-bold uppercase text-[#F2F2F2] mt-0.5">
              {currentMember?.plan}
            </h2>
            <div className="text-xs text-[#9A9A9A] font-mono mt-0.5">
              ID: {currentMember?.id} • Coach: {currentMember?.trainer}
            </div>
          </div>

          <Badge variant={currentMember?.status}>{currentMember?.status}</Badge>
        </div>

        {/* Progress bar for plan expiry */}
        <div className="mt-5 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#9A9A9A]">Validity Remaining:</span>
            <span className="font-bold text-[#F2F2F2] font-mono">{daysLeft} Days ({currentMember?.expiryDate})</span>
          </div>
          <div className="w-full bg-[#2A2A2A] h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                daysLeft <= 7 ? 'bg-[#E03131]' : daysLeft <= 20 ? 'bg-[#E8A317]' : 'bg-[#E8590C]'
              }`}
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-[#2A2A2A] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <Flame className="w-4 h-4 text-[#E8590C] fill-[#E8590C]" />
            <span className="font-semibold text-[#F2F2F2]">{currentMember?.attendanceStreak || 0} Day Habit Streak</span>
          </div>
          <button
            onClick={() => navigate('/member/profile')}
            className="text-xs text-[#E8590C] hover:underline font-semibold"
          >
            Digital Pass Details →
          </button>
        </div>
      </div>

      {/* 3. Today's Workout Quick Launcher */}
      <div className="p-5 rounded-xl border border-[#2A2A2A] bg-[#161616]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-[#E8590C]" />
            <h3 className="font-heading text-lg font-bold uppercase tracking-wider text-[#F2F2F2]">
              Today's Workout
            </h3>
          </div>
          <button
            onClick={() => navigate('/member/workout')}
            className="text-xs text-[#E8590C] hover:underline font-medium"
          >
            View Split →
          </button>
        </div>

        <div className="p-3 rounded-lg bg-[#1E1E1E] border border-[#2A2A2A] mb-3">
          <div className="font-semibold text-xs text-[#F2F2F2] mb-1">
            {currentMember?.assignedWorkout || 'Push / Pull / Legs Hypertrophy Split'}
          </div>
          <p className="text-[11px] text-[#9A9A9A]">
            Barbell Bench Press (4x8), Incline Dumbbell (3x10), Overhead Military Press (3x8), Lateral Raises (4x15)
          </p>
        </div>

        <button
          onClick={() => navigate('/member/workout')}
          className="w-full py-2.5 rounded-lg bg-[#E8590C] hover:bg-[#D04F0A] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
        >
          Start Workout & Rest Timer
        </button>
      </div>

      {/* 4. Hydration Water Tracker */}
      <div className="p-5 rounded-xl border border-[#2A2A2A] bg-[#161616]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-[#4DABF7]" />
            <h3 className="font-heading text-lg font-bold uppercase tracking-wider text-[#F2F2F2]">
              Daily Hydration
            </h3>
          </div>
          <span className="font-mono text-xs text-[#4DABF7] font-semibold">
            {(waterGlasses * 0.25).toFixed(1)}L / {(targetWaterGlasses * 0.25).toFixed(1)}L Target
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 bg-[#1E1E1E] h-3 rounded-full overflow-hidden border border-[#2A2A2A]">
            <div
              className="bg-[#4DABF7] h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (waterGlasses / targetWaterGlasses) * 100)}%` }}
            ></div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setWaterGlasses(Math.max(0, waterGlasses - 1))}
              className="w-8 h-8 rounded-lg bg-[#1E1E1E] border border-[#2A2A2A] text-[#9A9A9A] hover:text-[#F2F2F2] flex items-center justify-center"
              aria-label="Decrease water"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-bold text-xs text-[#F2F2F2] w-6 text-center">{waterGlasses}</span>
            <button
              onClick={() => setWaterGlasses(waterGlasses + 1)}
              className="w-8 h-8 rounded-lg bg-[#4DABF7] text-black font-bold flex items-center justify-center hover:bg-[#3b8fd3]"
              aria-label="Add water"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 5. Latest Gym Offers & Announcements */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-base font-bold uppercase tracking-wider text-[#F2F2F2]">
            Latest Gym Announcements
          </h3>
          <span className="text-[11px] text-[#9A9A9A]">Gurugram Floor</span>
        </div>

        {offers.slice(0, 2).map(off => (
          <div key={off.id} className="p-4 rounded-xl border border-[#2A2A2A] bg-[#161616] flex items-center justify-between gap-3">
            <div>
              <div className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-[#E8590C]/15 text-[#E8590C] mb-1">
                {off.discountValue}% Special
              </div>
              <h4 className="font-semibold text-xs text-[#F2F2F2]">{off.title}</h4>
              <p className="text-[11px] text-[#9A9A9A] mt-0.5">{off.description}</p>
            </div>
            <a
              href={`https://wa.me/${gymInfo.whatsapp}?text=Hi%2C%20I%20am%20interested%20in%20claiming%20${encodeURIComponent(off.title)}`}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded bg-[#1E1E1E] hover:bg-[#E8590C] hover:text-white border border-[#2A2A2A] text-xs font-semibold text-[#F2F2F2] whitespace-nowrap transition-colors"
            >
              Claim Offer
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

