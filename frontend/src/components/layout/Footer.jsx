import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, ShieldCheck, Mail, MapPin, Phone } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-[#e3e8ee] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#533afd] text-white flex items-center justify-center">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
              <span className="text-xl font-semibold tracking-tight text-[#0d253d]">
                Meal<span className="text-[#533afd]">Mitra</span>
              </span>
            </div>
            <p className="text-sm text-[#64748d] max-w-sm font-light leading-relaxed">
              India's transparent surplus food redistribution network. Connecting commercial restaurants, catering firms, and food producers with certified shelters and hunger relief NGOs.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#64748d]">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Compliant with FSSAI Surplus Food Safety Protocols</span>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-[#0d253d] uppercase tracking-wider">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-[#64748d] font-light">
              <li>
                <Link to="/" className="hover:text-[#533afd] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <a href="/#feed" className="hover:text-[#533afd] transition-colors">
                  Surplus Feed
                </a>
              </li>
              <li>
                <a href="/#about" className="hover:text-[#533afd] transition-colors">
                  About Our Mission
                </a>
              </li>
              <li>
                <a href="/#how-it-works" className="hover:text-[#533afd] transition-colors">
                  How It Works
                </a>
              </li>
            </ul>
          </div>

          {/* For Partners */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-[#0d253d] uppercase tracking-wider">
              For Partners
            </h4>
            <ul className="space-y-2 text-sm text-[#64748d] font-light">
              <li>
                <Link to="/register" className="hover:text-[#533afd] transition-colors">
                  Register Restaurant
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-[#533afd] transition-colors">
                  Register Shelter / NGO
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-[#533afd] transition-colors">
                  Partner Sign In
                </Link>
              </li>
              <li>
                <a href="/#safety" className="hover:text-[#533afd] transition-colors">
                  Food Safety Guidelines
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-[#0d253d] uppercase tracking-wider">
              Contact Us
            </h4>
            <ul className="space-y-2 text-xs text-[#64748d] font-light">
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#533afd]" />
                <span>support@mealmitra.org</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#533afd]" />
                <span>+91 (022) 2490-1100</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#533afd] shrink-0 mt-0.5" />
                <span>BKC, Bandra East, Mumbai, Maharashtra 400051</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#e3e8ee] flex flex-col sm:flex-row items-center justify-between text-xs text-[#64748d] gap-4">
          <p className="flex items-center gap-1 font-light">
            <span>© 2026 MealMitra Foundation. Dedicated to zero hunger & zero food waste.</span>
          </p>
          <div className="flex items-center gap-6 font-light">
            <a href="#privacy" className="hover:text-[#0d253d] transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-[#0d253d] transition-colors">
              Terms of Service
            </a>
            <a href="#fssai" className="hover:text-[#0d253d] transition-colors">
              FSSAI Compliance
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

