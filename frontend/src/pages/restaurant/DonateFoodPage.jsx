import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDonations } from '../../context/DonationContext';
import { Button } from '../../components/common/Button';
import {
  ArrowLeft,
  AlertCircle
} from 'lucide-react';

export const DonateFoodPage = () => {
  const { user } = useAuth();
  const { addDonation } = useDonations();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    foodName: '',
    category: 'Cooked Meals',
    dietary: 'Vegetarian',
    quantity: '',
    unit: 'meals',
    description: '',
    preparedAt: new Date().toISOString().slice(0, 16),
    expiresAt: new Date(Date.now() + 8 * 3600 * 1000).toISOString().slice(0, 16),
    pickupAddress: user?.address || '42 Senapati Bapat Marg, Lower Parel, Mumbai',
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

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
    setTimeout(() => {
      addDonation(
        {
          ...formData,
          quantity: Number(formData.quantity)
        },
        user
      );
      setIsSubmitting(false);
      navigate('/restaurant/donations');
    }, 400);
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
                  value={formData.foodName}
                  onChange={handleChange}
                  placeholder="e.g. Paneer Butter Masala & Steamed Rice"
                  className="w-full bg-white text-[#0d253d] border border-[#a8c3de] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#533afd] focus:ring-1 focus:ring-[#533afd] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#0d253d] mb-1">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-white text-[#0d253d] border border-[#a8c3de] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#533afd] focus:ring-1 focus:ring-[#533afd] transition-all"
                >
                  <option value="Cooked Meals">Cooked Meals (Hot)</option>
                  <option value="Bakery">Bakery & Breads</option>
                  <option value="Raw Produce">Fresh Produce / Vegetables</option>
                  <option value="Packaged">Packaged / Dry Rations</option>
                  <option value="Groceries">Pantry & Groceries</option>
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
                  <option value="Vegetarian">Pure Vegetarian</option>
                  <option value="Non-Vegetarian">Non-Vegetarian</option>
                  <option value="Vegan">Vegan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#0d253d] mb-1">
                  Quantity Available *
                </label>
                <input
                  type="number"
                  name="quantity"
                  required
                  min="1"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="e.g. 50"
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
            <h3 className="text-sm font-semibold text-[#0d253d] uppercase tracking-wider mb-4 pb-2 border-b border-[#e3e8ee]">
              3. Pickup Instructions
            </h3>

            <div>
              <label className="block text-xs font-medium text-[#0d253d] mb-1">
                Pickup Address *
              </label>
              <input
                type="text"
                name="pickupAddress"
                required
                value={formData.pickupAddress}
                onChange={handleChange}
                placeholder="Full address where the NGO vehicle should report"
                className="w-full bg-white text-[#0d253d] border border-[#a8c3de] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#533afd] focus:ring-1 focus:ring-[#533afd] transition-all"
              />
            </div>

            <div className="mt-4">
              <label className="block text-xs font-medium text-[#0d253d] mb-1">
                Special Instructions for Pickup Staff
              </label>
              <input
                type="text"
                name="pickupInstructions"
                value={formData.pickupInstructions}
                onChange={handleChange}
                placeholder="e.g. Enter through Gate 2, ask for Duty Chef Manoj"
                className="w-full bg-white text-[#0d253d] border border-[#a8c3de] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#533afd] focus:ring-1 focus:ring-[#533afd] transition-all"
              />
            </div>
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
              disabled={isSubmitting}
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
