import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import QuickNavSwitcher from '../components/common/QuickNavSwitcher';
import Avatar from '../components/common/Avatar';
import { useGym } from '../context/GymContext';
import {
  Home,
  Dumbbell,
  Utensils,
  TrendingUp,
  User,
  Calculator,
  CalendarCheck,
  Bell,
  CreditCard,
  Gift,
  QrCode,
  Flame,
  Menu,
  X
} from 'lucide-react';

export default function MemberLayout() {
  const { currentMember, members, activeMemberId, setActiveMemberId } = useGym();
  const [showMemberIdModal, setShowMemberIdModal] = useState(false);
  const [moreDrawerOpen, setMoreDrawerOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const unreadNotificationsCount = currentMember?.messageHistory?.length || 0;

  const bottomTabs = [
    { label: 'Home', path: '/member', icon: Home, exact: true },
    { label: 'Workout', path: '/member/workout', icon: Dumbbell },
    { label: 'Diet', path: '/member/diet', icon: Utensils },
    { label: 'Progress', path: '/member/progress', icon: TrendingUp },
    { label: 'Profile', path: '/member/profile', icon: User },
  ];

  const secondaryNav = [
    { label: 'BMI & Macro Calculator', path: '/member/calculator', icon: Calculator },
    { label: 'Book Classes & PT', path: '/member/bookings', icon: CalendarCheck },
    { label: 'Gym Notifications', path: '/member/notifications', icon: Bell, badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : null },
    { label: 'Fee History & Receipts', path: '/member/payments', icon: CreditCard },
    { label: 'Refer a Friend (Get 1 Mo Free)', path: '/member/referral', icon: Gift },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0E0E0E] text-[#F2F2F2]">
      {/* Top Prototype Switcher */}
      <QuickNavSwitcher />

      {/* Member Top Bar (Sticky, Mobile App Feel) */}
      <header className="sticky top-14 z-30 w-full border-b border-[#2A2A2A] bg-[#121212]/95 backdrop-blur-md px-4 py-2.5">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar name={currentMember?.name} size="md" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#9A9A9A]">Welcome back,</span>
                <span className="flex items-center gap-1 text-[11px] font-bold text-[#E8590C]">
                  <Flame className="w-3.5 h-3.5 fill-[#E8590C]" />
                  {currentMember?.attendanceStreak || 0}d streak
                </span>
              </div>
              <h1 className="font-heading text-lg font-bold uppercase text-[#F2F2F2] leading-none">
                {currentMember?.name}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Digital ID / QR Card Trigger */}
            <button
              onClick={() => setShowMemberIdModal(true)}
              className="p-2 rounded-lg bg-[#1E1E1E] border border-[#2A2A2A] text-[#F2F2F2] hover:border-[#E8590C] hover:text-[#E8590C] transition-colors"
              title="Show Digital Member QR"
            >
              <QrCode className="w-5 h-5" />
            </button>

            {/* Notifications Button */}
            <button
              onClick={() => navigate('/member/notifications')}
              className="relative p-2 rounded-lg bg-[#1E1E1E] border border-[#2A2A2A] text-[#F2F2F2] hover:border-[#E8590C] transition-colors"
              title="Gym Notifications"
            >
              <Bell className="w-5 h-5 text-[#9A9A9A]" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E8590C]"></span>
              )}
            </button>

            {/* Menu trigger for secondary links */}
            <button
              onClick={() => setMoreDrawerOpen(true)}
              className="p-2 rounded-lg bg-[#1E1E1E] border border-[#2A2A2A] text-[#9A9A9A] hover:text-[#F2F2F2] transition-colors"
              title="More options"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area: Centered container for app-like focus */}
      <main className="flex-1 max-w-2xl w-full mx-auto p-4 pb-24">
        <Outlet />
      </main>

      {/* Mobile-Native Bottom Tab Bar (min 44px tap targets) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#121212]/95 backdrop-blur-md border-t border-[#2A2A2A]">
        <div className="max-w-2xl mx-auto flex items-center justify-around h-16 px-1">
          {bottomTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.exact
              ? location.pathname === tab.path
              : location.pathname.startsWith(tab.path);

            return (
              <NavLink
                key={tab.path}
                to={tab.path}
                className={`flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 transition-colors ${
                  isActive
                    ? 'text-[#E8590C] font-semibold'
                    : 'text-[#9A9A9A] hover:text-[#F2F2F2]'
                }`}
              >
                <Icon className={`w-5 h-5 mb-1 ${isActive ? 'stroke-[2.4px]' : 'stroke-[1.8px]'}`} />
                <span className="text-[11px] tracking-tight">{tab.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Digital Member ID Card Modal */}
      {showMemberIdModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-xl border border-[#2A2A2A] bg-[#161616] p-6 text-center text-[#F2F2F2] shadow-2xl relative">
            <button
              onClick={() => setShowMemberIdModal(false)}
              className="absolute top-3 right-3 text-[#9A9A9A] hover:text-[#F2F2F2]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="font-heading uppercase text-xl font-bold tracking-widest text-[#E8590C] mb-1">
              SHIVAY GYM
            </div>
            <div className="text-[10px] uppercase tracking-wider text-[#9A9A9A] mb-4">
              Digital Membership Pass
            </div>

            {/* Simulated Clean QR Code */}
            <div className="mx-auto w-44 h-44 bg-white p-3 rounded-lg flex items-center justify-center shadow-inner my-2">
              <div className="w-full h-full border-4 border-black p-2 flex flex-col items-center justify-between">
                <div className="flex justify-between w-full">
                  <div className="w-8 h-8 bg-black"></div>
                  <div className="w-8 h-8 bg-black"></div>
                </div>
                <div className="text-black font-mono font-bold text-sm tracking-widest uppercase">
                  {currentMember?.id}
                </div>
                <div className="flex justify-between w-full">
                  <div className="w-8 h-8 bg-black"></div>
                  <div className="w-4 h-4 bg-black self-end"></div>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h2 className="font-heading text-lg font-bold text-[#F2F2F2]">{currentMember?.name}</h2>
              <p className="text-xs text-[#9A9A9A]">{currentMember?.plan}</p>
              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#2F9E44]/15 text-[#2F9E44] border border-[#2F9E44]/30">
                <span className="w-2 h-2 rounded-full bg-[#2F9E44] animate-pulse"></span>
                Active Pass • Valid till {currentMember?.expiryDate}
              </div>
            </div>

            <p className="text-[11px] text-[#666666] mt-4">
              Scan this QR at the entrance biometric turnstile or front desk to register check-in.
            </p>
          </div>
        </div>
      )}

      {/* Secondary Tools Drawer */}
      {moreDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/70"
            onClick={() => setMoreDrawerOpen(false)}
          />
          <div className="relative w-72 bg-[#141414] border-l border-[#2A2A2A] p-5 flex flex-col justify-between h-full z-10 animate-in slide-in-from-right duration-200">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#2A2A2A] mb-4">
                <span className="font-heading uppercase text-base font-bold text-[#F2F2F2]">
                  Member Services
                </span>
                <button
                  onClick={() => setMoreDrawerOpen(false)}
                  className="text-[#9A9A9A] hover:text-[#F2F2F2]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1.5">
                {secondaryNav.map(item => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMoreDrawerOpen(false)}
                      className="flex items-center justify-between p-2.5 rounded-lg text-xs font-medium text-[#9A9A9A] hover:text-[#F2F2F2] hover:bg-[#1E1E1E] transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-[#E8590C]" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-[#E8590C] text-white font-bold">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>

            <div className="p-3 bg-[#1A1A1A] rounded-lg border border-[#2A2A2A] text-xs">
              <div className="font-semibold text-[#F2F2F2] mb-1">Need trainer guidance?</div>
              <p className="text-[11px] text-[#9A9A9A] mb-2">Assigned coach: {currentMember?.trainer}</p>
              <a
                href={`https://wa.me/919876543210?text=Hi%20Coach%2C%20this%20is%20${encodeURIComponent(currentMember?.name || '')}.%20I%20have%20a%20question%20about%20my%20workout.`}
                target="_blank"
                rel="noreferrer"
                className="block text-center py-1.5 px-3 rounded bg-[#2A2A2A] hover:bg-[#E8590C] hover:text-white text-xs font-medium transition-colors"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

