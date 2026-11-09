import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import ThemeToggle from '../../components/common/ThemeToggle';
import WhatsAppSettings from '../../components/admin/WhatsAppSettings';
import { Settings, Save, RotateCcw, Building, Phone, Clock, ShieldCheck } from 'lucide-react';

export default function AdminSettings() {
  const { gymInfo, theme, toggleTheme, resetToDemoData, showToast } = useGym();

  const [form, setForm] = useState({
    name: gymInfo.name,
    tagline: gymInfo.tagline,
    phone: gymInfo.phone,
    whatsapp: gymInfo.whatsapp,
    email: gymInfo.email,
    address: gymInfo.address,
    weekdays: gymInfo.timings.weekdays,
    sundays: gymInfo.timings.sundays,
    gstNumber: gymInfo.gstNumber
  });

  const handleSave = (e) => {
    e.preventDefault();
    gymInfo.name = form.name;
    gymInfo.phone = form.phone;
    gymInfo.address = form.address;
    gymInfo.timings.weekdays = form.weekdays;
    gymInfo.timings.sundays = form.sundays;
    showToast('Gym configuration settings saved!', 'success');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#2A2A2A]">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold uppercase tracking-wide text-[#F2F2F2]">
            Facility & System Settings
          </h1>
          <p className="text-xs text-[#9A9A9A]">
            Official business profile, opening hours, WhatsApp integration, and data controls.
          </p>
        </div>

        <button
          onClick={resetToDemoData}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#2A2A2A] bg-[#161616] hover:bg-[#E8590C]/15 hover:text-[#E8590C] hover:border-[#E8590C]/40 text-xs text-[#9A9A9A] transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset All Prototype Data
        </button>
      </div>

      <WhatsAppSettings />

      <form onSubmit={handleSave} className="space-y-6">
        {/* Business Info */}
        <div className="p-5 rounded-lg border border-[#2A2A2A] bg-[#161616] space-y-4">
          <h2 className="font-heading text-base font-bold uppercase tracking-wider text-[#F2F2F2] flex items-center gap-2">
            <Building className="w-4 h-4 text-[#E8590C]" />
            Gym Identity & Contact
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Gym Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Tagline</label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                className="w-full px-3 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Phone Number</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">WhatsApp Business #</label>
              <input
                type="text"
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                className="w-full px-3 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">GSTIN Number</label>
              <input
                type="text"
                value={form.gstNumber}
                onChange={(e) => setForm({ ...form, gstNumber: e.target.value })}
                className="w-full px-3 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Physical Address</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full px-3 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
            />
          </div>
        </div>

        {/* Operating Hours */}
        <div className="p-5 rounded-lg border border-[#2A2A2A] bg-[#161616] space-y-4">
          <h2 className="font-heading text-base font-bold uppercase tracking-wider text-[#F2F2F2] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#E8590C]" />
            Operating Timings
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Monday to Saturday</label>
              <input
                type="text"
                value={form.weekdays}
                onChange={(e) => setForm({ ...form, weekdays: e.target.value })}
                className="w-full px-3 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">Sunday Timings</label>
              <input
                type="text"
                value={form.sundays}
                onChange={(e) => setForm({ ...form, sundays: e.target.value })}
                className="w-full px-3 py-2 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Appearance & Theme */}
        <div className="p-5 rounded-lg border border-[#2A2A2A] bg-[#161616] flex items-center justify-between">
          <div>
            <h2 className="font-heading text-base font-bold uppercase tracking-wider text-[#F2F2F2]">
              Theme & Visual Appearance
            </h2>
            <p className="text-xs text-[#9A9A9A]">Currently using {theme === 'dark' ? 'Near-Black (#0E0E0E) Dark Mode' : 'Clean White Light Mode'}</p>
          </div>
          <ThemeToggle />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-lg bg-[#E8590C] hover:bg-[#D04F0A] text-xs font-semibold uppercase tracking-wider text-white transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" />
            Save Gym Settings
          </button>
        </div>
      </form>
    </div>
  );
}

