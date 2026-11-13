import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDonations } from '../../context/DonationContext';
import { Button } from '../../components/common/Button';
import { Badge, CategoryBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import SpotlightCard from '../../components/reactbits/SpotlightCard';
import {
  Search,
  MapPin,
  UtensilsCrossed,
  ShieldCheck,
  Building2
} from 'lucide-react';

export const BrowseFoodPage = () => {
  const { user } = useAuth();
  const { donations, claimDonation } = useDonations();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [vegOnly, setVegOnly] = useState(false);
  const [claimModalDonation, setClaimModalDonation] = useState(null);
  const [pickupNotes, setPickupNotes] = useState('');
  const [estimatedArrival, setEstimatedArrival] = useState('30 minutes');
  const [isClaiming, setIsClaiming] = useState(false);

  // Available food donations
  const availableItems = donations.filter((d) => d.status === 'available');

  const filteredItems = availableItems.filter((item) => {
    const matchesSearch =
      item.foodName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.restaurantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.pickupAddress.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' ? true : item.category === selectedCategory;

    const matchesVeg = vegOnly ? item.dietary === 'Vegetarian' : true;

    return matchesSearch && matchesCategory && matchesVeg;
  });

  const handleConfirmClaim = () => {
    if (!claimModalDonation) return;
    setIsClaiming(true);

    setTimeout(() => {
      claimDonation(claimModalDonation.id, user, pickupNotes);
      setIsClaiming(false);
      setClaimModalDonation(null);
      navigate('/shelter/requests');
    }, 450);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#e3e8ee] gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-light text-[#0d253d] tracking-tight">
            Browse Available Surplus Food
          </h1>
          <p className="text-xs sm:text-sm text-[#64748d] mt-1 font-light">
            Real-time surplus batches posted by commercial restaurants and caterers ready for dispatch.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#64748d] bg-[#f6f9fc] border border-[#e3e8ee] px-3.5 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-medium text-[#0d253d] tnum">{availableItems.length}</span>
          <span>batches actively listed</span>
        </div>
      </div>

      {/* Search & Filtering Bar */}
      <div className="bg-white border border-[#e3e8ee] rounded-xl p-4 sm:p-5 shadow-stripe-1 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-8 relative">
            <Search className="w-4 h-4 text-[#64748d] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by dish name, restaurant or area (e.g. Lower Parel, Biryani, Bread)..."
              className="w-full bg-white text-[#0d253d] border border-[#a8c3de] rounded-md pl-10 pr-3 py-2 text-sm focus:outline-none focus:border-[#533afd] focus:ring-1 focus:ring-[#533afd] transition-all"
            />
          </div>

          {/* Pure Veg Toggle */}
          <div className="md:col-span-4 flex items-center justify-end">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#0d253d] select-none">
              <input
                type="checkbox"
                checked={vegOnly}
                onChange={(e) => setVegOnly(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-[#533afd] focus:ring-[#533afd]"
              />
              <span>Pure Vegetarian Only</span>
            </label>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-[#e3e8ee]">
          <span className="text-[11px] font-semibold text-[#64748d] uppercase tracking-wider mr-2 shrink-0">
            Category:
          </span>
          {['All', 'Cooked Meals', 'Bakery', 'Raw Produce', 'Packaged'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#533afd] text-white shadow-xs'
                  : 'bg-[#f6f9fc] text-[#64748d] hover:text-[#0d253d] hover:bg-[#eef0ff]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Food Listings Grid */}
      {filteredItems.length === 0 ? (
        <div className="p-16 text-center bg-white border border-[#e3e8ee] rounded-xl shadow-stripe-1 space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#f6f9fc] border border-[#e3e8ee] text-[#64748d] flex items-center justify-center mx-auto">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <h3 className="text-base font-normal text-[#0d253d]">
            No surplus food found matching your criteria
          </h3>
          <p className="text-xs text-[#64748d] max-w-sm mx-auto font-light">
            Try resetting your filters or check back in a few minutes as new restaurant batches are posted continuously.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <SpotlightCard
              key={item.id}
              spotlightColor="#533afd"
              className="flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <CategoryBadge category={item.category} />
                  <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full uppercase tnum">
                    Available
                  </span>
                </div>

                <h3 className="text-lg font-normal text-[#0d253d] tracking-tight mb-1">
                  {item.foodName}
                </h3>

                <p className="text-xs text-[#64748d] mb-3 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#533afd]" />
                  <span>{item.restaurantName}</span>
                </p>

                <p className="text-xs text-[#273951] mb-4 line-clamp-2 font-light leading-relaxed">
                  {item.description}
                </p>

                <div className="space-y-2 py-3 border-y border-[#e3e8ee] text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#64748d]">Portions Available:</span>
                    <span className="font-medium text-[#0d253d] tnum">
                      {item.quantity} {item.unit}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#64748d]">Dietary:</span>
                    <span className="font-normal text-[#0d253d]">{item.dietary}</span>
                  </div>
                  <div className="flex justify-between text-rose-600 font-normal">
                    <span>Safe Until:</span>
                    <span className="font-medium tnum">
                      {new Date(item.expiresAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-1.5 text-xs text-[#64748d] mt-3">
                  <MapPin className="w-3.5 h-3.5 text-[#533afd] shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{item.pickupAddress}</span>
                </div>
              </div>

              <div className="mt-5 pt-3">
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full"
                  spark
                  onClick={() => setClaimModalDonation(item)}
                >
                  Claim Donation Batch
                </Button>
              </div>
            </SpotlightCard>
          ))}
        </div>
      )}

      {/* Claim Confirmation Modal */}
      <Modal
        isOpen={Boolean(claimModalDonation)}
        onClose={() => setClaimModalDonation(null)}
        title="Confirm Surplus Food Reservation"
        subtitle={`Reserving: ${claimModalDonation?.foodName} (${claimModalDonation?.quantity} ${claimModalDonation?.unit})`}
      >
        {claimModalDonation && (
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="p-3.5 bg-[#f6f9fc] rounded-lg border border-[#e3e8ee] space-y-1.5">
              <p className="text-xs text-[#64748d]">
                Donor Kitchen: <strong className="text-[#0d253d]">{claimModalDonation.restaurantName}</strong>
              </p>
              <p className="text-xs text-[#64748d]">
                Pickup Location: <strong className="text-[#0d253d]">{claimModalDonation.pickupAddress}</strong>
              </p>
              <p className="text-xs text-rose-600 font-medium tnum">
                Must be picked up before: {new Date(claimModalDonation.expiresAt).toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#0d253d] mb-1">
                Estimated Volunteer / Van Arrival Window *
              </label>
              <select
                value={estimatedArrival}
                onChange={(e) => setEstimatedArrival(e.target.value)}
                className="w-full bg-white text-[#0d253d] border border-[#a8c3de] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#533afd] focus:ring-1 focus:ring-[#533afd]"
              >
                <option value="30 minutes">Within 30 minutes</option>
                <option value="45 minutes">Within 45 minutes</option>
                <option value="1 hour">Within 1 hour</option>
                <option value="2 hours">Within 2 hours</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#0d253d] mb-1">
                Pickup Notes & Driver Details (Optional)
              </label>
              <input
                type="text"
                value={pickupNotes}
                onChange={(e) => setPickupNotes(e.target.value)}
                placeholder="e.g. Volunteer Ramesh arriving in white Tata Ace (MH-01-AB-1234)"
                className="w-full bg-white text-[#0d253d] border border-[#a8c3de] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#533afd] focus:ring-1 focus:ring-[#533afd]"
              />
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                By confirming, you agree to inspect temperature and food integrity at the kitchen dock and adhere to sanitary distribution guidelines.
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#e3e8ee]">
              <Button
                variant="subtle"
                size="sm"
                onClick={() => setClaimModalDonation(null)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={isClaiming}
                onClick={handleConfirmClaim}
                spark
              >
                {isClaiming ? 'Reserving...' : 'Confirm Claim & Notify Kitchen'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
