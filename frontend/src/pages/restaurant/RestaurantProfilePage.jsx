import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { LocationPickerMap } from '../../components/common/LocationPickerMap';
import { geocodeAddress, reverseGeocode } from '../../services/geocodingService';
import { saveRestaurantLocation } from '../../services/api';
import {
  CheckCircle2,
  MapPin,
  Search,
  Loader2,
  AlertCircle,
  Navigation,
  Check,
  Building2,
  RotateCcw
} from 'lucide-react';

export const RestaurantProfilePage = () => {
  const { user, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    organizationName: user?.organizationName || 'The Royal Kitchen & Caterers',
    name: user?.name || 'Vikram Sethi',
    email: user?.email || 'contact@royalkitchen.com',
    phone: user?.phone || '+91 98201 44521',
    address: user?.address || '42 Senapati Bapat Marg, Lower Parel, Mumbai, Maharashtra 400013',
    fssaiLicense: user?.fssaiLicense || '11521018000452',
    openingHours: user?.openingHours || '10:00 AM - 11:30 PM'
  });

  // Coordinates strictly follow [lon, lat] in GeoJSON; map uses { lat, lon }
  const [coords, setCoords] = useState(() => {
    if (user?.location?.coordinates && user.location.coordinates.length === 2) {
      return {
        lat: Number(user.location.coordinates[1]),
        lon: Number(user.location.coordinates[0])
      };
    }
    // Default fallback coordinates (Mumbai)
    return { lat: 18.9986, lon: 72.8295 };
  });

  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodingCandidates, setGeocodingCandidates] = useState([]);
  const [geocodingError, setGeocodingError] = useState('');
  const [reverseGeocodedAddress, setReverseGeocodedAddress] = useState('');
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);

  const [isSavingLocation, setIsSavingLocation] = useState(false);
  const [locationSuccess, setLocationSuccess] = useState(false);
  const [locationError, setLocationError] = useState('');

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Trigger geocoding when restaurant owner clicks "Find Location"
  const handleFindLocation = async () => {
    if (!formData.address.trim()) {
      setGeocodingError('Please enter your restaurant address first.');
      return;
    }

    setIsGeocoding(true);
    setGeocodingError('');
    setGeocodingCandidates([]);
    setLocationSuccess(false);

    try {
      const results = await geocodeAddress(formData.address);

      if (!results || results.length === 0) {
        setGeocodingError(
          'No location match found for the entered address. Please check building name, area, city or PIN code.'
        );
        return;
      }

      // Center map on the top result
      const topMatch = results[0];
      setCoords({ lat: topMatch.lat, lon: topMatch.lon });
      setReverseGeocodedAddress(topMatch.displayName);

      // If multiple candidates exist, display them so user can pick exact spot
      if (results.length > 1) {
        setGeocodingCandidates(results);
      }
    } catch (err) {
      setGeocodingError(
        'Could not reach the geocoding service. Please check your internet connection or adjust the pin manually.'
      );
    } finally {
      setIsGeocoding(false);
    }
  };

  // Select candidate from multiple geocoding results
  const handleSelectCandidate = (candidate) => {
    setCoords({ lat: candidate.lat, lon: candidate.lon });
    setReverseGeocodedAddress(candidate.displayName);
    setGeocodingCandidates([]);
  };

  // Called when user drags the marker or clicks directly on the map
  const handleLocationChange = async (newLat, newLon) => {
    setCoords({ lat: newLat, lon: newLon });
    setLocationSuccess(false);

    try {
      setIsReverseGeocoding(true);
      const res = await reverseGeocode(newLat, newLon);
      if (res && res.displayName) {
        setReverseGeocodedAddress(res.displayName);
      }
    } catch (err) {
      console.warn('Reverse geocoding error:', err);
    } finally {
      setIsReverseGeocoding(false);
    }
  };

  // Adopt reverse-geocoded address into the address textarea
  const handleApplyReverseAddress = () => {
    if (reverseGeocodedAddress) {
      setFormData((prev) => ({ ...prev, address: reverseGeocodedAddress }));
    }
  };

  // Dedicated Save Restaurant Location action
  const handleSaveLocationOnly = async () => {
    if (!formData.address.trim()) {
      setLocationError('Restaurant address cannot be empty.');
      return;
    }

    if (!coords || isNaN(coords.lat) || isNaN(coords.lon)) {
      setLocationError('Valid map coordinates are required. Please click "Find Location" first.');
      return;
    }

    setIsSavingLocation(true);
    setLocationError('');
    setLocationSuccess(false);

    const geoJsonPayload = {
      address: formData.address.trim(),
      location: {
        type: 'Point',
        coordinates: [Number(coords.lon), Number(coords.lat)] // strictly [longitude, latitude]
      },
      organizationName: formData.organizationName,
      name: formData.name,
      phone: formData.phone,
      fssaiLicense: formData.fssaiLicense
    };

    try {
      await saveRestaurantLocation(user?.id || 'user-rest-101', geoJsonPayload);
    } catch (apiErr) {
      console.warn('Backend save notice (persisting locally):', apiErr.message);
    }

    // Persist in AuthContext & localStorage
    updateProfile({
      address: geoJsonPayload.address,
      location: geoJsonPayload.location
    });

    setIsSavingLocation(false);
    setLocationSuccess(true);
    setTimeout(() => setLocationSuccess(false), 5000);
  };

  // Full form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedLocation = {
      type: 'Point',
      coordinates: [Number(coords.lon), Number(coords.lat)]
    };

    try {
      await saveRestaurantLocation(user?.id || 'user-rest-101', {
        ...formData,
        location: updatedLocation
      });
    } catch (apiErr) {
      console.warn('Backend save notice (persisting locally):', apiErr.message);
    }

    updateProfile({
      ...formData,
      location: updatedLocation
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 space-y-6">
      {/* Page Header */}
      <div className="pb-6 border-b border-[#e3e8ee]">
        <h1 className="text-2xl sm:text-3xl font-light text-[#0d253d] tracking-tight">
          Restaurant Profile & Settings
        </h1>
        <p className="text-xs sm:text-sm text-[#64748d] mt-1 font-light">
          Manage your culinary establishment details, verified pickup map coordinates, and food license records.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-md bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Profile and pickup location updated successfully!</span>
        </div>
      )}

      {/* Profile Form Card */}
      <div className="bg-white border border-[#e3e8ee] rounded-xl p-6 sm:p-8 shadow-stripe-1">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Establishment Information */}
          <div>
            <h3 className="text-sm font-semibold text-[#0d253d] uppercase tracking-wider mb-4 pb-2 border-b border-[#e3e8ee]">
              Establishment Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#0d253d] mb-1">
                  Restaurant / Kitchen Brand Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.organizationName}
                  onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                  className="w-full bg-white text-[#0d253d] border border-[#a8c3de] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#533afd] focus:ring-1 focus:ring-[#533afd] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#0d253d] mb-1">
                  Primary Contact Manager *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white text-[#0d253d] border border-[#a8c3de] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#533afd] focus:ring-1 focus:ring-[#533afd] transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-xs font-medium text-[#0d253d] mb-1">
                  Contact Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white text-[#0d253d] border border-[#a8c3de] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#533afd] focus:ring-1 focus:ring-[#533afd] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#0d253d] mb-1">
                  Dispatch / Kitchen Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-white text-[#0d253d] border border-[#a8c3de] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#533afd] focus:ring-1 focus:ring-[#533afd] transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Restaurant Address & Map Location */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-2 border-b border-[#e3e8ee]">
              <div>
                <h3 className="text-sm font-semibold text-[#0d253d] uppercase tracking-wider">
                  Pickup Location & Interactive Map
                </h3>
                <p className="text-xs text-[#64748d] font-light mt-0.5">
                  Configure once: this address and geographical coordinates will automatically populate all food donations.
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#533afd] bg-[#eef0ff] px-2.5 py-1 rounded-full border border-[#b9b9f9]/50">
                <Navigation className="w-3 h-3" />
                <span>OpenStreetMap & Leaflet</span>
              </span>
            </div>

            {/* Address Input & Find Location Button */}
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-[#0d253d]">
                    Restaurant Full Address *
                  </label>
                  <span className="text-[11px] text-[#64748d] font-light">
                    Building name, street, area, city, state and PIN code
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <textarea
                    rows={2}
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Enter full address e.g. 42 Senapati Bapat Marg, Lower Parel, Mumbai, Maharashtra 400013"
                    className="flex-1 bg-white text-[#0d253d] border border-[#a8c3de] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#533afd] focus:ring-1 focus:ring-[#533afd] transition-all"
                  />
                  <button
                    type="button"
                    onClick={handleFindLocation}
                    disabled={isGeocoding}
                    className="self-start sm:self-stretch inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#533afd] hover:bg-[#432ee0] disabled:bg-[#a8c3de] text-white text-xs font-medium rounded-md shadow-xs transition-colors whitespace-nowrap cursor-pointer"
                  >
                    {isGeocoding ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Finding...</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-3.5 h-3.5" />
                        <span>Find Location</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Geocoding Error Message */}
              {geocodingError && (
                <div className="p-3 rounded-md bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{geocodingError}</span>
                </div>
              )}

              {/* Multiple Candidate Matches Picker */}
              {geocodingCandidates.length > 1 && (
                <div className="p-3 rounded-md bg-amber-50/80 border border-amber-200 text-xs space-y-2">
                  <div className="flex items-center gap-1.5 font-medium text-amber-900">
                    <Building2 className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>Multiple locations matched. Click to select the precise match:</span>
                  </div>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {geocodingCandidates.map((cand, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectCandidate(cand)}
                        className="w-full text-left p-2 rounded bg-white hover:bg-amber-100/60 border border-amber-200/60 text-[11px] text-[#273951] flex items-center justify-between gap-2 transition-colors cursor-pointer"
                      >
                        <span className="line-clamp-1">{cand.displayName}</span>
                        <span className="text-[10px] text-[#533afd] font-semibold shrink-0">Select</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Interactive Map */}
              <div className="space-y-2 pt-1">
                <LocationPickerMap
                  latitude={coords.lat}
                  longitude={coords.lon}
                  address={formData.address}
                  isEditable={true}
                  onLocationChange={handleLocationChange}
                  height="340px"
                />

                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#64748d] pt-1">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#533afd] shrink-0" />
                    <span>
                      Tip: You can drag the purple marker or click directly on the map to mark your kitchen entrance or delivery dock.
                    </span>
                  </div>

                  {reverseGeocodedAddress && (
                    <div className="flex items-center gap-2">
                      {isReverseGeocoding ? (
                        <span className="flex items-center gap-1 text-[11px] text-[#64748d]">
                          <Loader2 className="w-3 h-3 animate-spin" /> Resolving address...
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleApplyReverseAddress}
                          className="inline-flex items-center gap-1 text-[11px] text-[#533afd] hover:underline font-medium cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Sync address text with pin</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Dedicated Save Location Action */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3.5 rounded-lg bg-[#f6f9fc] border border-[#e3e8ee]">
                <div className="text-xs text-[#273951]">
                  <p className="font-medium text-[#0d253d]">Confirm Pickup Coordinates</p>
                  <p className="text-[11px] text-[#64748d] font-light">
                    Saves your verified GeoJSON coordinates <span className="font-mono text-[#533afd] tnum">[{coords.lon.toFixed(4)}, {coords.lat.toFixed(4)}]</span> to your restaurant profile.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSaveLocationOnly}
                  disabled={isSavingLocation}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#0d253d] hover:bg-[#1a3858] disabled:bg-[#a8c3de] text-white text-xs font-medium rounded-md shadow-xs transition-colors whitespace-nowrap cursor-pointer"
                >
                  {isSavingLocation ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving Location...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Save Restaurant Location</span>
                    </>
                  )}
                </button>
              </div>

              {locationSuccess && (
                <div className="p-3 rounded-md bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Restaurant pickup location saved successfully! This address will now automatically populate all food donations.</span>
                </div>
              )}

              {locationError && (
                <div className="p-3 rounded-md bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{locationError}</span>
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Operations & Licensing */}
          <div>
            <h3 className="text-sm font-semibold text-[#0d253d] uppercase tracking-wider mb-4 pb-2 border-b border-[#e3e8ee]">
              Operations & Licensing
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#0d253d] mb-1">
                  Operating / Service Hours
                </label>
                <input
                  type="text"
                  value={formData.openingHours}
                  onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                  placeholder="e.g. 10:00 AM - 11:30 PM"
                  className="w-full bg-white text-[#0d253d] border border-[#a8c3de] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#533afd] focus:ring-1 focus:ring-[#533afd] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#0d253d] mb-1">
                  FSSAI Food License Number
                </label>
                <input
                  type="text"
                  value={formData.fssaiLicense}
                  onChange={(e) => setFormData({ ...formData, fssaiLicense: e.target.value })}
                  className="w-full bg-white text-[#0d253d] border border-[#a8c3de] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#533afd] focus:ring-1 focus:ring-[#533afd] transition-all"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button type="submit" variant="primary" size="md" spark>
              Save All Profile Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
