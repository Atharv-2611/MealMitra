import React from 'react';
import { Link } from 'react-router-dom';
import { useDonations } from '../../context/DonationContext';
import { Button } from '../../components/common/Button';
import { Badge, CategoryBadge } from '../../components/common/Badge';
import SpotlightCard from '../../components/reactbits/SpotlightCard';
import CountUp from '../../components/reactbits/CountUp';
import BlurText from '../../components/reactbits/BlurText';
import ShinyText from '../../components/reactbits/ShinyText';
import Magnet from '../../components/reactbits/Magnet';
import {
  HeartHandshake,
  ShieldCheck,
  Clock,
  ArrowRight,
  MapPin,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Truck
} from 'lucide-react';

export const HomePage = () => {
  const { donations } = useDonations();
  const availableDonations = donations.filter((d) => d.status === 'available');

  return (
    <div className="w-full">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (100vh / min-h-[calc(100vh-4rem)] with Atmospheric Mesh) */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden hero-mesh-bg border-b border-[#e3e8ee] min-h-[calc(100vh-4rem)] flex flex-col justify-center py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-4xl">
            {/* Pill Eyebrow with ShinyText */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eef0ff] border border-[#b9b9f9]/50 text-[#4434d4] text-[11px] font-medium tracking-wide uppercase mb-5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#533afd] animate-pulse"></span>
              <ShinyText
                text="Zero Food Waste • Verified Hunger Relief"
                color="#4434d4"
                shineColor="#ffffff"
                speed={3}
                className="font-medium tracking-wider"
              />
            </div>

            {/* Display XXL Headline with React Bits BlurText */}
            <div className="mb-5">
              <BlurText
                text="Turn commercial surplus into immediate nourishment."
                delay={40}
                animateBy="words"
                direction="top"
                className="text-4xl sm:text-5xl lg:text-[56px] font-light text-[#0d253d] tracking-[-0.035em] leading-[1.05]"
              />
            </div>

            {/* Body lead */}
            <p className="text-base sm:text-lg text-[#273951] font-light leading-relaxed mb-8 max-w-2xl">
              MealMitra connects commercial kitchens, caterers, and restaurants with certified shelters and NGOs in real-time. Safe, compliant, and dignified food redistribution in minutes.
            </p>

            {/* Primary & Secondary Pill CTAs with React Bits Magnet */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-8">
              <Magnet padding={40} magnetStrength={3}>
                <Link to="/register">
                  <Button variant="primary" size="lg" icon={ArrowRight} spark>
                    Join the Network
                  </Button>
                </Link>
              </Magnet>
              <Magnet padding={40} magnetStrength={3}>
                <Link to="/login">
                  <Button variant="secondary" size="lg">
                    Explore Live Food Feed
                  </Button>
                </Link>
              </Magnet>
            </div>

            {/* Key Trust Indicators */}
            <div className="pt-4 border-t border-[#e3e8ee]/80 flex flex-wrap items-center gap-6 sm:gap-8 text-xs text-[#64748d]">
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

          {/* Integrated Live Impact Metrics Bar in Hero Anchor */}
          <div className="mt-10 pt-6 border-t border-[#e3e8ee]/80">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-medium uppercase tracking-wider text-[#64748d]">
                Live Ecosystem Impact
              </span>
              <span className="text-xs text-emerald-600 font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                Real-Time Audited
              </span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              <div className="bg-white/90 backdrop-blur-sm border border-[#e3e8ee] rounded-xl p-5 shadow-stripe-1 hover:border-[#b9b9f9] transition-colors">
                <p className="text-[11px] font-semibold text-[#64748d] uppercase tracking-wider mb-1.5">
                  Meals Saved
                </p>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-light text-[#0d253d] tracking-[-0.03em] tnum">
                  <CountUp to={128450} duration={2} separator="," suffix="+" />
                </div>
                <p className="text-xs text-emerald-600 font-medium mt-1.5 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>14% increase this month</span>
                </p>
              </div>

              <div className="bg-white/90 backdrop-blur-sm border border-[#e3e8ee] rounded-xl p-5 shadow-stripe-1 hover:border-[#b9b9f9] transition-colors">
                <p className="text-[11px] font-semibold text-[#64748d] uppercase tracking-wider mb-1.5">
                  Partner Kitchens
                </p>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-light text-[#0d253d] tracking-[-0.03em] tnum">
                  <CountUp to={340} duration={1.5} suffix="+" />
                </div>
                <p className="text-xs text-[#64748d] mt-1.5">
                  Hotels, caterers & cloud kitchens
                </p>
              </div>

              <div className="bg-white/90 backdrop-blur-sm border border-[#e3e8ee] rounded-xl p-5 shadow-stripe-1 hover:border-[#b9b9f9] transition-colors">
                <p className="text-[11px] font-semibold text-[#64748d] uppercase tracking-wider mb-1.5">
                  Verified Shelters
                </p>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-light text-[#0d253d] tracking-[-0.03em] tnum">
                  <CountUp to={112} duration={1.5} />
                </div>
                <p className="text-xs text-[#64748d] mt-1.5">
                  Distributing across 18 zones
                </p>
              </div>

              <div className="bg-white/90 backdrop-blur-sm border border-[#e3e8ee] rounded-xl p-5 shadow-stripe-1 hover:border-[#b9b9f9] transition-colors">
                <p className="text-[11px] font-semibold text-[#64748d] uppercase tracking-wider mb-1.5">
                  CO2 Landfill Saved
                </p>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-light text-[#0d253d] tracking-[-0.03em] tnum">
                  <CountUp to={54.8} decimals={1} duration={1.8} suffix=" t" />
                </div>
                <p className="text-xs text-emerald-600 font-medium mt-1.5 flex items-center gap-1">
                  <span>Diverted from waste streams</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. LIVE AVAILABLE SURPLUS FEED PREVIEW (100vh / min-h-screen)              */}
      {/* ========================================================================= */}
      <section id="feed" className="min-h-screen flex flex-col justify-center py-16 lg:py-20 bg-white border-b border-[#e3e8ee]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eef0ff] border border-[#b9b9f9]/50 text-[#533afd] text-[11px] font-medium tracking-wide uppercase mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#533afd] animate-pulse"></span>
                <span>Real-Time Food Feed</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-light text-[#0d253d] tracking-[-0.035em] leading-[1.1]">
                Surplus food actively awaiting pickup
              </h2>
              <p className="text-sm sm:text-base text-[#64748d] font-light mt-2 max-w-2xl leading-relaxed">
                Verified NGOs and community shelters can claim surplus batches in real-time. Automated route dispatch and FSSAI hygiene declarations attached to every listing.
              </p>
            </div>
            <Link to="/login" className="shrink-0">
              <Button variant="secondary" size="md">
                View Full Feed ({availableDonations.length} Active)
              </Button>
            </Link>
          </div>

          {/* 3 Cards Grid per DESIGN.md card-feature-light */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {availableDonations.slice(0, 3).map((donation) => (
              <SpotlightCard
                key={donation.id}
                spotlightColor="#533afd"
                className="flex flex-col justify-between bg-white border border-[#e3e8ee] rounded-xl p-8 shadow-stripe-1 hover:border-[#b9b9f9] transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <CategoryBadge category={donation.category} />
                    <Badge variant="available">Available Now</Badge>
                  </div>

                  <h3 className="text-xl font-normal text-[#0d253d] tracking-tight mb-2">
                    {donation.foodName}
                  </h3>

                  <p className="text-sm text-[#64748d] font-light leading-relaxed mb-6 line-clamp-2">
                    {donation.description}
                  </p>

                  <div className="space-y-3 py-4 border-y border-[#e3e8ee] text-xs text-[#273951]">
                    <div className="flex items-center justify-between">
                      <span className="text-[#64748d]">Quantity Available:</span>
                      <span className="font-semibold text-[#0d253d] tnum">
                        {donation.quantity} {donation.unit}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#64748d]">Prepared Timestamp:</span>
                      <span className="font-light tnum">
                        {new Date(donation.preparedAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[#ea2261]">
                      <span className="font-medium">Safe Expiry Window:</span>
                      <span className="font-medium tnum">
                        {new Date(donation.expiresAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#64748d] mt-4">
                    <MapPin className="w-3.5 h-3.5 text-[#533afd] shrink-0" />
                    <span className="truncate">{donation.pickupAddress}</span>
                  </div>
                </div>

                <div className="mt-6 pt-2">
                  <Magnet padding={30} magnetStrength={3} wrapperClassName="w-full">
                    <Link to="/login" className="block w-full">
                      <Button variant="primary" size="sm" className="w-full">
                        Claim as Verified NGO
                      </Button>
                    </Link>
                  </Magnet>
                </div>
              </SpotlightCard>
            ))}
          </div>

          {/* Sub-note per DESIGN.md */}
          <p className="text-xs text-[#64748d] text-center mt-8 font-light">
            All surplus listings are backed by verified donor hygiene self-declarations and temperature safety guidelines. Free forever for certified charities.
          </p>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. ABOUT SECTION (100vh / min-h-screen with card-cream-band Charter)       */}
      {/* ========================================================================= */}
      <section id="about" className="min-h-screen flex items-center justify-center py-16 bg-[#f6f9fc] border-b border-[#e3e8ee]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column: Mission Narrative & Capability Pillars */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eef0ff] border border-[#b9b9f9]/50 text-[#533afd] text-[11px] font-medium tracking-wide uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#533afd]"></span>
                <span>Civic Infrastructure & Mission</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-light text-[#0d253d] tracking-[-0.035em] leading-[1.12]">
                Closing the loop between urban excess and urban hunger.
              </h2>

              <p className="text-base sm:text-lg text-[#273951] font-light leading-relaxed">
                Millions of nutritious meals are discarded daily from commercial kitchens, luxury hotels, and corporate cafeterias due to lack of coordination. Meanwhile, community shelters struggle with continuous food security.
              </p>

              <p className="text-sm sm:text-base text-[#64748d] font-light leading-relaxed">
                MealMitra replaces chaotic messages and manual phone calls with a structured, verified, and auditable network. We enforce hygiene declarations, expiry windows, and real-time dispatch so good food never goes to landfill.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div className="border-l-2 border-[#533afd] pl-4">
                  <h4 className="text-base font-semibold text-[#0d253d] tracking-tight">Speed & Precision</h4>
                  <p className="text-xs text-[#64748d] mt-1 font-light leading-relaxed">
                    Direct notification to certified NGOs within a 5 km radius for sub-45min arrival.
                  </p>
                </div>
                <div className="border-l-2 border-[#533afd] pl-4">
                  <h4 className="text-base font-semibold text-[#0d253d] tracking-tight">Safety First</h4>
                  <p className="text-xs text-[#64748d] mt-1 font-light leading-relaxed">
                    Mandatory prep timestamps, temperature guidance & FSSAI alignment.
                  </p>
                </div>
              </div>

              {/* Trust Indicators Row per DESIGN.md */}
              <div className="pt-4 border-t border-[#e3e8ee] flex flex-wrap items-center gap-6 text-xs text-[#64748d]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>FSSAI Safety Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#533afd] shrink-0" />
                  <span>Sub-45 Min Hot Chain</span>
                </div>
                <div className="flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-[#ea2261] shrink-0" />
                  <span>Zero Shelter Fees</span>
                </div>
              </div>
            </div>

            {/* Right Column: DESIGN.md card-cream-band feature interlude with SpotlightCard */}
            <div className="lg:col-span-6">
              <SpotlightCard
                spotlightColor="#9b6829"
                className="!bg-[#f5e9d4]/85 border border-[#e3e8ee] rounded-xl p-8 sm:p-10 shadow-stripe-1 space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#9b6829] uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-[#9b6829]" />
                    <ShinyText
                      text="The MealMitra Charter"
                      color="#9b6829"
                      shineColor="#ffffff"
                      speed={3}
                      className="font-semibold"
                    />
                  </div>
                  <span className="text-[10px] font-medium text-[#9b6829] bg-[#f5e9d4] px-2.5 py-0.5 rounded-full border border-[#9b6829]/30 uppercase tracking-wider">
                    Civic Guarantee
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-light text-[#0d253d] tracking-tight leading-snug">
                  "Surplus food is not waste — it is an unshared resource."
                </h3>

                <ul className="space-y-4 text-sm text-[#273951] font-light">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#533afd] shrink-0 mt-0.5" />
                    <span>Free forever for registered charitable organizations, orphanages & shelters.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#533afd] shrink-0 mt-0.5" />
                    <span>Structured tax donation receipts and auditable ESG diversion metrics.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#533afd] shrink-0 mt-0.5" />
                    <span>Transparent custody tracking from restaurant dock to shelter dining table.</span>
                  </li>
                </ul>

                {/* Integrated Tabular Verification Strip */}
                <div className="grid grid-cols-3 gap-2 py-3.5 border-y border-[#9b6829]/25 text-center">
                  <div>
                    <span className="block text-lg sm:text-xl font-light text-[#0d253d] tnum">42 min</span>
                    <span className="text-[10px] text-[#64748d] uppercase tracking-wider">Avg Turnaround</span>
                  </div>
                  <div className="border-x border-[#9b6829]/25">
                    <span className="block text-lg sm:text-xl font-light text-emerald-700 tnum">100%</span>
                    <span className="text-[10px] text-[#64748d] uppercase tracking-wider">FSSAI Checked</span>
                  </div>
                  <div>
                    <span className="block text-lg sm:text-xl font-light text-[#533afd] tnum">₹0.00</span>
                    <span className="text-[10px] text-[#64748d] uppercase tracking-wider">Shelter Cost</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Magnet padding={35} magnetStrength={3}>
                    <Link to="/register">
                      <Button variant="primary" size="md">
                        Get Your Organization Verified
                      </Button>
                    </Link>
                  </Magnet>
                </div>
              </SpotlightCard>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. HOW IT WORKS SECTION (100vh / min-h-screen)                             */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="min-h-screen flex flex-col justify-center py-16 lg:py-20 bg-white border-b border-[#e3e8ee]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-[11px] font-medium uppercase tracking-wider text-[#64748d]">
              Simple 3-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-light text-[#0d253d] tracking-[-0.035em] leading-[1.1] mt-2 mb-3">
              How MealMitra operates seamlessly
            </h2>
            <p className="text-sm sm:text-base text-[#64748d] font-light leading-relaxed">
              A deterministic protocol engineered for speed, hygiene verification, and complete digital accountability.
            </p>
          </div>

          {/* 3 Step Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <SpotlightCard
              spotlightColor="#533afd"
              className="bg-white border border-[#e3e8ee] rounded-xl p-8 shadow-stripe-1 relative flex flex-col justify-between hover:border-[#b9b9f9] transition-all"
            >
              <div>
                <div className="w-10 h-10 rounded-full bg-[#f6f9fc] border border-[#e3e8ee] text-[#533afd] font-semibold flex items-center justify-center text-sm mb-6 tnum">
                  01
                </div>
                <h3 className="text-xl font-normal text-[#0d253d] tracking-tight mb-3">
                  Post Surplus in 60s
                </h3>
                <p className="text-sm text-[#64748d] font-light leading-relaxed">
                  When an event concludes or the kitchen has unsold prepared dishes, the restaurant enters food name, portion count, and expiry deadline with two taps.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-[#e3e8ee]/80 text-xs text-[#533afd] font-medium flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>Average listing time: 48 seconds</span>
              </div>
            </SpotlightCard>

            {/* Step 2 */}
            <SpotlightCard
              spotlightColor="#533afd"
              className="bg-white border border-[#e3e8ee] rounded-xl p-8 shadow-stripe-1 relative flex flex-col justify-between hover:border-[#b9b9f9] transition-all"
            >
              <div>
                <div className="w-10 h-10 rounded-full bg-[#eef0ff] border border-[#b9b9f9]/50 text-[#533afd] font-semibold flex items-center justify-center text-sm mb-6 tnum">
                  02
                </div>
                <h3 className="text-xl font-normal text-[#0d253d] tracking-tight mb-3">
                  Nearby Shelter Claims
                </h3>
                <p className="text-sm text-[#64748d] font-light leading-relaxed">
                  Verified NGOs in the immediate radius receive real-time alerts, review dietary specifics, and reserve the batch for their community.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-[#e3e8ee]/80 text-xs text-emerald-600 font-medium flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Instant broadcast within 5 km radius</span>
              </div>
            </SpotlightCard>

            {/* Step 3 */}
            <SpotlightCard
              spotlightColor="#533afd"
              className="bg-white border border-[#e3e8ee] rounded-xl p-8 shadow-stripe-1 relative flex flex-col justify-between hover:border-[#b9b9f9] transition-all"
            >
              <div>
                <div className="w-10 h-10 rounded-full bg-[#f6f9fc] border border-[#e3e8ee] text-[#533afd] font-semibold flex items-center justify-center text-sm mb-6 tnum">
                  03
                </div>
                <h3 className="text-xl font-normal text-[#0d253d] tracking-tight mb-3">
                  Hygienic Pickup & Distribution
                </h3>
                <p className="text-sm text-[#64748d] font-light leading-relaxed">
                  NGO volunteer arrives at the dispatch dock, verifies packaging integrity, confirms handover in the app, and serves hot food directly.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-[#e3e8ee]/80 text-xs text-[#4434d4] font-medium flex items-center gap-1.5">
                <Truck className="w-4 h-4" />
                <span>Average door-to-table: 42 minutes</span>
              </div>
            </SpotlightCard>
          </div>

          {/* Quick Platform Entry Banner */}
          <div className="mt-12 p-8 rounded-xl bg-[#f6f9fc] border border-[#e3e8ee] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-stripe-1">
            <div className="text-center sm:text-left">
              <h4 className="text-base sm:text-lg font-normal text-[#0d253d]">
                Ready to eliminate commercial food waste in your kitchen or city?
              </h4>
              <p className="text-xs sm:text-sm text-[#64748d] mt-1 font-light">
                Sign up takes less than 3 minutes. Zero onboarding or platform fees for charitable organizations.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Magnet padding={30} magnetStrength={3}>
                <Link to="/register">
                  <Button variant="primary" size="md" icon={ArrowRight} spark>
                    Get Started Now
                  </Button>
                </Link>
              </Magnet>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
