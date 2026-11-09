import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import DataTable from '../../components/common/DataTable';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { Receipt, Plus, TrendingDown, DollarSign } from 'lucide-react';
import { isoFromToday, currentMonthLabel } from '../../utils/dates';

export default function AdminExpenses() {
  const { expenses, setExpenses, expenseCategories, showToast } = useGym();
  const [addExpenseModal, setAddExpenseModal] = useState(false);

  const [form, setForm] = useState({
    title: '',
    category: 'Electricity & Utilities',
    amount: 15000,
    paidTo: 'Vendor',
    status: 'Paid',
    dueDate: isoFromToday(11)
  });

  const totalMonthlyExpense = expenses.reduce((acc, e) => acc + (Number(e.amount) || 0), 0);

  const handleAddExpense = (e) => {
    e.preventDefault();
    const created = {
      id: `EXP-${Date.now().toString().slice(-4)}`,
      ...form,
      paidDate: form.status === 'Paid' ? new Date().toISOString().split('T')[0] : null
    };
    setExpenses([created, ...expenses]);
    setAddExpenseModal(false);
    showToast(`Expense "${created.title}" recorded!`, 'success');
  };

  const columns = [
    {
      key: 'title',
      label: 'Expense Item',
      render: (row) => (
        <div>
          <div className="font-semibold text-[#F2F2F2]">{row.title}</div>
          <div className="text-[11px] text-[#9A9A9A]">Paid to: {row.paidTo}</div>
        </div>
      )
    },
    {
      key: 'category',
      label: 'Category',
      render: (row) => (
        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#1E1E1E] text-[#9A9A9A] border border-[#2A2A2A]">
          {row.category}
        </span>
      )
    },
    {
      key: 'amount',
      label: 'Amount (INR)',
      render: (row) => (
        <span className="font-mono font-bold text-[#F2F2F2] tabular-nums">
          ₹{Number(row.amount).toLocaleString('en-IN')}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Payment Status',
      render: (row) => <Badge variant={row.status === 'Paid' ? 'success' : 'warning'}>{row.status}</Badge>
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      render: (row) => <span className="font-mono text-xs text-[#9A9A9A]">{row.dueDate}</span>
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#2A2A2A]">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold uppercase tracking-wide text-[#F2F2F2]">
            Operational Expenses & Overhead
          </h1>
          <p className="text-xs text-[#9A9A9A]">
            Rent, staff payroll, electricity utilities, equipment repairs, and P&L ledger.
          </p>
        </div>

        <button
          onClick={() => setAddExpenseModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#E8590C] hover:bg-[#D04F0A] text-xs font-semibold uppercase tracking-wider text-white transition-colors"
        >
          <Plus className="w-4 h-4" />
          Log Expense Voucher
        </button>
      </div>

      {/* P&L Snapshot */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg border border-[#2A2A2A] bg-[#161616]">
          <span className="text-[10px] uppercase text-[#9A9A9A] font-semibold">Total Monthly Expenses</span>
          <div className="font-heading text-3xl font-bold text-[#E03131] tabular-nums mt-0.5">
            ₹{totalMonthlyExpense.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-[#666666]">{currentMonthLabel(true)}</span>
        </div>
        <div className="p-4 rounded-lg border border-[#2A2A2A] bg-[#161616]">
          <span className="text-[10px] uppercase text-[#9A9A9A] font-semibold">Gross Monthly Revenue</span>
          <div className="font-heading text-3xl font-bold text-[#2F9E44] tabular-nums mt-0.5">
            ₹4,95,000
          </div>
          <span className="text-[11px] text-[#2F9E44]">+18% YoY Net Margin</span>
        </div>
        <div className="p-4 rounded-lg border border-[#2A2A2A] bg-[#161616]">
          <span className="text-[10px] uppercase text-[#9A9A9A] font-semibold">Net Operating Profit</span>
          <div className="font-heading text-3xl font-bold text-[#E8590C] tabular-nums mt-0.5">
            ₹{(495000 - totalMonthlyExpense).toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-[#9A9A9A]">Positive cash flow</span>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={expenses}
        searchPlaceholder="Search expenses by title, category, or vendor..."
        filterKey="category"
        filterOptions={[
          { label: 'Rent', value: 'Property Rent' },
          { label: 'Salaries', value: 'Staff Salaries' },
          { label: 'Electricity', value: 'Electricity & Utilities' },
          { label: 'Maintenance', value: 'Equipment Maintenance' }
        ]}
        exportFilename="expenses_ledger.csv"
      />

      {/* ADD EXPENSE MODAL */}
      <Modal
        isOpen={addExpenseModal}
        onClose={() => setAddExpenseModal(false)}
        title="Log Operational Expense"
      >
        <form onSubmit={handleAddExpense} className="space-y-4">
          <div>
            <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Expense Title</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Treadmill Belt Lubricant & Service"
              className="w-full px-3 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-2.5 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
              >
                <option>Property Rent</option>
                <option>Staff Salaries</option>
                <option>Electricity & Utilities</option>
                <option>Equipment Maintenance</option>
                <option>Sanitation & Cleaning Supplies</option>
                <option>Marketing & WhatsApp SMS API</option>
                <option>Other Miscellaneous</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Amount (₹ INR)</label>
              <input
                type="number"
                required
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Paid To / Payee</label>
              <input
                type="text"
                required
                value={form.paidTo}
                onChange={(e) => setForm({ ...form, paidTo: e.target.value })}
                className="w-full px-3 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Payment Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-2.5 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
              >
                <option>Paid</option>
                <option>Pending</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#2A2A2A]">
            <button
              type="button"
              onClick={() => setAddExpenseModal(false)}
              className="px-4 py-2 text-xs font-medium rounded-lg border border-[#2A2A2A] bg-[#1E1E1E] text-[#9A9A9A]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg bg-[#E8590C] hover:bg-[#D04F0A] text-white transition-colors"
            >
              Save Voucher
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

