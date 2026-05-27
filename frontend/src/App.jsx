import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'

import Navbar         from './components/Navbar.jsx'
import CartDrawer     from './components/CartDrawer.jsx'
import Footer         from './components/Footer.jsx'
import ChatWidget     from './components/ChatWidget.jsx'

import HomePage           from './pages/HomePage.jsx'
import GalleryPage        from './pages/GalleryPage.jsx'
import ArtworkDetailPage  from './pages/ArtworkDetailPage.jsx'
import ArtistDashboard    from './pages/ArtistDashboard.jsx'
import BuyerDashboard     from './pages/BuyerDashboard.jsx'
import OrderSuccessPage   from './pages/OrderSuccessPage.jsx'
import LoginPage          from './pages/LoginPage.jsx'
import RegisterPage       from './pages/RegisterPage.jsx'
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx'
import MockCheckoutPage   from './pages/MockCheckoutPage.jsx'
import AboutPage          from './pages/AboutPage.jsx'
import ServicesPage       from './pages/ServicesPage.jsx'
import HowItWorksPage     from './pages/HowItWorksPage.jsx'
import ContactPage        from './pages/ContactPage.jsx'
import NotFoundPage       from './pages/NotFoundPage.jsx'

// ── Route Guards ──────────────────────────────────────────────────────────────

function RequireArtist({ children }) {
  const { isArtist } = useAuth()
  return isArtist ? children : <Navigate to="/gallery" replace />
}

function RequireCustomer({ children }) {
  const { isCustomer, isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return isCustomer ? children : <Navigate to="/gallery" replace />
}

// ── App Shell ─────────────────────────────────────────────────────────────────

function AppShell() {
  const [cartOpen, setCartOpen] = useState(false)
  const { isCustomer } = useAuth()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onCartOpen={() => setCartOpen(true)} />

      <div className="flex-1">
        <Routes>
          {/* Public */}
          <Route path="/"               element={<HomePage />} />
          <Route path="/gallery"        element={<GalleryPage />} />
          <Route path="/artworks/:id"   element={<ArtworkDetailPage />} />
          <Route path="/about"          element={<AboutPage />} />
          <Route path="/services"       element={<ServicesPage />} />
          <Route path="/how-it-works"   element={<HowItWorksPage />} />
          <Route path="/contact"        element={<ContactPage />} />
          <Route path="/login"          element={<LoginPage />} />
          <Route path="/register"       element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Artist-only */}
          <Route path="/artist/dashboard" element={
            <RequireArtist><ArtistDashboard /></RequireArtist>
          } />

          {/* Customer-only */}
          <Route path="/buyer/dashboard" element={
            <RequireCustomer><BuyerDashboard /></RequireCustomer>
          } />
          <Route path="/order/success" element={
            <RequireCustomer><OrderSuccessPage /></RequireCustomer>
          } />
          <Route path="/mock-checkout" element={
            <RequireCustomer><MockCheckoutPage /></RequireCustomer>
          } />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>

      <Footer />
      <ChatWidget />

      {isCustomer && (
        <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      )}
    </div>
  )
}

// ── Root ──────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppShell />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
