import React, { createContext, useContext, useState, useEffect } from 'react';

const DonationContext = createContext(null);

const INITIAL_DONATIONS = [
  // --- Available Surplus Food (Ready for Shelter Claim across all categories) ---
  {
    id: 'DON-2026-081',
    restaurantId: 'user-rest-101',
    restaurantName: 'The Royal Kitchen & Caterers',
    foodName: 'Paneer Butter Masala & Steamed Basmati Rice',
    category: 'Cooked Meals',
    dietary: 'Vegetarian',
    quantity: 45,
    unit: 'meals',
    description: 'Freshly prepared corporate catering surplus. Stored in high-grade insulated cambro containers at >65°C.',
    preparedAt: '2026-11-14T13:30',
    expiresAt: '2026-11-14T23:30',
    pickupAddress: '42 Senapati Bapat Marg, Lower Parel, Mumbai',
    pickupLocation: {
      type: 'Point',
      coordinates: [72.8295, 18.9986]
    },
    pickupInstructions: 'Enter through Service Gate 2, report to Chef Manoj at the kitchen dispatch dock.',
    freshnessDeclaration: true,
    status: 'available',
    claimedBy: null,
    claimedAt: null,
    createdAt: '2026-11-14T14:00:00Z'
  },
  {
    id: 'DON-2026-083',
    restaurantId: 'user-rest-305',
    restaurantName: 'Taj Confectioneries & Deli',
    foodName: 'Multigrain Veg Sandwiches & Fresh Seasonal Fruit Bowls',
    category: 'Cooked Meals',
    dietary: 'Vegetarian',
    quantity: 35,
    unit: 'packs',
    description: 'Hygienically pre-packed sandwiches and chilled fruit bowls, refrigerated at 4°C.',
    preparedAt: '2026-11-14T12:00',
    expiresAt: '2026-11-14T23:45',
    pickupAddress: 'Bandra West, Hill Road, Near Mehboob Studio, Mumbai',
    pickupLocation: {
      type: 'Point',
      coordinates: [72.8258, 19.0544]
    },
    pickupInstructions: 'Call store manager on arrival for dock release.',
    freshnessDeclaration: true,
    status: 'available',
    claimedBy: null,
    claimedAt: null,
    createdAt: '2026-11-14T13:45:00Z'
  },
  {
    id: 'DON-2026-084',
    restaurantId: 'user-rest-410',
    restaurantName: 'Green Garden Banquet Hall',
    foodName: 'Hyderabadi Veg Biryani & Cucumber Mint Raita',
    category: 'Cooked Meals',
    dietary: 'Vegetarian',
    quantity: 80,
    unit: 'meals',
    description: 'Wedding banquet lunch surplus prepared under standard culinary hygiene protocols.',
    preparedAt: '2026-11-14T14:30',
    expiresAt: '2026-11-15T02:00',
    pickupAddress: 'Andheri East, MIDC Central Road, Mumbai',
    pickupLocation: {
      type: 'Point',
      coordinates: [72.8697, 19.1197]
    },
    pickupInstructions: 'Security cabin at Gate 1 will guide to kitchen dock.',
    freshnessDeclaration: true,
    status: 'available',
    claimedBy: null,
    claimedAt: null,
    createdAt: '2026-11-14T15:00:00Z'
  },
  {
    id: 'DON-2026-090',
    restaurantId: 'user-rest-501',
    restaurantName: 'Amul Fresh Dairy Depot',
    foodName: 'Pasteurised Toned Milk Pouches (500ml crates)',
    category: 'Dairy',
    dietary: 'Vegetarian',
    quantity: 40,
    unit: 'litres',
    description: 'Surplus morning distribution crates held continuously in refrigerated cold room at 3°C. High nutrition for children and senior shelter homes.',
    preparedAt: '2026-11-14T06:00',
    expiresAt: '2026-11-16T18:00',
    pickupAddress: 'Kurla West, Near Kurla Railway Terminus, Mumbai',
    pickupLocation: {
      type: 'Point',
      coordinates: [72.8797, 19.0688]
    },
    pickupInstructions: 'Cold storage dock 3. Bring thermal carrier boxes or insulated bags.',
    freshnessDeclaration: true,
    status: 'available',
    claimedBy: null,
    claimedAt: null,
    createdAt: '2026-11-14T08:00:00Z'
  },
  {
    id: 'DON-2026-091',
    restaurantId: 'user-rest-502',
    restaurantName: 'Kisan Mandi Central Distribution',
    foodName: 'Farm Fresh Tomatoes, Capsicum & Golden Potatoes',
    category: 'Raw Produce',
    dietary: 'Vegetarian',
    quantity: 65,
    unit: 'kg',
    description: 'Grade-A wholesale agricultural produce crates sorted and crate-packed today. Excellent for community kitchen cooking.',
    preparedAt: '2026-11-14T07:00',
    expiresAt: '2026-11-17T20:00',
    pickupAddress: 'APMC Market Yard Phase 2, Vashi, Navi Mumbai',
    pickupLocation: {
      type: 'Point',
      coordinates: [72.9982, 19.0760]
    },
    pickupInstructions: 'Wholesale Shed 14. Loading helpers on site will assist loading your van.',
    freshnessDeclaration: true,
    status: 'available',
    claimedBy: null,
    claimedAt: null,
    createdAt: '2026-11-14T08:30:00Z'
  },
  {
    id: 'DON-2026-092',
    restaurantId: 'user-rest-503',
    restaurantName: 'Metro Cash & Carry Hub',
    foodName: 'Nutritious Multigrain Oats & High-Fiber Biscuit Packs',
    category: 'Packaged Foods',
    dietary: 'Vegetarian',
    quantity: 50,
    unit: 'boxes',
    description: 'Unopened sealed manufacturer distribution overstock in original corrugated master cartons. Long shelf life.',
    preparedAt: '2026-11-14T09:00',
    expiresAt: '2026-12-30T23:59',
    pickupAddress: 'Bhandup West, LBS Marg, Mumbai',
    pickupLocation: {
      type: 'Point',
      coordinates: [72.9328, 19.1528]
    },
    pickupInstructions: 'Customer service dispatch desk at Entry Gate B. Ask for CSR Coordinator Anand.',
    freshnessDeclaration: true,
    status: 'available',
    claimedBy: null,
    claimedAt: null,
    createdAt: '2026-11-14T10:00:00Z'
  },
  {
    id: 'DON-2026-093',
    restaurantId: 'user-rest-504',
    restaurantName: 'Madras Cafe & Catering',
    foodName: 'Steamed Idlis, Medu Vadas & Vegetable Sambar with Chutney',
    category: 'Cooked Meals',
    dietary: 'Vegetarian',
    quantity: 70,
    unit: 'meals',
    description: 'Morning corporate seminar surplus packed piping hot in sealed food-grade containers with coconut chutney on the side.',
    preparedAt: '2026-11-14T11:00',
    expiresAt: '2026-11-14T22:30',
    pickupAddress: 'King\'s Circle, Matunga East, Mumbai',
    pickupLocation: {
      type: 'Point',
      coordinates: [72.8561, 19.0269]
    },
    pickupInstructions: 'Direct kitchen gate on Telang Road. Very close to Matunga station.',
    freshnessDeclaration: true,
    status: 'available',
    claimedBy: null,
    claimedAt: null,
    createdAt: '2026-11-14T11:30:00Z'
  },
  {
    id: 'DON-2026-094',
    restaurantId: 'user-rest-505',
    restaurantName: 'Theobroma Artisan Bakery',
    foodName: 'Fresh Multigrain Loaves, Burger Buns & Cinnamon Rolls',
    category: 'Bakery',
    dietary: 'Vegetarian',
    quantity: 35,
    unit: 'boxes',
    description: 'Artisan bakery surplus from morning bake cycle. All packaged cleanly in food-safe sealed paper sacks.',
    preparedAt: '2026-11-14T10:30',
    expiresAt: '2026-11-15T18:00',
    pickupAddress: 'Palladium Mall Service Dock, Lower Parel, Mumbai',
    pickupLocation: {
      type: 'Point',
      coordinates: [72.8258, 18.9950]
    },
    pickupInstructions: 'Rear service entrance basement level 1. Call bakery dispatch manager.',
    freshnessDeclaration: true,
    status: 'available',
    claimedBy: null,
    claimedAt: null,
    createdAt: '2026-11-14T12:00:00Z'
  },
  {
    id: 'DON-2026-095',
    restaurantId: 'user-rest-506',
    restaurantName: 'Punjab Grill Corporate Caterers',
    foodName: 'Dal Makhani, Subz Miloni & Tandoori Roti Combo',
    category: 'Cooked Meals',
    dietary: 'Vegetarian',
    quantity: 50,
    unit: 'meals',
    description: 'Executive luncheon surplus held in insulated hot cambros at >70°C. Complete nutritious meals.',
    preparedAt: '2026-11-14T13:00',
    expiresAt: '2026-11-14T23:00',
    pickupAddress: 'BKC G-Block, Platina Building, Bandra Kurla Complex, Mumbai',
    pickupLocation: {
      type: 'Point',
      coordinates: [72.8683, 19.0626]
    },
    pickupInstructions: 'Report to Platina basement kitchen loading bay dock 2.',
    freshnessDeclaration: true,
    status: 'available',
    claimedBy: null,
    claimedAt: null,
    createdAt: '2026-11-14T13:30:00Z'
  },

  // --- Active Scheduled Pickups (Claimed by Anandam Food Relief Shelter) ---
  {
    id: 'DON-2026-082',
    restaurantId: 'user-rest-101',
    restaurantName: 'The Royal Kitchen & Caterers',
    foodName: 'Whole Wheat Breads & Artisan Croissant Assortment',
    category: 'Bakery',
    dietary: 'Vegetarian',
    quantity: 28,
    unit: 'boxes',
    description: 'Unsold premium morning bake batches. Packed cleanly in food-safe sealed bakery crates.',
    preparedAt: '2026-11-14T08:00',
    expiresAt: '2026-11-15T14:00',
    pickupAddress: '42 Senapati Bapat Marg, Lower Parel, Mumbai',
    pickupLocation: {
      type: 'Point',
      coordinates: [72.8295, 18.9986]
    },
    pickupInstructions: 'Reception counter, ask for Bakery Supervisor Duty Officer.',
    freshnessDeclaration: true,
    status: 'claimed',
    claimedBy: {
      shelterId: 'user-shel-202',
      shelterName: 'Anandam Food Relief Shelter',
      contactPhone: '+91 99302 77810',
      expectedPickupTime: '2026-11-14T20:30',
      notes: 'Insulated van MH-02-EE-4412 dispatched with 2 shelter volunteers.'
    },
    claimedAt: '2026-11-14T15:30:00Z',
    createdAt: '2026-11-14T11:00:00Z'
  },
  {
    id: 'DON-2026-085',
    restaurantId: 'user-rest-507',
    restaurantName: 'Grand Hyatt Banquet Kitchen',
    foodName: 'Steamed Jeera Rice & Rajma Masala with Tawa Roti',
    category: 'Cooked Meals',
    dietary: 'Vegetarian',
    quantity: 55,
    unit: 'meals',
    description: 'Corporate summit dinner surplus. Packed in heavy-duty food-grade insulated cambro containers at >65°C.',
    preparedAt: '2026-11-14T16:00',
    expiresAt: '2026-11-15T01:30',
    pickupAddress: 'Off Western Express Highway, Santacruz East, Mumbai',
    pickupLocation: {
      type: 'Point',
      coordinates: [72.8517, 19.0790]
    },
    pickupInstructions: 'Security Gate 4, inform security for Banquet Kitchen Dock 2.',
    freshnessDeclaration: true,
    status: 'claimed',
    claimedBy: {
      shelterId: 'user-shel-202',
      shelterName: 'Anandam Food Relief Shelter',
      contactPhone: '+91 99302 77810',
      expectedPickupTime: '2026-11-14T21:45',
      notes: 'Volunteer driver Ramesh en route with hot holding cambros.'
    },
    claimedAt: '2026-11-14T17:15:00Z',
    createdAt: '2026-11-14T16:15:00Z'
  },
  {
    id: 'DON-2026-086',
    restaurantId: 'user-rest-508',
    restaurantName: 'Jio World Convention Caterers',
    foodName: 'Assorted Deli Rolls, Vegetable Wraps & Fresh Citrus Fruit',
    category: 'Cooked Meals',
    dietary: 'Vegetarian',
    quantity: 40,
    unit: 'packs',
    description: 'Afternoon exhibition surplus chilled in individual sealed biodegradable boxes.',
    preparedAt: '2026-11-14T15:30',
    expiresAt: '2026-11-15T03:00',
    pickupAddress: 'G Block, Bandra Kurla Complex (BKC), Mumbai',
    pickupLocation: {
      type: 'Point',
      coordinates: [72.8683, 19.0626]
    },
    pickupInstructions: 'Service Loading Dock B-3. Contact duty supervisor Sunil on arrival.',
    freshnessDeclaration: true,
    status: 'claimed',
    claimedBy: {
      shelterId: 'user-shel-202',
      shelterName: 'Anandam Food Relief Shelter',
      contactPhone: '+91 99302 77810',
      expectedPickupTime: '2026-11-14T22:30',
      notes: 'Pickup scheduled during evening logistics route.'
    },
    claimedAt: '2026-11-14T17:45:00Z',
    createdAt: '2026-11-14T15:45:00Z'
  },

  // --- Completed Pickups / Distributed History by Anandam Shelter ---
  {
    id: 'DON-2026-079',
    restaurantId: 'user-rest-101',
    restaurantName: 'The Royal Kitchen & Caterers',
    foodName: 'Yellow Dal Tadka, Whole Wheat Roti & Mixed Veg',
    category: 'Cooked Meals',
    dietary: 'Vegetarian',
    quantity: 60,
    unit: 'meals',
    description: 'Seminar lunch surplus packed in insulated hot containers.',
    preparedAt: '2026-11-13T19:00',
    expiresAt: '2026-11-14T04:00',
    pickupAddress: '42 Senapati Bapat Marg, Lower Parel, Mumbai',
    pickupLocation: {
      type: 'Point',
      coordinates: [72.8295, 18.9986]
    },
    pickupInstructions: 'Kitchen loading bay dock.',
    freshnessDeclaration: true,
    status: 'picked_up',
    claimedBy: {
      shelterId: 'user-shel-202',
      shelterName: 'Anandam Food Relief Shelter',
      contactPhone: '+91 99302 77810',
      notes: 'Successfully distributed to 60 beneficiaries at Dharavi Community Center.'
    },
    claimedAt: '2026-11-13T20:15:00Z',
    createdAt: '2026-11-13T19:30:00Z'
  },
  {
    id: 'DON-2026-077',
    restaurantId: 'user-rest-101',
    restaurantName: 'The Royal Kitchen & Caterers',
    foodName: 'Vegetable Cutlets & Mint Coriander Dip',
    category: 'Cooked Meals',
    dietary: 'Vegetarian',
    quantity: 30,
    unit: 'packs',
    description: 'Evening tea snack surplus, packed hot in foil trays.',
    preparedAt: '2026-11-12T16:00',
    expiresAt: '2026-11-12T22:00',
    pickupAddress: '42 Senapati Bapat Marg, Lower Parel, Mumbai',
    pickupLocation: {
      type: 'Point',
      coordinates: [72.8295, 18.9986]
    },
    pickupInstructions: 'Dispatch desk.',
    freshnessDeclaration: true,
    status: 'picked_up',
    claimedBy: {
      shelterId: 'user-shel-202',
      shelterName: 'Anandam Food Relief Shelter',
      contactPhone: '+91 99302 77810',
      notes: 'Distributed as evening snack for shelter children education batch.'
    },
    claimedAt: '2026-11-12T17:30:00Z',
    createdAt: '2026-11-12T16:30:00Z'
  },
  {
    id: 'DON-2026-075',
    restaurantId: 'user-rest-509',
    restaurantName: 'Mayfair Banquets & Events',
    foodName: 'Shahi Paneer, Dal Makhani & Missi Roti Platter',
    category: 'Cooked Meals',
    dietary: 'Vegetarian',
    quantity: 95,
    unit: 'meals',
    description: 'Wedding reception surplus collected and distributed across Matunga slum community center.',
    preparedAt: '2026-11-11T14:00',
    expiresAt: '2026-11-12T01:00',
    pickupAddress: 'Dr. Annie Besant Road, Worli, Mumbai',
    pickupLocation: {
      type: 'Point',
      coordinates: [72.8184, 19.0144]
    },
    pickupInstructions: 'Rear banquet dispatch dock.',
    freshnessDeclaration: true,
    status: 'picked_up',
    claimedBy: {
      shelterId: 'user-shel-202',
      shelterName: 'Anandam Food Relief Shelter',
      contactPhone: '+91 99302 77810',
      notes: 'Successfully distributed to 95 residents at Matunga Labor Colony.'
    },
    claimedAt: '2026-11-11T16:00:00Z',
    createdAt: '2026-11-11T14:30:00Z'
  },
  {
    id: 'DON-2026-074',
    restaurantId: 'user-rest-510',
    restaurantName: 'Shree Mahavir Community Kitchen',
    foodName: 'Moong Dal Khichdi, Gujarati Kadhi & Roasted Papad',
    category: 'Cooked Meals',
    dietary: 'Vegetarian',
    quantity: 80,
    unit: 'meals',
    description: 'Community hall lunch surplus verified at 70°C in food-grade thermos containers.',
    preparedAt: '2026-11-10T12:30',
    expiresAt: '2026-11-10T21:00',
    pickupAddress: 'Walkeshwar Road, Malabar Hill, Mumbai',
    pickupLocation: {
      type: 'Point',
      coordinates: [72.7997, 18.9500]
    },
    pickupInstructions: 'Trust office rear dispatch door.',
    freshnessDeclaration: true,
    status: 'picked_up',
    claimedBy: {
      shelterId: 'user-shel-202',
      shelterName: 'Anandam Food Relief Shelter',
      contactPhone: '+91 99302 77810',
      notes: 'Nutritious dinner served to senior citizen night shelter inmates.'
    },
    claimedAt: '2026-11-10T14:15:00Z',
    createdAt: '2026-11-10T13:00:00Z'
  },
  {
    id: 'DON-2026-073',
    restaurantId: 'user-rest-511',
    restaurantName: 'Bastian Bakery & Cafe',
    foodName: 'Fresh Bagels, Croissants & Multigrain Sandwich Loaves',
    category: 'Bakery',
    dietary: 'Vegetarian',
    quantity: 45,
    unit: 'boxes',
    description: 'Morning bake overstock packed in hygienic bakery trays.',
    preparedAt: '2026-11-09T08:30',
    expiresAt: '2026-11-10T18:00',
    pickupAddress: 'Linking Road, Bandra West, Mumbai',
    pickupLocation: {
      type: 'Point',
      coordinates: [72.8354, 19.0596]
    },
    pickupInstructions: 'Rear loading lane near staff entrance.',
    freshnessDeclaration: true,
    status: 'picked_up',
    claimedBy: {
      shelterId: 'user-shel-202',
      shelterName: 'Anandam Food Relief Shelter',
      contactPhone: '+91 99302 77810',
      notes: 'Breakfast served to 120 children at Sion municipal study center.'
    },
    claimedAt: '2026-11-09T10:30:00Z',
    createdAt: '2026-11-09T09:00:00Z'
  },

  // --- Cancelled / Released Claims ---
  {
    id: 'DON-2026-071',
    restaurantId: 'user-rest-512',
    restaurantName: 'Cafe Moshe\'s Continental',
    foodName: 'Assorted Penne Arrabiata Pasta & Garlic Herb Bread',
    category: 'Cooked Meals',
    dietary: 'Vegetarian',
    quantity: 35,
    unit: 'meals',
    description: 'Corporate lunch buffet surplus.',
    preparedAt: '2026-11-08T13:00',
    expiresAt: '2026-11-08T20:30',
    pickupAddress: 'Cuffe Parade, Colaba, Mumbai',
    pickupLocation: {
      type: 'Point',
      coordinates: [72.8211, 18.9150]
    },
    pickupInstructions: 'Service elevator lobby.',
    freshnessDeclaration: true,
    status: 'cancelled',
    cancellationReason: 'Shelter van faced severe traffic breakdown on Eastern Freeway; released back so nearby Colaba shelter could claim.',
    claimedBy: {
      shelterId: 'user-shel-202',
      shelterName: 'Anandam Food Relief Shelter',
      contactPhone: '+91 99302 77810',
      notes: 'Released batch voluntarily to prevent food waste.'
    },
    claimedAt: '2026-11-08T14:00:00Z',
    createdAt: '2026-11-08T13:30:00Z'
  },
  {
    id: 'DON-2026-070',
    restaurantId: 'user-rest-513',
    restaurantName: 'Trident Hotel Nariman Point',
    foodName: 'Mixed Fruit Tarts & English Tea Muffins',
    category: 'Bakery',
    dietary: 'Vegetarian',
    quantity: 20,
    unit: 'boxes',
    description: 'Breakfast banquet overproduction.',
    preparedAt: '2026-11-07T09:00',
    expiresAt: '2026-11-08T12:00',
    pickupAddress: 'Nariman Point, Marine Drive, Mumbai',
    pickupLocation: {
      type: 'Point',
      coordinates: [72.8222, 18.9272]
    },
    pickupInstructions: 'Receiving dock gate 3.',
    freshnessDeclaration: true,
    status: 'cancelled',
    cancellationReason: 'Daily shelter sweet bakery quota already fulfilled; released for alternate youth vocational center.',
    claimedBy: {
      shelterId: 'user-shel-202',
      shelterName: 'Anandam Food Relief Shelter',
      contactPhone: '+91 99302 77810',
      notes: 'Cancelled by shelter logistics manager.'
    },
    claimedAt: '2026-11-07T10:15:00Z',
    createdAt: '2026-11-07T09:30:00Z'
  }
];

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-shel-1',
    title: 'New Food Surplus Alert',
    message: 'Madras Cafe posted 70 meals of "Steamed Idlis & Sambar" in Matunga East (800m away from your center).',
    timestamp: '15 minutes ago',
    read: false,
    type: 'food_available',
    link: '/shelter/browse'
  },
  {
    id: 'notif-shel-2',
    title: 'Upcoming Collection Reminder',
    message: 'Pickup at Grand Hyatt Banquet (55 meals) is scheduled for 09:45 PM tonight. Transport van assigned.',
    timestamp: '45 minutes ago',
    read: false,
    type: 'claim',
    link: '/shelter/requests'
  },
  {
    id: 'notif-shel-3',
    title: 'Distribution Verified & Logged',
    message: '95 meals of "Shahi Paneer & Dal Makhani" verified as distributed at Matunga Labor Colony. Thank you!',
    timestamp: 'Yesterday',
    read: true,
    type: 'success',
    link: '/shelter/requests'
  },
  {
    id: 'notif-shel-4',
    title: 'New Category Added: Dairy & Produce',
    message: 'Amul Dairy Depot and Kisan Mandi have listed raw produce and fresh milk surplus available for direct collection.',
    timestamp: '2 days ago',
    read: true,
    type: 'info',
    link: '/shelter/browse'
  },
  {
    id: 'notif-shel-5',
    title: 'Monthly Impact Milestone',
    message: 'Anandam Food Relief Shelter has rescued over 520 kg of surplus food this month, feeding over 600 beneficiaries!',
    timestamp: '3 days ago',
    read: true,
    type: 'success',
    link: '/shelter/dashboard'
  }
];

export const DonationProvider = ({ children }) => {
  const [donations, setDonations] = useState(() => {
    try {
      const saved = localStorage.getItem('mealmitra_donations');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Merge in any initial donations that are not already present in the user's stored cache
          const existingIds = new Set(parsed.map((d) => d.id));
          const missing = INITIAL_DONATIONS.filter((d) => !existingIds.has(d.id));
          if (missing.length > 0) {
            const combined = [...parsed, ...missing];
            return combined;
          }
          return parsed;
        }
      }
      return INITIAL_DONATIONS;
    } catch {
      return INITIAL_DONATIONS;
    }
  });

  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('mealmitra_notifications');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const existingIds = new Set(parsed.map((n) => n.id));
          const missing = INITIAL_NOTIFICATIONS.filter((n) => !existingIds.has(n.id));
          if (missing.length > 0) {
            return [...parsed, ...missing];
          }
          return parsed;
        }
      }
      return INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('mealmitra_donations', JSON.stringify(donations));
    } catch (e) {
      console.error(e);
    }
  }, [donations]);

  useEffect(() => {
    try {
      localStorage.setItem('mealmitra_notifications', JSON.stringify(notifications));
    } catch (e) {
      console.error(e);
    }
  }, [notifications]);

  // Restaurant action: Add food donation
  const addDonation = (newDonation, restaurantUser) => {
    const donationItem = {
      id: newDonation.id || `DON-2026-${String(Math.floor(100 + Math.random() * 900))}`,
      restaurantId: restaurantUser?.id || 'user-rest-101',
      restaurantName: restaurantUser?.organizationName || 'The Royal Kitchen & Caterers',
      pickupAddress: newDonation.pickupAddress || restaurantUser?.address || 'Mumbai, Maharashtra',
      pickupLocation: newDonation.pickupLocation || restaurantUser?.location || {
        type: 'Point',
        coordinates: [72.8295, 18.9986]
      },
      status: 'available',
      claimedBy: null,
      claimedAt: null,
      createdAt: new Date().toISOString(),
      ...newDonation
    };

    setDonations((prev) => [donationItem, ...prev]);

    const newNotif = {
      id: `notif-${Date.now()}`,
      title: 'Donation Listed Successfully',
      message: `Your donation "${donationItem.foodName}" (${donationItem.quantity} ${donationItem.unit}) is now live for verified NGOs to claim.`,
      timestamp: 'Just now',
      read: false,
      type: 'info',
      link: '/restaurant/donations'
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return donationItem;
  };

  // Update status (e.g. mark picked up)
  const updateDonationStatus = (donationId, status) => {
    setDonations((prev) =>
      prev.map((d) => (d.id === donationId ? { ...d, status } : d))
    );
  };

  // Shelter action: Claim donation
  const claimDonation = (donationId, shelterUser, notes = '') => {
    let claimedItem = null;
    setDonations((prev) =>
      prev.map((d) => {
        if (d.id === donationId) {
          claimedItem = {
            ...d,
            status: 'claimed',
            claimedBy: {
              shelterId: shelterUser?.id || 'user-shel-202',
              shelterName: shelterUser?.organizationName || 'Anandam Food Relief Shelter',
              contactPhone: shelterUser?.phone || '+91 99302 77810',
              expectedPickupTime: new Date(Date.now() + 2 * 3600 * 1000).toISOString().slice(0, 16),
              notes: notes || 'Volunteer transport vehicle assigned for rapid pickup.'
            },
            claimedAt: new Date().toISOString()
          };
          return claimedItem;
        }
        return d;
      })
    );

    if (claimedItem) {
      const claimNotif = {
        id: `notif-${Date.now()}`,
        title: 'Donation Reserved & Scheduled',
        message: `You successfully reserved "${claimedItem.foodName}" (${claimedItem.quantity} ${claimedItem.unit}). Please complete pickup before expiry.`,
        timestamp: 'Just now',
        read: false,
        type: 'claim',
        link: '/shelter/requests'
      };
      setNotifications((prev) => [claimNotif, ...prev]);
    }
  };

  // Shelter action: Cancel claim / release back to feed
  const cancelDonation = (donationId, reason = '') => {
    setDonations((prev) =>
      prev.map((d) => {
        if (d.id === donationId) {
          return {
            ...d,
            status: 'cancelled',
            cancellationReason: reason || 'Released by shelter',
            claimedBy: null
          };
        }
        return d;
      })
    );
  };

  return (
    <DonationContext.Provider
      value={{
        donations,
        notifications,
        addDonation,
        updateDonationStatus,
        claimDonation,
        cancelDonation
      }}
    >
      {children}
    </DonationContext.Provider>
  );
};

export const useDonations = () => {
  const context = useContext(DonationContext);
  if (!context) {
    throw new Error('useDonations must be used within a DonationProvider');
  }
  return context;
};
