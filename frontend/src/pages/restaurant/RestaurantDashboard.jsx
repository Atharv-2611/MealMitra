import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDonations } from '../../context/DonationContext';
import { MetricCard } from '../../components/common/MetricCard';
import { Button } from '../../components/common/Button';
import { Badge, CategoryBadge } from '../../components/common/Badge';
import {
  UtensilsCrossed,
  PlusCircle,
  Clock,
  CheckCircle2,
  ArrowRight,
  MapPin,
  TrendingUp,
  ShieldCheck,
  Building2
} from 'lucide-react';

export const RestaurantDashboard = () => {
  const { user } = useAuth();
  const { donations } = useDonations();

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 space-y-8">
      {/* Top Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#e3e8ee] gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#64748d] mb-1 font-medium">
            <Building2 className="w-3.5 h-3.5 text-[#533afd]" />
            <span>Restaurant Partner Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-light text-[#0d253d] tracking-tight">
            Welcome, {user?.organizationName || user?.name}
          </h1>
          <p className="text-xs sm:text-sm text-[#64748d] mt-1 font-light flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-[#533afd]" />
            <span className="truncate max-w-xl">{user?.address || 'Mumbai, Maharashtra'}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/restaurant/donate">
            <Button variant="primary" size="md" icon={PlusCircle} spark>
              Donate Food Now
            </Button>
          </Link>
          <Link to="/restaurant/donations">
            <Button variant="secondary" size="md">
              View All History
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Metric Cards (DESIGN.md Level 1 shadow, tabular numbers with CountUp) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <MetricCard
          label="Total Units Donated"
          numericValue={totalMeals}
          subtext="Nutritious meals & bakery surplus"
          trend="+18%"
          icon={UtensilsCrossed}
        />
        <MetricCard
          label="Active Available"
          numericValue={availableCount}
          subtext="Awaiting NGO claim"
          icon={Clock}
        />
        <MetricCard
          label="Claimed / En Route"
          numericValue={claimedCount}
          subtext="Pickup scheduled today"
          icon={TrendingUp}
        />
        <MetricCard
          label="Successful Handouts"
          numericValue={completedCount}
          subtext="Verified distributed"
          icon={CheckCircle2}
        />
      </div>

      {/* Active Listings Grid / Table */}
      <div className="bg-white border border-[#e3e8ee] rounded-xl shadow-stripe-1 overflow-hidden">
        <div className="p-5 md:p-6 border-b border-[#e3e8ee] flex items-center justify-between">
          <div>
            <h2 className="text-lg font-normal text-[#0d253d] tracking-tight">
              Active Surplus Listings
            </h2>
            <p className="text-xs text-[#64748d] mt-0.5 font-light">
              Donations currently waiting for collection or in coordination.
            </p>
          </div>
          <Link
            to="/restaurant/donations"
            className="text-xs text-[#533afd] font-medium hover:underline inline-flex items-center gap-1"
          >
            <span>Manage Donations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {activeDonations.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#f6f9fc] border border-[#e3e8ee] text-[#64748d] flex items-center justify-center mx-auto">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-medium text-[#0d253d]">
              No active food listings right now
            </h3>
            <p className="text-xs text-[#64748d] max-w-sm mx-auto font-light">
              Do you have leftover food from lunch or dinner service? List it in seconds to feed nearby families.
            </p>
            <div className="pt-2">
              <Link to="/restaurant/donate">
                <Button variant="primary" size="sm" icon={PlusCircle}>
                  Create New Donation
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#e3e8ee] bg-[#f6f9fc] text-[11px] font-semibold text-[#64748d] uppercase tracking-wider">
                  <th className="py-3 px-4 md:px-6">Donation Details</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Quantity</th>
                  <th className="py-3 px-4">Expiry Window</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3e8ee] text-xs sm:text-sm font-light text-[#273951]">
                {activeDonations.map((item) => (
                  <tr key={item.id} className="hover:bg-[#f6f9fc]/60 transition-colors">
                    <td className="py-3.5 px-4 md:px-6">
                      <p className="font-normal text-[#0d253d]">{item.foodName}</p>
                      <p className="text-[11px] text-[#64748d] mt-0.5 tnum">{item.id}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <CategoryBadge category={item.category} />
                    </td>
                    <td className="py-3.5 px-4 font-medium text-[#0d253d] tnum">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-rose-600 font-normal tnum">
                        {new Date(item.expiresAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={item.status}>
                        {item.status === 'available' ? 'Available' : 'Claimed by NGO'}
                      </Badge>
                      {item.claimedBy && (
                        <p className="text-[11px] text-[#533afd] font-medium mt-1 truncate max-w-[160px]">
                          {item.claimedBy.shelterName}
                        </p>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link to="/restaurant/donations">
                        <Button variant="subtle" size="sm">
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
      </div>

      {/* Food Safety Compliance Banner */}
      <div className="bg-[#f5e9d4]/40 border border-[#e3e8ee] rounded-xl p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-[#f5e9d4] text-[#9b6829] flex items-center justify-center shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-[#0d253d]">
              FSSAI Standard Hygiene Reminder
            </h4>
            <p className="text-xs text-[#64748d] mt-0.5 font-light">
              Always inspect prepared foods before handover. Ensure hot cooked meals are stored at ≥60°C or safely cooled within 2 hours of preparation.
            </p>
          </div>
        </div>
        <Link to="/restaurant/donate" className="shrink-0">
          <Button variant="dark" size="sm">
            Post Donation
          </Button>
        </Link>
      </div>
    </div>
  );
};

