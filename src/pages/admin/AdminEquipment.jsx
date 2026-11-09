import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import DataTable from '../../components/common/DataTable';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { Dumbbell, Package, Plus, Wrench, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function AdminEquipment() {
  const { equipment, supplements, setEquipment, setSupplements, showToast } = useGym();
  const [activeTab, setActiveTab] = useState('equipment'); // 'equipment' or 'supplements'

  const equipColumns = [
    {
      key: 'name',
      label: 'Equipment Unit',
      render: (row) => (
        <div>
          <div className="font-semibold text-[#F2F2F2]">{row.name}</div>
          <div className="text-[11px] text-[#9A9A9A] font-mono">{row.brand} • {row.id}</div>
        </div>
      )
    },
    {
      key: 'category',
      label: 'Zone / Category',
      render: (row) => (
        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#1E1E1E] text-[#F2F2F2] border border-[#2A2A2A]">
          {row.category}
        </span>
      )
    },
    {
      key: 'lastServiceDate',
      label: 'Last Serviced',
      render: (row) => <span className="text-xs font-mono text-[#9A9A9A]">{row.lastServiceDate}</span>
    },
    {
      key: 'nextServiceDate',
      label: 'Next Scheduled Inspection',
      render: (row) => <span className="text-xs font-mono text-[#E8590C] font-semibold">{row.nextServiceDate}</span>
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <Badge variant={row.status === 'Operational' ? 'success' : 'warning'}>{row.status}</Badge>
    },
    {
      key: 'condition',
      label: 'Condition & Notes',
      render: (row) => <span className="text-xs text-[#9A9A9A]">{row.condition}</span>
    }
  ];

  const suppColumns = [
    {
      key: 'name',
      label: 'Item / Supplement',
      render: (row) => (
        <div>
          <div className="font-semibold text-[#F2F2F2]">{row.name}</div>
          <div className="text-[11px] text-[#9A9A9A] font-mono">{row.id}</div>
        </div>
      )
    },
    {
      key: 'category',
      label: 'Category',
      render: (row) => <Badge variant="saffron">{row.category}</Badge>
    },
    {
      key: 'costPrice',
      label: 'Cost (INR)',
      render: (row) => <span className="font-mono text-xs text-[#9A9A9A]">₹{row.costPrice}</span>
    },
    {
      key: 'sellingPrice',
      label: 'MRP Price',
      render: (row) => <span className="font-mono font-bold text-xs text-[#F2F2F2]">₹{row.sellingPrice}</span>
    },
    {
      key: 'stockQty',
      label: 'In Stock',
      render: (row) => (
        <span className={`font-mono font-bold text-xs ${row.stockQty <= row.reorderLevel ? 'text-[#E03131]' : 'text-[#2F9E44]'}`}>
          {row.stockQty} units {row.stockQty <= row.reorderLevel && '(Low)'}
        </span>
      )
    },
    {
      key: 'salesThisMonth',
      label: 'Sales (Nov)',
      render: (row) => (
        <div className="text-xs">
          <span className="font-semibold text-[#F2F2F2]">{row.salesThisMonth} sold</span>
          <div className="text-[10px] text-[#2F9E44]">Profit: ₹{((row.sellingPrice - row.costPrice) * row.salesThisMonth).toLocaleString('en-IN')}</div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#2A2A2A]">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold uppercase tracking-wide text-[#F2F2F2]">
            Equipment Maintenance & Supplement Inventory
          </h1>
          <p className="text-xs text-[#9A9A9A]">
            Track machinery servicing dates, cable checks, and front-desk protein supplement retail sales.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#2A2A2A] pb-2 text-xs">
        <button
          onClick={() => setActiveTab('equipment')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-medium transition-colors ${
            activeTab === 'equipment' ? 'bg-[#E8590C] text-white' : 'text-[#9A9A9A] hover:text-[#F2F2F2]'
          }`}
        >
          <Dumbbell className="w-3.5 h-3.5" />
          Heavy Equipment & Racks ({equipment.length})
        </button>
        <button
          onClick={() => setActiveTab('supplements')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-medium transition-colors ${
            activeTab === 'supplements' ? 'bg-[#E8590C] text-white' : 'text-[#9A9A9A] hover:text-[#F2F2F2]'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          Supplement Stock & Merch ({supplements.length})
        </button>
      </div>

      {activeTab === 'equipment' ? (
        <DataTable
          columns={equipColumns}
          data={equipment}
          searchPlaceholder="Search equipment by name, category, or brand..."
          filterKey="status"
          filterOptions={[
            { label: 'Operational', value: 'Operational' },
            { label: 'Needs Inspection', value: 'Needs Inspection' }
          ]}
          exportFilename="equipment_service_log.csv"
        />
      ) : (
        <DataTable
          columns={suppColumns}
          data={supplements}
          searchPlaceholder="Search supplements, proteins, peanut butter..."
          filterKey="category"
          filterOptions={[
            { label: 'Whey Protein', value: 'Whey Protein' },
            { label: 'Performance', value: 'Performance' },
            { label: 'Merchandise', value: 'Merchandise' }
          ]}
          exportFilename="supplement_stock.csv"
        />
      )}
    </div>
  );
}

