import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { UtensilsCrossed, Building2, Heart, AlertCircle } from 'lucide-react';

export const RegisterPage = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('restaurant'); // 'restaurant' | 'shelter'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    organizationName: '',
    address: '',
    fssaiLicense: '',
    ngoRegistration: '',
    beneficiaryCount: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      const newUser = await register({ ...formData, role });
      if (newUser.role === 'restaurant') {
        navigate('/restaurant/dashboard');
      } else {
        navigate('/shelter/dashboard');
      }
    } catch {
      setError('Registration failed. Please verify your details.');
    }
  };

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 bg-[#f6f9fc]">
      <div className="max-w-xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#533afd] text-white shadow-sm mb-3">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-light text-[#0d253d] tracking-tight">
            Create a MealMitra Account
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[#64748d] font-light">
            Join the verified network to donate surplus food or feed vulnerable communities.
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-white border border-[#e3e8ee] rounded-xl p-6 sm:p-8 shadow-stripe-1">
          {error && (
            <div className="mb-5 p-3 rounded-md bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Account Type Selection */}
            <div>
              <label className="block text-xs font-medium text-[#0d253d] mb-1.5">
                I am registering as:
              </label>
              <div className="grid grid-cols-2 p-1 bg-[#f6f9fc] border border-[#e3e8ee] rounded-full">
                <button
                  type="button"
                  onClick={() => setRole('restaurant')}
                  className={`py-2 text-xs font-medium rounded-full flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    role === 'restaurant'
                      ? 'bg-white text-[#533afd] shadow-xs'
                      : 'text-[#64748d] hover:text-[#0d253d]'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Restaurant / Kitchen</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('shelter')}
                  className={`py-2 text-xs font-medium rounded-full flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    role === 'shelter'
                      ? 'bg-white text-[#533afd] shadow-xs'
                      : 'text-[#64748d] hover:text-[#0d253d]'
                  }`}
                >
                  <Heart className="w-3.5 h-3.5" />
                  <span>Shelter / Relief NGO</span>
                </button>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#0d253d] mb-1">
                  Representative Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Vikram Sethi"
                  className="w-full bg-white text-[#0d253d] border border-[#a8c3de] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#533afd] focus:ring-1 focus:ring-[#533afd] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#0d253d] mb-1">
                  Official Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="contact@entity.org"
                  className="w-full bg-white text-[#0d253d] border border-[#a8c3de] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#533afd] focus:ring-1 focus:ring-[#533afd] transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#0d253d] mb-1">
                  Organization / Brand Name *
                </label>
                <input
                  type="text"
                  name="organizationName"
                  required
                  value={formData.organizationName}
                  onChange={handleChange}
                  placeholder={
                    role === 'restaurant'
                      ? 'e.g. The Royal Kitchen Caterers'
                      : 'e.g. Anandam Food Relief Trust'
                  }
                  className="w-full bg-white text-[#0d253d] border border-[#a8c3de] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#533afd] focus:ring-1 focus:ring-[#533afd] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#0d253d] mb-1">
                  Phone / Mobile Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98200 00000"
                  className="w-full bg-white text-[#0d253d] border border-[#a8c3de] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#533afd] focus:ring-1 focus:ring-[#533afd] transition-all"
                />
              </div>
            </div>

            {/* Role Specific Fields */}
            {role === 'restaurant' ? (
              <div>
                <label className="block text-xs font-medium text-[#0d253d] mb-1">
                  FSSAI Food License Number (Optional / Recommended)
                </label>
                <input
                  type="text"
                  name="fssaiLicense"
                  value={formData.fssaiLicense}
                  onChange={handleChange}
                  placeholder="14-digit FSSAI registration number"
                  className="w-full bg-white text-[#0d253d] border border-[#a8c3de] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#533afd] focus:ring-1 focus:ring-[#533afd] transition-all"
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#0d253d] mb-1">
                    NGO Registration / Darpan ID
                  </label>
                  <input
                    type="text"
                    name="ngoRegistration"
                    value={formData.ngoRegistration}
                    onChange={handleChange}
                    placeholder="e.g. MH/2022/012938"
                    className="w-full bg-white text-[#0d253d] border border-[#a8c3de] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#533afd] focus:ring-1 focus:ring-[#533afd] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#0d253d] mb-1">
                    Daily Beneficiaries Served
                  </label>
                  <input
                    type="text"
                    name="beneficiaryCount"
                    value={formData.beneficiaryCount}
                    onChange={handleChange}
                    placeholder="e.g. 100-250 people"
                    className="w-full bg-white text-[#0d253d] border border-[#a8c3de] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#533afd] focus:ring-1 focus:ring-[#533afd] transition-all"
                  />
                </div>
              </div>
            )}

            {/* Physical Address */}
            <div>
              <label className="block text-xs font-medium text-[#0d253d] mb-1">
                Full Physical Address (for Pickups / Dispatch) *
              </label>
              <textarea
                rows={2}
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                placeholder="Street address, landmark, area, city, pin code"
                className="w-full bg-white text-[#0d253d] border border-[#a8c3de] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#533afd] focus:ring-1 focus:ring-[#533afd] transition-all"
              />
            </div>

            {/* Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#0d253d] mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  className="w-full bg-white text-[#0d253d] border border-[#a8c3de] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#533afd] focus:ring-1 focus:ring-[#533afd] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#0d253d] mb-1">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  className="w-full bg-white text-[#0d253d] border border-[#a8c3de] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#533afd] focus:ring-1 focus:ring-[#533afd] transition-all"
                />
              </div>
            </div>

            <div className="pt-3">
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={loading}
                className="w-full"
                spark
              >
                {loading ? 'Creating Account...' : 'Complete Registration'}
              </Button>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-[#e3e8ee] text-center">
            <p className="text-xs text-[#64748d]">
              Already registered?{' '}
              <Link to="/login" className="text-[#533afd] font-medium hover:underline">
                Sign in to your account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
