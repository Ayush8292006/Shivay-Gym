import React from 'react';
import { useGym } from '../../context/GymContext';
import { Bell, Sparkles, Clock, MessageSquare } from 'lucide-react';

export default function MemberNotifications() {
  const { currentMember } = useGym();

  const messages = currentMember?.messageHistory || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold uppercase tracking-wide text-[#F2F2F2]">
          Gym Notifications & Notices
        </h1>
        <p className="text-xs text-[#9A9A9A]">
          Direct dispatches from Shivay Gym head coach and automated motivation.
        </p>
      </div>

      <div className="space-y-3">
        {messages.length > 0 ? (
          messages.map((m, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-[#2A2A2A] bg-[#161616] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#E8590C] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  {m.channel || 'Gym Broadcast'}
                </span>
                <span className="text-[11px] font-mono text-[#666666]">{m.date}</span>
              </div>
              <p className="text-xs text-[#E2E2E2] leading-relaxed bg-[#1E1E1E] p-3 rounded-lg border border-[#242424]">
                {m.text}
              </p>
            </div>
          ))
        ) : (
          <div className="p-8 rounded-xl border border-[#2A2A2A] bg-[#161616] text-center text-xs text-[#9A9A9A]">
            <Bell className="w-8 h-8 text-[#666666] mx-auto mb-2" />
            Your notification inbox is clean. Daily morning quotes and expiry notices will appear here.
          </div>
        )}
      </div>
    </div>
  );
}

