"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, User, LogOut, Heart, Shield, Settings2 } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { useAccessibility } from "@/contexts/AccessibilityContext"

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()
  const { isToolbarVisible, setToolbarVisible } = useAccessibility()
  const navigate = useNavigate()
  const location = useLocation()

  // Check if user is admin
  const checkIfAdmin = () => {
    if (!isAuthenticated || !user) return false

    // First check the user object directly
    if (user.isAdmin === true) return true

    // If not found in user object, check localStorage
    try {
      const storedUsers = localStorage.getItem("users")
      if (storedUsers) {
        const users = JSON.parse(storedUsers)
        // Find the current user by email or membership number
        const currentUser = users.find(
          (u: any) =>
            (user.email && u.email === user.email) ||
            (user.membershipNumber && u.membershipNumber === user.membershipNumber),
        )
        return currentUser?.isAdmin === true
      }
    } catch (error) {
      console.error("Error checking admin status:", error)
    }

    return false
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const navigateToPage = (path: string) => {
    navigate(path)
    setMobileMenuOpen(false)
  }

  const handleSupportMovement = () => {
    navigate("/donate")
    setMobileMenuOpen(false)
  }

  const handleDashboardClick = () => {
    const isAdmin = checkIfAdmin()
    if (isAdmin) {
      navigate("/admin")
    } else {
      navigate("/dashboard")
    }
    setMobileMenuOpen(false)
  }

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-sm shadow-md py-2" : "bg-white py-4"
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
              <div className="h-12 w-12 rounded-full overflow-hidden">
                <img
                  src="/lovable-uploads/vok.png"
                  alt="Forty Seven Voices of Kenya"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-party-hotpink text-2xl font-bold tracking-wider">THE VOICES PARTY</div>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-1 items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setToolbarVisible(!isToolbarVisible)}
              className="text-gray-800 hover:bg-gray-100"
              aria-label="Accessibility settings"
            >
              <Settings2 className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              className={`text-gray-800 font-medium hover:bg-party-hotpink/10 hover:text-party-hotpink ${
                location.pathname === "/" ? "bg-party-hotpink/10 text-party-hotpink" : ""
              }`}
              onClick={() => navigateToPage("/")}
            >
              Home
            </Button>
            <Button
              variant="ghost"
              className={`text-gray-800 font-medium hover:bg-party-lightblue/10 hover:text-party-lightblue ${
                location.pathname === "/about" ? "bg-party-lightblue/10 text-party-lightblue" : ""
              }`}
              onClick={() => navigateToPage("/about")}
            >
              About
            </Button>
            <Button
              variant="ghost"
              className={`text-gray-800 font-medium hover:bg-party-gold/10 hover:text-party-gold ${
                location.pathname === "/manifesto" ? "bg-party-gold/10 text-party-gold" : ""
              }`}
              onClick={() => navigateToPage("/manifesto")}
            >
              Manifesto
            </Button>
            <Button
              variant="ghost"
              className={`text-gray-800 font-medium hover:bg-party-brown/10 hover:text-party-brown ${
                location.pathname === "/leadership" ? "bg-party-brown/10 text-party-brown" : ""
              }`}
              onClick={() => navigateToPage("/leadership")}
            >
              Leadership
            </Button>
            <Button
              variant="ghost"
              className={`text-gray-800 font-medium hover:bg-party-hotpink/10 hover:text-party-hotpink ${
                location.pathname === "/gallery" ? "bg-party-hotpink/10 text-party-hotpink" : ""
              }`}
              onClick={() => navigateToPage("/gallery")}
            >
              Gallery
            </Button>

            {/* Support the Movement Button */}
            <Button
              className="bg-gradient-to-r from-party-hotpink to-party-gold hover:from-party-gold hover:to-party-hotpink text-white ml-2 shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={handleSupportMovement}
            >
              <Heart className="mr-2 h-4 w-4" />
              Support the Movement
            </Button>

            {isAuthenticated ? (
              <>
                <Button
                  className={`${checkIfAdmin() ? "bg-party-gold" : "bg-party-lightblue"} hover:opacity-90 text-white ml-2`}
                  onClick={handleDashboardClick}
                >
                  {checkIfAdmin() ? (
                    <>
                      <Shield className="mr-2 h-4 w-4" />
                      Admin Dashboard
                    </>
                  ) : (
                    <>
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="text-party-hotpink border-party-hotpink hover:bg-party-hotpink/10"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="text-party-hotpink border-party-hotpink hover:bg-party-hotpink/10"
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
                <Button
                  className="bg-party-green hover:bg-party-green/90 text-white ml-2"
                  onClick={() => navigateToPage("/membership")}
                >
                  Join the Movement
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-800"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mt-4 md:hidden bg-white rounded-lg shadow-xl border border-gray-100 animate-fade-in">
            <div className="flex flex-col p-4 space-y-2">
              <Button
                variant="ghost"
                className={`text-gray-800 font-medium w-full text-left justify-start hover:bg-party-gold/10 hover:text-party-gold ${
                  location.pathname === "/" ? "bg-party-gold/10 text-party-gold" : ""
                }`}
                onClick={() => navigateToPage("/")}
              >
                Home
              </Button>
              <Button
                variant="ghost"
                className={`text-gray-800 font-medium w-full text-left justify-start hover:bg-party-gold/10 hover:text-party-gold ${
                  location.pathname === "/about" ? "bg-party-gold/10 text-party-gold" : ""
                }`}
                onClick={() => navigateToPage("/about")}
              >
                About
              </Button>
              <Button
                variant="ghost"
                className={`text-gray-800 font-medium w-full text-left justify-start hover:bg-party-gold/10 hover:text-party-gold ${
                  location.pathname === "/manifesto" ? "bg-party-gold/10 text-party-gold" : ""
                }`}
                onClick={() => navigateToPage("/manifesto")}
              >
                Manifesto
              </Button>
              <Button
                variant="ghost"
                className={`text-gray-800 font-medium w-full text-left justify-start hover:bg-party-gold/10 hover:text-party-gold ${
                  location.pathname === "/leadership" ? "bg-party-gold/10 text-party-gold" : ""
                }`}
                onClick={() => navigateToPage("/leadership")}
              >
                Leadership
              </Button>
              <Button
                variant="ghost"
                className={`text-gray-800 font-medium w-full text-left justify-start hover:bg-party-gold/10 hover:text-party-gold ${
                  location.pathname === "/gallery" ? "bg-party-gold/10 text-party-gold" : ""
                }`}
                onClick={() => navigateToPage("/gallery")}
              >
                Gallery
              </Button>

              {/* Support the Movement Button - Mobile */}
              <Button
                className="bg-gradient-to-r from-party-hotpink to-party-gold hover:from-party-gold hover:to-party-hotpink text-white w-full mt-2"
                onClick={handleSupportMovement}
              >
                <Heart className="mr-2 h-4 w-4" />
                Support the Movement
              </Button>

              {isAuthenticated ? (
                <>
                  <Button
                    className={`${checkIfAdmin() ? "bg-party-gold" : "bg-party-lightblue"} hover:opacity-90 text-white w-full mt-2`}
                    onClick={handleDashboardClick}
                  >
                    {checkIfAdmin() ? (
                      <>
                        <Shield className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </>
                    ) : (
                      <>
                        <User className="mr-2 h-4 w-4" />
                        Dashboard
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    className="text-party-hotpink border-party-hotpink hover:bg-party-hotpink/10 w-full"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="text-party-hotpink border-party-hotpink hover:bg-party-hotpink/10 w-full"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </Button>
                  <Button
                    className="bg-party-green hover:bg-party-green/90 text-white w-full mt-2"
                    onClick={() => navigateToPage("/membership")}
                  >
                    Join the Movement
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
