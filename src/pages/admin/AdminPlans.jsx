import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import { Layers, Plus, CheckCircle2, Edit2 } from 'lucide-react';

export default function AdminPlans() {
  const { plans, addOns, showToast } = useGym();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [planForm, setPlanForm] = useState({ name: '', price: 0, durationMonths: 1, description: '' });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#2A2A2A]">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold uppercase tracking-wide text-[#F2F2F2]">
            Plans, Pricing & Add-Ons
          </h1>
          <p className="text-xs text-[#9A9A9A]">
            Configure recurring membership tiers, personal training packages, and locker/steam fees.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map(p => (
          <div
            key={p.id}
            className={`p-5 rounded-lg border flex flex-col justify-between ${
              p.popular ? 'border-[#E8590C] bg-[#181818]' : 'border-[#2A2A2A] bg-[#161616]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs text-[#E8590C] font-semibold">{p.id}</span>
                {p.badge && <Badge variant="saffron">{p.badge}</Badge>}
              </div>

              <h3 className="font-heading text-xl font-bold uppercase text-[#F2F2F2]">
                {p.name}
              </h3>
              <p className="text-xs text-[#9A9A9A] mt-1 mb-4">
                {p.description}
              </p>

              <div className="mb-4 pb-4 border-b border-[#2A2A2A]">
                <div className="flex items-baseline gap-1">
                  <span className="text-xs text-[#9A9A9A]">₹</span>
                  <span className="font-heading text-3xl font-bold text-[#F2F2F2] tabular-nums">
                    {p.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-[#9A9A9A]">/ {p.durationMonths} Months</span>
                </div>
              </div>

              <ul className="space-y-2 mb-4">
                {p.features?.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs text-[#9A9A9A]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2F9E44] flex-shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => {
                setSelectedPlan(p);
                setPlanForm({
                  name: p.name,
                  price: p.price,
                  durationMonths: p.durationMonths,
                  description: p.description
                });
                setEditModalOpen(true);
              }}
              className="w-full py-2 rounded bg-[#1E1E1E] hover:bg-[#2A2A2A] border border-[#2A2A2A] text-xs font-semibold text-[#F2F2F2] transition-colors"
            >
              Configure Plan Details
            </button>
          </div>
        ))}
      </div>

      {/* Add-Ons Section */}
      <div className="p-5 rounded-lg border border-[#2A2A2A] bg-[#161616]">
        <h3 className="font-heading text-lg font-bold uppercase tracking-wider text-[#F2F2F2] mb-1">
          Gym Floor Add-Ons & Auxiliary Fees
        </h3>
        <p className="text-xs text-[#9A9A9A] mb-4">Recurring lockers, towel service & steam room passes</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {addOns.map(addon => (
            <div key={addon.id} className="p-4 rounded-lg bg-[#1E1E1E] border border-[#2A2A2A]">
              <span className="text-[10px] uppercase tracking-wider text-[#9A9A9A] font-semibold">{addon.id}</span>
              <div className="font-heading text-base font-bold text-[#F2F2F2] mt-0.5">{addon.name}</div>
              <div className="font-heading text-xl font-bold text-[#E8590C] mt-1 tabular-nums">
                ₹{addon.price} <span className="text-xs text-[#9A9A9A] font-sans font-normal">/ {addon.period}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* EDIT PLAN MODAL */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={`Edit Plan: ${selectedPlan?.name}`}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            selectedPlan.price = Number(planForm.price);
            selectedPlan.description = planForm.description;
            setEditModalOpen(false);
            showToast('Plan configuration saved!', 'success');
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Plan Title</label>
            <input
              type="text"
              required
              value={planForm.name}
              onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
              className="w-full px-3 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Fee (₹ INR)</label>
            <input
              type="number"
              required
              value={planForm.price}
              onChange={(e) => setPlanForm({ ...planForm, price: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Description</label>
            <textarea
              rows={2}
              value={planForm.description}
              onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
              className="w-full px-3 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
            />
          </div>
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#2A2A2A]">
            <button
              type="button"
              onClick={() => setEditModalOpen(false)}
              className="px-4 py-2 text-xs font-medium rounded-lg border border-[#2A2A2A] bg-[#1E1E1E] text-[#9A9A9A]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg bg-[#E8590C] hover:bg-[#D04F0A] text-white transition-colors"
            >
              Save Configuration
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

