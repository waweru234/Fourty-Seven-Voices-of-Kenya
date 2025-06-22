"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Mail, Phone, MapPin, Facebook, Instagram, Youtube } from "lucide-react"
import { useNavigate } from "react-router-dom"

const CallToJoin = () => {
  const navigate = useNavigate()

  return (
    <section className="py-20 bg-gradient-to-r from-party-gold to-party-hotpink relative overflow-hidden">
      <div className="absolute inset-0 opacity-15">
        <img
          src="/lovable-uploads/2cf903d4-8b6e-4e88-b487-edc75db7e4a9.png"
          alt="Logo Background"
          className="w-full h-full object-contain"
        />
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Join the Movement</h2>
        <p className="text-white/90 text-xl max-w-3xl mx-auto mb-10">
          Become part of a growing movement focused on building a better Kenya for all. Together, we can make a
          difference.
        </p>
        <Button
          size="lg"
          className="bg-white text-party-gold hover:bg-gray-100 text-lg px-10 py-6 rounded-full shadow-xl flex items-center mx-auto"
          onClick={() => navigate("/membership")}
        >
          Register Now
          <ArrowRight className="ml-2" />
        </Button>
      </div>
    </section>
  )
}

export default CallToJoin