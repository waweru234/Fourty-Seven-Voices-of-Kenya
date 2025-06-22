import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import { AccessibilityProvider } from "./contexts/AccessibilityContext"
import { Toaster } from "./components/ui/toaster"
import Navbar from "./components/Navbar"
import { AccessibilityToolbar } from "./components/AccessibilityToolbar"

import Home from "./pages/Home"
import About from "./pages/About"
import Manifesto from "./pages/Manifesto"
import Leadership from "./pages/Leadership"
import Gallery from "./pages/Gallery"
import Membership from "./pages/Membership"
import Donate from "./pages/Donate"
import Login from "./pages/Login"
import SetPassword from "./pages/SetPassword"
import Dashboard from "./pages/Dashboard"
import EditProfile from "./pages/EditProfile"
import AdminDashboard from "./pages/AdminDashboard"
import PrivacyPolicy from "./pages/PrivacyPolicy"
import NotFound from "./pages/NotFound"
import EmailVerification from "./pages/EmailVerification"
import TermsOfService from "./pages/TermsOfService"
import Declaration from "./pages/Declaration"
import ProtectedRoute from "./components/ProtectedRoute"
import "./App.css"

function App() {
  // Check if the current route is a standalone page
  const isStandalonePage = window.location.pathname === '/terms-of-service' || 
                          window.location.pathname === '/privacy-policy' ||
                          window.location.pathname === '/declaration';

  return (
    <AuthProvider>
      <AccessibilityProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            {!isStandalonePage && <Navbar />}
            <main id="main-content" className="flex-grow" tabIndex={-1}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/manifesto" element={<Manifesto />} />
                <Route path="/leadership" element={<Leadership />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/membership" element={<Membership />} />
                <Route path="/donate" element={<Donate />} />
                <Route path="/login" element={<Login />} />
                <Route path="/set-password" element={<SetPassword />} />
                <Route path="/verify-email" element={<EmailVerification />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/declaration" element={<Declaration />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/edit-profile"
                  element={
                    <ProtectedRoute>
                      <EditProfile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            {!isStandalonePage && (
              <>
                <AccessibilityToolbar />
                <Toaster />
              </>
            )}
          </div>
        </Router>
      </AccessibilityProvider>
    </AuthProvider>
  )
}

export default App
