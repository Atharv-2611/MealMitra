import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDonations } from '../../context/DonationContext';
import { Button } from '../../components/common/Button';
import { Badge, CategoryBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import {
  Heart,
  Search,
  MapPin,
  Building2
} from 'lucide-react';

export const MyRequestsPage = () => {
  const { user } = useAuth();
  const { donations, cancelDonation } = useDonations();

  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [cancelModalItem, setCancelModalItem] = useState(null);

  // Filter requests claimed by this shelter
  const myRequests = donations.filter((d) => {
    const shelterId = user?.id || 'user-shel-202';
    const isThisShelter = d.claimedBy?.shelterId === shelterId;
    const isShelterRole =
      (user?.role === 'shelter' || !user?.role) &&
      (d.claimedBy?.shelterId === shelterId || ['claimed', 'picked_up', 'cancelled'].includes(d.status));
    return isThisShelter || isShelterRole;
  });

  const filteredRequests = myRequests.filter((item) => {
    if (statusFilter === 'all') return true;
    return item.status === statusFilter;
  });

  const handleCancelClaim = () => {
    if (cancelModalItem) {
      cancelDonation(cancelModalItem.id, 'Cancelled by claiming shelter');
      setCancelModalItem(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#e3e8ee] gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-light text-[#0d253d] tracking-tight">
            My Food Requests & Pickups
          </h1>
          <p className="text-xs sm:text-sm text-[#64748d] mt-1 font-light">
            Coordinate ongoing collections, retrieve kitchen dispatch instructions, and log distributions.
          </p>
        </div>

        <Link to="/shelter/browse">
          <Button variant="primary" size="md" icon={Search} spark>
            Browse More Food
          </Button>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto p-1 bg-[#f6f9fc] border border-[#e3e8ee] rounded-full max-w-fit">
        {['all', 'claimed', 'picked_up', 'cancelled'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-full capitalize transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === st
                ? 'bg-white text-[#533afd] shadow-xs'
                : 'text-[#64748d] hover:text-[#0d253d]'
            }`}
          >
            {st === 'claimed' ? 'Scheduled Pickup' : st.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Requests Table / Cards */}
      <div className="bg-white border border-[#e3e8ee] rounded-xl shadow-stripe-1 overflow-hidden">
        {filteredRequests.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#f6f9fc] border border-[#e3e8ee] text-[#64748d] flex items-center justify-center mx-auto">
              <Heart className="w-6 h-6 text-[#ea2261]" />
            </div>
            <h3 className="text-base font-normal text-[#0d253d]">
              No claimed requests in this view
            </h3>
            <p className="text-xs text-[#64748d] max-w-sm mx-auto font-light">
              Explore the live food directory to reserve available surplus meals for your community.
            </p>
            <div className="pt-2">
              <Link to="/shelter/browse">
                <Button variant="primary" size="sm">
                  Browse Surplus Directory
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#e3e8ee] bg-[#f6f9fc] text-[11px] font-semibold text-[#64748d] uppercase tracking-wider">
                  <th className="py-3 px-4 md:px-6">Donation & Donor</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Portions</th>
                  <th className="py-3 px-4">Pickup Window</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3e8ee] text-xs sm:text-sm font-light text-[#273951]">
                {filteredRequests.map((item) => (
                  <tr key={item.id} className="hover:bg-[#f6f9fc]/60 transition-colors">
                    <td className="py-4 px-4 md:px-6">
                      <p className="font-normal text-[#0d253d]">{item.foodName}</p>
                      <p className="text-[11px] text-[#64748d] flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3 h-3 text-[#533afd]" />
                        <span>{item.restaurantName}</span>
                      </p>
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
                        {item.status === 'claimed' ? 'Pickup Scheduled' : item.status.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="subtle"
                          size="sm"
                          onClick={() => setSelectedRequest(item)}
                        >
                          Details
                        </Button>
                        {item.status === 'claimed' && (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => setCancelModalItem(item)}
                          >
                            Release
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
        isOpen={Boolean(selectedRequest)}
        onClose={() => setSelectedRequest(null)}
        title={selectedRequest?.foodName || 'Pickup Details'}
        subtitle={`Listing Ref: ${selectedRequest?.id}`}
      >
        {selectedRequest && (
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="p-4 bg-[#f6f9fc] rounded-xl border border-[#e3e8ee] space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748d]">
                Donor Establishment
              </span>
              <p className="text-base font-normal text-[#0d253d]">
                {selectedRequest.restaurantName}
              </p>
              <div className="flex items-start gap-1.5 text-[#273951]">
                <MapPin className="w-3.5 h-3.5 text-[#533afd] shrink-0 mt-0.5" />
                <span>{selectedRequest.pickupAddress}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 py-2 border-y border-[#e3e8ee] text-xs">
              <div>
                <span className="text-[#64748d] block">Portion Quantity:</span>
                <span className="font-medium text-[#0d253d] tnum">
                  {selectedRequest.quantity} {selectedRequest.unit}
                </span>
              </div>
              <div>
                <span className="text-[#64748d] block">Dietary Standard:</span>
                <span className="font-normal text-[#0d253d]">{selectedRequest.dietary}</span>
              </div>
              <div>
                <span className="text-[#64748d] block">Cooked / Prepared:</span>
                <span className="tnum text-[#273951]">{new Date(selectedRequest.preparedAt).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[#64748d] block">Expiry Deadline:</span>
                <span className="font-medium text-rose-600 tnum">{new Date(selectedRequest.expiresAt).toLocaleString()}</span>
              </div>
            </div>

            <div>
              <span className="text-xs font-medium text-[#0d253d] block mb-1">
                Dispatch Instructions from Kitchen
              </span>
              <p className="p-3 rounded-lg bg-[#f6f9fc] text-xs text-[#273951] leading-relaxed border border-[#e3e8ee]">
                {selectedRequest.pickupInstructions || 'Report to reception or service dock.'}
              </p>
            </div>

            {selectedRequest.cancellationReason && (
              <div>
                <span className="text-xs font-medium text-rose-700 block mb-1">
                  Cancellation / Release Reason
                </span>
                <p className="p-3 rounded-lg bg-rose-50 text-xs text-rose-800 leading-relaxed border border-rose-200">
                  {selectedRequest.cancellationReason}
                </p>
              </div>
            )}

            {selectedRequest.claimedBy?.notes && (
              <div>
                <span className="text-xs font-medium text-[#0d253d] block mb-1">
                  Logistics & Handover Notes
                </span>
                <p className="p-3 rounded-lg bg-[#f6f9fc] text-xs text-[#273951] leading-relaxed border border-[#e3e8ee]">
                  {selectedRequest.claimedBy.notes}
                </p>
              </div>
            )}

            <div className="flex justify-end pt-3 border-t border-[#e3e8ee]">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setSelectedRequest(null)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Cancel Request Modal */}
      <Modal
        isOpen={Boolean(cancelModalItem)}
        onClose={() => setCancelModalItem(null)}
        title="Release Reserved Food Donation"
        subtitle={`Release batch "${cancelModalItem?.foodName}"?`}
      >
        <div className="space-y-4 text-xs sm:text-sm">
          <p className="text-xs text-[#64748d] font-light leading-relaxed">
            If your vehicle or volunteer is unable to collect this batch, releasing it will immediately return the food to the live feed so another shelter can rescue it before expiry.
          </p>

          <div className="flex items-center justify-end gap-2 pt-3">
            <Button
              variant="subtle"
              size="sm"
              onClick={() => setCancelModalItem(null)}
            >
              Keep Reservation
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleCancelClaim}
            >
              Release Batch for Other NGOs
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
