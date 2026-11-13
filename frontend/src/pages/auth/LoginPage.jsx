import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { UtensilsCrossed, Building2, Heart, AlertCircle, Sparkles } from 'lucide-react';

export const LoginPage = () => {
  const { login, loginDemo, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [role, setRole] = useState('restaurant'); // 'restaurant' | 'shelter'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      const loggedUser = await login(email, password, role);
      const destination =
        location.state?.from?.pathname ||
        (loggedUser.role === 'restaurant'
          ? '/restaurant/dashboard'
          : '/shelter/dashboard');
      navigate(destination, { replace: true });
    } catch {
      setError('Failed to sign in. Please verify your credentials.');
    }
  };

  const handleDemoLogin = (selectedRole) => {
    loginDemo(selectedRole);
    const destination =
      selectedRole === 'restaurant'
        ? '/restaurant/dashboard'
        : '/shelter/dashboard';
    navigate(destination, { replace: true });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#f6f9fc]">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#533afd] text-white shadow-sm mb-3">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-light text-[#0d253d] tracking-tight">
            Sign in to MealMitra
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-[#64748d] font-light">
            Enter your credentials to manage surplus donations or shelter claims.
          </p>
        </div>

        {/* Quick Demo Login Switcher */}
        <div className="bg-white border border-[#e3e8ee] rounded-xl p-4 shadow-stripe-1">
          <p className="text-[11px] font-semibold text-[#64748d] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#533afd]" />
            <span>Instant Demo Access</span>
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('restaurant')}
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-full text-xs font-medium border border-[#e3e8ee] bg-[#f6f9fc] hover:bg-[#eef0ff] hover:text-[#533afd] hover:border-[#b9b9f9] transition-all text-[#0d253d] cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5 text-[#533afd]" />
              <span>Restaurant Demo</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('shelter')}
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-full text-xs font-medium border border-[#e3e8ee] bg-[#f6f9fc] hover:bg-[#eef0ff] hover:text-[#533afd] hover:border-[#b9b9f9] transition-all text-[#0d253d] cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 text-[#ea2261]" />
              <span>Shelter / NGO Demo</span>
            </button>
          </div>
        </div>

        {/* Form Card (DESIGN.md card-feature-light) */}
        <div className="bg-white border border-[#e3e8ee] rounded-xl p-6 sm:p-8 shadow-stripe-1">
          {error && (
            <div className="mb-5 p-3 rounded-md bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role selector tab */}
            <div>
              <label className="block text-xs font-medium text-[#0d253d] mb-1.5">
                Select Your Role
              </label>
              <div className="grid grid-cols-2 p-1 bg-[#f6f9fc] border border-[#e3e8ee] rounded-full">
                <button
                  type="button"
                  onClick={() => setRole('restaurant')}
                  className={`py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer ${
                    role === 'restaurant'
                      ? 'bg-white text-[#533afd] shadow-xs'
                      : 'text-[#64748d] hover:text-[#0d253d]'
                  }`}
                >
                  Restaurant / Caterer
                </button>
                <button
                  type="button"
                  onClick={() => setRole('shelter')}
                  className={`py-1.5 text-xs font-medium rounded-full transition-all cursor-pointer ${
                    role === 'shelter'
                      ? 'bg-white text-[#533afd] shadow-xs'
                      : 'text-[#64748d] hover:text-[#0d253d]'
                  }`}
                >
                  Shelter / NGO
                </button>
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs font-medium text-[#0d253d] mb-1">
                Account Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  role === 'restaurant'
                    ? 'contact@royalkitchen.com'
                    : 'info@anandamfoundation.org'
                }
                className="w-full bg-white text-[#0d253d] border border-[#a8c3de] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#533afd] focus:ring-1 focus:ring-[#533afd] transition-all"
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-[#0d253d]">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-[#533afd] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white text-[#0d253d] border border-[#a8c3de] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#533afd] focus:ring-1 focus:ring-[#533afd] transition-all"
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={loading}
                className="w-full"
                spark
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </Button>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-[#e3e8ee] text-center">
            <p className="text-xs text-[#64748d]">
              Don't have an account yet?{' '}
              <Link to="/register" className="text-[#533afd] font-medium hover:underline">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
