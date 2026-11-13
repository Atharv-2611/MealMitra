import React, { createContext, useContext, useState, useEffect } from 'react';

const DonationContext = createContext(null);

const INITIAL_DONATIONS = [
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
    preparedAt: '2026-11-10T13:30',
    expiresAt: '2026-11-10T22:30',
    pickupAddress: '42 Senapati Bapat Marg, Lower Parel, Mumbai',
    pickupInstructions: 'Enter through Service Gate 2, report to Chef Manoj at the kitchen dispatch dock.',
    freshnessDeclaration: true,
    status: 'available', // 'available' | 'claimed' | 'picked_up' | 'cancelled'
    claimedBy: null,
    claimedAt: null,
    createdAt: '2026-11-10T14:00:00Z'
  },
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
    preparedAt: '2026-11-10T08:00',
    expiresAt: '2026-11-11T14:00',
    pickupAddress: '42 Senapati Bapat Marg, Lower Parel, Mumbai',
    pickupInstructions: 'Reception counter, ask for Bakery Supervisor.',
    freshnessDeclaration: true,
    status: 'claimed',
    claimedBy: {
      shelterId: 'user-shel-202',
      shelterName: 'Anandam Food Relief Shelter',
      contactPhone: '+91 99302 77810',
      expectedPickupTime: '2026-11-10T20:30'
    },
    claimedAt: '2026-11-10T15:30:00Z',
    createdAt: '2026-11-10T11:00:00Z'
  },
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
    preparedAt: '2026-11-09T19:00',
    expiresAt: '2026-11-10T04:00',
    pickupAddress: '42 Senapati Bapat Marg, Lower Parel, Mumbai',
    pickupInstructions: 'Kitchen loading bay.',
    freshnessDeclaration: true,
    status: 'picked_up',
    claimedBy: {
      shelterId: 'user-shel-202',
      shelterName: 'Anandam Food Relief Shelter',
      contactPhone: '+91 99302 77810'
    },
    claimedAt: '2026-11-09T20:15:00Z',
    createdAt: '2026-11-09T19:30:00Z'
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
    preparedAt: '2026-11-10T12:00',
    expiresAt: '2026-11-10T23:30',
    pickupAddress: 'Bandra West, Hill Road, Near Mehboob Studio, Mumbai',
    pickupInstructions: 'Call store manager on arrival for dock release.',
    freshnessDeclaration: true,
    status: 'available',
    claimedBy: null,
    claimedAt: null,
    createdAt: '2026-11-10T13:45:00Z'
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
    preparedAt: '2026-11-10T14:30',
    expiresAt: '2026-11-11T02:00',
    pickupAddress: 'Andheri East, MIDC Central Road, Mumbai',
    pickupInstructions: 'Security cabin at Gate 1 will guide to kitchen dock.',
    freshnessDeclaration: true,
    status: 'available',
    claimedBy: null,
    claimedAt: null,
    createdAt: '2026-11-10T15:00:00Z'
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
    preparedAt: '2026-11-08T16:00',
    expiresAt: '2026-11-08T22:00',
    pickupAddress: '42 Senapati Bapat Marg, Mumbai',
    pickupInstructions: 'Dispatch desk.',
    freshnessDeclaration: true,
    status: 'picked_up',
    claimedBy: {
      shelterId: 'user-shel-202',
      shelterName: 'Anandam Food Relief Shelter',
      contactPhone: '+91 99302 77810'
    },
    claimedAt: '2026-11-08T17:30:00Z',
    createdAt: '2026-11-08T16:30:00Z'
  }
];

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'Donation Claimed',
    message: 'Anandam Food Relief Shelter claimed your "Whole Wheat Breads & Artisan Croissant Assortment" (28 boxes). Expected pickup by 08:30 PM.',
    timestamp: '25 minutes ago',
    read: false,
    type: 'claim',
    link: '/restaurant/donations'
  },
  {
    id: 'notif-2',
    title: 'New Food Donation Available Nearby',
    message: 'The Royal Kitchen posted 45 meals of "Paneer Butter Masala & Rice" in Lower Parel (4.2 km away).',
    timestamp: '1 hour ago',
    read: false,
    type: 'food_available',
    link: '/shelter/browse'
  },
  {
    id: 'notif-3',
    title: 'Pickup Confirmed & Completed',
    message: 'Successfully confirmed pickup for 60 meals of "Dal Tadka, Roti & Seasonal Sabzi". Thank you for preventing food waste!',
    timestamp: 'Yesterday at 09:20 PM',
    read: true,
    type: 'success',
    link: '/restaurant/donations'
  },
  {
    id: 'notif-4',
    title: 'Food Safety Compliance Notice',
    message: 'Please ensure hot foods are maintained above 60°C and cold foods below 5°C during handover.',
    timestamp: '2 days ago',
    read: true,
    type: 'info',
    link: '/settings'
  }
];

export const DonationProvider = ({ children }) => {
  const [donations, setDonations] = useState(() => {
    try {
      const saved = localStorage.getItem('mealmitra_donations');
      return saved ? JSON.parse(saved) : INITIAL_DONATIONS;
    } catch {
      return INITIAL_DONATIONS;
    }
  });

  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('mealmitra_notifications');
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
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
      id: `DON-2026-${String(Math.floor(100 + Math.random() * 900))}`,
      restaurantId: restaurantUser?.id || 'user-rest-101',
      restaurantName: restaurantUser?.organizationName || 'The Royal Kitchen & Caterers',
      pickupAddress: newDonation.pickupAddress || restaurantUser?.address || 'Mumbai, Maharashtra',
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
              notes: notes,
              claimedTime: new Date().toISOString()
            },
            claimedAt: new Date().toISOString()
          };
          return claimedItem;
        }
        return d;
      })
    );

    const shelterNotif = {
      id: `notif-${Date.now()}`,
      title: 'Donation Claim Confirmed',
      message: `You claimed ${claimedItem?.quantity || ''} ${claimedItem?.unit || 'units'} from ${claimedItem?.restaurantName || 'Restaurant'}. Please coordinate pickup.`,
      timestamp: 'Just now',
      read: false,
      type: 'claim',
      link: '/shelter/requests'
    };
    setNotifications((prev) => [shelterNotif, ...prev]);

    return claimedItem;
  };

  // Cancel donation
  const cancelDonation = (donationId, reason = '') => {
    setDonations((prev) =>
      prev.map((d) =>
        d.id === donationId
          ? { ...d, status: 'cancelled', cancellationReason: reason }
          : d
      )
    );
  };

  // Edit donation details
  const updateDonation = (donationId, updates) => {
    setDonations((prev) =>
      prev.map((d) => (d.id === donationId ? { ...d, ...updates } : d))
    );
  };

  // Notification actions
  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <DonationContext.Provider
      value={{
        donations,
        notifications,
        unreadCount: notifications.filter((n) => !n.read).length,
        addDonation,
        updateDonation,
        updateDonationStatus,
        claimDonation,
        cancelDonation,
        markAsRead,
        markAllAsRead
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

