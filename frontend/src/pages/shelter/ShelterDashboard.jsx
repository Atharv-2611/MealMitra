import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDonations } from '../../context/DonationContext';
import { MetricCard } from '../../components/common/MetricCard';
import { Button } from '../../components/common/Button';
import { CategoryBadge } from '../../components/common/Badge';
import SpotlightCard from '../../components/reactbits/SpotlightCard';
import {
  Heart,
  Search,
  Clock,
  MapPin,
  ArrowRight,
  Building2
} from 'lucide-react';

export const ShelterDashboard = () => {
  const { user } = useAuth();
  const { donations } = useDonations();

  const availableDonations = donations.filter((d) => d.status === 'available');
  const myClaims = donations.filter(
    (d) => d.claimedBy?.shelterId === user?.id || (user?.role === 'shelter' && d.status === 'claimed')
  );
  const myCompletedPickups = donations.filter(
    (d) => d.status === 'picked_up'
  );

  const totalMealsClaimed = myCompletedPickups.reduce(
    (acc, curr) => acc + (Number(curr.quantity) || 0),
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#e3e8ee] gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#64748d] mb-1 font-medium">
            <Heart className="w-3.5 h-3.5 text-[#ea2261]" />
            <span>Shelter & NGO Relief Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-light text-[#0d253d] tracking-tight">
            Welcome, {user?.organizationName || user?.name}
          </h1>
          <p className="text-xs sm:text-sm text-[#64748d] mt-1 font-light flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-[#533afd]" />
            <span className="truncate max-w-xl">{user?.address || 'Matunga, Mumbai'}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/shelter/browse">
            <Button variant="primary" size="md" icon={Search} spark>
              Browse Food Feed
            </Button>
          </Link>
          <Link to="/shelter/requests">
            <Button variant="secondary" size="md">
              My Active Pickups ({myClaims.length})
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <MetricCard
          label="Available Surplus Nearby"
          numericValue={availableDonations.length}
          subtext="Ready for immediate claim"
          trend="Live"
          icon={Search}
        />
        <MetricCard
          label="Active Claims & Pickups"
          numericValue={myClaims.length}
          subtext="Coordinating logistics"
          icon={Clock}
        />
        <MetricCard
          label="Total Meals Received"
          numericValue={totalMealsClaimed + 180}
          subtext="Distributed to beneficiaries"
          trend="+22%"
          icon={Heart}
        />
        <MetricCard
          label="Verified Local Partners"
          numericValue={14}
          subtext="Within 8 km radius"
          icon={Building2}
        />
      </div>

      {/* Live Available Food Section (SpotlightCard from React Bits) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-normal text-[#0d253d] tracking-tight">
              Recently Posted Surplus Meals
            </h2>
            <p className="text-xs text-[#64748d] mt-0.5 font-light">
              Fresh commercial batches posted by nearby partner kitchens.
            </p>
          </div>
          <Link
            to="/shelter/browse"
            className="text-xs text-[#533afd] font-medium hover:underline inline-flex items-center gap-1"
          >
            <span>View Full Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {availableDonations.length === 0 ? (
          <div className="p-12 text-center bg-white border border-[#e3e8ee] rounded-xl shadow-stripe-1 space-y-2">
            <p className="text-sm font-medium text-[#0d253d]">
              No unreserved surplus listings right now
            </p>
            <p className="text-xs text-[#64748d] font-light">
              Check back soon or set notification alerts for your zone.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableDonations.slice(0, 3).map((item) => (
              <SpotlightCard
                key={item.id}
                spotlightColor="#533afd"
                className="flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <CategoryBadge category={item.category} />
                    <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full uppercase tnum">
                      Available
                    </span>
                  </div>

                  <h3 className="text-base font-normal text-[#0d253d] tracking-tight mb-1">
                    {item.foodName}
                  </h3>
                  <p className="text-xs text-[#64748d] mb-3">
                    From: <strong className="text-[#0d253d] font-medium">{item.restaurantName}</strong>
                  </p>

                  <div className="py-2.5 px-3 bg-[#f6f9fc] rounded-lg border border-[#e3e8ee] space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#64748d]">Portions:</span>
                      <span className="font-medium text-[#0d253d] tnum">
                        {item.quantity} {item.unit}
                      </span>
                    </div>
                    <div className="flex justify-between text-rose-600 font-normal">
                      <span>Expires:</span>
                      <span className="tnum">
                        {new Date(item.expiresAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-[#64748d] mt-3">
                    <MapPin className="w-3.5 h-3.5 text-[#533afd] shrink-0" />
                    <span className="truncate">{item.pickupAddress}</span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-[#e3e8ee]">
                  <Link to="/shelter/browse" className="block w-full">
                    <Button variant="primary" size="sm" className="w-full">
                      Review & Claim Batch
                    </Button>
                  </Link>
                </div>
              </SpotlightCard>
            ))}
          </div>
        )}
      </div>

      {/* Active Pickups Coordination Table */}
      {myClaims.length > 0 && (
        <div className="bg-white border border-[#e3e8ee] rounded-xl shadow-stripe-1 overflow-hidden">
          <div className="p-5 md:p-6 border-b border-[#e3e8ee] flex items-center justify-between">
            <div>
              <h2 className="text-lg font-normal text-[#0d253d] tracking-tight">
                Scheduled Collections in Progress
              </h2>
              <p className="text-xs text-[#64748d] mt-0.5 font-light">
                Batches currently reserved by your organization awaiting physical dispatch.
              </p>
            </div>
            <Link
              to="/shelter/requests"
              className="text-xs text-[#533afd] font-medium hover:underline"
            >
              View Full Logistics
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#e3e8ee] bg-[#f6f9fc] text-[11px] font-semibold text-[#64748d] uppercase tracking-wider">
                  <th className="py-3 px-4 md:px-6">Donation & Donor</th>
                  <th className="py-3 px-4">Portions</th>
                  <th className="py-3 px-4">Pickup Address</th>
                  <th className="py-3 px-4">Expiry Window</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3e8ee] text-xs sm:text-sm font-light text-[#273951]">
                {myClaims.map((item) => (
                  <tr key={item.id} className="hover:bg-[#f6f9fc]/60 transition-colors">
                    <td className="py-3.5 px-4 md:px-6">
                      <p className="font-normal text-[#0d253d]">{item.foodName}</p>
                      <p className="text-[11px] text-[#64748d]">{item.restaurantName}</p>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-[#0d253d] tnum">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-[#64748d] max-w-xs truncate">
                      {item.pickupAddress}
                    </td>
                    <td className="py-3.5 px-4 text-rose-600 font-normal tnum">
                      {new Date(item.expiresAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link to="/shelter/requests">
                        <Button variant="primary" size="sm">
                          Pickup Details
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
