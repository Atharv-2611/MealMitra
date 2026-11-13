import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import {
  Lock,
  Bell,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const SettingsPage = () => {
  const [passwordState, setPasswordState] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: true,
    expiryWarnings: true,
    weeklyReport: false
  });

  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [prefSuccess, setPrefSuccess] = useState(false);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordError('');

    if (passwordState.newPassword !== passwordState.confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    if (passwordState.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    setPasswordSuccess(true);
    setPasswordState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => setPasswordSuccess(false), 4000);
  };

  const handlePrefSave = () => {
    setPrefSuccess(true);
    setTimeout(() => setPrefSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-[#e3e8ee]">
        <h1 className="text-2xl sm:text-3xl font-light text-[#0d253d] tracking-tight">
          Account Settings & Security
        </h1>
        <p className="text-xs sm:text-sm text-[#64748d] mt-1 font-light">
          Manage your account credentials, alert preferences, and safety protocol verifications.
        </p>
      </div>

      {/* 1. Change Password */}
      <div className="bg-white border border-[#e3e8ee] rounded-xl p-6 sm:p-8 shadow-stripe-1">
        <h3 className="text-sm font-semibold text-[#0d253d] uppercase tracking-wider mb-2 flex items-center gap-2">
          <Lock className="w-4 h-4 text-[#533afd]" />
          <span>Security & Password</span>
        </h3>
        <p className="text-xs text-[#64748d] mb-6 font-light">
          Ensure your account uses a secure password to protect donation management access.
        </p>

        {passwordSuccess && (
          <div className="mb-5 p-3 rounded-md bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Password updated successfully!</span>
          </div>
        )}

        {passwordError && (
          <div className="mb-5 p-3 rounded-md bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{passwordError}</span>
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-xs font-medium text-[#0d253d] mb-1">
              Current Password
            </label>
            <input
              type="password"
              required
              value={passwordState.currentPassword}
              onChange={(e) => setPasswordState({ ...passwordState, currentPassword: e.target.value })}
              placeholder="••••••••"
              className="w-full bg-white text-[#0d253d] border border-[#a8c3de] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#533afd] focus:ring-1 focus:ring-[#533afd] transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#0d253d] mb-1">
                New Password
              </label>
              <input
                type="password"
                required
                value={passwordState.newPassword}
                onChange={(e) => setPasswordState({ ...passwordState, newPassword: e.target.value })}
                placeholder="Min 6 characters"
                className="w-full bg-white text-[#0d253d] border border-[#a8c3de] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#533afd] focus:ring-1 focus:ring-[#533afd] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#0d253d] mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={passwordState.confirmPassword}
                onChange={(e) => setPasswordState({ ...passwordState, confirmPassword: e.target.value })}
                placeholder="Re-enter password"
                className="w-full bg-white text-[#0d253d] border border-[#a8c3de] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#533afd] focus:ring-1 focus:ring-[#533afd] transition-all"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button type="submit" variant="primary" size="sm" spark>
              Update Password
            </Button>
          </div>
        </form>
      </div>

      {/* 2. Notification Preferences */}
      <div className="bg-white border border-[#e3e8ee] rounded-xl p-6 sm:p-8 shadow-stripe-1">
        <h3 className="text-sm font-semibold text-[#0d253d] uppercase tracking-wider mb-2 flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#533afd]" />
          <span>Notification & Dispatch Alerts</span>
        </h3>
        <p className="text-xs text-[#64748d] mb-6 font-light">
          Choose how you receive immediate notifications when food is claimed or listed in your area.
        </p>

        {prefSuccess && (
          <div className="mb-5 p-3 rounded-md bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Alert preferences saved!</span>
          </div>
        )}

        <div className="space-y-4 max-w-lg">
          <label className="flex items-center justify-between p-3 rounded-lg border border-[#e3e8ee] hover:bg-[#f6f9fc] cursor-pointer">
            <div>
              <p className="text-xs font-medium text-[#0d253d]">Immediate Email Dispatch Notices</p>
              <p className="text-[11px] text-[#64748d]">Sent as soon as a shelter reserves your food batch</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.emailAlerts}
              onChange={(e) => setNotifications({ ...notifications, emailAlerts: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-[#533afd] focus:ring-[#533afd]"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-lg border border-[#e3e8ee] hover:bg-[#f6f9fc] cursor-pointer">
            <div>
              <p className="text-xs font-medium text-[#0d253d]">SMS Urgency Alerts</p>
              <p className="text-[11px] text-[#64748d]">Direct SMS to driver or kitchen supervisor phone</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.smsAlerts}
              onChange={(e) => setNotifications({ ...notifications, smsAlerts: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-[#533afd] focus:ring-[#533afd]"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-lg border border-[#e3e8ee] hover:bg-[#f6f9fc] cursor-pointer">
            <div>
              <p className="text-xs font-medium text-[#0d253d]">Expiry Countdown Reminders</p>
              <p className="text-[11px] text-[#64748d]">Notifies 2 hours before donation window closes</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.expiryWarnings}
              onChange={(e) => setNotifications({ ...notifications, expiryWarnings: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-[#533afd] focus:ring-[#533afd]"
            />
          </label>

          <div className="pt-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handlePrefSave}
            >
              Save Alert Preferences
            </Button>
          </div>
        </div>
      </div>

      {/* 3. Safety Standard Acknowledgment */}
      <div className="bg-[#f5e9d4]/30 border border-[#e3e8ee] rounded-xl p-6 sm:p-8 flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-[#f5e9d4] text-[#9b6829] flex items-center justify-center shrink-0 mt-0.5">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-medium text-[#0d253d]">
            FSSAI Surplus Food Recovery Standard
          </h4>
          <p className="text-xs text-[#64748d] mt-1 font-light leading-relaxed">
            All registered organizations on MealMitra operate under the Food Safety and Standards (Recovery & Distribution of Surplus Food) Regulations. Donors are shielded from liability when food is provided in good faith and unexpired condition.
          </p>
        </div>
      </div>
    </div>
  );
};
