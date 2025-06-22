"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, Compass, Lightbulb, Users, Globe } from "lucide-react"

// Replace the style jsx block with this proper global style
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

const Vision = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  // Background pattern using data URL
  const backgroundPattern = `data:image/svg+xml,${encodeURIComponent(
    `<svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(0,0,255,0.03)" stroke-width="0.5"/>
        </pattern>
        <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
          <rect width="50" height="50" fill="url(#smallGrid)"/>
          <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(0,0,255,0.05)" stroke-width="1"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>`
  )}`

  return (
    <div id="vision" className="py-24 relative overflow-hidden">
      <style>{globalStyles}</style>
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Main gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/70 to-white" />
        
        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-40"
          style={{ backgroundImage: `url("${backgroundPattern}")` }}
        />

        {/* Decorative animated circles - Enhanced visibility */}
        <div 
          className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-party-hotpink/60 rounded-full blur-3xl"
          style={{
            animation: 'pulse-scale 8s ease-in-out infinite',
            animationDelay: '1s'
          }}
        />
        <div 
          className="absolute top-1/3 -left-20 w-[500px] h-[500px] bg-party-lightblue/50 rounded-full blur-3xl"
          style={{
            animation: 'pulse-scale 8s ease-in-out infinite',
            animationDelay: '2s'
          }}
        />
        <div 
          className="absolute -bottom-60 left-1/4 w-[700px] h-[700px] bg-blue-400/50 rounded-full blur-3xl"
          style={{
            animation: 'pulse-scale 8s ease-in-out infinite',
            animationDelay: '4s'
          }}
        />

        {/* Additional floating orbs */}
        <div 
          className="absolute top-1/4 right-1/4 w-32 h-32 bg-purple-400/40 rounded-full blur-2xl"
          style={{
            animation: 'float 20s ease-in-out infinite',
          }}
        />
        <div 
          className="absolute bottom-1/4 right-1/3 w-24 h-24 bg-pink-400/40 rounded-full blur-2xl"
          style={{
            animation: 'float 15s ease-in-out infinite',
            animationDelay: '2s'
          }}
        />
        
        {/* Enhanced gradient lines */}
        <div 
          className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-party-hotpink/40 to-transparent"
          style={{
            animation: 'pulse-opacity 4s ease-in-out infinite'
          }}
        />
        <div 
          className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-party-lightblue/40 to-transparent"
          style={{
            animation: 'pulse-opacity 4s ease-in-out infinite',
            animationDelay: '2s'
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-gradient-to-r from-party-hotpink/20 to-party-lightblue/20 text-party-hotpink px-4 py-1.5 rounded-full text-sm font-medium mb-4 backdrop-blur-sm"
            whileHover={{ scale: 1.05 }}
          >
            <Target className="w-4 h-4" />
            Our Direction
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Our <span className="text-party-hotpink">Vision</span> &{" "}
            <span className="text-party-lightblue">Mission</span>
          </h2>

          <div className="w-32 h-1.5 bg-gradient-to-r from-party-hotpink to-party-lightblue mx-auto my-6 rounded-full" />

          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Building a united Kenya where every voice matters and every citizen has the opportunity to thrive
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-6xl mx-auto"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {/* Vision Card */}
          <motion.div variants={fadeIn} whileHover={{ y: -8, transition: { duration: 0.3 } }} className="group">
            <Card className="border-none shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden h-full backdrop-blur-sm bg-white/90">
              <div className="h-3 bg-gradient-to-r from-party-hotpink via-purple-500 to-party-hotpink" />
              <CardHeader className="bg-gradient-to-br from-white to-party-hotpink/5 pt-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-party-hotpink to-pink-600 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Lightbulb className="w-8 h-8" />
                  </div>
                  <div>
                    <CardTitle className="text-3xl text-party-hotpink flex items-center gap-3">PARTY VISION</CardTitle>
                    <CardDescription className="text-lg">Our aspirations for Kenya's future</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 pb-8 px-8">
                <div className="relative">
                  <div className="absolute -left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-party-hotpink/30 via-party-hotpink to-party-hotpink/30 rounded-full" />
                  <p className="text-gray-700 text-lg leading-relaxed">
                    The Vision of the Party is to transform Kenya into a just, Modern and a prosperous Nation; a country
                    united in pursuit of Happiness and in which, Every Kenyan Citizen has equal and fair chance to be
                    their best, where every Voice is represented and listened to. Voices party will treat all Kenyans
                    the same regardless of their religion, tribe and race.
                  </p>
                </div>

                <div className="mt-8 flex justify-end">
                  <div className="flex items-center gap-2 text-party-hotpink text-sm font-medium">
                    <Users className="w-4 h-4" />
                    <span>For all Kenyans</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Mission Card */}
          <motion.div variants={fadeIn} whileHover={{ y: -8, transition: { duration: 0.3 } }} className="group">
            <Card className="border-none shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden h-full backdrop-blur-sm bg-white/90">
              <div className="h-3 bg-gradient-to-r from-party-lightblue via-blue-500 to-party-lightblue" />
              <CardHeader className="bg-gradient-to-br from-white to-party-lightblue/5 pt-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-party-lightblue to-blue-600 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Compass className="w-8 h-8" />
                  </div>
                  <div>
                    <CardTitle className="text-3xl text-party-lightblue flex items-center gap-3">
                      PARTY MISSION
                    </CardTitle>
                    <CardDescription className="text-lg">How we will achieve our vision</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 pb-8 px-8">
                <div className="relative">
                  <div className="absolute -left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-party-lightblue/30 via-party-lightblue to-party-lightblue/30 rounded-full" />
                  <p className="text-gray-700 text-lg leading-relaxed">
                    To provide a platform for Kenyans to speak their minds in transforming the country, and to inspire,
                    equip, facilitate and harness the synergies of Kenya towards transforming their own lives and those
                    of their children. To create a fundamental shift in the management of public affairs for the good of
                    all Kenyan people.
                  </p>
                </div>

                <div className="mt-8 flex justify-end">
                  <div className="flex items-center gap-2 text-party-lightblue text-sm font-medium">
                    <Globe className="w-4 h-4" />
                    <span>Transforming Kenya</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default Vision
