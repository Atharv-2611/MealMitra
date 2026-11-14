import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Fetch restaurant profile from backend/MongoDB.
 */
export const getRestaurantProfile = async (restaurantId) => {
  try {
    const response = await apiClient.get(`/profile/${restaurantId}`);
    return response.data;
  } catch (err) {
    console.warn(`[API] getRestaurantProfile fallback for ${restaurantId}:`, err.message);
    return null;
  }
};

/**
 * Save restaurant location (address + GeoJSON Point coordinates) to backend/MongoDB.
 * GeoJSON coordinates must strictly be [longitude, latitude].
 */
export const saveRestaurantLocation = async (restaurantId, profileData) => {
  try {
    const response = await apiClient.put(`/profile/${restaurantId}/location`, profileData);
    return response.data;
  } catch (err) {
    console.error(`[API] saveRestaurantLocation error for ${restaurantId}:`, err.response?.data || err.message);
    throw err;
  }
};

/**
 * Fetch shelter profile from backend/MongoDB.
 */
export const getShelterProfile = async (shelterId) => {
  try {
    const response = await apiClient.get(`/profile/${shelterId}`);
    return response.data;
  } catch (err) {
    console.warn(`[API] getShelterProfile fallback for ${shelterId}:`, err.message);
    return null;
  }
};

/**
 * Save shelter receiving location (address + GeoJSON Point coordinates) to backend/MongoDB.
 * GeoJSON coordinates must strictly be [longitude, latitude].
 */
export const saveShelterLocation = async (shelterId, profileData) => {
  try {
    const response = await apiClient.put(`/profile/${shelterId}/location`, profileData);
    return response.data;
  } catch (err) {
    console.error(`[API] saveShelterLocation error for ${shelterId}:`, err.response?.data || err.message);
    throw err;
  }
};

/**
 * Publish food donation with snapshot of restaurant's pickup address and GeoJSON location.
 */
export const publishDonation = async (donationData) => {
  try {
    const response = await apiClient.post('/donations', donationData);
    return response.data;
  } catch (err) {
    console.error('[API] publishDonation error:', err.response?.data || err.message);
    throw err;
  }
};

/**
 * Fetch donations list with location snapshots.
 */
export const getDonations = async (restaurantId = null) => {
  try {
    const params = restaurantId ? { restaurant_id: restaurantId } : {};
    const response = await apiClient.get('/donations', { params });
    return response.data;
  } catch (err) {
    console.warn('[API] getDonations fallback:', err.message);
    return [];
  }
};

export default apiClient;

