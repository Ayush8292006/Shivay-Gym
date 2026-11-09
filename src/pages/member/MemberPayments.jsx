import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import Modal from '../../components/common/Modal';
import { CreditCard, Download, Printer, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function MemberPayments() {
  const { currentMember, payments, plans, renewMember, gymInfo, showToast } = useGym();
  const [renewModalOpen, setRenewModalOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState('PLAN-12M');

  // Filter payments for this member
  const myPayments = payments.filter(
    p => p.memberId === currentMember?.id || p.memberName === currentMember?.name
  );

  const handleRenew = (e) => {
    e.preventDefault();
    const planObj = plans.find(p => p.id === selectedPlanId) || plans[0];
    renewMember(currentMember.id, planObj, planObj.price, 'UPI');
    setRenewModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-[#2A2A2A]">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold uppercase tracking-wide text-[#F2F2F2]">
            Fee History & Receipts
          </h1>
          <p className="text-xs text-[#9A9A9A]">
            Download tax invoices and renew your gym floor access.
          </p>
        </div>

        <button
          onClick={() => setRenewModalOpen(true)}
          className="px-3.5 py-1.5 rounded-lg bg-[#E8590C] hover:bg-[#D04F0A] text-xs font-semibold uppercase tracking-wider text-white transition-colors"
        >
          Renew Pass
        </button>
      </div>

      <div className="p-5 rounded-xl border border-[#2A2A2A] bg-[#161616] space-y-4">
        <h3 className="font-heading text-base font-bold uppercase tracking-wider text-[#F2F2F2]">
          Payment Records ({myPayments.length})
        </h3>

        <div className="divide-y divide-[#242424]">
          {myPayments.length > 0 ? (
            myPayments.map(p => (
              <div key={p.invoiceNumber} className="py-3.5 flex items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-mono font-bold text-[#F2F2F2]">{p.invoiceNumber}</div>
                  <div className="text-[11px] text-[#9A9A9A]">{p.planName} • {p.paymentDate}</div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-bold text-[#F2F2F2]">₹{p.amount.toLocaleString('en-IN')}</div>
                    <span className="text-[10px] text-[#2F9E44]">Paid via {p.paymentMode}</span>
                  </div>
                  <button
                    onClick={() => {
                      showToast(`Downloading invoice ${p.invoiceNumber}...`, 'info');
                      window.print();
                    }}
                    className="p-1.5 rounded bg-[#1E1E1E] hover:bg-[#2A2A2A] border border-[#2A2A2A] text-[#9A9A9A] hover:text-[#F2F2F2]"
                    title="Print receipt"
                  >
                    <Printer className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-xs text-[#9A9A9A]">
              No past payment receipts on file for your member profile.
            </div>
          )}
        </div>
      </div>

      {/* RENEW MODAL */}
      <Modal
        isOpen={renewModalOpen}
        onClose={() => setRenewModalOpen(false)}
        title="Renew Membership Pass"
        subtitle={`Current Active Pass: ${currentMember?.plan}`}
      >
        <form onSubmit={handleRenew} className="space-y-4">
          <div>
            <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Choose Renewal Tier</label>
            <select
              value={selectedPlanId}
              onChange={(e) => setSelectedPlanId(e.target.value)}
              className="w-full px-3 py-2.5 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-sm text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
            >
              {plans.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} — ₹{p.price.toLocaleString('en-IN')} ({p.durationMonths} Mos)
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 bg-[#1A1A1A] rounded border border-[#2A2A2A] text-xs text-[#9A9A9A] flex items-center justify-between">
            <span>Amount Payable via UPI:</span>
            <span className="font-bold text-sm text-[#E8590C]">
              ₹{plans.find(p => p.id === selectedPlanId)?.price.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#2A2A2A]">
            <button
              type="button"
              onClick={() => setRenewModalOpen(false)}
              className="px-4 py-2 text-xs font-medium rounded-lg border border-[#2A2A2A] bg-[#1E1E1E] text-[#9A9A9A]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg bg-[#E8590C] hover:bg-[#D04F0A] text-white transition-colors"
            >
              Pay via UPI & Extend Validity
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

