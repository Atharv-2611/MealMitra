import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DonationProvider } from './context/DonationContext';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Public Pages
import { HomePage } from './pages/public/HomePage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';

// Restaurant Pages
import { RestaurantDashboard } from './pages/restaurant/RestaurantDashboard';
import { DonateFoodPage } from './pages/restaurant/DonateFoodPage';
import { MyDonationsPage } from './pages/restaurant/MyDonationsPage';
import { RestaurantProfilePage } from './pages/restaurant/RestaurantProfilePage';

// Shelter / NGO Pages
import { ShelterDashboard } from './pages/shelter/ShelterDashboard';
import { BrowseFoodPage } from './pages/shelter/BrowseFoodPage';
import { MyRequestsPage } from './pages/shelter/MyRequestsPage';
import { ShelterProfilePage } from './pages/shelter/ShelterProfilePage';

// Shared Authenticated Pages
import { NotificationsPage } from './pages/shared/NotificationsPage';
import { SettingsPage } from './pages/shared/SettingsPage';

function App() {
  return (
    <AuthProvider>
      <DonationProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              {/* 1. Public Route */}
              <Route path="/" element={<HomePage />} />

              {/* 2-4. Authentication Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />

              {/* 5-8. Restaurant Dashboard & Flows */}
              <Route
                path="/restaurant/dashboard"
                element={
                  <ProtectedRoute allowedRole="restaurant">
                    <RestaurantDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/restaurant/donate"
                element={
                  <ProtectedRoute allowedRole="restaurant">
                    <DonateFoodPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/restaurant/donations"
                element={
                  <ProtectedRoute allowedRole="restaurant">
                    <MyDonationsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/restaurant/profile"
                element={
                  <ProtectedRoute allowedRole="restaurant">
                    <RestaurantProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* 9-12. Shelter / NGO Dashboard & Flows */}
              <Route
                path="/shelter/dashboard"
                element={
                  <ProtectedRoute allowedRole="shelter">
                    <ShelterDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/shelter/browse"
                element={
                  <ProtectedRoute allowedRole="shelter">
                    <BrowseFoodPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/shelter/requests"
                element={
                  <ProtectedRoute allowedRole="shelter">
                    <MyRequestsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/shelter/profile"
                element={
                  <ProtectedRoute allowedRole="shelter">
                    <ShelterProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* 13-14. Shared Authenticated Routes */}
              <Route
                path="/notifications"
                element={
                  <ProtectedRoute>
                    <NotificationsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </DonationProvider>
    </AuthProvider>
  );
}

export default App;
