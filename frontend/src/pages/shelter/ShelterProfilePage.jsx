import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import {
  CheckCircle2
} from 'lucide-react';

export const ShelterProfilePage = () => {
  const { user, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    organizationName: user?.organizationName || 'Anandam Food Relief Shelter',
    name: user?.name || 'Priya Sharma',
    email: user?.email || 'info@anandamfoundation.org',
    phone: user?.phone || '+91 99302 77810',
    address: user?.address || 'Plot 18, Near King Circle Railway Station, Matunga, Mumbai 400019',
    ngoRegistration: user?.ngoRegistration || 'NGO-MH-2022-0941',
    beneficiaryCount: user?.beneficiaryCount || '150-200 daily meals',
    vehicleAvailable: user?.vehicleAvailable ?? true
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 space-y-6">
      {/* Header */}
      <div className="pb-6 border-b border-[#e3e8ee]">
        <h1 className="text-2xl sm:text-3xl font-light text-[#0d253d] tracking-tight">
          Shelter & NGO Profile
        </h1>
        <p className="text-xs sm:text-sm text-[#64748d] mt-1 font-light">
          Manage your relief organization details, beneficiary serving capacity, and logistics capabilities.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-md bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Shelter profile details saved successfully!</span>
        </div>
      )}

      {/* Form Container */}
      <div className="bg-white border border-[#e3e8ee] rounded-xl p-6 sm:p-8 shadow-stripe-1">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-[#0d253d] uppercase tracking-wider mb-4 pb-2 border-b border-[#e3e8ee]">
              Organization & Contact Representative
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#0d253d] mb-1">
                  Shelter / Charitable Trust Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.organizationName}
                  onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                  className="w-full bg-white text-[#0d253d] border border-[#a8c3de] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#533afd] focus:ring-1 focus:ring-[#533afd] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#0d253d] mb-1">
                  Representative Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white text-[#0d253d] border border-[#a8c3de] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#533afd] focus:ring-1 focus:ring-[#533afd] transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-xs font-medium text-[#0d253d] mb-1">
                  Official Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white text-[#0d253d] border border-[#a8c3de] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#533afd] focus:ring-1 focus:ring-[#533afd] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#0d253d] mb-1">
                  Emergency Logistics Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-white text-[#0d253d] border border-[#a8c3de] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#533afd] focus:ring-1 focus:ring-[#533afd] transition-all"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#0d253d] uppercase tracking-wider mb-4 pb-2 border-b border-[#e3e8ee]">
              Relief Capacity & Distribution Center
            </h3>

            <div>
              <label className="block text-xs font-medium text-[#0d253d] mb-1">
                Shelter Delivery / Receiving Address *
              </label>
              <textarea
                rows={2}
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-white text-[#0d253d] border border-[#a8c3de] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#533afd] focus:ring-1 focus:ring-[#533afd] transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-xs font-medium text-[#0d253d] mb-1">
                  NGO Darpan / Registration ID
                </label>
                <input
                  type="text"
                  value={formData.ngoRegistration}
                  onChange={(e) => setFormData({ ...formData, ngoRegistration: e.target.value })}
                  className="w-full bg-white text-[#0d253d] border border-[#a8c3de] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#533afd] focus:ring-1 focus:ring-[#533afd] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#0d253d] mb-1">
                  Daily Beneficiary Serving Capacity
                </label>
                <input
                  type="text"
                  value={formData.beneficiaryCount}
                  onChange={(e) => setFormData({ ...formData, beneficiaryCount: e.target.value })}
                  placeholder="e.g. 150-200 people daily"
                  className="w-full bg-white text-[#0d253d] border border-[#a8c3de] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#533afd] focus:ring-1 focus:ring-[#533afd] transition-all"
                />
              </div>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-[#f6f9fc] border border-[#e3e8ee]">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.vehicleAvailable}
                  onChange={(e) => setFormData({ ...formData, vehicleAvailable: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-[#533afd] focus:ring-[#533afd]"
                />
                <div className="text-xs">
                  <span className="font-medium text-[#0d253d] block">
                    Own Transport / Insulated Van Available
                  </span>
                  <span className="text-[#64748d]">
                    Enables your organization to perform rapid direct pickups from restaurant docks.
                  </span>
                </div>
              </label>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button type="submit" variant="primary" size="md" spark>
              Save Shelter Details
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
