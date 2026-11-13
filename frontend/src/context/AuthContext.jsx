import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const DEMO_USERS = {
  restaurant: {
    id: 'user-rest-101',
    name: 'Vikram Sethi',
    email: 'contact@royalkitchen.com',
    role: 'restaurant',
    organizationName: 'The Royal Kitchen & Caterers',
    phone: '+91 98201 44521',
    address: '42 Senapati Bapat Marg, Lower Parel, Mumbai, Maharashtra 400013',
    fssaiLicense: '11521018000452',
    openingHours: '10:00 AM - 11:30 PM',
    createdAt: '2026-01-15'
  },
  shelter: {
    id: 'user-shel-202',
    name: 'Priya Sharma',
    email: 'info@anandamfoundation.org',
    role: 'shelter',
    organizationName: 'Anandam Food Relief Shelter',
    phone: '+91 99302 77810',
    address: 'Plot 18, Near King Circle Railway Station, Matunga, Mumbai 400019',
    ngoRegistration: 'NGO-MH-2022-0941',
    beneficiaryCount: '150-200 daily meals',
    vehicleAvailable: true,
    createdAt: '2026-02-01'
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('mealmitra_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('mealmitra_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('mealmitra_user');
      }
    } catch (e) {
      console.error('Storage error:', e);
    }
  }, [user]);

  const login = async (email, password, selectedRole = 'restaurant') => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 350));

    let loggedUser = null;
    if (email === DEMO_USERS.restaurant.email || (selectedRole === 'restaurant' && !email.toLowerCase().includes('shelter') && !email.toLowerCase().includes('anandam'))) {
      loggedUser = { ...DEMO_USERS.restaurant, email: email || DEMO_USERS.restaurant.email };
    } else {
      loggedUser = { ...DEMO_USERS.shelter, email: email || DEMO_USERS.shelter.email };
    }

    setUser(loggedUser);
    setLoading(false);
    return loggedUser;
  };

  const loginDemo = (role) => {
    const demoUser = DEMO_USERS[role] || DEMO_USERS.restaurant;
    setUser(demoUser);
    return demoUser;
  };

  const register = async (formData) => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 400));

    const newUser = {
      id: `user-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      role: formData.role, // 'restaurant' or 'shelter'
      organizationName: formData.organizationName,
      phone: formData.phone,
      address: formData.address,
      fssaiLicense: formData.fssaiLicense || '',
      ngoRegistration: formData.ngoRegistration || '',
      beneficiaryCount: formData.beneficiaryCount || '',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setUser(newUser);
    setLoading(false);
    return newUser;
  };

  const updateProfile = (updates) => {
    setUser((prev) => {
      const updated = { ...prev, ...updates };
      return updated;
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mealmitra_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: Boolean(user),
        loading,
        login,
        loginDemo,
        register,
        updateProfile,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

