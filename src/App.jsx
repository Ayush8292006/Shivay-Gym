import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GymProvider } from './context/GymContext';
import Toast from './components/common/Toast';
import WhatsAppQueue from './components/common/WhatsAppQueue';

// Layouts
import LandingLayout from './layouts/LandingLayout';
import AdminLayout from './layouts/AdminLayout';
import MemberLayout from './layouts/MemberLayout';

// Public Landing Page
import LandingPage from './pages/landing/LandingPage';

// Admin / Owner Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMembers from './pages/admin/AdminMembers';
import AdminMemberDetail from './pages/admin/AdminMemberDetail';
import AdminFormerMembers from './pages/admin/AdminFormerMembers';
import AdminAutomations from './pages/admin/AdminAutomations';
import AdminOffers from './pages/admin/AdminOffers';
import AdminAttendance from './pages/admin/AdminAttendance';
import AdminPayments from './pages/admin/AdminPayments';
import AdminPlans from './pages/admin/AdminPlans';
import AdminTrainers from './pages/admin/AdminTrainers';
import AdminSchedule from './pages/admin/AdminSchedule';
import AdminDietsWorkouts from './pages/admin/AdminDietsWorkouts';
import AdminLeads from './pages/admin/AdminLeads';
import AdminExpenses from './pages/admin/AdminExpenses';
import AdminEquipment from './pages/admin/AdminEquipment';
import AdminReports from './pages/admin/AdminReports';
import AdminSettings from './pages/admin/AdminSettings';

// Member Portal Pages
import MemberHome from './pages/member/MemberHome';
import MemberWorkouts from './pages/member/MemberWorkouts';
import MemberDiet from './pages/member/MemberDiet';
import MemberProgress from './pages/member/MemberProgress';
import MemberCalculator from './pages/member/MemberCalculator';
import MemberBookings from './pages/member/MemberBookings';
import MemberPayments from './pages/member/MemberPayments';
import MemberNotifications from './pages/member/MemberNotifications';
import MemberReferral from './pages/member/MemberReferral';
import MemberProfile from './pages/member/MemberProfile';

export default function App() {
  return (
    <GymProvider>
      <BrowserRouter>
        <Routes>
          {/* PART A: Public Landing Page */}
          <Route path="/" element={<LandingLayout />}>
            <Route index element={<LandingPage />} />
          </Route>

          {/* PART B: Owner / Admin Management Console */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="members" element={<AdminMembers />} />
            <Route path="members/:id" element={<AdminMemberDetail />} />
            <Route path="former-members" element={<AdminFormerMembers />} />
            <Route path="automations" element={<AdminAutomations />} />
            <Route path="offers" element={<AdminOffers />} />
            <Route path="attendance" element={<AdminAttendance />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="plans" element={<AdminPlans />} />
            <Route path="trainers" element={<AdminTrainers />} />
            <Route path="schedule" element={<AdminSchedule />} />
            <Route path="diets-workouts" element={<AdminDietsWorkouts />} />
            <Route path="leads" element={<AdminLeads />} />
            <Route path="expenses" element={<AdminExpenses />} />
            <Route path="equipment" element={<AdminEquipment />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* PART C: Member App */}
          <Route path="/member" element={<MemberLayout />}>
            <Route index element={<MemberHome />} />
            <Route path="workout" element={<MemberWorkouts />} />
            <Route path="diet" element={<MemberDiet />} />
            <Route path="progress" element={<MemberProgress />} />
            <Route path="calculator" element={<MemberCalculator />} />
            <Route path="bookings" element={<MemberBookings />} />
            <Route path="payments" element={<MemberPayments />} />
            <Route path="notifications" element={<MemberNotifications />} />
            <Route path="referral" element={<MemberReferral />} />
            <Route path="profile" element={<MemberProfile />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Global Floating Toast */}
        <Toast />
        <WhatsAppQueue />
      </BrowserRouter>
    </GymProvider>
  );
}

