/**
 * Geocoding service utilizing OpenStreetMap Nominatim.
 * Strictly adheres to Nominatim usage policies:
 * - Includes customized application User-Agent header
 * - Intended only for explicit user triggers (button click or dragend), never on every keystroke
 */

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org';

/**
 * Geocode a user-provided textual address into geographical coordinates.
 * @param {string} address - Full physical address
 * @returns {Promise<Array<{lat: number, lon: number, displayName: string, address: object}>>}
 */
export const geocodeAddress = async (address) => {
  if (!address || !address.trim()) {
    throw new Error('Please enter an address to search.');
  }

  const query = encodeURIComponent(address.trim());
  const url = `${NOMINATIM_BASE}/search?format=json&q=${query}&limit=5&addressdetails=1`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'MealMitra-FoodRecovery/1.0 (contact@mealmitra.org)'
      }
    });

    if (!response.ok) {
      throw new Error(`Geocoding request failed with status: ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      return [];
    }

    return data.map((item) => ({
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
      displayName: item.display_name,
      addressDetails: item.address || {}
    }));
  } catch (err) {
    console.error('[Geocoding] Error resolving address:', err);
    throw err;
  }
};

/**
 * Reverse geocode geographical coordinates (lat, lon) into a human-readable address.
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<{displayName: string, addressDetails: object}>}
 */
export const reverseGeocode = async (lat, lon) => {
  if (typeof lat !== 'number' || typeof lon !== 'number') {
    throw new Error('Valid latitude and longitude numbers are required.');
  }

  const url = `${NOMINATIM_BASE}/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'MealMitra-FoodRecovery/1.0 (contact@mealmitra.org)'
      }
    });

    if (!response.ok) {
      throw new Error(`Reverse geocoding failed with status: ${response.status}`);
    }

    const data = await response.json();
    return {
      displayName: data.display_name || '',
      addressDetails: data.address || {}
    };
  } catch (err) {
    console.error('[Geocoding] Error reverse geocoding:', err);
    throw err;
  }
};

