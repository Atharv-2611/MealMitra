import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDonations } from '../../context/DonationContext';
import { Button } from '../../components/common/Button';
import { Badge, CategoryBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import {
  UtensilsCrossed,
  PlusCircle,
  Search
} from 'lucide-react';

export const MyDonationsPage = () => {
  const { user } = useAuth();
  const { donations, updateDonationStatus, cancelDonation } = useDonations();

  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [cancelModalItem, setCancelModalItem] = useState(null);
  const [cancelReason, setCancelReason] = useState('');

  // Filter donations belonging to this restaurant
  const myDonations = donations.filter(
    (d) => d.restaurantId === user?.id || user?.role === 'restaurant'
  );

  const filteredDonations = myDonations.filter((item) => {
    const matchesStatus =
      statusFilter === 'all' ? true : item.status === statusFilter;
    const matchesSearch =
      item.foodName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleMarkPickedUp = (id) => {
    updateDonationStatus(id, 'picked_up');
    if (selectedDonation?.id === id) {
      setSelectedDonation(null);
    }
  };

  const handleConfirmCancel = () => {
    if (cancelModalItem) {
      cancelDonation(cancelModalItem.id, cancelReason);
      setCancelModalItem(null);
      setCancelReason('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#e3e8ee] gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-light text-[#0d253d] tracking-tight">
            My Food Donations
          </h1>
          <p className="text-xs sm:text-sm text-[#64748d] mt-1 font-light">
            Monitor surplus listings, track NGO collection statuses, and verify distributions.
          </p>
        </div>

        <Link to="/restaurant/donate">
          <Button variant="primary" size="md" icon={PlusCircle} spark>
            Donate Food
          </Button>
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#64748d] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by food name, ID or category..."
            className="w-full bg-white text-[#0d253d] border border-[#a8c3de] rounded-md pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-[#533afd] focus:ring-1 focus:ring-[#533afd] transition-all"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto p-1 bg-[#f6f9fc] border border-[#e3e8ee] rounded-full">
          {['all', 'available', 'claimed', 'picked_up', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full capitalize transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-white text-[#533afd] shadow-xs'
                  : 'text-[#64748d] hover:text-[#0d253d]'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Donations List Container */}
      <div className="bg-white border border-[#e3e8ee] rounded-xl shadow-stripe-1 overflow-hidden">
        {filteredDonations.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#f6f9fc] border border-[#e3e8ee] text-[#64748d] flex items-center justify-center mx-auto">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <h3 className="text-base font-normal text-[#0d253d]">
              No donations match your filters
            </h3>
            <p className="text-xs text-[#64748d] max-w-sm mx-auto font-light">
              Try adjusting your search criteria or create a new food donation listing.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#e3e8ee] bg-[#f6f9fc] text-[11px] font-semibold text-[#64748d] uppercase tracking-wider">
                  <th className="py-3 px-4 md:px-6">Food Name & Ref</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Portions</th>
                  <th className="py-3 px-4">Expiry Window</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3e8ee] text-xs sm:text-sm font-light text-[#273951]">
                {filteredDonations.map((item) => (
                  <tr key={item.id} className="hover:bg-[#f6f9fc]/60 transition-colors">
                    <td className="py-4 px-4 md:px-6">
                      <p className="font-normal text-[#0d253d]">{item.foodName}</p>
                      <p className="text-[11px] text-[#64748d] mt-0.5 tnum">{item.id}</p>
                    </td>
                    <td className="py-4 px-4">
                      <CategoryBadge category={item.category} />
                    </td>
                    <td className="py-4 px-4 font-medium text-[#0d253d] tnum">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-rose-600 font-normal tnum">
                        {new Date(item.expiresAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      <p className="text-[11px] text-[#64748d] tnum">
                        {new Date(item.expiresAt).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={item.status}>
                        {item.status.replace('_', ' ')}
                      </Badge>
                      {item.claimedBy && (
                        <p className="text-[11px] text-[#533afd] font-medium mt-1 truncate max-w-[160px]">
                          {item.claimedBy.shelterName}
                        </p>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="subtle"
                          size="sm"
                          onClick={() => setSelectedDonation(item)}
                        >
                          View
                        </Button>

                        {item.status === 'claimed' && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleMarkPickedUp(item.id)}
                          >
                            Mark Picked Up
                          </Button>
                        )}

                        {item.status === 'available' && (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => setCancelModalItem(item)}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Modal */}
      <Modal
        isOpen={Boolean(selectedDonation)}
        onClose={() => setSelectedDonation(null)}
        title={selectedDonation?.foodName || 'Donation Details'}
        subtitle={`Reference ID: ${selectedDonation?.id}`}
      >
        {selectedDonation && (
          <div className="space-y-5 text-sm">
            <div className="flex items-center justify-between pb-3 border-b border-[#e3e8ee]">
              <span className="text-xs text-[#64748d]">Current Status</span>
              <Badge variant={selectedDonation.status}>
                {selectedDonation.status.replace('_', ' ')}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-[#64748d] block">Category</span>
                <span className="font-normal text-[#0d253d]">{selectedDonation.category}</span>
              </div>
              <div>
                <span className="text-xs text-[#64748d] block">Quantity</span>
                <span className="font-medium text-[#0d253d] tnum">
                  {selectedDonation.quantity} {selectedDonation.unit}
                </span>
              </div>
              <div>
                <span className="text-xs text-[#64748d] block">Preparation Time</span>
                <span className="text-xs text-[#273951] tnum">
                  {new Date(selectedDonation.preparedAt).toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-xs text-[#64748d] block">Expiry Deadline</span>
                <span className="text-xs text-rose-600 font-medium tnum">
                  {new Date(selectedDonation.expiresAt).toLocaleString()}
                </span>
              </div>
            </div>

            <div>
              <span className="text-xs text-[#64748d] block mb-1">Description</span>
              <p className="text-xs text-[#273951] bg-[#f6f9fc] p-3 rounded-lg border border-[#e3e8ee] leading-relaxed">
                {selectedDonation.description || 'No additional description provided.'}
              </p>
            </div>

            <div>
              <span className="text-xs text-[#64748d] block mb-1">Pickup Instructions</span>
              <p className="text-xs text-[#273951] leading-relaxed">
                {selectedDonation.pickupInstructions}
              </p>
            </div>

            {selectedDonation.claimedBy && (
              <div className="p-4 rounded-xl bg-[#eef0ff] border border-[#b9b9f9]/40 space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#4434d4] block">
                  Claimed Organization Details
                </span>
                <p className="text-sm font-medium text-[#0d253d]">
                  {selectedDonation.claimedBy.shelterName}
                </p>
                <p className="text-xs text-[#64748d]">
                  Phone: {selectedDonation.claimedBy.contactPhone}
                </p>
                {selectedDonation.claimedBy.expectedPickupTime && (
                  <p className="text-xs text-[#64748d] tnum">
                    Scheduled pickup: {new Date(selectedDonation.claimedBy.expectedPickupTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#e3e8ee]">
              {selectedDonation.status === 'claimed' && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleMarkPickedUp(selectedDonation.id)}
                >
                  Confirm Handover Complete
                </Button>
              )}
              <Button
                variant="subtle"
                size="sm"
                onClick={() => setSelectedDonation(null)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={Boolean(cancelModalItem)}
        onClose={() => setCancelModalItem(null)}
        title="Cancel Food Donation"
        subtitle={`Are you sure you want to cancel listing ${cancelModalItem?.id}?`}
      >
        <div className="space-y-4">
          <p className="text-xs text-[#64748d] font-light">
            Once cancelled, shelters will no longer be able to discover or reserve this batch.
          </p>

          <div>
            <label className="block text-xs font-medium text-[#0d253d] mb-1">
              Cancellation Reason (Optional)
            </label>
            <input
              type="text"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="e.g. Consumed internally or cold chain compromised"
              className="w-full bg-white text-[#0d253d] border border-[#a8c3de] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#533afd] focus:ring-1 focus:ring-[#533afd]"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3">
            <Button
              variant="subtle"
              size="sm"
              onClick={() => setCancelModalItem(null)}
            >
              Keep Listing
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleConfirmCancel}
            >
              Confirm Cancellation
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
