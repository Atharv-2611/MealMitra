import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDonations } from '../../context/DonationContext';
import { Button } from '../common/Button';
import {
  UtensilsCrossed,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  PlusCircle,
  Search
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, role, logout } = useAuth();
  const { unreadCount } = useDonations();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#e3e8ee] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to={
              isAuthenticated
                ? role === 'restaurant'
                  ? '/restaurant/dashboard'
                  : '/shelter/dashboard'
                : '/'
            }
            className="flex items-center gap-2.5 text-[#0d253d] group"
          >
            <div className="w-9 h-9 rounded-full bg-[#533afd] text-white flex items-center justify-center shadow-sm group-hover:bg-[#4434d4] transition-colors">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-semibold tracking-tight text-[#0d253d]">
                Meal<span className="text-[#533afd]">Mitra</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] uppercase tracking-wider text-[#64748d] border-l border-[#e3e8ee] pl-2 font-medium">
                Food Recovery Network
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {!isAuthenticated ? (
              // Public Navigation
              <>
                <Link
                  to="/"
                  className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    isActive('/')
                      ? 'text-[#533afd] bg-[#eef0ff]'
                      : 'text-[#273951] hover:text-[#533afd] hover:bg-[#f6f9fc]'
                  }`}
                >
                  Home
                </Link>
                <a
                  href="/#feed"
                  className="px-3.5 py-1.5 rounded-full text-sm font-medium text-[#273951] hover:text-[#533afd] hover:bg-[#f6f9fc] transition-colors"
                >
                  Surplus Feed
                </a>
                <a
                  href="/#about"
                  className="px-3.5 py-1.5 rounded-full text-sm font-medium text-[#273951] hover:text-[#533afd] hover:bg-[#f6f9fc] transition-colors"
                >
                  About
                </a>
                <a
                  href="/#how-it-works"
                  className="px-3.5 py-1.5 rounded-full text-sm font-medium text-[#273951] hover:text-[#533afd] hover:bg-[#f6f9fc] transition-colors"
                >
                  How It Works
                </a>
              </>
            ) : role === 'restaurant' ? (
              // Restaurant Navigation
              <>
                <Link
                  to="/restaurant/dashboard"
                  className={`px-3 py-1.5 rounded-full text-sm font-normal transition-colors ${
                    isActive('/restaurant/dashboard')
                      ? 'text-[#533afd] bg-[#eef0ff]'
                      : 'text-[#273951] hover:text-[#0d253d] hover:bg-[#f6f9fc]'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/restaurant/donate"
                  className={`px-3 py-1.5 rounded-full text-sm font-normal flex items-center gap-1.5 transition-colors ${
                    isActive('/restaurant/donate')
                      ? 'text-[#533afd] bg-[#eef0ff]'
                      : 'text-[#273951] hover:text-[#0d253d] hover:bg-[#f6f9fc]'
                  }`}
                >
                  <PlusCircle className="w-4 h-4 text-[#533afd]" />
                  <span>Donate Food</span>
                </Link>
                <Link
                  to="/restaurant/donations"
                  className={`px-3 py-1.5 rounded-full text-sm font-normal transition-colors ${
                    isActive('/restaurant/donations')
                      ? 'text-[#533afd] bg-[#eef0ff]'
                      : 'text-[#273951] hover:text-[#0d253d] hover:bg-[#f6f9fc]'
                  }`}
                >
                  My Donations
                </Link>
                <Link
                  to="/restaurant/profile"
                  className={`px-3 py-1.5 rounded-full text-sm font-normal transition-colors ${
                    isActive('/restaurant/profile')
                      ? 'text-[#533afd] bg-[#eef0ff]'
                      : 'text-[#273951] hover:text-[#0d253d] hover:bg-[#f6f9fc]'
                  }`}
                >
                  Profile
                </Link>
              </>
            ) : (
              // Shelter / NGO Navigation
              <>
                <Link
                  to="/shelter/dashboard"
                  className={`px-3 py-1.5 rounded-full text-sm font-normal transition-colors ${
                    isActive('/shelter/dashboard')
                      ? 'text-[#533afd] bg-[#eef0ff]'
                      : 'text-[#273951] hover:text-[#0d253d] hover:bg-[#f6f9fc]'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/shelter/browse"
                  className={`px-3 py-1.5 rounded-full text-sm font-normal flex items-center gap-1.5 transition-colors ${
                    isActive('/shelter/browse')
                      ? 'text-[#533afd] bg-[#eef0ff]'
                      : 'text-[#273951] hover:text-[#0d253d] hover:bg-[#f6f9fc]'
                  }`}
                >
                  <Search className="w-4 h-4 text-[#533afd]" />
                  <span>Browse Food</span>
                </Link>
                <Link
                  to="/shelter/requests"
                  className={`px-3 py-1.5 rounded-full text-sm font-normal transition-colors ${
                    isActive('/shelter/requests')
                      ? 'text-[#533afd] bg-[#eef0ff]'
                      : 'text-[#273951] hover:text-[#0d253d] hover:bg-[#f6f9fc]'
                  }`}
                >
                  My Requests
                </Link>
                <Link
                  to="/shelter/profile"
                  className={`px-3 py-1.5 rounded-full text-sm font-normal transition-colors ${
                    isActive('/shelter/profile')
                      ? 'text-[#533afd] bg-[#eef0ff]'
                      : 'text-[#273951] hover:text-[#0d253d] hover:bg-[#f6f9fc]'
                  }`}
                >
                  NGO Profile
                </Link>
              </>
            )}
          </nav>

          {/* Right Action Bar */}
          <div className="hidden md:flex items-center gap-2">
            {!isAuthenticated ? (
              <>
                <Link to="/login">
                  <Button variant="subtle" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm" spark>
                    Register
                  </Button>
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-1.5">
                {/* Notifications link */}
                <Link
                  to="/notifications"
                  className={`relative p-2 rounded-full text-[#64748d] hover:text-[#0d253d] hover:bg-[#f6f9fc] transition-colors ${
                    isActive('/notifications') ? 'text-[#533afd] bg-[#eef0ff]' : ''
                  }`}
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#ea2261]" />
                  )}
                </Link>

                {/* Settings link */}
                <Link
                  to="/settings"
                  className={`p-2 rounded-full text-[#64748d] hover:text-[#0d253d] hover:bg-[#f6f9fc] transition-colors ${
                    isActive('/settings') ? 'text-[#533afd] bg-[#eef0ff]' : ''
                  }`}
                  title="Settings"
                >
                  <Settings className="w-4 h-4" />
                </Link>

                {/* Organization badge */}
                <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-[#e3e8ee]">
                  <div className="text-right">
                    <p className="text-xs font-medium text-[#0d253d] leading-none">
                      {user?.organizationName || user?.name}
                    </p>
                    <p className="text-[10px] uppercase tracking-wider text-[#64748d] leading-none mt-1">
                      {role === 'restaurant' ? 'Restaurant Partner' : 'Shelter / NGO'}
                    </p>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="ml-2 p-2 rounded-full text-[#64748d] hover:text-[#ea2261] hover:bg-rose-50 transition-colors"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            {isAuthenticated && (
              <Link
                to="/notifications"
                className="relative p-2 rounded-full text-[#64748d]"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#ea2261]" />
                )}
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full text-[#0d253d] hover:bg-[#f6f9fc] focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#e3e8ee] px-4 pt-2 pb-6 space-y-2 shadow-lg">
          {isAuthenticated && (
            <div className="py-2.5 px-3 mb-2 rounded-lg bg-[#f6f9fc] border border-[#e3e8ee]">
              <p className="text-xs font-semibold text-[#0d253d]">
                {user?.organizationName || user?.name}
              </p>
              <p className="text-[11px] text-[#64748d]">
                {user?.email} • {role === 'restaurant' ? 'Restaurant' : 'Shelter/NGO'}
              </p>
            </div>
          )}

          {!isAuthenticated ? (
            <>
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-medium text-[#0d253d] hover:bg-[#f6f9fc] hover:text-[#533afd] transition-colors"
              >
                Home
              </Link>
              <a
                href="/#feed"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-medium text-[#273951] hover:bg-[#f6f9fc] hover:text-[#533afd] transition-colors"
              >
                Surplus Feed
              </a>
              <a
                href="/#about"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-medium text-[#273951] hover:bg-[#f6f9fc] hover:text-[#533afd] transition-colors"
              >
                About
              </a>
              <a
                href="/#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-medium text-[#273951] hover:bg-[#f6f9fc] hover:text-[#533afd] transition-colors"
              >
                How It Works
              </a>

              <div className="pt-4 space-y-2 border-t border-[#e3e8ee]">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-2 text-sm text-[#533afd] font-medium"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full"
                >
                  <Button variant="primary" className="w-full">
                    Register Free
                  </Button>
                </Link>
              </div>
            </>
          ) : role === 'restaurant' ? (
            <>
              <Link
                to="/restaurant/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-sm text-[#0d253d] hover:bg-[#f6f9fc]"
              >
                Dashboard
              </Link>
              <Link
                to="/restaurant/donate"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-sm text-[#533afd] font-medium hover:bg-[#f6f9fc]"
              >
                + Donate Food
              </Link>
              <Link
                to="/restaurant/donations"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-sm text-[#0d253d] hover:bg-[#f6f9fc]"
              >
                My Donations
              </Link>
              <Link
                to="/restaurant/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-sm text-[#0d253d] hover:bg-[#f6f9fc]"
              >
                Restaurant Profile
              </Link>
              <Link
                to="/notifications"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-sm text-[#0d253d] hover:bg-[#f6f9fc]"
              >
                Notifications ({unreadCount})
              </Link>
              <Link
                to="/settings"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-sm text-[#0d253d] hover:bg-[#f6f9fc]"
              >
                Settings
              </Link>
              <div className="pt-3 border-t border-[#e3e8ee]">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-sm text-[#ea2261] font-medium flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log out</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/shelter/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-sm text-[#0d253d] hover:bg-[#f6f9fc]"
              >
                Dashboard
              </Link>
              <Link
                to="/shelter/browse"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-sm text-[#533afd] font-medium hover:bg-[#f6f9fc]"
              >
                Browse Food Feed
              </Link>
              <Link
                to="/shelter/requests"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-sm text-[#0d253d] hover:bg-[#f6f9fc]"
              >
                My Requests & Pickups
              </Link>
              <Link
                to="/shelter/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-sm text-[#0d253d] hover:bg-[#f6f9fc]"
              >
                NGO Profile
              </Link>
              <Link
                to="/notifications"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-sm text-[#0d253d] hover:bg-[#f6f9fc]"
              >
                Notifications ({unreadCount})
              </Link>
              <Link
                to="/settings"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-sm text-[#0d253d] hover:bg-[#f6f9fc]"
              >
                Settings
              </Link>
              <div className="pt-3 border-t border-[#e3e8ee]">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-sm text-[#ea2261] font-medium flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log out</span>
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
};
