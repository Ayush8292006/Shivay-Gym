import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import { Gift, Copy, Check, Share2, Users } from 'lucide-react';

export default function MemberReferral() {
  const { currentMember, showToast } = useGym();
  const [copied, setCopied] = useState(false);

  const referralCode = `SHIVAY-${currentMember?.id?.replace('SHIV-', '') || 'FIT'}`;
  const referralText = `Train with me at SHIVAY GYM! Use my invite code ${referralCode} to get 15% off + a free workout week, and I get 1 month membership free!`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    showToast('Referral code copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(referralText)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold uppercase tracking-wide text-[#F2F2F2]">
          Refer a Training Partner
        </h1>
        <p className="text-xs text-[#9A9A9A]">
          Give 15% off to friends. Earn 1 month free extension for every enrolled friend.
        </p>
      </div>

      <div className="p-6 rounded-xl border border-[#2A2A2A] bg-gradient-to-br from-[#181818] to-[#121212] text-center space-y-4 shadow-xl">
        <div className="w-14 h-14 rounded-full bg-[#E8590C]/15 border border-[#E8590C]/40 flex items-center justify-center mx-auto text-[#E8590C]">
          <Gift className="w-7 h-7" />
        </div>

        <div>
          <h2 className="font-heading text-xl font-bold uppercase text-[#F2F2F2]">
            Your Exclusive Referral Code
          </h2>
          <p className="text-xs text-[#9A9A9A] mt-1 max-w-sm mx-auto">
            Share with colleagues, friends, or gym buddies. Both of you receive benefits upon registration.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 max-w-xs mx-auto">
          <div className="flex-1 py-2.5 px-4 rounded-lg bg-[#1E1E1E] border border-[#2A2A2A] font-mono text-base font-bold text-[#E8590C] tracking-widest text-center select-all">
            {referralCode}
          </div>
          <button
            onClick={handleCopy}
            className="p-2.5 rounded-lg bg-[#2A2A2A] hover:bg-[#333333] text-[#F2F2F2] transition-colors"
            title="Copy code"
          >
            {copied ? <Check className="w-5 h-5 text-[#2F9E44]" /> : <Copy className="w-5 h-5" />}
          </button>
        </div>

        <button
          onClick={handleShareWhatsApp}
          className="w-full max-w-xs mx-auto py-3 rounded-lg bg-[#2F9E44] hover:bg-[#28883b] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm"
        >
          <Share2 className="w-4 h-4" />
          Share via WhatsApp
        </button>
      </div>

      <div className="p-5 rounded-xl border border-[#2A2A2A] bg-[#161616] space-y-3">
        <h3 className="font-heading text-base font-bold uppercase tracking-wider text-[#F2F2F2]">
          How The Reward Program Works
        </h3>

        <div className="space-y-3 text-xs text-[#9A9A9A]">
          <div className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-[#1E1E1E] text-[#F2F2F2] flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
              1
            </span>
            <span>Send your unique referral code to friends interested in gym fitness.</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-[#1E1E1E] text-[#F2F2F2] flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
              2
            </span>
            <span>Your friend enters this code during enrollment to receive an instant 15% discount.</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-[#1E1E1E] text-[#F2F2F2] flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
              3
            </span>
            <span>Your membership pass is automatically credited with +30 days free extension!</span>
          </div>
        </div>
      </div>
    </div>
  );
}

