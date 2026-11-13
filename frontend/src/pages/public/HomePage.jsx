import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDonations } from '../../context/DonationContext';
import { Button } from '../../components/common/Button';
import { Badge, CategoryBadge } from '../../components/common/Badge';
import SpotlightCard from '../../components/reactbits/SpotlightCard';
import CountUp from '../../components/reactbits/CountUp';
import {
  HeartHandshake,
  ShieldCheck,
  Clock,
  ArrowRight,
  MapPin,
  CheckCircle2,
  Sparkles,
  Send
} from 'lucide-react';

export const HomePage = () => {
  const { donations } = useDonations();
  const availableDonations = donations.filter((d) => d.status === 'available');

  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    organization: '',
    type: 'Restaurant',
    message: ''
  });

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => setContactSubmitted(false), 5000);
    setContactForm({ name: '', email: '', organization: '', type: 'Restaurant', message: '' });
  };

  return (
    <div className="w-full">
      {/* 1. HERO SECTION (Atmospheric subtle mesh backdrop per DESIGN.md) */}
      <section className="relative overflow-hidden hero-mesh-bg border-b border-[#e3e8ee] pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            {/* Pill Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eef0ff] border border-[#b9b9f9]/50 text-[#4434d4] text-[11px] font-medium tracking-wide uppercase mb-6">
              <span className="w-2 h-2 rounded-full bg-[#533afd] animate-pulse"></span>
              <span>Zero Food Waste • Verified Hunger Relief</span>
            </div>

            {/* Display XXL Headline per DESIGN.md: weight 300 thin, negative letter-spacing */}
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-light text-[#0d253d] tracking-[-0.035em] leading-[1.05] mb-6">
              Turn commercial surplus into immediate nourishment.
            </h1>

            {/* Body lead */}
            <p className="text-base sm:text-lg text-[#273951] font-light leading-relaxed mb-8 max-w-2xl">
              MealMitra connects commercial kitchens, caterers, and restaurants with certified shelters and NGOs in real-time. Safe, compliant, and dignified food redistribution in minutes.
            </p>

            {/* Primary & Secondary Pill CTAs */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <Link to="/register">
                <Button variant="primary" size="lg" icon={ArrowRight} spark>
                  Join the Network
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" size="lg">
                  Explore Live Food Feed
                </Button>
              </Link>
            </div>

            {/* Key Trust Indicators */}
            <div className="mt-10 pt-6 border-t border-[#e3e8ee] flex flex-wrap items-center gap-6 text-xs text-[#64748d]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% FSSAI Safety Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#533afd]" />
                <span>Average 42-min pickup time</span>
              </div>
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-[#ea2261]" />
                <span>Completely Free for Nonprofits</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. LIVE IMPACT METRICS (CountUp from React Bits with Tabular Numbers) */}
      <section id="impact" className="py-16 bg-[#f6f9fc] border-b border-[#e3e8ee]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] font-medium uppercase tracking-wider text-[#64748d]">
              Live Ecosystem Metrics
            </span>
            <h2 className="text-2xl sm:text-3xl font-light text-[#0d253d] tracking-tight mt-2">
              Measurable nourishment delivered across the city
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-white border border-[#e3e8ee] rounded-xl p-6 shadow-stripe-1">
              <p className="text-xs font-semibold text-[#64748d] uppercase tracking-wider mb-2">
                Meals Saved
              </p>
              <div className="text-3xl sm:text-4xl font-light text-[#0d253d] tracking-[-0.03em] tnum">
                <CountUp to={128450} duration={2} separator="," suffix="+" />
              </div>
              <p className="text-xs text-emerald-600 font-medium mt-2">
                ↑ 14% this month
              </p>
            </div>

            <div className="bg-white border border-[#e3e8ee] rounded-xl p-6 shadow-stripe-1">
              <p className="text-xs font-semibold text-[#64748d] uppercase tracking-wider mb-2">
                Partner Kitchens
              </p>
              <div className="text-3xl sm:text-4xl font-light text-[#0d253d] tracking-[-0.03em] tnum">
                <CountUp to={340} duration={1.5} suffix="+" />
              </div>
              <p className="text-xs text-[#64748d] mt-2">
                Hotels, cloud kitchens & caterers
              </p>
            </div>

            <div className="bg-white border border-[#e3e8ee] rounded-xl p-6 shadow-stripe-1">
              <p className="text-xs font-semibold text-[#64748d] uppercase tracking-wider mb-2">
                Verified Shelters & NGOs
              </p>
              <div className="text-3xl sm:text-4xl font-light text-[#0d253d] tracking-[-0.03em] tnum">
                <CountUp to={112} duration={1.5} />
              </div>
              <p className="text-xs text-[#64748d] mt-2">
                Distributing across 18 zones
              </p>
            </div>

            <div className="bg-white border border-[#e3e8ee] rounded-xl p-6 shadow-stripe-1">
              <p className="text-xs font-semibold text-[#64748d] uppercase tracking-wider mb-2">
                CO2 Landfill Emissions Saved
              </p>
              <div className="text-3xl sm:text-4xl font-light text-[#0d253d] tracking-[-0.03em] tnum">
                <CountUp to={54.8} decimals={1} duration={1.8} suffix=" t" />
              </div>
              <p className="text-xs text-emerald-600 font-medium mt-2">
                Diverted from waste streams
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. LIVE AVAILABLE SURPLUS FEED PREVIEW (SpotlightCard from React Bits) */}
      <section className="py-20 bg-white border-b border-[#e3e8ee]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-[11px] font-medium uppercase tracking-wider text-[#533afd] bg-[#eef0ff] px-2.5 py-1 rounded-full">
                Real-Time Listings
              </span>
              <h2 className="text-2xl sm:text-3xl font-light text-[#0d253d] tracking-tight mt-3">
                Surplus food actively awaiting pickup
              </h2>
              <p className="text-sm text-[#64748d] mt-1 font-light">
                Verified NGOs can log in to claim instantly and initiate immediate logistics.
              </p>
            </div>
            <Link to="/login">
              <Button variant="secondary" size="sm">
                View Full Feed ({availableDonations.length} Active)
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableDonations.slice(0, 3).map((donation) => (
              <SpotlightCard
                key={donation.id}
                spotlightColor="#533afd"
                className="flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <CategoryBadge category={donation.category} />
                    <Badge variant="available">Available Now</Badge>
                  </div>

                  <h3 className="text-lg font-normal text-[#0d253d] tracking-tight mb-2">
                    {donation.foodName}
                  </h3>

                  <p className="text-xs text-[#64748d] mb-4 line-clamp-2 font-light">
                    {donation.description}
                  </p>

                  <div className="space-y-2 py-3 border-y border-[#e3e8ee] text-xs text-[#273951]">
                    <div className="flex items-center justify-between">
                      <span className="text-[#64748d]">Quantity:</span>
                      <span className="font-medium text-[#0d253d] tnum">
                        {donation.quantity} {donation.unit}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#64748d]">Prepared:</span>
                      <span className="font-light tnum">
                        {new Date(donation.preparedAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-rose-600">
                      <span>Expires by:</span>
                      <span className="font-medium tnum">
                        {new Date(donation.expiresAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-[#64748d] mt-3">
                    <MapPin className="w-3.5 h-3.5 text-[#533afd] shrink-0" />
                    <span className="truncate">{donation.pickupAddress}</span>
                  </div>
                </div>

                <div className="mt-5 pt-3">
                  <Link to="/login" className="block w-full">
                    <Button variant="primary" size="sm" className="w-full">
                      Claim as Verified NGO
                    </Button>
                  </Link>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* 4. ABOUT SECTION (DESIGN.md card-cream-band feature interlude) */}
      <section id="about" className="py-20 bg-[#f6f9fc] border-b border-[#e3e8ee]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-[11px] font-medium uppercase tracking-wider text-[#64748d]">
                About MealMitra
              </span>
              <h2 className="text-3xl sm:text-4xl font-light text-[#0d253d] tracking-tight leading-tight">
                Closing the loop between urban excess and urban hunger.
              </h2>
              <p className="text-sm sm:text-base text-[#273951] font-light leading-relaxed">
                Millions of nutritious meals are discarded daily from banquets, corporate cafeterias, and restaurants due to lack of coordination. Meanwhile, community shelters struggle with continuous food security.
              </p>
              <p className="text-sm sm:text-base text-[#273951] font-light leading-relaxed">
                MealMitra replaces chaotic messages and manual phone calls with a structured, verified, and auditable network. We enforce hygiene declarations, expiry windows, and real-time dispatch so good food never goes to landfill.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="border-l-2 border-[#533afd] pl-4">
                  <h4 className="text-sm font-semibold text-[#0d253d]">Speed & Precision</h4>
                  <p className="text-xs text-[#64748d] mt-1 font-light">
                    Direct notification to certified NGOs within a 5 km radius.
                  </p>
                </div>
                <div className="border-l-2 border-[#533afd] pl-4">
                  <h4 className="text-sm font-semibold text-[#0d253d]">Safety First</h4>
                  <p className="text-xs text-[#64748d] mt-1 font-light">
                    Mandatory prep timestamps, temperature guidance & FSSAI alignment.
                  </p>
                </div>
              </div>
            </div>

            {/* DESIGN.md card-cream-band feature interlude */}
            <div className="lg:col-span-6">
              <div className="bg-[#f5e9d4]/60 border border-[#e3e8ee] rounded-xl p-8 shadow-stripe-1 space-y-6">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#9b6829] uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-[#9b6829]" />
                  <span>The MealMitra Charter</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-light text-[#0d253d] tracking-tight">
                  "Surplus food is not waste — it is an unshared resource."
                </h3>
                <ul className="space-y-3 text-sm text-[#273951] font-light">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#533afd] shrink-0 mt-0.5" />
                    <span>Free forever for registered charitable organizations and shelters.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#533afd] shrink-0 mt-0.5" />
                    <span>Structured tax donation receipts and auditable ESG diversion metrics.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#533afd] shrink-0 mt-0.5" />
                    <span>Transparent custody tracking from restaurant dock to shelter dining table.</span>
                  </li>
                </ul>

                <div className="pt-2">
                  <Link to="/register">
                    <Button variant="primary" size="md">
                      Get Your Organization Verified
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 bg-white border-b border-[#e3e8ee]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[11px] font-medium uppercase tracking-wider text-[#64748d]">
              Simple 3-Step Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-light text-[#0d253d] tracking-tight mt-2">
              How MealMitra operates seamlessly
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white border border-[#e3e8ee] rounded-xl p-8 shadow-stripe-1 relative">
              <div className="w-10 h-10 rounded-full bg-[#f6f9fc] border border-[#e3e8ee] text-[#533afd] font-semibold flex items-center justify-center text-sm mb-6 tnum">
                01
              </div>
              <h3 className="text-lg font-normal text-[#0d253d] tracking-tight mb-3">
                Post Surplus in 60s
              </h3>
              <p className="text-sm text-[#64748d] font-light leading-relaxed">
                When an event concludes or the kitchen has unsold prepared dishes, the restaurant enters food name, portion count, and expiry deadline with two taps.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white border border-[#e3e8ee] rounded-xl p-8 shadow-stripe-1 relative">
              <div className="w-10 h-10 rounded-full bg-[#eef0ff] border border-[#b9b9f9]/50 text-[#533afd] font-semibold flex items-center justify-center text-sm mb-6 tnum">
                02
              </div>
              <h3 className="text-lg font-normal text-[#0d253d] tracking-tight mb-3">
                Nearby Shelter Claims
              </h3>
              <p className="text-sm text-[#64748d] font-light leading-relaxed">
                Verified NGOs in the immediate radius receive real-time alerts, review dietary specifics, and reserve the batch for their community.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white border border-[#e3e8ee] rounded-xl p-8 shadow-stripe-1 relative">
              <div className="w-10 h-10 rounded-full bg-[#f6f9fc] border border-[#e3e8ee] text-[#533afd] font-semibold flex items-center justify-center text-sm mb-6 tnum">
                03
              </div>
              <h3 className="text-lg font-normal text-[#0d253d] tracking-tight mb-3">
                Hygienic Pickup & Distribution
              </h3>
              <p className="text-sm text-[#64748d] font-light leading-relaxed">
                NGO volunteer or delivery van arrives at the dispatch dock, verifies packaging integrity, confirms handover in the app, and serves hot food.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CONTACT SECTION */}
      <section id="contact" className="py-20 bg-[#f6f9fc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto bg-white border border-[#e3e8ee] rounded-xl p-8 sm:p-10 shadow-stripe-1">
            <div className="text-center mb-8">
              <span className="text-[11px] font-medium uppercase tracking-wider text-[#64748d]">
                Get in Touch
              </span>
              <h2 className="text-2xl sm:text-3xl font-light text-[#0d253d] tracking-tight mt-2">
                Have questions or want a partnership?
              </h2>
              <p className="text-xs sm:text-sm text-[#64748d] mt-2 font-light">
                Our food rescue coordinators in Mumbai, Delhi & Bangalore respond within 4 hours.
              </p>
            </div>

            {contactSubmitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-lg text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="text-base font-medium text-emerald-900">
                  Message Sent Successfully
                </h4>
                <p className="text-xs text-emerald-700">
                  Thank you! Our regional coordinator will reach out to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#0d253d] mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="e.g. Rahul Verma"
                      className="w-full bg-white text-[#0d253d] border border-[#a8c3de] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#533afd] focus:ring-1 focus:ring-[#533afd] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#0d253d] mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="name@organization.com"
                      className="w-full bg-white text-[#0d253d] border border-[#a8c3de] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#533afd] focus:ring-1 focus:ring-[#533afd] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#0d253d] mb-1">
                      Organization Name
                    </label>
                    <input
                      type="text"
                      required
                      value={contactForm.organization}
                      onChange={(e) => setContactForm({ ...contactForm, organization: e.target.value })}
                      placeholder="Restaurant or NGO name"
                      className="w-full bg-white text-[#0d253d] border border-[#a8c3de] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#533afd] focus:ring-1 focus:ring-[#533afd] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#0d253d] mb-1">
                      Organization Type
                    </label>
                    <select
                      value={contactForm.type}
                      onChange={(e) => setContactForm({ ...contactForm, type: e.target.value })}
                      className="w-full bg-white text-[#0d253d] border border-[#a8c3de] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#533afd] focus:ring-1 focus:ring-[#533afd] transition-all"
                    >
                      <option value="Restaurant">Restaurant / Hotel / Caterer</option>
                      <option value="Shelter">Shelter / Charitable Trust / NGO</option>
                      <option value="Volunteer">Volunteer / Driver</option>
                      <option value="Corporate">Corporate CSR / Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#0d253d] mb-1">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="Tell us about your donation capacity or shelter requirements..."
                    className="w-full bg-white text-[#0d253d] border border-[#a8c3de] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#533afd] focus:ring-1 focus:ring-[#533afd] transition-all"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <Button type="submit" variant="primary" size="md" className="w-full" icon={Send} spark>
                    Send Inquiry
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
