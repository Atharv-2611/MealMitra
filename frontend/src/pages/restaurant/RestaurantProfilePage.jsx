import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import {
  CheckCircle2
} from 'lucide-react';

export const RestaurantProfilePage = () => {
  const { user, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    organizationName: user?.organizationName || 'The Royal Kitchen & Caterers',
    name: user?.name || 'Vikram Sethi',
    email: user?.email || 'contact@royalkitchen.com',
    phone: user?.phone || '+91 98201 44521',
    address: user?.address || '42 Senapati Bapat Marg, Lower Parel, Mumbai, Maharashtra 400013',
    fssaiLicense: user?.fssaiLicense || '11521018000452',
    openingHours: user?.openingHours || '10:00 AM - 11:30 PM'
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
      {/* Page Header */}
      <div className="pb-6 border-b border-[#e3e8ee]">
        <h1 className="text-2xl sm:text-3xl font-light text-[#0d253d] tracking-tight">
          Restaurant Profile & Settings
        </h1>
        <p className="text-xs sm:text-sm text-[#64748d] mt-1 font-light">
          Manage your culinary establishment details, pickup directions, and food license records.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-md bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Profile information updated successfully!</span>
        </div>
      )}

      {/* Profile Form Card */}
      <div className="bg-white border border-[#e3e8ee] rounded-xl p-6 sm:p-8 shadow-stripe-1">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-[#0d253d] uppercase tracking-wider mb-4 pb-2 border-b border-[#e3e8ee]">
              Establishment Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#0d253d] mb-1">
                  Restaurant / Kitchen Brand Name *
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
                  Primary Contact Manager *
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
                  Contact Email Address *
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
                  Dispatch / Kitchen Phone *
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
              Location & Operations
            </h3>

            <div>
              <label className="block text-xs font-medium text-[#0d253d] mb-1">
                Full Physical Address for Food Dispatch *
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
                  Operating / Service Hours
                </label>
                <input
                  type="text"
                  value={formData.openingHours}
                  onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                  placeholder="e.g. 10:00 AM - 11:30 PM"
                  className="w-full bg-white text-[#0d253d] border border-[#a8c3de] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#533afd] focus:ring-1 focus:ring-[#533afd] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#0d253d] mb-1">
                  FSSAI Food License Number
                </label>
                <input
                  type="text"
                  value={formData.fssaiLicense}
                  onChange={(e) => setFormData({ ...formData, fssaiLicense: e.target.value })}
                  className="w-full bg-white text-[#0d253d] border border-[#a8c3de] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#533afd] focus:ring-1 focus:ring-[#533afd] transition-all"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button type="submit" variant="primary" size="md" spark>
              Save Profile Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
