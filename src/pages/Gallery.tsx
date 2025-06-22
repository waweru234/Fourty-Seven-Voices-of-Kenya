"use client"

import Navbar from "@/components/Navbar"
import Gallery from "@/components/Gallery"
import Footer from "@/components/Footer"
import { motion } from "framer-motion"
import CallToJoin from "@/components/call-to-join"

const GalleryPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-party-lightblue/5">
      <Navbar />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="pt-16">
        <Gallery />
      </motion.div>
      <CallToJoin />
      <Footer />
    </div>
  )
}

export default GalleryPage
