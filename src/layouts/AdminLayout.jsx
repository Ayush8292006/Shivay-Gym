import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import QuickNavSwitcher from '../components/common/QuickNavSwitcher';
import Modal from '../components/common/Modal';
import { useGym } from '../context/GymContext';
import {
  LayoutDashboard,
  Users,
  UserX,
  MessageSquareCode,
  Tag,
  QrCode,
  CreditCard,
  Layers,
  UserCheck,
  CalendarDays,
  Utensils,
  UserPlus,
  Receipt,
  Dumbbell,
  BarChart3,
  Settings,
  Menu,
  X,
  Plus,
  ScanLine,
  Send
} from 'lucide-react';

export default function AdminLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickCheckInModal, setQuickCheckInModal] = useState(false);
  const [checkInInput, setCheckInInput] = useState('');
  const { gymInfo, checkInMember, members, showToast } = useGym();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Members', path: '/admin/members', icon: Users },
    { label: 'Former Members', path: '/admin/former-members', icon: UserX },
    { label: 'Automations & Messages', path: '/admin/automations', icon: MessageSquareCode, badge: 'Core' },
    { label: 'Offers & Campaigns', path: '/admin/offers', icon: Tag },
    { label: 'Attendance & QR', path: '/admin/attendance', icon: QrCode },
    { label: 'Payments & GST Invoices', path: '/admin/payments', icon: CreditCard },
    { label: 'Plans & Pricing', path: '/admin/plans', icon: Layers },
    { label: 'Trainers & Staff', path: '/admin/trainers', icon: UserCheck },
    { label: 'Classes & Timetable', path: '/admin/schedule', icon: CalendarDays },
    { label: 'Diet & Workout Templates', path: '/admin/diets-workouts', icon: Utensils },
    { label: 'Leads & Enquiries', path: '/admin/leads', icon: UserPlus },
    { label: 'Expenses & Overhead', path: '/admin/expenses', icon: Receipt },
    { label: 'Equipment & Supplements', path: '/admin/equipment', icon: Dumbbell },
    { label: 'Reports & Analytics', path: '/admin/reports', icon: BarChart3 },
    { label: 'Gym Settings', path: '/admin/settings', icon: Settings },
  ];

  const handleQuickCheckIn = (e) => {
    e.preventDefault();
    if (!checkInInput.trim()) return;
    const ok = checkInMember(checkInInput.trim(), 'Manual Desk');
    if (ok) {
      setCheckInInput('');
      setQuickCheckInModal(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0E0E0E] text-[#F2F2F2]">
      {/* Top Prototype Switcher */}
      <QuickNavSwitcher />

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 border-r border-[#2A2A2A] bg-[#121212] flex-shrink-0">
          {/* Gym Badge in Sidebar */}
          <div className="p-4 border-b border-[#2A2A2A] flex items-center justify-between">
            <div>
              <div className="font-heading uppercase text-xl font-bold tracking-wider text-[#F2F2F2]">
                SHIVAY GYM
              </div>
              <div className="text-[11px] text-[#9A9A9A]">
                Owner & Management Console
              </div>
            </div>
            <span className="w-2 h-2 rounded-full bg-[#2F9E44]" title="System Online"></span>
          </div>

          {/* Quick Action Buttons */}
          <div className="p-3 border-b border-[#2A2A2A] grid grid-cols-2 gap-2">
            <button
              onClick={() => setQuickCheckInModal(true)}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#E8590C]/60 text-xs font-medium text-[#F2F2F2] hover:text-[#E8590C] transition-colors"
            >
              <ScanLine className="w-3.5 h-3.5" />
              Check-in
            </button>
            <button
              onClick={() => navigate('/admin/members?add=true')}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded bg-[#E8590C] hover:bg-[#D04F0A] text-xs font-semibold text-white transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Member
            </button>
          </div>

          {/* Nav List */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? location.pathname === item.path
                : location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-[#E8590C] text-white shadow-sm font-semibold'
                      : 'text-[#9A9A9A] hover:text-[#F2F2F2] hover:bg-[#1A1A1A]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase ${
                      isActive ? 'bg-black/30 text-white' : 'bg-[#E8590C]/20 text-[#E8590C]'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* User profile footer */}
          <div className="p-3 border-t border-[#2A2A2A] bg-[#161616] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#E8590C] text-white flex items-center justify-center font-bold text-xs">
                AK
              </div>
              <div>
                <div className="text-xs font-semibold text-[#F2F2F2]">Amit Kumar</div>
                <div className="text-[10px] text-[#9A9A9A]">Gym Owner / Admin</div>
              </div>
            </div>
            <button
              onClick={() => showToast('Demo credentials active (admin@shivaygym.com)', 'info')}
              className="text-[11px] text-[#9A9A9A] hover:text-[#E8590C]"
              title="Demo Account"
            >
              Demo
            </button>
          </div>
        </aside>

        {/* Mobile Header */}
        <div className="lg:hidden fixed top-14 left-0 right-0 z-30 flex items-center justify-between px-4 h-12 bg-[#121212] border-b border-[#2A2A2A]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1 rounded text-[#9A9A9A] hover:text-[#F2F2F2]"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-heading font-bold uppercase tracking-wider text-sm text-[#F2F2F2]">
              SHIVAY ADMIN
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setQuickCheckInModal(true)}
              className="px-2.5 py-1 rounded bg-[#1E1E1E] border border-[#2A2A2A] text-xs text-[#F2F2F2] flex items-center gap-1"
            >
              <ScanLine className="w-3.5 h-3.5 text-[#E8590C]" />
              Check-in
            </button>
            <button
              onClick={() => navigate('/admin/members?add=true')}
              className="p-1.5 rounded bg-[#E8590C] text-white"
              title="Add Member"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div
              className="fixed inset-0 bg-black/70"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative w-72 max-w-[80vw] bg-[#121212] border-r border-[#2A2A2A] flex flex-col h-full z-10 p-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#2A2A2A]">
                <div>
                  <div className="font-heading uppercase text-lg font-bold text-[#F2F2F2]">SHIVAY GYM</div>
                  <div className="text-[10px] text-[#9A9A9A]">Owner Management</div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-[#9A9A9A] hover:text-[#F2F2F2]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto py-3 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.exact
                    ? location.pathname === item.path
                    : location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-[#E8590C] text-white'
                          : 'text-[#9A9A9A] hover:text-[#F2F2F2] hover:bg-[#1A1A1A]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] px-1 py-0.5 rounded bg-[#E8590C]/20 text-[#E8590C]">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 overflow-y-auto px-4 sm:px-6 lg:px-8 pt-16 lg:pt-8 pb-20 lg:pb-10 bg-[#0E0E0E]">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Quick Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 h-14 bg-[#121212] border-t border-[#2A2A2A] flex items-center justify-around px-2">
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 text-[10px] font-medium transition-colors ${
              isActive ? 'text-[#E8590C]' : 'text-[#9A9A9A]'
            }`
          }
        >
          <LayoutDashboard className="w-4 h-4 mb-0.5" />
          Dashboard
        </NavLink>
        <NavLink
          to="/admin/members"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 text-[10px] font-medium transition-colors ${
              isActive ? 'text-[#E8590C]' : 'text-[#9A9A9A]'
            }`
          }
        >
          <Users className="w-4 h-4 mb-0.5" />
          Members
        </NavLink>
        <NavLink
          to="/admin/automations"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 text-[10px] font-medium transition-colors ${
              isActive ? 'text-[#E8590C]' : 'text-[#9A9A9A]'
            }`
          }
        >
          <MessageSquareCode className="w-4 h-4 mb-0.5" />
          Automations
        </NavLink>
        <NavLink
          to="/admin/attendance"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 text-[10px] font-medium transition-colors ${
              isActive ? 'text-[#E8590C]' : 'text-[#9A9A9A]'
            }`
          }
        >
          <QrCode className="w-4 h-4 mb-0.5" />
          Attendance
        </NavLink>
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center justify-center py-1 text-[10px] font-medium text-[#9A9A9A]"
        >
          <Menu className="w-4 h-4 mb-0.5" />
          More
        </button>
      </div>

      {/* Quick Check-In Modal */}
      <Modal
        isOpen={quickCheckInModal}
        onClose={() => setQuickCheckInModal(false)}
        title="Quick Member Check-In"
        subtitle="Enter Member ID (e.g. SHIV-1001) or 10-digit mobile number"
      >
        <form onSubmit={handleQuickCheckIn} className="space-y-4">
          <div>
            <label className="block text-xs uppercase font-medium text-[#9A9A9A] mb-1">
              Member ID or Phone
            </label>
            <input
              type="text"
              required
              autoFocus
              value={checkInInput}
              onChange={(e) => setCheckInInput(e.target.value)}
              placeholder="e.g. SHIV-1001 or 98101"
              className="w-full px-3 py-2.5 rounded-lg bg-[#1E1E1E] border border-[#2A2A2A] text-sm text-[#F2F2F2] placeholder-[#666666] focus:border-[#E8590C] focus:outline-none"
            />
          </div>

          <div className="p-3 bg-[#1E1E1E] rounded-lg border border-[#2A2A2A] text-xs text-[#9A9A9A] space-y-1">
            <div className="font-semibold text-[#F2F2F2]">Fast check-in shortcuts:</div>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {members.slice(0, 5).map(m => (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => setCheckInInput(m.id)}
                  className="px-2 py-1 rounded bg-[#2A2A2A] hover:bg-[#E8590C] hover:text-white text-[11px] text-[#F2F2F2] transition-colors"
                >
                  {m.name.split(' ')[0]} ({m.id})
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setQuickCheckInModal(false)}
              className="px-4 py-2 text-xs font-medium rounded-lg border border-[#2A2A2A] bg-[#1E1E1E] text-[#9A9A9A] hover:text-[#F2F2F2]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg bg-[#E8590C] hover:bg-[#D04F0A] text-white transition-colors"
            >
              Log Attendance
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

