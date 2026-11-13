import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDonations } from '../../context/DonationContext';
import { Button } from '../../components/common/Button';
import { Badge, CategoryBadge } from '../../components/common/Badge';
import SpotlightCard from '../../components/reactbits/SpotlightCard';
import ShinyText from '../../components/reactbits/ShinyText';
import Magnet from '../../components/reactbits/Magnet';
import CountUp from '../../components/reactbits/CountUp';
import {
  UtensilsCrossed,
  PlusCircle,
  Clock,
  CheckCircle2,
  ArrowRight,
  MapPin,
  TrendingUp,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const RestaurantDashboard = () => {
  const { user } = useAuth();
  const { donations } = useDonations();
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 3;

  const myDonations = donations.filter(
    (d) => d.restaurantId === user?.id || user?.role === 'restaurant'
  );

  const availableCount = myDonations.filter((d) => d.status === 'available').length;
  const claimedCount = myDonations.filter((d) => d.status === 'claimed').length;
  const completedCount = myDonations.filter((d) => d.status === 'picked_up').length;
  const totalMeals = myDonations.reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 0);

  const activeDonations = myDonations.filter(
    (d) => d.status === 'available' || d.status === 'claimed'
  );

  const totalPages = Math.ceil(activeDonations.length / ITEMS_PER_PAGE) || 1;
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedListings = activeDonations.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="w-full hero-mesh-bg py-5 sm:py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5 sm:space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-[#e3e8ee] gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eef0ff] border border-[#b9b9f9]/50 text-[#533afd] text-xs font-medium tracking-wide uppercase mb-2 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#533afd] animate-pulse"></span>
              <ShinyText
                text="Restaurant Partner Portal"
                color="#533afd"
                shineColor="#ffffff"
                speed={3}
                className="font-medium tracking-wider"
              />
            </div>
            <h1 className="text-2xl sm:text-3xl font-light text-[#0d253d] tracking-tight">
              Welcome, {user?.organizationName || user?.name || 'Restaurant Partner'}
            </h1>
            <div className="flex flex-wrap items-center gap-2.5 text-xs sm:text-sm text-[#64748d] mt-1.5 font-light">
              <span className="flex items-center gap-1.5 text-[#64748d]">
                <MapPin className="w-3.5 h-3.5 text-[#533afd] shrink-0" />
                <span className="truncate max-w-xs sm:max-w-md">{user?.address || 'Mumbai, Maharashtra'}</span>
              </span>
              <span className="text-[#e3e8ee]">•</span>
              <span className="inline-flex items-center gap-1.5 text-emerald-700 font-medium text-xs bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/70 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Verified Commercial Donor
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Magnet padding={20} magnetStrength={2}>
              <Link to="/restaurant/donate">
                <Button variant="primary" size="md" icon={PlusCircle} spark>
                  Donate Food Now
                </Button>
              </Link>
            </Magnet>
            <Link to="/restaurant/donations">
              <Button variant="secondary" size="md">
                View All History
              </Button>
            </Link>
          </div>
        </div>

        {/* 4 Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          <SpotlightCard
            spotlightColor="rgba(83, 58, 253, 0.08)"
            className="bg-white border border-[#e3e8ee] rounded-xl p-4 sm:p-5 shadow-stripe-1 hover:border-[#b9b9f9] transition-all"
          >
            <div className="flex items-center justify-between text-[#64748d] text-xs font-medium uppercase tracking-wider mb-2">
              <span>Total Units Donated</span>
              <div className="w-8 h-8 rounded-full bg-[#f6f9fc] border border-[#e3e8ee] text-[#533afd] flex items-center justify-center shrink-0">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-light text-[#0d253d] tracking-[-0.03em] tnum leading-tight mb-1">
              <CountUp to={totalMeals} duration={1.2} separator="," />
            </div>
            <p className="text-xs text-[#64748d] font-light flex items-center gap-1.5 truncate">
              <span className="text-emerald-600 font-medium">+18%</span>
              <span>Nutritious meals & surplus</span>
            </p>
          </SpotlightCard>

          <SpotlightCard
            spotlightColor="rgba(83, 58, 253, 0.08)"
            className="bg-white border border-[#e3e8ee] rounded-xl p-4 sm:p-5 shadow-stripe-1 hover:border-[#b9b9f9] transition-all"
          >
            <div className="flex items-center justify-between text-[#64748d] text-xs font-medium uppercase tracking-wider mb-2">
              <span>Active Available</span>
              <div className="w-8 h-8 rounded-full bg-[#f6f9fc] border border-[#e3e8ee] text-[#533afd] flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-light text-[#0d253d] tracking-[-0.03em] tnum leading-tight mb-1">
              <CountUp to={availableCount} duration={1.2} />
            </div>
            <p className="text-xs text-[#64748d] font-light flex items-center gap-1.5 truncate">
              <span className="inline-flex items-center gap-1 text-[#533afd] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#533afd] animate-pulse"></span>
                Live
              </span>
              <span>Awaiting NGO claim</span>
            </p>
          </SpotlightCard>

          <SpotlightCard
            spotlightColor="rgba(83, 58, 253, 0.08)"
            className="bg-white border border-[#e3e8ee] rounded-xl p-4 sm:p-5 shadow-stripe-1 hover:border-[#b9b9f9] transition-all"
          >
            <div className="flex items-center justify-between text-[#64748d] text-xs font-medium uppercase tracking-wider mb-2">
              <span>Claimed / En Route</span>
              <div className="w-8 h-8 rounded-full bg-[#f6f9fc] border border-[#e3e8ee] text-[#533afd] flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-light text-[#0d253d] tracking-[-0.03em] tnum leading-tight mb-1">
              <CountUp to={claimedCount} duration={1.2} />
            </div>
            <p className="text-xs text-[#64748d] font-light flex items-center gap-1.5 truncate">
              <span className="text-sky-700 font-medium">In Transit</span>
              <span>Pickup scheduled today</span>
            </p>
          </SpotlightCard>

          <SpotlightCard
            spotlightColor="rgba(83, 58, 253, 0.08)"
            className="bg-white border border-[#e3e8ee] rounded-xl p-4 sm:p-5 shadow-stripe-1 hover:border-[#b9b9f9] transition-all"
          >
            <div className="flex items-center justify-between text-[#64748d] text-xs font-medium uppercase tracking-wider mb-2">
              <span>Successful Handouts</span>
              <div className="w-8 h-8 rounded-full bg-[#f6f9fc] border border-[#e3e8ee] text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl sm:text-4xl font-light text-[#0d253d] tracking-[-0.03em] tnum leading-tight mb-1">
              <CountUp to={completedCount} duration={1.2} />
            </div>
            <p className="text-xs text-[#64748d] font-light flex items-center gap-1.5 truncate">
              <span className="text-emerald-600 font-medium">100%</span>
              <span>Verified distributed</span>
            </p>
          </SpotlightCard>
        </div>

        {/* Active Listings Grid / Table */}
        <div className="bg-white border border-[#e3e8ee] rounded-xl shadow-stripe-1 overflow-hidden">
          <div className="px-5 sm:px-6 py-3.5 border-b border-[#e3e8ee] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2.5">
              <h2 className="text-base sm:text-lg font-normal text-[#0d253d] tracking-tight">
                Active Surplus Listings
              </h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#eef0ff] border border-[#b9b9f9]/50 text-[#533afd] text-xs font-medium tnum">
                {activeDonations.length} Active
              </span>
            </div>
            <Link
              to="/restaurant/donations"
              className="text-xs sm:text-sm text-[#533afd] font-medium hover:text-[#4434d4] inline-flex items-center gap-1 group transition-colors"
            >
              <span>Manage All Donations</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {activeDonations.length === 0 ? (
            <div className="p-8 sm:p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#f6f9fc] border border-[#e3e8ee] text-[#64748d] flex items-center justify-center mx-auto">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
              <h3 className="text-base font-normal text-[#0d253d]">
                No active food listings right now
              </h3>
              <p className="text-xs sm:text-sm text-[#64748d] max-w-sm mx-auto font-light">
                Do you have surplus meals from service? List them in seconds to feed nearby shelters.
              </p>
              <div className="pt-2">
                <Magnet padding={20} magnetStrength={2}>
                  <Link to="/restaurant/donate">
                    <Button variant="primary" size="md" icon={PlusCircle}>
                      Create Surplus Listing
                    </Button>
                  </Link>
                </Magnet>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#e3e8ee] bg-[#f6f9fc] text-[11px] font-semibold text-[#64748d] uppercase tracking-wider">
                    <th className="py-3 px-4 sm:px-6">Donation Details</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Quantity</th>
                    <th className="py-3 px-4">Expiry Window</th>
                    <th className="py-3 px-4">Status & NGO</th>
                    <th className="py-3 px-4 sm:px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e3e8ee] text-xs sm:text-sm font-light text-[#273951]">
                  {paginatedListings.map((item) => (
                    <tr key={item.id} className="hover:bg-[#f6f9fc]/70 transition-colors">
                      <td className="py-3 px-4 sm:px-6">
                        <p className="font-normal text-[#0d253d] leading-snug truncate max-w-xs">{item.foodName}</p>
                        <p className="text-[11px] text-[#64748d] tnum font-mono mt-0.5">{item.id}</p>
                      </td>
                      <td className="py-3 px-4">
                        <CategoryBadge category={item.category} />
                      </td>
                      <td className="py-3 px-4 font-medium text-[#0d253d] tnum">
                        {item.quantity} {item.unit}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-rose-600 font-normal tnum inline-flex items-center gap-1.5 text-xs sm:text-sm">
                          <Clock className="w-3.5 h-3.5 shrink-0" />
                          <span>
                            {new Date(item.expiresAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={item.status}>
                          {item.status === 'available' ? 'Available' : 'Claimed by NGO'}
                        </Badge>
                        {item.claimedBy && (
                          <p className="text-xs text-[#533afd] font-medium truncate max-w-[150px] mt-1">
                            {item.claimedBy.shelterName}
                          </p>
                        )}
                      </td>
                      <td className="py-3 px-4 sm:px-6 text-right">
                        <Link to="/restaurant/donations">
                          <Button
                            variant="subtle"
                            size="sm"
                            className="!py-1 !px-3 text-xs rounded-full border border-[#e3e8ee] bg-white text-[#273951] hover:text-[#533afd] hover:border-[#b9b9f9] hover:bg-[#f6f9fc]"
                          >
                            Details
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Footer */}
          {activeDonations.length > 0 && (
            <div className="px-5 sm:px-6 py-3 border-t border-[#e3e8ee] bg-white flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#64748d]">
              <div className="tnum font-light text-xs">
                Showing <span className="font-medium text-[#0d253d]">{startIndex + 1}</span> to{' '}
                <span className="font-medium text-[#0d253d]">
                  {Math.min(startIndex + ITEMS_PER_PAGE, activeDonations.length)}
                </span>{' '}
                of <span className="font-medium text-[#0d253d]">{activeDonations.length}</span> active listings
              </div>

              {totalPages > 1 && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={safeCurrentPage === 1}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-[#e3e8ee] bg-white text-[#273951] hover:bg-[#f6f9fc] hover:text-[#0d253d] disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs font-medium"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Previous</span>
                  </button>

                  <div className="flex items-center gap-1 px-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-6 h-6 rounded-full text-xs font-medium transition-colors flex items-center justify-center tnum ${
                          safeCurrentPage === pageNum
                            ? 'bg-[#533afd] text-white shadow-2xs'
                            : 'text-[#273951] hover:bg-[#f6f9fc] hover:text-[#0d253d]'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={safeCurrentPage === totalPages}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-[#e3e8ee] bg-white text-[#273951] hover:bg-[#f6f9fc] hover:text-[#0d253d] disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs font-medium"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
