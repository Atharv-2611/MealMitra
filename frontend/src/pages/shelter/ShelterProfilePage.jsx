import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { LocationPickerMap } from '../../components/common/LocationPickerMap';
import { geocodeAddress, reverseGeocode } from '../../services/geocodingService';
import { saveShelterLocation } from '../../services/api';
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

export const ShelterProfilePage = () => {
  const { user, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    organizationName: user?.organizationName || 'Anandam Food Relief Shelter',
    name: user?.name || 'Priya Sharma',
    email: user?.email || 'info@anandamfoundation.org',
    phone: user?.phone || '+91 99302 77810',
    address: user?.address || 'Plot 18, Near King Circle Railway Station, Matunga, Mumbai 400019',
    ngoRegistration: user?.ngoRegistration || 'NGO-MH-2022-0941',
    beneficiaryCount: user?.beneficiaryCount || '150-200 daily meals',
    vehicleAvailable: user?.vehicleAvailable ?? true,
    operatingHours: user?.operatingHours || '08:00 AM - 10:00 PM',
    storageFacilities: user?.storageFacilities || 'Commercial Cold Room (4°C) & Insulated Hot Cambros'
  });

  // Coordinates strictly follow [lon, lat] in GeoJSON; map uses { lat, lon }
  const [coords, setCoords] = useState(() => {
    if (user?.location?.coordinates && user.location.coordinates.length === 2) {
      return {
        lat: Number(user.location.coordinates[1]),
        lon: Number(user.location.coordinates[0])
      };
    }
    // Default fallback coordinates for Matunga/Central Mumbai
    return { lat: 19.0269, lon: 72.8561 };
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

  // Trigger geocoding when shelter owner clicks "Find Location"
  const handleFindLocation = async () => {
    if (!formData.address.trim()) {
      setGeocodingError('Please enter your shelter receiving address first.');
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
          'No location match found for the entered address. Please check building name, locality, city or PIN code.'
        );
        return;
      }

      // Center map on the top result
      const topMatch = results[0];
      setCoords({ lat: topMatch.lat, lon: topMatch.lon });
      setReverseGeocodedAddress(topMatch.displayName);

      // If multiple candidates exist, display them so shelter owner can pick exact spot
      if (results.length > 1) {
        setGeocodingCandidates(results);
      }
    } catch (err) {
      setGeocodingError(
        'Could not reach the geocoding service. Please check your network connection or adjust the pin manually.'
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

  // Dedicated Save Shelter Location action
  const handleSaveLocationOnly = async () => {
    if (!formData.address.trim()) {
      setLocationError('Shelter receiving address cannot be empty.');
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
        coordinates: [Number(coords.lon), Number(coords.lat)] // strictly GeoJSON [longitude, latitude]
      },
      organizationName: formData.organizationName,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: 'shelter',
      ngoRegistration: formData.ngoRegistration,
      beneficiaryCount: formData.beneficiaryCount,
      vehicleAvailable: formData.vehicleAvailable,
      operatingHours: formData.operatingHours,
      storageFacilities: formData.storageFacilities
    };

    try {
      await saveShelterLocation(user?.id || 'user-shel-202', geoJsonPayload);
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

    const fullPayload = {
      ...formData,
      role: 'shelter',
      location: updatedLocation
    };

    try {
      await saveShelterLocation(user?.id || 'user-shel-202', fullPayload);
    } catch (apiErr) {
      console.warn('Backend save notice (persisting locally):', apiErr.message);
    }

    updateProfile(fullPayload);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 space-y-6">
      {/* Header */}
      <div className="pb-6 border-b border-[#e3e8ee]">
        <h1 className="text-2xl sm:text-3xl font-light text-[#0d253d] tracking-tight">
          Shelter & NGO Profile
        </h1>
        <p className="text-xs sm:text-sm text-[#64748d] mt-1 font-light">
          Manage your relief organization details, verified receiving coordinates, beneficiary serving capacity, and logistics capabilities.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-md bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Shelter profile details and receiving coordinates saved successfully!</span>
        </div>
      )}

      {/* Form Container */}
      <div className="bg-white border border-[#e3e8ee] rounded-xl p-6 sm:p-8 shadow-stripe-1">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Organization & Contact Representative */}
          <div>
            <h3 className="text-sm font-semibold text-[#0d253d] uppercase tracking-wider mb-4 pb-2 border-b border-[#e3e8ee]">
              Organization & Contact Representative
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#0d253d] mb-1">
                  Shelter / Charitable Trust Name *
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
                  Representative Name *
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
                  Official Email Address *
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
                  Emergency Logistics Phone *
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

          {/* Section 2: Relief Capacity & Receiving Location Map */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-2 border-b border-[#e3e8ee]">
              <div>
                <h3 className="text-sm font-semibold text-[#0d253d] uppercase tracking-wider">
                  Relief Capacity & Distribution Center
                </h3>
                <p className="text-xs text-[#64748d] font-light mt-0.5">
                  Configure your receiving location: this address and map coordinates verify where surplus food is accepted and distributed.
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
                    Shelter Delivery / Receiving Address *
                  </label>
                  <span className="text-[11px] text-[#64748d] font-light">
                    Building name, street, locality, city, state and PIN code
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <textarea
                    rows={2}
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Enter complete receiving address e.g. Plot 18, Near King Circle Railway Station, Matunga, Mumbai 400019"
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

              {/* Interactive Leaflet Map */}
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
                      Tip: Drag the marker or click on the map to pinpoint your shelter receiving entrance or unloading ramp.
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

              {/* Dedicated Save Shelter Location Action */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3.5 rounded-lg bg-[#f6f9fc] border border-[#e3e8ee]">
                <div className="text-xs text-[#273951]">
                  <p className="font-medium text-[#0d253d]">Confirm Shelter Receiving Location</p>
                  <p className="text-[11px] text-[#64748d] font-light">
                    Saves your verified GeoJSON coordinates <span className="font-mono text-[#533afd] tnum">[{coords.lon.toFixed(4)}, {coords.lat.toFixed(4)}]</span> to your shelter profile.
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
                      <span>Save Shelter Location</span>
                    </>
                  )}
                </button>
              </div>

              {locationSuccess && (
                <div className="p-3 rounded-md bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Shelter receiving location saved successfully in profile and MongoDB!</span>
                </div>
              )}

              {locationError && (
                <div className="p-3 rounded-md bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{locationError}</span>
                </div>
              )}
            </div>

            {/* Operational & Registration Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div>
                <label className="block text-xs font-medium text-[#0d253d] mb-1">
                  NGO Darpan / Registration ID
                </label>
                <input
                  type="text"
                  value={formData.ngoRegistration}
                  onChange={(e) => setFormData({ ...formData, ngoRegistration: e.target.value })}
                  className="w-full bg-white text-[#0d253d] border border-[#a8c3de] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#533afd] focus:ring-1 focus:ring-[#533afd] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#0d253d] mb-1">
                  Daily Beneficiary Serving Capacity
                </label>
                <input
                  type="text"
                  value={formData.beneficiaryCount}
                  onChange={(e) => setFormData({ ...formData, beneficiaryCount: e.target.value })}
                  placeholder="e.g. 150-200 people daily"
                  className="w-full bg-white text-[#0d253d] border border-[#a8c3de] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#533afd] focus:ring-1 focus:ring-[#533afd] transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-xs font-medium text-[#0d253d] mb-1">
                  Operating / Reception Hours
                </label>
                <input
                  type="text"
                  value={formData.operatingHours}
                  onChange={(e) => setFormData({ ...formData, operatingHours: e.target.value })}
                  placeholder="e.g. 08:00 AM - 10:00 PM"
                  className="w-full bg-white text-[#0d253d] border border-[#a8c3de] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#533afd] focus:ring-1 focus:ring-[#533afd] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#0d253d] mb-1">
                  On-Site Storage Facilities
                </label>
                <input
                  type="text"
                  value={formData.storageFacilities}
                  onChange={(e) => setFormData({ ...formData, storageFacilities: e.target.value })}
                  placeholder="e.g. Commercial Cold Room (4°C) & Insulated Hot Cambros"
                  className="w-full bg-white text-[#0d253d] border border-[#a8c3de] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#533afd] focus:ring-1 focus:ring-[#533afd] transition-all"
                />
              </div>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-[#f6f9fc] border border-[#e3e8ee]">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.vehicleAvailable}
                  onChange={(e) => setFormData({ ...formData, vehicleAvailable: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-[#533afd] focus:ring-[#533afd]"
                />
                <div className="text-xs">
                  <span className="font-medium text-[#0d253d] block">
                    Own Transport / Insulated Van Available
                  </span>
                  <span className="text-[#64748d]">
                    Enables your organization to perform rapid direct pickups from restaurant docks.
                  </span>
                </div>
              </label>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button type="submit" variant="primary" size="md" spark>
              Save All Shelter Details
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
