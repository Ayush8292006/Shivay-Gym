import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useGym } from '../../context/GymContext';
import ThemeToggle from './ThemeToggle';
import { Globe, Shield, Smartphone, RotateCcw, UserCheck, HelpCircle } from 'lucide-react';

export default function QuickNavSwitcher() {
  const { members, activeMemberId, setActiveMemberId, resetToDemoData } = useGym();
  const [showDemoModal, setShowDemoModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isLanding = location.pathname === '/';
  const isAdmin = location.pathname.startsWith('/admin');
  const isMember = location.pathname.startsWith('/member');

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[#2A2A2A] bg-[#0E0E0E]/95 backdrop-blur-md px-3 py-2 text-xs select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Brand Logo & Tag */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 font-heading text-base font-bold tracking-wider uppercase text-[#F2F2F2] hover:text-[#E8590C] transition-colors"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#E8590C] inline-block"></span>
              SHIVAY GYM
            </button>
            <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] uppercase font-semibold bg-[#1E1E1E] text-[#9A9A9A] border border-[#2A2A2A]">
              Prototype Mode
            </span>
          </div>

          {/* Core Switcher Tabs: Website | Admin | Member */}
          <nav className="flex items-center gap-1 bg-[#161616] p-1 rounded-lg border border-[#2A2A2A]">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium text-xs transition-colors ${
                  isActive
                    ? 'bg-[#E8590C] text-white shadow-sm'
                    : 'text-[#9A9A9A] hover:text-[#F2F2F2] hover:bg-[#1E1E1E]'
                }`
              }
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Public</span> Website
            </NavLink>

            <NavLink
              to="/admin"
              className={() =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium text-xs transition-colors ${
                  isAdmin
                    ? 'bg-[#E8590C] text-white shadow-sm'
                    : 'text-[#9A9A9A] hover:text-[#F2F2F2] hover:bg-[#1E1E1E]'
                }`
              }
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Owner</span> Admin
            </NavLink>

            <NavLink
              to="/member"
              className={() =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium text-xs transition-colors ${
                  isMember
                    ? 'bg-[#E8590C] text-white shadow-sm'
                    : 'text-[#9A9A9A] hover:text-[#F2F2F2] hover:bg-[#1E1E1E]'
                }`
              }
            >
              <Smartphone className="w-3.5 h-3.5" />
              Member App
            </NavLink>
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2">
            {/* Active Member Selector for Member Portal */}
            {isMember && (
              <div className="hidden lg:flex items-center gap-1.5 text-xs text-[#9A9A9A]">
                <UserCheck className="w-3.5 h-3.5 text-[#E8590C]" />
                <span className="hidden xl:inline">Viewing as:</span>
                <select
                  value={activeMemberId}
                  onChange={(e) => setActiveMemberId(e.target.value)}
                  className="bg-[#161616] border border-[#2A2A2A] rounded px-2 py-1 text-xs text-[#F2F2F2] focus:border-[#E8590C] focus:outline-none"
                >
                  {members.slice(0, 15).map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.plan.split(' ')[0]})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Demo Credentials Help */}
            <button
              onClick={() => setShowDemoModal(true)}
              className="p-1.5 rounded border border-[#2A2A2A] bg-[#161616] text-[#9A9A9A] hover:text-[#F2F2F2] hover:border-[#3A3A3A] transition-colors"
              title="View Demo Credentials & Info"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            {/* Reset Data */}
            <button
              onClick={resetToDemoData}
              className="hidden sm:flex items-center gap-1 px-2 py-1.5 rounded border border-[#2A2A2A] bg-[#161616] text-[#9A9A9A] hover:text-[#E8590C] hover:border-[#E8590C]/40 transition-colors"
              title="Reset sample data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Reset</span>
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Demo Credentials Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#161616] border border-[#2A2A2A] rounded-lg p-6 shadow-2xl text-[#F2F2F2]">
            <div className="flex items-center justify-between pb-3 border-b border-[#2A2A2A]">
              <h3 className="font-heading uppercase text-lg font-bold text-[#E8590C]">
                Demo Access & Shortcuts
              </h3>
              <button
                onClick={() => setShowDemoModal(false)}
                className="text-[#9A9A9A] hover:text-[#F2F2F2]"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs leading-relaxed">
              <div className="p-3 bg-[#1E1E1E] rounded-md border border-[#2A2A2A]">
                <div className="font-semibold text-sm text-[#F2F2F2] mb-1">
                  1. Admin / Owner Portal
                </div>
                <p className="text-[#9A9A9A]">Email: <span className="font-mono text-[#F2F2F2]">admin@shivaygym.com</span></p>
                <p className="text-[#9A9A9A]">Password: <span className="font-mono text-[#F2F2F2]">admin123</span></p>
                <button
                  onClick={() => { setShowDemoModal(false); navigate('/admin'); }}
                  className="mt-2 w-full py-1.5 px-3 bg-[#E8590C] text-white rounded font-medium hover:bg-[#D04F0A] transition-colors"
                >
                  Enter Owner Portal
                </button>
              </div>

              <div className="p-3 bg-[#1E1E1E] rounded-md border border-[#2A2A2A]">
                <div className="font-semibold text-sm text-[#F2F2F2] mb-1">
                  2. Member App
                </div>
                <p className="text-[#9A9A9A]">Email: <span className="font-mono text-[#F2F2F2]">member@shivaygym.com</span></p>
                <p className="text-[#9A9A9A]">Password: <span className="font-mono text-[#F2F2F2]">member123</span></p>
                <button
                  onClick={() => { setShowDemoModal(false); navigate('/member'); }}
                  className="mt-2 w-full py-1.5 px-3 bg-[#2A2A2A] text-white rounded font-medium hover:bg-[#333333] transition-colors"
                >
                  Enter Member App
                </button>
              </div>

              <div className="text-[11px] text-[#888888]">
                Note: All modifications (adding members, renewing plans, check-ins, automations, WhatsApp messaging logs) persist in browser localStorage. Click "Reset" in the top bar anytime to restore defaults.
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

