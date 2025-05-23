"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const backgroundImages = [
    "/lovable-uploads/129fc8a3-d480-4909-bf31-28fc98b2c0eb.png",
    "/lovable-uploads/party1.jpeg",
    "/lovable-uploads/party2.jpeg",
    "/lovable-uploads/party3.jpeg",
    "/lovable-uploads/party4.jpeg",
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length)
    }, 5000) // Change image every 5 seconds

    return () => clearInterval(interval)
  }, [backgroundImages.length])

  return (
    <div id="top" className="bg-white py-20 lg:py-32 relative overflow-hidden">
      {/* Background image carousel with horizontal scroll */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="relative w-full h-full">
          {backgroundImages.map((image, index) => {
            // Calculate if this image should be visible
            const isActive = index === currentImageIndex
            const isPrevious = index === (currentImageIndex - 1 + backgroundImages.length) % backgroundImages.length

            return (
              <motion.div
                key={index}
                className="absolute inset-0"
                initial={{ x: "100%" }}
                animate={{
                  x: isActive ? "0%" : isPrevious ? "-100%" : "100%",
                }}
                transition={{
                  x: { type: "tween", duration: 1, ease: "easeInOut" },
                }}
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`Party Background ${index + 1}`}
                  className="w-full h-full object-cover opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-party-hotpink/20 via-party-green/20 to-party-lightblue/20"></div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Enhanced top accent - made thicker */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-party-gold via-party-hotpink to-party-green"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
            >
              <span className="text-party-gold drop-shadow-sm">FORTY SEVEN</span>{" "}
              <span className="text-gray-800">VOICES OF KENYA</span>
            </motion.h1>
            <div className="w-32 h-1.5 bg-party-green mx-auto lg:mx-0 my-6"></div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg md:text-xl text-gray-700 max-w-xl"
            >
              A national political party that stands for progress, good governance, and a united, prosperous Kenya built
              on the foundation of equal representation.
            </motion.p>
            <p className="mt-4 text-xl italic text-party-gold font-medium drop-shadow-sm">"Sauti Kila Mahali"</p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start"
            >
              <Button
                className="bg-party-hotpink hover:bg-opacity-90 text-white px-8 py-6 text-lg rounded-md shadow-lg flex items-center transition-transform hover:scale-105"
                onClick={() => {
                  const section = document.getElementById("join")
                  if (section) {
                    section.scrollIntoView({ behavior: "smooth" })
                  }
                }}
              >
                Join The Movement
                <ArrowRight className="ml-2" />
              </Button>
              <Button
                variant="outline"
                className="border-2 border-party-green text-party-green hover:bg-party-green hover:text-white px-8 py-6 text-lg rounded-md shadow-lg transition-transform hover:scale-105"
                onClick={() => {
                  const section = document.getElementById("leadership")
                  if (section) {
                    section.scrollIntoView({ behavior: "smooth" })
                  }
                }}
              >
                Our Leadership
              </Button>
            </motion.div>
          </div>

          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative flex justify-center"
            >
              {/* Removed the white background box and redesigned with floating elements */}
              <div className="relative">
                {/* Decorative background elements */}
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-party-gold/10 rounded-full"></div>
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-party-lightblue/10 rounded-full"></div>

                <div className="relative flex flex-col items-center gap-10">
                  {/* Logo with shadow but no white background */}
                  <motion.div
                    className="w-56 h-56 md:w-72 md:h-72 rounded-full overflow-hidden shadow-lg relative"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-party-gold/20 to-party-hotpink/20 rounded-full"></div>
                    <img
                      src="/lovable-uploads/2cf903d4-8b6e-4e88-b487-edc75db7e4a9-removebg-preview.png"
                      alt="Forty Seven Voices of Kenya Logo"
                      className="w-full h-full object-cover p-2"
                    />
                  </motion.div>

                  {/* Flag with shadow but no white background */}
                  <motion.div
                    className="max-w-sm relative"
                    animate={{ y: [0, 5, 0] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 4, delay: 0.5 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-party-green/10 to-party-gold/10 rounded-lg"></div>
                    <img
                      src="/lovable-uploads/4e846373-36d1-4a53-a815-29a1f895dafc.png"
                      alt="Forty Seven Voices of Kenya Flag"
                      className="w-full rounded-lg shadow-lg relative z-10"
                    />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Enhanced bottom accent - made thicker */}
      <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-party-green via-party-hotpink to-party-gold"></div>
    </div>
  )
}

export default Hero
