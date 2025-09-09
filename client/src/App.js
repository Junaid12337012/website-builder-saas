import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import EditorPage from './pages/EditorPage';
import AuthCallback from './pages/AuthCallback';
import LandingPage from './pages/LandingPage';
import BillingPage from './pages/BillingPage';
import BillingSuccessPage from './pages/BillingSuccessPage';
import BillingCancelPage from './pages/BillingCancelPage';
import AboutPage from './pages/AboutPage';
import PricingPage from './pages/PricingPage';
import FeaturesPage from './pages/FeaturesPage';
import ContactPage from './pages/ContactPage';
import HelpPage from './pages/HelpPage';
import TemplatesPage from './pages/TemplatesPage';
import IntegrationsPage from './pages/IntegrationsPage';
import BlogPage from './pages/BlogPage';
import CareersPage from './pages/CareersPage';
import CMS from './pages/CMS';
import ProfilePage from './pages/ProfilePage';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  const { user, loading, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const shouldShowNavbar = () => {
    const publicPaths = ['/', '/login', '/register', '/auth/callback', '/features', '/pricing', '/about', '/contact', '/help', '/templates', '/integrations', '/blog', '/careers'];
    const currentPath = window.location.pathname;
    
    // Show navbar on public paths when user is not logged in, or on marketing pages regardless of login status
    const isMarketingPage = ['/features', '/pricing', '/about', '/contact', '/help', '/templates', '/integrations', '/blog', '/careers'].includes(currentPath);
    return publicPaths.includes(currentPath) && (!user || isMarketingPage);
  };

  return (
    <div className="App">
      {shouldShowNavbar() && <Navbar />}
      <Routes>
        {/* Public routes */}
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <RegisterPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        
        {/* Marketing pages - accessible to all users */}
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/templates" element={<TemplatesPage />} />
        <Route path="/integrations" element={<IntegrationsPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/careers" element={<CareersPage />} />
        
        {/* Protected routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/editor/:projectId" element={
          <ProtectedRoute>
            <EditorPage />
          </ProtectedRoute>
        } />
        <Route path="/billing" element={
          <ProtectedRoute>
            <BillingPage />
          </ProtectedRoute>
        } />
        <Route path="/billing/success" element={
          <ProtectedRoute>
            <BillingSuccessPage />
          </ProtectedRoute>
        } />
        <Route path="/billing/cancel" element={
          <ProtectedRoute>
            <BillingCancelPage />
          </ProtectedRoute>
        } />
        <Route path="/cms" element={
          <ProtectedRoute>
            <CMS />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      {shouldShowNavbar() && <Footer />}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;
