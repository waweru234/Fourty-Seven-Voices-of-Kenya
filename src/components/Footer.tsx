"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Mail, Phone, MapPin, Facebook, Instagram, Youtube } from "lucide-react"
import { useNavigate } from "react-router-dom"

const Footer = () => {
  const navigate = useNavigate()

  return (
    <>
  

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full overflow-hidden bg-white p-1">
                  <img
                    src="/lovable-uploads/2cf903d4-8b6e-4e88-b487-edc75db7e4a9.png"
                    alt="Party Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-2xl font-bold text-party-gold">VOICES OF KENYA</h3>
              </div>
              <p className="text-gray-400 mb-6">
                A national political party that stands for progress, good governance, and a united, prosperous Kenya.
              </p>
              <p className="text-party-gold font-medium">"Sauti Kila Mahali"</p>
            </div>

            <div>
              <h4 className="text-xl font-semibold mb-6 text-party-gold">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => navigate("/")}
                    className="text-gray-400 hover:text-white transition-colors hover:underline text-left"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/about")}
                    className="text-gray-400 hover:text-white transition-colors hover:underline text-left"
                  >
                    About
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/manifesto")}
                    className="text-gray-400 hover:text-white transition-colors hover:underline text-left"
                  >
                    Manifesto
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/leadership")}
                    className="text-gray-400 hover:text-white transition-colors hover:underline text-left"
                  >
                    Leadership
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/gallery")}
                    className="text-gray-400 hover:text-white transition-colors hover:underline text-left"
                  >
                    Gallery
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/donate")}
                    className="text-gray-400 hover:text-white transition-colors hover:underline text-left"
                  >
                    Donate
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/membership")}
                    className="text-gray-400 hover:text-white transition-colors hover:underline text-left"
                  >
                    Join Us
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-semibold mb-6 text-party-gold">Contact</h4>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Mail className="text-party-gold mr-3 flex-shrink-0 mt-1" size={18} />
                  <span className="text-gray-400">info@voicesparty.co.ke</span>
                </li>
                <li className="flex items-start">
                  <Phone className="text-party-gold mr-3 flex-shrink-0 mt-1" size={18} />
                  <span className="text-gray-400">+254 742 478456</span>
                </li>
                <li className="flex items-start">
                  <MapPin className="text-party-gold mr-3 flex-shrink-0 mt-1" size={18} />
                  <span className="text-gray-400">Nairobi, Kenya</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-semibold mb-6 text-party-gold">Connect</h4>
              <div className="flex space-x-4 mb-6">
                <a
                  href="https://www.facebook.com/share/1AQhcmSd6Z"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-party-gold transition-colors"
                >
                  <Facebook size={18} className="text-white" />
                </a>
                <a
                  href="https://www.instagram.com/thevoicecenter2027?igsh=MWpqMjJ4aDUxOWs4dw=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-party-gold transition-colors"
                >
                  <Instagram size={18} className="text-white" />
                </a>
                <a
                  href="https://youtube.com/@beijingvideo857?si=1M0U_Dyj_Ul02a_9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-party-gold transition-colors"
                >
                  <Youtube size={18} className="text-white" />
                </a>
              </div>
              <p className="text-gray-400">
                Stay updated with our latest news and events by following us on social media.
              </p>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} Forty Seven Voices of Kenya Party. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer
