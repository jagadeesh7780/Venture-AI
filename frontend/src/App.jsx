import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import CreateBusiness from './pages/CreateBusiness';
import MyBusinesses from './pages/MyBusinesses';
import EditBusiness from './pages/EditBusiness';
import AIAnalysisPage from './pages/AIAnalysisPage';
import DigitalTwinPage from './pages/DigitalTwinPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

export const App = () => {
  return (
    <Routes>
      {/* Public Landing / Home Page (First page of the project) */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<LandingPage />} />

      {/* Public Authentication Routes */}
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Route>
      </Route>

      {/* Protected Application Routes (Dashboard & Business Operations) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/create" element={<CreateBusiness />} />
          <Route path="/dashboard/businesses" element={<MyBusinesses />} />
          <Route path="/dashboard/businesses/:id" element={<AIAnalysisPage />} />
          <Route path="/dashboard/businesses/:id/edit" element={<EditBusiness />} />
          <Route path="/dashboard/businesses/:id/analysis" element={<AIAnalysisPage />} />
          <Route path="/dashboard/businesses/:id/digital-twin" element={<DigitalTwinPage />} />
          <Route path="/dashboard/businesses/:id/report" element={<ReportsPage />} />
          <Route path="/dashboard/reports" element={<MyBusinesses />} />
          <Route path="/dashboard/world" element={<MyBusinesses />} />
          <Route path="/dashboard/settings" element={<SettingsPage />} />

          {/* Direct Route Aliases for ease of navigation */}
          <Route path="/create-business" element={<CreateBusiness />} />
          <Route path="/my-businesses" element={<MyBusinesses />} />
          <Route path="/businesses/:id" element={<AIAnalysisPage />} />
          <Route path="/businesses/:id/edit" element={<EditBusiness />} />
          <Route path="/businesses/:id/analysis" element={<AIAnalysisPage />} />
          <Route path="/businesses/:id/digital-twin" element={<DigitalTwinPage />} />
          <Route path="/businesses/:id/report" element={<ReportsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
