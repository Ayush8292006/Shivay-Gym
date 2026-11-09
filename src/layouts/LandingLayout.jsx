import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import QuickNavSwitcher from '../components/common/QuickNavSwitcher';
import { useGym } from '../context/GymContext';
import { Phone, Mail, MapPin, Clock, MessageSquare, Instagram, Facebook } from 'lucide-react';

export default function LandingLayout() {
  const { gymInfo } = useGym();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-[#0E0E0E] text-[#F2F2F2]">
      {/* Universal Prototype Switcher Bar */}
      <QuickNavSwitcher />

      {/* Website Header */}
      <header className="sticky top-14 z-30 w-full border-b border-[#2A2A2A] bg-[#0E0E0E]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded bg-[#E8590C] flex items-center justify-center font-heading font-bold text-white text-lg">
              S
            </div>
            <div>
              <span className="font-heading text-2xl font-bold tracking-wider text-[#F2F2F2] group-hover:text-[#E8590C] transition-colors">
                SHIVAY GYM
              </span>
              <span className="hidden sm:block text-[10px] text-[#9A9A9A] tracking-widest uppercase">
                GURUGRAM • SECTOR 14
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#9A9A9A]">
            <a href="#about" className="hover:text-[#F2F2F2] transition-colors">About</a>
            <a href="#facilities" className="hover:text-[#F2F2F2] transition-colors">Facilities</a>
            <a href="#plans" className="hover:text-[#F2F2F2] transition-colors">Memberships</a>
            <a href="#trainers" className="hover:text-[#F2F2F2] transition-colors">Coaches</a>
            <a href="#timetable" className="hover:text-[#F2F2F2] transition-colors">Timetable</a>
            <a href="#calculator" className="hover:text-[#F2F2F2] transition-colors">BMI Calculator</a>
            <a href="#location" className="hover:text-[#F2F2F2] transition-colors">Contact</a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/${gymInfo.whatsapp}?text=Hi%20Shivay%20Gym%2C%20I%20would%20like%20to%20book%20a%20free%20trial.`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg border border-[#2A2A2A] bg-[#161616] hover:bg-[#1E1E1E] text-[#F2F2F2] transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#2F9E44]" />
              WhatsApp
            </a>

            <button
              onClick={() => {
                const el = document.getElementById('plans');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else navigate('/#plans');
              }}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg bg-[#E8590C] hover:bg-[#D04F0A] text-white shadow-sm transition-colors"
            >
              Join Now
            </button>
          </div>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-[#2A2A2A] bg-[#121212] pt-14 pb-8 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-[#242424]">
            {/* Col 1 */}
            <div>
              <div className="font-heading text-2xl font-bold tracking-wider text-[#F2F2F2] mb-3">
                SHIVAY GYM
              </div>
              <p className="text-xs text-[#9A9A9A] leading-relaxed mb-4">
                {gymInfo.subtitle}
              </p>
              <div className="flex items-center gap-3 text-[#9A9A9A]">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded bg-[#1A1A1A] border border-[#2A2A2A] hover:text-[#E8590C] transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded bg-[#1A1A1A] border border-[#2A2A2A] hover:text-[#E8590C] transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href={`https://wa.me/${gymInfo.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded bg-[#1A1A1A] border border-[#2A2A2A] hover:text-[#2F9E44] transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Col 2 */}
            <div>
              <h4 className="font-heading uppercase text-sm font-bold tracking-wider text-[#F2F2F2] mb-3">
                Opening Hours
              </h4>
              <ul className="space-y-2 text-xs text-[#9A9A9A]">
                <li className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-[#E8590C] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#F2F2F2] font-medium">Monday - Saturday:</span>
                    <p>{gymInfo.timings.weekdays}</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-[#E8590C] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[#F2F2F2] font-medium">Sunday:</span>
                    <p>{gymInfo.timings.sundays}</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Col 3 */}
            <div>
              <h4 className="font-heading uppercase text-sm font-bold tracking-wider text-[#F2F2F2] mb-3">
                Contact & Address
              </h4>
              <ul className="space-y-2.5 text-xs text-[#9A9A9A]">
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#E8590C] flex-shrink-0 mt-0.5" />
                  <span>{gymInfo.address} ({gymInfo.landmark})</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#E8590C] flex-shrink-0" />
                  <a href={`tel:${gymInfo.phone}`} className="hover:text-[#F2F2F2]">{gymInfo.phone}</a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#E8590C] flex-shrink-0" />
                  <a href={`mailto:${gymInfo.email}`} className="hover:text-[#F2F2F2]">{gymInfo.email}</a>
                </li>
              </ul>
            </div>

            {/* Col 4 */}
            <div>
              <h4 className="font-heading uppercase text-sm font-bold tracking-wider text-[#F2F2F2] mb-3">
                Portal Access
              </h4>
              <div className="space-y-2 text-xs">
                <Link
                  to="/admin"
                  className="block p-2.5 rounded bg-[#1A1A1A] border border-[#2A2A2A] text-[#9A9A9A] hover:text-[#F2F2F2] hover:border-[#E8590C]/50 transition-colors"
                >
                  <span className="font-semibold text-[#F2F2F2]">Owner / Staff Portal →</span>
                  <p className="text-[11px] text-[#666666] mt-0.5">Manage members, attendance & automations</p>
                </Link>
                <Link
                  to="/member"
                  className="block p-2.5 rounded bg-[#1A1A1A] border border-[#2A2A2A] text-[#9A9A9A] hover:text-[#F2F2F2] hover:border-[#E8590C]/50 transition-colors"
                >
                  <span className="font-semibold text-[#F2F2F2]">Member App Access →</span>
                  <p className="text-[11px] text-[#666666] mt-0.5">Workouts, diet, attendance QR & progress</p>
                </Link>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#666666]">
            <div>
              © {new Date().getFullYear()} SHIVAY GYM. All rights reserved. GST: {gymInfo.gstNumber}
            </div>
            <div>
              Built for serious strength & habit consistency.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

