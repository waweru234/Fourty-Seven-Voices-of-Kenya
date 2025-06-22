"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Target, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

const Objectives = () => {
  const objectives = [
    "To be a national party that promotes the unity of all the people of the Republic of Kenya.",
    "To form national and county governments that will at all times act in the best interests of the people of Kenya at national and county levels.",
    "To support, promote and facilitate devolution as a system of governance in Kenya.",
    "To promote vigilance in safeguarding the national interests of Kenya.",
    "To serve as a vigorous and conscious political vanguard for eradicating tribal, racial and social bigotry, economic discrimination, and exploitation and elimination of all forms of oppression.",
    "To promote the creation of a conducive environment for the operation of the co-operative movement, trade unions, professional organizations, welfare associations and non-governmental organizations.",
    "To respect and preserve the national heritage, history, cultural diversity, national monuments, historical sites, and archives for the good and enjoyment of posterity.",
    "To engage in and provide quality, equitable, transparent, and accountable leadership to the people of Kenya.",
    "To participate in elections for the purpose of forming government at the national and county levels.",
    "To promote democratic political governance based on the popular will and voices of the people.",
    "To stop lesbian, gay, bisexual, transgender LGBTQ in the country and promote cultural and religious beliefs.",
  ]

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const backgroundPattern = `data:image/svg+xml,${encodeURIComponent(
    '<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="%2322c55e" fill-opacity="0.05"><path d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/></g></g></svg>'
  )}`

  return (
    <>
      <div className="py-24 bg-gradient-to-b from-white to-party-green/5 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute top-0 right-0 w-full h-full opacity-50"
            style={{ backgroundImage: `url("${backgroundPattern}")` }}
          />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-green-200 rounded-full opacity-20 blur-3xl" />
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
              className="inline-flex items-center gap-2 bg-gradient-to-r from-party-green/20 to-green-500/20 text-party-green px-4 py-1.5 rounded-full text-sm font-medium mb-4"
              whileHover={{ scale: 1.05 }}
            >
              <Target className="w-4 h-4" />
              Our Goals
            </motion.div>
            
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Party <span className="text-party-green">Objectives</span>
            </h2>
            
            <div className="w-32 h-1.5 bg-gradient-to-r from-party-green to-green-500 mx-auto my-6 rounded-full" />
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The Forty-Seven Voices Party is committed to achieving these key objectives for a better Kenya
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <Card className="shadow-2xl hover:shadow-2xl transition-shadow duration-500 border-none rounded-2xl overflow-hidden">
              <div className="h-3 bg-gradient-to-r from-party-green via-green-500 to-party-green" />
              <CardHeader className="bg-gradient-to-br from-white to-party-green/5 pt-8">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-party-green to-green-600 text-white shadow-lg">
                    <Target className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-3xl text-party-green">Our Objectives</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-8 px-8 pb-10">
                <motion.div 
                  className="grid grid-cols-1 gap-6"
                  variants={staggerContainer}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                >
                  {objectives.map((objective, index) => (
                    <motion.div 
                      key={index} 
                      variants={fadeIn}
                      className="flex items-start gap-4 group hover:bg-gradient-to-r hover:from-white hover:to-green-50 p-4 rounded-xl transition-colors duration-300"
                      whileHover={{ x: 5 }}
                    >
                      <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br from-party-green/10 to-green-500/10 text-party-green flex items-center justify-center mr-4 group-hover:bg-gradient-to-br group-hover:from-party-green group-hover:to-green-600 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-md">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-700 text-lg pt-1.5 group-hover:text-gray-900 transition-colors duration-300">{objective}</p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <ArrowRight className="h-5 w-5 text-party-green" />
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div 
            className="mt-16 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Link to="/manifesto">
              <motion.div 
                className="inline-flex items-center gap-2 bg-gradient-to-r from-party-green to-green-600 text-white px-6 py-3 rounded-full text-lg font-medium hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <CheckCircle2 className="w-5 h-5" />
                Read Our Full Manifesto
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default Objectives
