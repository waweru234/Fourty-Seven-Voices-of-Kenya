"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, User, LogOut } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

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

  const scrollToSection = (sectionId: string) => {
    // If we're on the home page, scroll to the section
    if (location.pathname === "/") {
      const section = document.getElementById(sectionId)
      if (section) {
        section.scrollIntoView({ behavior: "smooth" })
        setMobileMenuOpen(false)
      }
    } else {
      // If we're on another page, navigate to home and then scroll
      navigate(`/#${sectionId}`)
    }
  }

  const handleLogout = () => {
    logout()
    navigate("/")
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
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full overflow-hidden">
                <img
                  src="/lovable-uploads/vok.png"
                  alt="Forty Seven Voices of Kenya"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-party-hotpink text-2xl font-bold tracking-wider">THE VOICE PARTY</div>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-1">
            <Button
              variant="ghost"
              className="text-gray-800 font-medium hover:bg-party-hotpink/10 hover:text-party-hotpink"
              onClick={() => scrollToSection("top")}
            >
              Home
            </Button>
            <Button
              variant="ghost"
              className="text-gray-800 font-medium hover:bg-party-green/10 hover:text-party-green"
              onClick={() => scrollToSection("slogan")}
            >
              Slogan
            </Button>
            <Button
              variant="ghost"
              className="text-gray-800 font-medium hover:bg-party-lightblue/10 hover:text-party-lightblue"
              onClick={() => scrollToSection("vision")}
            >
              About
            </Button>
            <Button
              variant="ghost"
              className="text-gray-800 font-medium hover:bg-party-gold/10 hover:text-party-gold"
              onClick={() => scrollToSection("message")}
            >
              Manifesto
            </Button>
            <Button
              variant="ghost"
              className="text-gray-800 font-medium hover:bg-party-brown/10 hover:text-party-brown"
              onClick={() => scrollToSection("leadership")}
            >
              Leadership
            </Button>
            <Button
              variant="ghost"
              className="text-gray-800 font-medium hover:bg-party-hotpink/10 hover:text-party-hotpink"
              onClick={() => scrollToSection("gallery")}
            >
              Gallery
            </Button>
            <Button
              variant="ghost"
              className="text-gray-800 font-medium hover:bg-party-lightblue/10 hover:text-party-lightblue"
              onClick={() => scrollToSection("contact")}
            >
              Contact
            </Button>

            {isAuthenticated ? (
              <>
                <Button
                  className="bg-party-gold hover:bg-party-gold/90 text-white ml-2"
                  onClick={() => navigate("/dashboard")}
                >
                  <User className="mr-2 h-4 w-4" />
                  Dashboard
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
                  onClick={() => scrollToSection("join")}
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
                className="text-gray-800 font-medium w-full text-left justify-start hover:bg-party-gold/10 hover:text-party-gold"
                onClick={() => scrollToSection("top")}
              >
                Home
              </Button>
              <Button
                variant="ghost"
                className="text-gray-800 font-medium w-full text-left justify-start hover:bg-party-gold/10 hover:text-party-gold"
                onClick={() => scrollToSection("slogan")}
              >
                Slogan
              </Button>
              <Button
                variant="ghost"
                className="text-gray-800 font-medium w-full text-left justify-start hover:bg-party-gold/10 hover:text-party-gold"
                onClick={() => scrollToSection("vision")}
              >
                About
              </Button>
              <Button
                variant="ghost"
                className="text-gray-800 font-medium w-full text-left justify-start hover:bg-party-gold/10 hover:text-party-gold"
                onClick={() => scrollToSection("message")}
              >
                Manifesto
              </Button>
              <Button
                variant="ghost"
                className="text-gray-800 font-medium w-full text-left justify-start hover:bg-party-gold/10 hover:text-party-gold"
                onClick={() => scrollToSection("leadership")}
              >
                Leadership
              </Button>
              <Button
                variant="ghost"
                className="text-gray-800 font-medium w-full text-left justify-start hover:bg-party-gold/10 hover:text-party-gold"
                onClick={() => scrollToSection("gallery")}
              >
                Gallery
              </Button>
              <Button
                variant="ghost"
                className="text-gray-800 font-medium w-full text-left justify-start hover:bg-party-gold/10 hover:text-party-gold"
                onClick={() => scrollToSection("contact")}
              >
                Contact
              </Button>

              {isAuthenticated ? (
                <>
                  <Button
                    className="bg-party-gold hover:bg-party-gold/90 text-white w-full mt-2"
                    onClick={() => navigate("/dashboard")}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
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
                    onClick={() => scrollToSection("join")}
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
