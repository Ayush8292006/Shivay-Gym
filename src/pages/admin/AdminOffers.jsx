import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import ImageFallback from '../../components/common/ImageFallback';
import { Tag, Plus, Send, TrendingUp, IndianRupee, Calendar } from 'lucide-react';

export default function AdminOffers() {
  const { offers, setOffers, triggerSendMessage, members, formerMembers, showToast } = useGym();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newOffer, setNewOffer] = useState({
    title: '',
    discountType: 'percentage',
    discountValue: 20,
    validFrom: '2024-11-01',
    validTill: '2024-11-30',
    targetAudience: 'All Members',
    planApplicable: 'Yearly Elite Strength',
    description: '',
    bannerImage: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=800&q=80'
  });

  const handleCreateOffer = (e) => {
    e.preventDefault();
    const created = {
      id: `OFF-${Date.now().toString().slice(-5)}`,
      ...newOffer,
      sentCount: 0,
      redeemedCount: 0,
      revenueGenerated: 0,
      status: 'Active'
    };
    setOffers([created, ...offers]);
    setCreateModalOpen(false);
    showToast(`Campaign offer "${created.title}" published!`, 'success');
  };

  const handleBroadcastOffer = (off) => {
    const recipients = off.targetAudience.includes('Former') ? formerMembers : members.slice(0, 20);
    recipients.forEach(m => {
      triggerSendMessage({
        recipientId: m.id,
        recipientName: m.name,
        recipientPhone: m.phone,
        text: `Special Shivay Gym Offer: ${off.title}! Enjoy ${off.discountValue}${off.discountType === 'percentage' ? '%' : ' INR'} discount on ${off.planApplicable}. Valid till ${off.validTill}.`,
        channel: 'WhatsApp',
        automationTitle: `Promo: ${off.title}`
      });
    });

    setOffers(prev => prev.map(o => o.id === off.id ? { ...o, sentCount: (o.sentCount || 0) + recipients.length } : o));
    showToast(`Offer broadcasted to ${recipients.length} recipients!`, 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#2A2A2A]">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold uppercase tracking-wide text-[#F2F2F2]">
            Offers & Campaign Management ({offers.length})
          </h1>
          <p className="text-xs text-[#9A9A9A]">
            Create festival discount vouchers, track redemption counts, and calculate generated revenue.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#E8590C] hover:bg-[#D04F0A] text-xs font-semibold uppercase tracking-wider text-white transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create New Campaign
        </button>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map(off => (
          <div key={off.id} className="rounded-lg border border-[#2A2A2A] bg-[#161616] overflow-hidden flex flex-col justify-between">
            <div>
              <div className="h-40 overflow-hidden relative">
                <ImageFallback
                  src={off.bannerImage}
                  alt={off.title}
                  className="w-full h-full"
                  overlay={true}
                  overlayOpacity="bg-black/40"
                />
                <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
                  <Badge variant={off.status === 'Active' ? 'success' : 'default'}>{off.status}</Badge>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E8590C] text-white">
                    {off.discountValue}{off.discountType === 'percentage' ? '%' : '₹'} OFF
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div>
                  <h3 className="font-heading text-lg font-bold uppercase text-[#F2F2F2]">
                    {off.title}
                  </h3>
                  <p className="text-xs text-[#9A9A9A] line-clamp-2 mt-1">
                    {off.description}
                  </p>
                </div>

                <div className="p-3 bg-[#1A1A1A] rounded border border-[#2A2A2A] grid grid-cols-3 gap-2 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-[#9A9A9A] uppercase">Dispatched</span>
                    <div className="font-heading text-base font-bold text-[#F2F2F2] mt-0.5">{off.sentCount}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#9A9A9A] uppercase">Redeemed</span>
                    <div className="font-heading text-base font-bold text-[#2F9E44] mt-0.5">{off.redeemedCount}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#9A9A9A] uppercase">Revenue</span>
                    <div className="font-heading text-base font-bold text-[#E8590C] mt-0.5">
                      ₹{(off.revenueGenerated / 1000).toFixed(0)}k
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-[#9A9A9A] space-y-1">
                  <div>Target: <span className="text-[#F2F2F2]">{off.targetAudience}</span></div>
                  <div>Valid: <span className="text-[#F2F2F2]">{off.validFrom} to {off.validTill}</span></div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-[#242424] bg-[#121212] flex items-center justify-between">
              <span className="text-[11px] text-[#666666] font-mono">{off.id}</span>
              <button
                onClick={() => handleBroadcastOffer(off)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#E8590C]/15 border border-[#E8590C]/40 hover:bg-[#E8590C] hover:text-white text-xs font-semibold text-[#E8590C] transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                Broadcast via WhatsApp
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE OFFER MODAL */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Launch New Offer Campaign"
      >
        <form onSubmit={handleCreateOffer} className="space-y-4">
          <div>
            <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Offer Title</label>
            <input
              type="text"
              required
              value={newOffer.title}
              onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })}
              placeholder="e.g. New Year Resolution 25% Off"
              className="w-full px-3 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Discount Type</label>
              <select
                value={newOffer.discountType}
                onChange={(e) => setNewOffer({ ...newOffer, discountType: e.target.value })}
                className="w-full px-2.5 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Discount Value</label>
              <input
                type="number"
                required
                value={newOffer.discountValue}
                onChange={(e) => setNewOffer({ ...newOffer, discountValue: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Target Audience</label>
              <select
                value={newOffer.targetAudience}
                onChange={(e) => setNewOffer({ ...newOffer, targetAudience: e.target.value })}
                className="w-full px-2.5 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
              >
                <option>All Active Members</option>
                <option>Former Members Only</option>
                <option>Expiring in 7 Days</option>
                <option>Students with valid ID</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Valid Till Date</label>
              <input
                type="date"
                required
                value={newOffer.validTill}
                onChange={(e) => setNewOffer({ ...newOffer, validTill: e.target.value })}
                className="w-full px-3 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Offer Terms & Description</label>
            <textarea
              rows={2}
              value={newOffer.description}
              onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })}
              placeholder="e.g. Applicable on Half-Yearly and Yearly plans. Includes free shaker bottle."
              className="w-full px-3 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#2A2A2A]">
            <button
              type="button"
              onClick={() => setCreateModalOpen(false)}
              className="px-4 py-2 text-xs font-medium rounded-lg border border-[#2A2A2A] bg-[#1E1E1E] text-[#9A9A9A]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg bg-[#E8590C] hover:bg-[#D04F0A] text-white transition-colors"
            >
              Publish Offer
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

