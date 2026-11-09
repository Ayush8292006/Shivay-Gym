import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import Avatar from '../../components/common/Avatar';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { User, Phone, Mail, Snowflake, MessageSquare, ShieldCheck, HeartHandshake } from 'lucide-react';

export default function MemberProfile() {
  const { currentMember, freezeMember, showToast } = useGym();

  const [freezeModalOpen, setFreezeModalOpen] = useState(false);
  const [freezeDays, setFreezeDays] = useState(15);
  const [freezeReason, setFreezeReason] = useState('Medical / Travel');

  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleFreezeRequest = (e) => {
    e.preventDefault();
    freezeMember(currentMember.id, Number(freezeDays), freezeReason);
    setFreezeModalOpen(false);
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    setFeedbackSubmitted(true);
    showToast('Feedback submitted directly to Head Coach & Management!', 'success');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold uppercase tracking-wide text-[#F2F2F2]">
          Member Account & Pass Controls
        </h1>
        <p className="text-xs text-[#9A9A9A]">
          Manage your personal details, submit freeze requests, and send floor feedback.
        </p>
      </div>

      {/* Member Details */}
      <div className="p-5 rounded-xl border border-[#2A2A2A] bg-[#161616] space-y-4">
        <div className="flex items-center gap-4">
          <Avatar name={currentMember?.name} size="lg" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading text-xl font-bold uppercase text-[#F2F2F2]">
                {currentMember?.name}
              </h2>
              <Badge variant={currentMember?.status}>{currentMember?.status}</Badge>
            </div>
            <div className="text-xs text-[#9A9A9A] font-mono mt-0.5">
              Member ID: {currentMember?.id}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#242424] text-xs text-[#9A9A9A]">
          <div>
            <span className="text-[#666666]">Contact Number:</span>
            <div className="font-semibold text-[#F2F2F2] mt-0.5">{currentMember?.phone}</div>
          </div>
          <div>
            <span className="text-[#666666]">Email Address:</span>
            <div className="font-semibold text-[#F2F2F2] mt-0.5">{currentMember?.email}</div>
          </div>
          <div>
            <span className="text-[#666666]">Membership Plan:</span>
            <div className="font-semibold text-[#F2F2F2] mt-0.5">{currentMember?.plan}</div>
          </div>
          <div>
            <span className="text-[#666666]">Pass Validity Expiry:</span>
            <div className="font-semibold text-[#E8590C] mt-0.5">{currentMember?.expiryDate}</div>
          </div>
        </div>
      </div>

      {/* Self-Service Membership Freeze Option */}
      <div className="p-5 rounded-xl border border-[#2A2A2A] bg-[#161616] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Snowflake className="w-5 h-5 text-[#4DABF7]" />
            <h3 className="font-heading text-lg font-bold uppercase tracking-wider text-[#F2F2F2]">
              Temporary Membership Freeze
            </h3>
          </div>
          <button
            onClick={() => setFreezeModalOpen(true)}
            className="px-3.5 py-1.5 rounded-lg bg-[#1E1E1E] hover:bg-[#4DABF7] hover:text-black border border-[#2A2A2A] text-xs font-semibold text-[#F2F2F2] transition-colors"
          >
            Request Freeze
          </button>
        </div>
        <p className="text-xs text-[#9A9A9A] leading-relaxed">
          Traveling or recovering from an injury? Half-Yearly and Yearly members can freeze their membership for up to 30 days per calendar year.
        </p>
      </div>

      {/* Feedback / Complaint Box */}
      <div className="p-5 rounded-xl border border-[#2A2A2A] bg-[#161616] space-y-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-[#E8590C]" />
          <h3 className="font-heading text-lg font-bold uppercase tracking-wider text-[#F2F2F2]">
            Feedback & Suggestion Box
          </h3>
        </div>
        <p className="text-xs text-[#9A9A9A]">
          Equipment requests, sanitation notes, or coaching reviews go directly to gym ownership.
        </p>

        {feedbackSubmitted ? (
          <div className="p-4 rounded-lg bg-[#142918] border border-[#2F9E44]/40 text-xs text-[#2F9E44]">
            Thank you! Your feedback has been forwarded to gym management. We strive for relentless improvement.
          </div>
        ) : (
          <form onSubmit={handleFeedbackSubmit} className="space-y-3">
            <textarea
              rows={3}
              required
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Tell us what we can improve on the floor..."
              className="w-full px-3 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
            />
            <button
              type="submit"
              className="py-2 px-4 rounded bg-[#E8590C] hover:bg-[#D04F0A] text-white text-xs font-semibold uppercase tracking-wider"
            >
              Submit Feedback
            </button>
          </form>
        )}
      </div>

      {/* FREEZE MODAL */}
      <Modal
        isOpen={freezeModalOpen}
        onClose={() => setFreezeModalOpen(false)}
        title="Submit Membership Freeze"
      >
        <form onSubmit={handleFreezeRequest} className="space-y-4">
          <div>
            <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Freeze Period</label>
            <select
              value={freezeDays}
              onChange={(e) => setFreezeDays(e.target.value)}
              className="w-full px-3 py-2.5 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-sm text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
            >
              <option value="7">7 Days Pause</option>
              <option value="15">15 Days Pause</option>
              <option value="30">30 Days Pause</option>
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Reason</label>
            <input
              type="text"
              required
              value={freezeReason}
              onChange={(e) => setFreezeReason(e.target.value)}
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
              className="px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg bg-[#4DABF7] text-black font-bold"
            >
              Confirm Freeze
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

