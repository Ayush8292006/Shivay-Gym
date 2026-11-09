import React, { useState, useEffect } from 'react';
import { useGym } from '../../context/GymContext';
import { isValidWhatsAppNumber } from '../../services/whatsapp';
import { Bell, MessageCircle, Smartphone, Check, CheckCheck, Clock, AlertCircle } from 'lucide-react';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'offers', label: 'Offers', match: /offer|off |discount|promo|win-back|rejoin/i },
  { id: 'reminders', label: 'Reminders', match: /expir|renew|due|pending|reminder|session/i },
  { id: 'wishes', label: 'Wishes', match: /happy|wishes|birthday|anniversary|diwali|holi|eid|christmas|independence|republic|good morning|शुभ/i }
];

function StatusTick({ status }) {
  const s = String(status || '').toLowerCase();
  if (s === 'read') return <span className="flex items-center gap-1 text-[#4DABF7]"><CheckCheck className="w-3.5 h-3.5" />Read</span>;
  if (s === 'delivered') return <span className="flex items-center gap-1 text-[#9A9A9A]"><CheckCheck className="w-3.5 h-3.5" />Delivered</span>;
  if (s === 'failed') return <span className="flex items-center gap-1 text-[#E03131]"><AlertCircle className="w-3.5 h-3.5" />Not delivered</span>;
  if (s === 'queued' || s === 'sending') return <span className="flex items-center gap-1 text-[#9A9A9A]"><Clock className="w-3.5 h-3.5" />Sending</span>;
  return <span className="flex items-center gap-1 text-[#9A9A9A]"><Check className="w-3.5 h-3.5" />Sent</span>;
}

export default function MemberNotifications() {
  const { currentMember, updateMember } = useGym();
  const [filter, setFilter] = useState('all');
  const [phone, setPhone] = useState(currentMember?.phone || '');

  useEffect(() => setPhone(currentMember?.phone || ''), [currentMember?.id]);

  const messages = currentMember?.messageHistory || [];
  const active = FILTERS.find((f) => f.id === filter);
  const shown = active?.match ? messages.filter((m) => active.match.test(`${m.title || ''} ${m.text}`)) : messages;
  const optIn = currentMember?.whatsappOptIn !== false;
  const lang = currentMember?.preferredLanguage || 'en';

  const savePrefs = (fields) => updateMember(currentMember.id, fields);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold uppercase tracking-wide text-[#F2F2F2]">
          Notifications
        </h1>
        <p className="text-xs text-[#9A9A9A]">
          Offers, reminders and wishes from Shivay Gym. Everything here is also sent to your WhatsApp.
        </p>
      </div>

      {/* WhatsApp preferences */}
      <div className="p-4 rounded-xl border border-[#2A2A2A] bg-[#161616] space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#142918] border border-[#2F9E44]/40 flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-4 h-4 text-[#2F9E44]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#F2F2F2]">Get updates on WhatsApp</p>
              <p className="text-[11px] text-[#9A9A9A] leading-relaxed">
                Membership reminders, offers, good morning messages and festival wishes.
              </p>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={optIn}
            aria-label="WhatsApp notifications"
            onClick={() => savePrefs({ whatsappOptIn: !optIn })}
            className={`relative w-11 h-6 rounded-full flex-shrink-0 transition-colors ${optIn ? 'bg-[#2F9E44]' : 'bg-[#3A3A3A]'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${optIn ? 'translate-x-5' : ''}`} />
          </button>
        </div>

        {optIn && (
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-2 items-end">
            <div>
              <label className="block text-[10px] uppercase font-medium text-[#9A9A9A] mb-1">WhatsApp number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-[#1E1E1E] border border-[#2A2A2A] text-sm text-[#F2F2F2] font-mono focus:border-[#2F9E44] focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-1 bg-[#1E1E1E] p-1 rounded-lg border border-[#2A2A2A] h-[42px]">
              {[['en', 'English'], ['hi', 'हिन्दी']].map(([v, l]) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => savePrefs({ preferredLanguage: v })}
                  className={`px-3 h-full rounded text-xs font-semibold ${lang === v ? 'bg-[#2F9E44] text-white' : 'text-[#9A9A9A]'}`}
                >
                  {l}
                </button>
              ))}
            </div>
            <button
              type="button"
              disabled={!isValidWhatsAppNumber(phone) || phone === currentMember.phone}
              onClick={() => savePrefs({ phone: phone.trim() })}
              className="h-[42px] px-4 rounded-lg bg-[#2F9E44] hover:bg-[#278A3A] disabled:opacity-40 text-xs font-semibold uppercase tracking-wider text-white"
            >
              Save number
            </button>
          </div>
        )}
        {!optIn && (
          <p className="text-[11px] text-[#9A9A9A] flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5" />
            WhatsApp is off. You'll still see every update here in the app.
          </p>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-colors ${
              filter === f.id ? 'bg-[#E8590C] border-[#E8590C] text-white' : 'border-[#2A2A2A] text-[#9A9A9A] hover:text-[#F2F2F2]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {shown.length > 0 ? (
          shown.map((m, idx) => (
            <div key={m.id || idx} className="p-4 rounded-xl border border-[#2A2A2A] bg-[#161616] space-y-2">
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="font-semibold text-[#F2F2F2] truncate">{m.title || 'Shivay Gym'}</span>
                <span className="text-[11px] font-mono text-[#666666] whitespace-nowrap">{m.date}</span>
              </div>
              <p className="text-[13px] text-[#E2E2E2] leading-relaxed whitespace-pre-line">{m.text}</p>
              <div className="flex items-center justify-between text-[11px] pt-1">
                <span className={`flex items-center gap-1 ${m.channel === 'WhatsApp' ? 'text-[#2F9E44]' : 'text-[#9A9A9A]'}`}>
                  {m.channel === 'WhatsApp' ? <MessageCircle className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
                  {m.channel === 'WhatsApp' ? 'WhatsApp' : 'In app'}
                </span>
                {m.channel === 'WhatsApp' && <StatusTick status={m.status} />}
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 rounded-xl border border-[#2A2A2A] bg-[#161616] text-center text-xs text-[#9A9A9A]">
            <Bell className="w-8 h-8 text-[#666666] mx-auto mb-2" />
            {filter === 'all'
              ? 'No notifications yet. Good morning messages, reminders and offers will appear here.'
              : 'Nothing in this category yet.'}
          </div>
        )}
      </div>
    </div>
  );
}
