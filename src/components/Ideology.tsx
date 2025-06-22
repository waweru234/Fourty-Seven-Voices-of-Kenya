"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Flag, Globe, Users, Shield } from "lucide-react"

// Background pattern using data URL
const backgroundPattern = `data:image/svg+xml,${encodeURIComponent(
  `<svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(120,83,64,0.03)" stroke-width="0.5"/>
      </pattern>
      <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
        <rect width="50" height="50" fill="url(#smallGrid)"/>
        <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(120,83,64,0.05)" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid)" />
  </svg>`
)}`

// Animation keyframes
const globalStyles = `
  @keyframes pulse-scale {
    0%, 100% { transform: scale(1); opacity: 0.4; }
    50% { transform: scale(1.1); opacity: 0.6; }
  }

  @keyframes float {
    0%, 100% { transform: translate(0, 0); }
    25% { transform: translate(20px, -20px); }
    50% { transform: translate(-20px, -40px); }
    75% { transform: translate(-30px, -20px); }
  }

  @keyframes pulse-opacity {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 0.7; }
  }
`

const Ideology = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  }

  return (
    <div className="py-24 relative overflow-hidden">
      <style>{globalStyles}</style>
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Main gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-party-brown/5 to-white" />
        
        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-40"
          style={{ backgroundImage: `url("${backgroundPattern}")` }}
        />

        {/* Decorative animated circles - Enhanced visibility */}
        <div 
          className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-party-brown/40 rounded-full blur-3xl"
          style={{
            animation: 'pulse-scale 8s ease-in-out infinite',
            animationDelay: '0s'
          }}
        />
        <div 
          className="absolute top-1/3 -left-20 w-[500px] h-[500px] bg-amber-600/40 rounded-full blur-3xl"
          style={{
            animation: 'pulse-scale 8s ease-in-out infinite',
            animationDelay: '2s'
          }}
        />
        <div 
          className="absolute -bottom-60 left-1/4 w-[700px] h-[700px] bg-amber-400/40 rounded-full blur-3xl"
          style={{
            animation: 'pulse-scale 8s ease-in-out infinite',
            animationDelay: '4s'
          }}
        />

        {/* Additional floating orbs */}
        <div 
          className="absolute top-1/4 right-1/4 w-32 h-32 bg-amber-500/40 rounded-full blur-2xl"
          style={{
            animation: 'float 20s ease-in-out infinite',
          }}
        />
        <div 
          className="absolute bottom-1/4 right-1/3 w-24 h-24 bg-party-brown/40 rounded-full blur-2xl"
          style={{
            animation: 'float 15s ease-in-out infinite',
            animationDelay: '2s'
          }}
        />
        
        {/* Enhanced gradient lines */}
        <div 
          className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-party-brown/40 to-transparent"
          style={{
            animation: 'pulse-opacity 4s ease-in-out infinite'
          }}
        />
        <div 
          className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-amber-600/40 to-transparent"
          style={{
            animation: 'pulse-opacity 4s ease-in-out infinite',
            animationDelay: '2s'
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-gradient-to-r from-party-brown/20 to-amber-500/20 text-party-brown px-4 py-1.5 rounded-full text-sm font-medium mb-4 backdrop-blur-sm"
            whileHover={{ scale: 1.05 }}
          >
            <Flag className="w-4 h-4" />
            Our Principles
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Party <span className="text-party-brown">Ideology</span>
          </h2>

          <div className="w-32 h-1.5 bg-gradient-to-r from-party-brown to-amber-600 mx-auto my-6 rounded-full" />

          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The principles that guide our actions and vision for Kenya
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <Card className="max-w-4xl mx-auto shadow-2xl hover:shadow-2xl transition-shadow duration-500 border-none rounded-2xl overflow-hidden group backdrop-blur-sm bg-white/90">
            <div className="h-3 bg-gradient-to-r from-party-brown via-amber-600 to-party-brown" />
            <CardHeader className="bg-gradient-to-br from-white to-party-brown/5 pt-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-party-brown to-amber-600 text-white shadow-lg group-hover:scale-105 transition-transform duration-300">
                  <Flag className="w-8 h-8" />
                </div>
                <div>
                  <CardTitle className="text-3xl text-party-brown">NATIONALISM</CardTitle>
                  <p className="text-gray-600 mt-1">Our guiding principle</p>
                </div>
              </div>
              <Separator className="my-2 bg-party-brown/30" />
            </CardHeader>
            <CardContent className="pt-8 px-8 pb-10 bg-gradient-to-br from-white to-amber-50/30">
              <div className="prose max-w-none text-gray-700 text-lg leading-relaxed">
                <motion.div
                  className="flex gap-6 items-start mb-8"
                  variants={fadeIn}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                >
                  <div className="flex-shrink-0 mt-1">
                    <Globe className="h-8 w-8 text-party-brown opacity-80" />
                  </div>
                  <p className="mb-6">
                    The ideology of the Forty-Seven Voices Party derives from its orientation of national identity and
                    unity where it is people-oriented and all-inclusive. Consequently, the principles of our party shall
                    be based on national unity, national pride, patriotism, pan-African tendencies and sovereignty of
                    the Kenyan people because it is established to promote and defend the rights and welfare of the
                    masses where the will of the people is paramount.
                  </p>
                </motion.div>

                <motion.div
                  className="flex gap-6 items-start mb-8"
                  variants={fadeIn}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                >
                  <div className="flex-shrink-0 mt-1">
                    <Users className="h-8 w-8 text-party-brown opacity-80" />
                  </div>
                  <p className="mb-6">
                    We shall uplift the conditions of life of all Kenyans, the prosperity and stability of the nation,
                    and guarantee the reign of equity, justice and a period to be proud of being a Kenyan citizen.
                  </p>
                </motion.div>

                <motion.div
                  className="flex gap-6 items-start"
                  variants={fadeIn}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                >
                  <div className="flex-shrink-0 mt-1">
                    <Shield className="h-8 w-8 text-party-brown opacity-80" />
                  </div>
                  <p className="font-medium text-party-brown">
                    In furtherance of the above, the ideology of the VOICES Party and its members shall be Nationalism.
                    Therefore, our party shall promote national values and principles.
                  </p>
                </motion.div>
              </div>

              <motion.div
                className="mt-10 bg-gradient-to-r from-party-brown/10 to-amber-500/10 p-6 rounded-xl border border-party-brown/10"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Flag className="h-5 w-5 text-party-brown" />
                  <h3 className="text-xl font-semibold text-party-brown">Our Commitment</h3>
                </div>
                <p className="text-gray-700">
                  We are committed to building a Kenya where every citizen feels represented, valued, and empowered to
                  contribute to the nation's prosperity.
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default Ideology
