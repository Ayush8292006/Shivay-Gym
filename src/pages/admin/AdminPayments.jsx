import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import DataTable from '../../components/common/DataTable';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import {
  CreditCard,
  Plus,
  Printer,
  Download,
  IndianRupee,
  Receipt,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function AdminPayments() {
  const {
    payments,
    members,
    recordManualPayment,
    gymInfo,
    showToast
  } = useGym();

  const [recordModalOpen, setRecordModalOpen] = useState(false);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const [paymentForm, setPaymentForm] = useState({
    memberId: members[0]?.id || 'SHIV-1001',
    planName: 'Yearly Elite Strength',
    amount: 18999,
    paymentMode: 'UPI',
    notes: 'Annual Membership Renewal'
  });

  const handleRecordSubmit = (e) => {
    e.preventDefault();
    const mem = members.find(m => m.id === paymentForm.memberId);
    if (!mem) return;

    const createdPayment = recordManualPayment({
      memberId: mem.id,
      memberName: mem.name,
      planName: paymentForm.planName,
      amount: paymentForm.amount,
      paymentMode: paymentForm.paymentMode,
      notes: paymentForm.notes
    });

    setRecordModalOpen(false);
    setSelectedInvoice(createdPayment);
    setInvoiceModalOpen(true);
  };

  const handlePrint = () => {
    window.print();
  };

  // Dues list
  const pendingDuesList = members.filter(m => m.duesPending > 0);
  const totalDues = pendingDuesList.reduce((acc, m) => acc + (m.duesPending || 0), 0);

  const columns = [
    {
      key: 'invoiceNumber',
      label: 'Invoice #',
      render: (row) => (
        <span className="font-mono font-bold text-[#F2F2F2] hover:text-[#E8590C] cursor-pointer">
          {row.invoiceNumber}
        </span>
      )
    },
    {
      key: 'memberName',
      label: 'Member',
      render: (row) => (
        <div>
          <div className="font-semibold text-[#F2F2F2]">{row.memberName}</div>
          <div className="text-[11px] text-[#9A9A9A] font-mono">{row.memberId}</div>
        </div>
      )
    },
    {
      key: 'planName',
      label: 'Plan / Description',
      render: (row) => <span className="text-xs text-[#9A9A9A]">{row.planName}</span>
    },
    {
      key: 'paymentDate',
      label: 'Date',
      render: (row) => <span className="text-xs font-mono text-[#9A9A9A]">{row.paymentDate}</span>
    },
    {
      key: 'paymentMode',
      label: 'Mode',
      render: (row) => (
        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#1E1E1E] text-[#F2F2F2] border border-[#2A2A2A]">
          {row.paymentMode}
        </span>
      )
    },
    {
      key: 'amount',
      label: 'Total Paid (INR)',
      render: (row) => (
        <div className="text-xs">
          <span className="font-bold text-[#F2F2F2] tabular-nums">₹{Number(row.amount).toLocaleString('en-IN')}</span>
          <div className="text-[10px] text-[#666666]">Base: ₹{Math.round(row.baseAmount)} • GST: ₹{Math.round(row.gstAmount)}</div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <Badge variant={row.status === 'Completed' ? 'success' : 'warning'}>{row.status}</Badge>
    },
    {
      label: 'Receipt',
      sortable: false,
      render: (row) => (
        <button
          onClick={() => {
            setSelectedInvoice(row);
            setInvoiceModalOpen(true);
          }}
          className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#1E1E1E] hover:bg-[#E8590C] hover:text-white border border-[#2A2A2A] text-xs font-medium text-[#F2F2F2] transition-colors"
        >
          <Printer className="w-3 h-3" />
          Print
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#2A2A2A]">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold uppercase tracking-wide text-[#F2F2F2]">
            Fee Collections & GST Billing
          </h1>
          <p className="text-xs text-[#9A9A9A]">
            Official tax invoices, UPI/card payment reconciliation, and pending balance follow-ups.
          </p>
        </div>

        <button
          onClick={() => setRecordModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#E8590C] hover:bg-[#D04F0A] text-xs font-semibold uppercase tracking-wider text-white transition-colors"
        >
          <Plus className="w-4 h-4" />
          Record New Payment
        </button>
      </div>

      {/* Dues Alert Banner */}
      {pendingDuesList.length > 0 && (
        <div className="p-4 rounded-lg border border-[#E8A317]/40 bg-[#E8A317]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-[#E8A317] flex-shrink-0" />
            <div>
              <span className="font-semibold text-[#F2F2F2]">
                Outstanding Balance Alert:
              </span>{' '}
              <span className="text-[#9A9A9A]">
                ₹{totalDues.toLocaleString('en-IN')} pending across {pendingDuesList.length} members.
              </span>
            </div>
          </div>
          <span className="text-[11px] text-[#E8A317] font-semibold">
            Automated SMS & WhatsApp due notices dispatched
          </span>
        </div>
      )}

      {/* Main Data Table */}
      <DataTable
        columns={columns}
        data={payments}
        searchPlaceholder="Search invoices by number, member name, or payment mode..."
        filterKey="paymentMode"
        filterOptions={[
          { label: 'UPI', value: 'UPI' },
          { label: 'Credit Card', value: 'Credit Card' },
          { label: 'Cash', value: 'Cash' },
          { label: 'Net Banking', value: 'Net Banking' }
        ]}
        onRowClick={(row) => {
          setSelectedInvoice(row);
          setInvoiceModalOpen(true);
        }}
        exportFilename="shivay_gym_invoices.csv"
      />

      {/* RECORD PAYMENT MODAL */}
      <Modal
        isOpen={recordModalOpen}
        onClose={() => setRecordModalOpen(false)}
        title="Record Member Payment"
        subtitle="Generates printable GST invoice with 18% SAC 999723 tax breakdown"
      >
        <form onSubmit={handleRecordSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Select Member</label>
            <select
              value={paymentForm.memberId}
              onChange={(e) => setPaymentForm({ ...paymentForm, memberId: e.target.value })}
              className="w-full px-3 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
            >
              {members.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.id}) {m.duesPending > 0 ? `• Dues: ₹${m.duesPending}` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Amount Paid (₹ INR)</label>
              <input
                type="number"
                required
                value={paymentForm.amount}
                onChange={(e) => setPaymentForm({ ...paymentForm, amount: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Payment Mode</label>
              <select
                value={paymentForm.paymentMode}
                onChange={(e) => setPaymentForm({ ...paymentForm, paymentMode: e.target.value })}
                className="w-full px-2.5 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
              >
                <option>UPI</option>
                <option>Credit Card</option>
                <option>Debit Card</option>
                <option>Cash</option>
                <option>Net Banking</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Plan / Reason</label>
            <input
              type="text"
              required
              value={paymentForm.planName}
              onChange={(e) => setPaymentForm({ ...paymentForm, planName: e.target.value })}
              placeholder="e.g. Half-Yearly Builder + Locker Deposit"
              className="w-full px-3 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Receipt Notes / Reference</label>
            <input
              type="text"
              value={paymentForm.notes}
              onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
              placeholder="e.g. GPay UTR 492193810291"
              className="w-full px-3 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#2A2A2A]">
            <button
              type="button"
              onClick={() => setRecordModalOpen(false)}
              className="px-4 py-2 text-xs font-medium rounded-lg border border-[#2A2A2A] bg-[#1E1E1E] text-[#9A9A9A]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg bg-[#E8590C] hover:bg-[#D04F0A] text-white transition-colors"
            >
              Save & Print Receipt
            </button>
          </div>
        </form>
      </Modal>

      {/* PRINTABLE GST INVOICE MODAL */}
      <Modal
        isOpen={invoiceModalOpen}
        onClose={() => setInvoiceModalOpen(false)}
        title="Tax Invoice / Payment Receipt"
        maxWidth="max-w-xl"
      >
        {selectedInvoice && (
          <div className="space-y-6 text-xs text-[#F2F2F2]">
            {/* Header of Printable Bill */}
            <div className="flex items-start justify-between pb-4 border-b border-[#2A2A2A]">
              <div>
                <div className="font-heading text-xl font-bold uppercase tracking-wider text-[#E8590C]">
                  SHIVAY GYM
                </div>
                <div className="text-[11px] text-[#9A9A9A]">{gymInfo.address}</div>
                <div className="text-[10px] text-[#666666] font-mono mt-0.5">GSTIN: {gymInfo.gstNumber} • SAC Code: 999723</div>
              </div>
              <div className="text-right">
                <div className="font-mono font-bold text-sm text-[#F2F2F2]">{selectedInvoice.invoiceNumber}</div>
                <div className="text-[11px] text-[#9A9A9A]">{selectedInvoice.paymentDate}</div>
              </div>
            </div>

            {/* Billed To */}
            <div className="grid grid-cols-2 gap-4 p-3 bg-[#1A1A1A] rounded border border-[#2A2A2A]">
              <div>
                <span className="text-[10px] text-[#666666] uppercase">Billed To:</span>
                <div className="font-semibold text-sm text-[#F2F2F2]">{selectedInvoice.memberName}</div>
                <div className="text-[11px] text-[#9A9A9A] font-mono">Member ID: {selectedInvoice.memberId}</div>
              </div>
              <div>
                <span className="text-[10px] text-[#666666] uppercase">Payment Mode & Ref:</span>
                <div className="font-semibold text-xs text-[#F2F2F2]">{selectedInvoice.paymentMode}</div>
                <div className="text-[11px] text-[#9A9A9A] font-mono">{selectedInvoice.transactionRef || 'N/A'}</div>
              </div>
            </div>

            {/* Line items table */}
            <table className="w-full text-left border-collapse border border-[#2A2A2A]">
              <thead>
                <tr className="bg-[#1E1E1E] border-b border-[#2A2A2A] text-[#9A9A9A] text-[11px]">
                  <th className="p-2.5">Item Description</th>
                  <th className="p-2.5 text-right">Taxable Value</th>
                  <th className="p-2.5 text-right">GST (18%)</th>
                  <th className="p-2.5 text-right">Total Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2.5 font-medium">{selectedInvoice.planName}</td>
                  <td className="p-2.5 text-right font-mono">₹{Math.round(selectedInvoice.baseAmount).toLocaleString('en-IN')}</td>
                  <td className="p-2.5 text-right font-mono">₹{Math.round(selectedInvoice.gstAmount).toLocaleString('en-IN')}</td>
                  <td className="p-2.5 text-right font-mono font-bold text-[#E8590C]">
                    ₹{Number(selectedInvoice.amount).toLocaleString('en-IN')}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="text-[11px] text-[#666666] text-center border-t border-[#2A2A2A] pt-3">
              This is a computer-generated tax invoice issued by Shivay Gym. Membership fees are non-refundable.
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setInvoiceModalOpen(false)}
                className="px-4 py-2 text-xs font-medium rounded-lg border border-[#2A2A2A] bg-[#1E1E1E] text-[#9A9A9A]"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg bg-[#E8590C] hover:bg-[#D04F0A] text-white transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                Print / Save PDF
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

