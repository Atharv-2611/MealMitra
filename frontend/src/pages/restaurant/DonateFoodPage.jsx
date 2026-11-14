import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDonations } from '../../context/DonationContext';
import { Button } from '../../components/common/Button';
import { LocationPickerMap } from '../../components/common/LocationPickerMap';
import { publishDonation } from '../../services/api';
import {
  ArrowLeft,
  AlertCircle,
  AlertTriangle,
  MapPin,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const DonateFoodPage = () => {
  const { user } = useAuth();
  const { addDonation } = useDonations();
  const navigate = useNavigate();

  // Validate that the authenticated restaurant has configured address and coordinates in their profile
  const hasConfiguredLocation = Boolean(
    user?.address &&
    user.address.trim() &&
    user?.location?.coordinates &&
    Array.isArray(user.location.coordinates) &&
    user.location.coordinates.length === 2 &&
    typeof user.location.coordinates[0] === 'number' &&
    typeof user.location.coordinates[1] === 'number' &&
    !isNaN(user.location.coordinates[0]) &&
    !isNaN(user.location.coordinates[1])
  );

  const restaurantAddress = user?.address || '';
  const restaurantCoords = hasConfiguredLocation
    ? {
        lat: Number(user.location.coordinates[1]),
        lon: Number(user.location.coordinates[0])
      }
    : null;

  const [formData, setFormData] = useState({
    foodName: '',
    category: 'Cooked Meals',
    dietary: 'Vegetarian',
    quantity: '',
    unit: 'meals',
    description: '',
    preparedAt: new Date().toISOString().slice(0, 16),
    expiresAt: new Date(Date.now() + 8 * 3600 * 1000).toISOString().slice(0, 16),
    pickupInstructions: 'Report to kitchen dispatch dock Gate 2.',
    freshnessDeclaration: false
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Block submission if restaurant pickup location is missing
    if (!hasConfiguredLocation) {
      setError(
        'Your restaurant pickup location is not configured. Please add your restaurant address in your Profile before publishing a donation.'
      );
      return;
    }

    if (!formData.foodName.trim()) {
      setError('Food name is required.');
      return;
    }

    if (!formData.quantity || Number(formData.quantity) <= 0) {
      setError('Please provide a valid quantity greater than zero.');
      return;
    }

    if (new Date(formData.expiresAt) <= new Date(formData.preparedAt)) {
      setError('Expiry time must be later than preparation time.');
      return;
    }

    if (!formData.freshnessDeclaration) {
      setError('Please certify the food safety and freshness declaration.');
      return;
    }

    setIsSubmitting(true);

    // Create an immutable snapshot of the restaurant's address and GeoJSON coordinates
    const donationPayload = {
      foodName: formData.foodName.trim(),
      category: formData.category,
      dietary: formData.dietary,
      quantity: Number(formData.quantity),
      unit: formData.unit,
      description: formData.description,
      preparedAt: formData.preparedAt,
      expiresAt: formData.expiresAt,
      // Immutable location snapshot strictly adhering to GeoJSON RFC 7946 [longitude, latitude]
      pickupAddress: restaurantAddress,
      pickupLocation: {
        type: 'Point',
        coordinates: [Number(restaurantCoords.lon), Number(restaurantCoords.lat)]
      },
      pickupInstructions: formData.pickupInstructions,
      freshnessDeclaration: formData.freshnessDeclaration,
      restaurantId: user?.id || 'user-rest-101',
      restaurantName: user?.organizationName || 'The Royal Kitchen & Caterers'
    };

    try {
      // Save donation with location snapshot to backend / MongoDB
      await publishDonation(donationPayload);
    } catch (apiErr) {
      console.warn('Backend donation notice (persisting locally):', apiErr.message);
    }

    // Persist in local donation context & notifications
    addDonation(donationPayload, user);
    setIsSubmitting(false);
    navigate('/restaurant/donations');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 space-y-6">
      {/* Back button & Title */}
      <div>
        <Link
          to="/restaurant/dashboard"
          className="inline-flex items-center gap-1.5 text-xs text-[#64748d] hover:text-[#533afd] transition-colors mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-light text-[#0d253d] tracking-tight">
          List Surplus Food Donation
        </h1>
        <p className="text-xs sm:text-sm text-[#64748d] mt-1 font-light">
          Post surplus meals from your commercial kitchen for immediate reservation by nearby verified shelters.
        </p>
      </div>

      {/* Form Container */}
      <div className="bg-white border border-[#e3e8ee] rounded-xl p-6 sm:p-8 shadow-stripe-1">
        {/* Missing Location Warning Banner */}
        {!hasConfiguredLocation && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2.5">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-900">
                  Pickup Location Not Configured
                </p>
                <p className="text-amber-800 leading-relaxed mt-0.5">
                  Your restaurant pickup location is not configured. Please add your restaurant address in your Profile before publishing a donation.
                </p>
              </div>
            </div>
            <div className="pl-7.5">
              <Link
                to="/restaurant/profile"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#533afd] hover:bg-[#432ee0] text-white text-xs font-medium rounded-md shadow-xs transition-colors"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Configure Pickup Address in Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-3.5 rounded-md bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Food Details */}
          <div>
            <h3 className="text-sm font-semibold text-[#0d253d] uppercase tracking-wider mb-4 pb-2 border-b border-[#e3e8ee]">
              1. Food Item Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-[#0d253d] mb-1">
                  Food Item / Dish Name *
                </label>
                <input
                  type="text"
                  name="foodName"
                  required
                  placeholder="e.g. Vegetable Biryani & Raita"
                  value={formData.foodName}
                  onChange={handleChange}
                  className="w-full bg-white text-[#0d253d] border border-[#a8c3de] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#533afd] focus:ring-1 focus:ring-[#533afd] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#0d253d] mb-1">
                  Food Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-white text-[#0d253d] border border-[#a8c3de] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#533afd] focus:ring-1 focus:ring-[#533afd] transition-all"
                >
                  <option value="Cooked Meals">Cooked Meals</option>
                  <option value="Bakery">Bakery & Breads</option>
                  <option value="Raw Produce">Raw Produce</option>
                  <option value="Packaged Foods">Packaged Foods</option>
                  <option value="Dairy">Dairy</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-xs font-medium text-[#0d253d] mb-1">
                  Dietary Classification *
                </label>
                <select
                  name="dietary"
                  value={formData.dietary}
                  onChange={handleChange}
                  className="w-full bg-white text-[#0d253d] border border-[#a8c3de] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#533afd] focus:ring-1 focus:ring-[#533afd] transition-all"
                >
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Non-Vegetarian">Non-Vegetarian</option>
                  <option value="Contains Egg">Contains Egg</option>
                  <option value="Jain">Jain Friendly</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#0d253d] mb-1">
                  Estimated Quantity *
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  required
                  name="quantity"
                  placeholder="e.g. 50"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="w-full bg-white text-[#0d253d] border border-[#a8c3de] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#533afd] focus:ring-1 focus:ring-[#533afd] transition-all tnum"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#0d253d] mb-1">
                  Unit of Measure *
                </label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="w-full bg-white text-[#0d253d] border border-[#a8c3de] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#533afd] focus:ring-1 focus:ring-[#533afd] transition-all"
                >
                  <option value="meals">meals / portions</option>
                  <option value="kg">kilograms (kg)</option>
                  <option value="boxes">boxes / packs</option>
                  <option value="litres">litres</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-medium text-[#0d253d] mb-1">
                Description & Storage Instructions
              </label>
              <textarea
                rows={2}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Mention storage state (e.g. held hot at >65°C in insulated containers, sealed trays, allergens...)"
                className="w-full bg-white text-[#0d253d] border border-[#a8c3de] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#533afd] focus:ring-1 focus:ring-[#533afd] transition-all"
              />
            </div>
          </div>

          {/* Section 2: Timing & Safety Window */}
          <div>
            <h3 className="text-sm font-semibold text-[#0d253d] uppercase tracking-wider mb-4 pb-2 border-b border-[#e3e8ee]">
              2. Timing & Expiry Window
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#0d253d] mb-1">
                  Preparation Date & Time *
                </label>
                <input
                  type="datetime-local"
                  name="preparedAt"
                  required
                  value={formData.preparedAt}
                  onChange={handleChange}
                  className="w-full bg-white text-[#0d253d] border border-[#a8c3de] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#533afd] focus:ring-1 focus:ring-[#533afd] transition-all tnum"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#0d253d] mb-1">
                  Safe Consumption Expiry *
                </label>
                <input
                  type="datetime-local"
                  name="expiresAt"
                  required
                  value={formData.expiresAt}
                  onChange={handleChange}
                  className="w-full bg-white text-[#0d253d] border border-[#a8c3de] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#533afd] focus:ring-1 focus:ring-[#533afd] transition-all tnum"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Pickup Details */}
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#e3e8ee]">
              <h3 className="text-sm font-semibold text-[#0d253d] uppercase tracking-wider">
                3. Pickup Instructions
              </h3>
              {hasConfiguredLocation && (
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Profile Location Verified</span>
                </span>
              )}
            </div>

            {hasConfiguredLocation ? (
              <div className="space-y-4">
                {/* Read-Only Pickup Address */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-[#0d253d]">
                      Registered Pickup Address (Read-only) *
                    </label>
                    <Link
                      to="/restaurant/profile"
                      className="text-[11px] text-[#533afd] hover:underline font-medium inline-flex items-center gap-1"
                    >
                      <span>Update in Profile</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                  <input
                    type="text"
                    readOnly
                    value={restaurantAddress}
                    className="w-full bg-[#f6f9fc] text-[#0d253d] border border-[#d0d7de] rounded-md px-3 py-2 text-sm cursor-not-allowed select-text font-normal shadow-xs"
                  />
                  <p className="text-[11px] text-[#64748d] mt-1 font-light">
                    Populated automatically from your Restaurant Profile. Pickup vehicles and shelters will be guided directly to this verified location.
                  </p>
                </div>

                {/* Read-Only Location Map with Fixed Marker */}
                <div>
                  <label className="block text-xs font-medium text-[#0d253d] mb-1.5">
                    Verified Pickup Point on Map
                  </label>
                  <LocationPickerMap
                    latitude={restaurantCoords.lat}
                    longitude={restaurantCoords.lon}
                    address={restaurantAddress}
                    isEditable={false}
                    height="270px"
                  />
                </div>

                {/* Pickup Instructions */}
                <div>
                  <label className="block text-xs font-medium text-[#0d253d] mb-1">
                    Special Instructions for Pickup Staff / Drivers
                  </label>
                  <input
                    type="text"
                    name="pickupInstructions"
                    value={formData.pickupInstructions}
                    onChange={handleChange}
                    placeholder="e.g. Enter through Gate 2, ask for Duty Chef Manoj at kitchen dock"
                    className="w-full bg-white text-[#0d253d] border border-[#a8c3de] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#533afd] focus:ring-1 focus:ring-[#533afd] transition-all"
                  />
                </div>
              </div>
            ) : (
              /* Missing Location Prompt - No Dummy Map */
              <div className="p-6 rounded-xl bg-amber-50/80 border border-amber-200 text-xs space-y-3">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-900">
                      Pickup Location Not Configured
                    </h4>
                    <p className="text-xs text-amber-800 leading-relaxed font-normal">
                      Your restaurant pickup location is not configured. Please add your restaurant address in your Profile before publishing a donation.
                    </p>
                  </div>
                </div>
                <div className="pt-1 pl-8">
                  <Link
                    to="/restaurant/profile"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#533afd] hover:bg-[#432ee0] text-white text-xs font-medium rounded-md shadow-xs transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Go to Profile to Set Address & Map</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Food Freshness Checkbox */}
          <div className="p-4 rounded-xl bg-[#f6f9fc] border border-[#e3e8ee]">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="freshnessDeclaration"
                checked={formData.freshnessDeclaration}
                onChange={handleChange}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-[#533afd] focus:ring-[#533afd]"
              />
              <span className="text-xs text-[#273951] leading-relaxed">
                <strong>Food Safety & Freshness Certification:</strong> I certify that this surplus food was prepared in a hygienic, authorized kitchen, has been maintained at safe temperatures, and is unadulterated and suitable for human consumption per FSSAI donation guidelines.
              </span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Link to="/restaurant/dashboard">
              <Button variant="subtle" size="md">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isSubmitting || !hasConfiguredLocation}
              spark
            >
              {isSubmitting ? 'Publishing...' : 'Publish Surplus Donation'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
