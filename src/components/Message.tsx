"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Download, Lock } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

const Message = () => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleDownloadClick = (e: React.MouseEvent<HTMLAnchorElement>, documentName: string) => {
    if (!isAuthenticated) {
      e.preventDefault()
      toast.error("Please login to download party documents", {
        description: "Only registered members can access official party documents",
        action: {
          label: "Login",
          onClick: () => navigate("/login"),
        },
      })
    }
  }

  return (
    <section id="message" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
            Party <span className="text-party-green">Manifesto</span>
          </h2>
          <div className="w-24 h-1 bg-party-green mx-auto my-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">Our commitment and promise to the people of Kenya</p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center gap-4 mt-8 mb-6 flex-wrap"
        >
          {isAuthenticated ? (
            <>
              <a
                href="/documents/47 VOICES MANIFESTO 2027-2032.pdf"
                download
                className="bg-party-green hover:bg-green-700 text-white px-6 py-3 rounded-md flex items-center gap-2 transition-colors shadow-md hover:shadow-lg"
              >
                <Download size={18} />
                Download Manifesto
              </a>

              <a
                href="/documents/VOICES PARTY CONSTITUTION.pdf"
                download
                className="bg-party-hotpink hover:bg-pink-700 text-white px-6 py-3 rounded-md flex items-center gap-2 transition-colors shadow-md hover:shadow-lg"
              >
                <Download size={18} />
                Party Constitution
              </a>

              <a
                href="/documents/Election & Nomination Rules of The Voices  Party final amended cover.pdf"
                download
                className="bg-party-gold hover:bg-yellow-700 text-white px-6 py-3 rounded-md flex items-center gap-2 transition-colors shadow-md hover:shadow-lg"
              >
                <Download size={18} />
                Election Rules
              </a>

              <a
                href="/documents/Statement of Ideology  of 47 voices.pdf"
                download
                className="bg-party-lightblue hover:bg-blue-700 text-white px-6 py-3 rounded-md flex items-center gap-2 transition-colors shadow-md hover:shadow-lg"
              >
                <Download size={18} />
                Statement of Ideology
              </a>
            </>
          ) : (
            <>
              <a
                href="#"
                onClick={(e) => handleDownloadClick(e, "Manifesto")}
                className="bg-gray-400 text-white px-6 py-3 rounded-md flex items-center gap-2 transition-colors shadow-md hover:shadow-lg"
              >
                <Lock size={18} />
                Download Manifesto
              </a>

              <a
                href="#"
                onClick={(e) => handleDownloadClick(e, "Constitution")}
                className="bg-gray-400 text-white px-6 py-3 rounded-md flex items-center gap-2 transition-colors shadow-md hover:shadow-lg"
              >
                <Lock size={18} />
                Party Constitution
              </a>

              <a
                href="#"
                onClick={(e) => handleDownloadClick(e, "Election Rules")}
                className="bg-gray-400 text-white px-6 py-3 rounded-md flex items-center gap-2 transition-colors shadow-md hover:shadow-lg"
              >
                <Lock size={18} />
                Election Rules
              </a>

              <a
                href="#"
                onClick={(e) => handleDownloadClick(e, "Ideology")}
                className="bg-gray-400 text-white px-6 py-3 rounded-md flex items-center gap-2 transition-colors shadow-md hover:shadow-lg"
              >
                <Lock size={18} />
                Statement of Ideology
              </a>
            </>
          )}
        </motion.div>

        {!isAuthenticated && (
          <div className="text-center mb-12">
            <p className="text-gray-600 mb-4">These documents are available only to registered members.</p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => navigate("/login")} className="bg-party-hotpink hover:bg-party-hotpink/90">
                Login
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const joinSection = document.getElementById("join")
                  if (joinSection) {
                    joinSection.scrollIntoView({ behavior: "smooth" })
                  }
                }}
              >
                Register Now
              </Button>
            </div>
          </div>
        )}

        <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 font-cinzel text-gray-800">
          Messages from Our Leadership
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Party Leader Message */}
          <motion.div
            className="bg-white rounded-xl shadow-lg overflow-hidden relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Decorative top accent */}
            <div className="h-2 bg-gradient-to-r from-party-hotpink via-party-gold to-party-green w-full"></div>

            {/* Background pattern */}
            <div className="absolute inset-0 z-0">
              <div className="absolute top-0 right-0 h-40 w-40 bg-party-hotpink/5 rounded-full -mr-20 -mt-20"></div>
              <div className="absolute bottom-0 left-0 h-40 w-40 bg-party-green/5 rounded-full -ml-20 -mb-20"></div>
            </div>

            <div className="p-6 md:p-8 relative z-10">
              <div className="flex items-center justify-center mb-6 flex-col">
                <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-party-gold shadow-lg mb-4 relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-party-gold/20 to-party-hotpink/20 group-hover:opacity-0 transition-opacity duration-300"></div>
                  <img
                    src="/lovable-uploads/38f0aef9-802a-4193-bbc1-3de59c80a838.png"
                    alt="Party Leader"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-party-gold">Message from the Party Leader</h3>
              </div>

              <div className="prose prose-lg max-w-none text-gray-600 bg-gray-50/70 rounded-lg p-6 border border-gray-100">
                <p className="leading-relaxed">
                  Fellow Kenyans, I address you today with a vision for a united, prosperous, and equitable Kenya. Our
                  party, Forty-Seven Voices of Kenya, stands firm on the principle that every Kenyan voice matters.
                </p>
                <p className="mt-4 leading-relaxed">
                  We are committed to transforming our nation through good governance, transparency, and inclusive
                  policies that serve all citizens regardless of their background, tribe, or social status.
                </p>
                <p className="mt-4 font-medium text-gray-700">
                  Our party manifesto focuses on key areas that impact the daily lives of Kenyans:
                </p>
                <ul className="mt-4 space-y-3 list-disc list-inside">
                  <li className="text-party-hotpink font-medium flex items-start">
                    <span className="text-party-hotpink mr-2">•</span>
                    <span className="text-gray-700">
                      <strong className="text-party-hotpink">Economic development</strong> that creates jobs and
                      opportunities for all
                    </span>
                  </li>
                  <li className="text-party-lightblue font-medium flex items-start">
                    <span className="text-party-lightblue mr-2">•</span>
                    <span className="text-gray-700">
                      <strong className="text-party-lightblue">Quality healthcare</strong> accessible to every Kenyan as
                      a fundamental right
                    </span>
                  </li>
                  <li className="text-party-green font-medium flex items-start">
                    <span className="text-party-green mr-2">•</span>
                    <span className="text-gray-700">
                      <strong className="text-party-green">Education reform</strong> that equips our youth with relevant
                      skills for the future
                    </span>
                  </li>
                  <li className="text-party-gold font-medium flex items-start">
                    <span className="text-party-gold mr-2">•</span>
                    <span className="text-gray-700">
                      <strong className="text-party-gold">Infrastructure development</strong> that connects all parts of
                      Kenya
                    </span>
                  </li>
                  <li className="text-party-hotpink font-medium flex items-start">
                    <span className="text-party-hotpink mr-2">•</span>
                    <span className="text-gray-700">
                      <strong className="text-party-hotpink">Environmental conservation</strong> for sustainable
                      development
                    </span>
                  </li>
                </ul>
                <p className="mt-6 leading-relaxed">
                  I invite all Kenyans to join our movement and be part of transforming our country into a nation where
                  every citizen has an equal opportunity to thrive and where every voice is heard.
                </p>
                <div className="mt-8 pt-4 border-t border-gray-200">
                  <p className="font-semibold text-gray-800 text-right">
                    -Hon Wycliffe Kamanda Gichuru
                    <br />
                    <span className="font-normal text-gray-600">National Chairperson and Party Founder</span>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* National Chairperson and Founder Message */}
          <motion.div
            className="bg-white rounded-xl shadow-lg overflow-hidden relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Decorative top accent */}
            <div className="h-2 bg-gradient-to-r from-party-gold via-party-green to-party-lightblue w-full"></div>

            {/* Background pattern */}
            <div className="absolute inset-0 z-0">
              <div className="absolute top-0 right-0 h-40 w-40 bg-party-gold/5 rounded-full -mr-20 -mt-20"></div>
              <div className="absolute bottom-0 left-0 h-40 w-40 bg-party-lightblue/5 rounded-full -ml-20 -mb-20"></div>
            </div>

            <div className="p-6 md:p-8 relative z-10">
              <div className="flex items-center justify-center mb-6 flex-col">
                <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-party-green shadow-lg mb-4 relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-party-green/20 to-party-gold/20 group-hover:opacity-0 transition-opacity duration-300"></div>
                  <img
                    src="/lovable-uploads/0266e8af-6d34-4c02-8bc3-b5203bc131d5.png"
                    alt="Wycliffe Kamanda Gichuru"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-party-green">Message from the National Chairperson</h3>
              </div>

              <div className="prose prose-lg max-w-none text-gray-600 bg-gray-50/70 rounded-lg p-6 border border-gray-100">
                <p className="leading-relaxed">
                  Fellow Kenyans, I address you today with a vision for a united, prosperous, and equitable Kenya. Our
                  party, Forty-Seven Voices of Kenya, stands firm on the principle that every Kenyan voice matters.
                </p>
                <p className="mt-4 leading-relaxed">
                  We are committed to transforming our nation through good governance, transparency, and inclusive
                  policies that serve all citizens regardless of their background, tribe, or social status.
                </p>
                <p className="mt-4 font-medium text-gray-700">
                  Our party manifesto focuses on key areas that impact the daily lives of Kenyans:
                </p>
                <ul className="mt-4 space-y-3 list-disc list-inside">
                  <li className="text-party-hotpink font-medium flex items-start">
                    <span className="text-party-hotpink mr-2">•</span>
                    <span className="text-gray-700">
                      <strong className="text-party-hotpink">Economic development</strong> that creates jobs and
                      opportunities for all
                    </span>
                  </li>
                  <li className="text-party-lightblue font-medium flex items-start">
                    <span className="text-party-lightblue mr-2">•</span>
                    <span className="text-gray-700">
                      <strong className="text-party-lightblue">Quality healthcare</strong> accessible to every Kenyan as
                      a fundamental right
                    </span>
                  </li>
                  <li className="text-party-green font-medium flex items-start">
                    <span className="text-party-green mr-2">•</span>
                    <span className="text-gray-700">
                      <strong className="text-party-green">Education reform</strong> that equips our youth with relevant
                      skills for the future
                    </span>
                  </li>
                  <li className="text-party-gold font-medium flex items-start">
                    <span className="text-party-gold mr-2">•</span>
                    <span className="text-gray-700">
                      <strong className="text-party-gold">Infrastructure development</strong> that connects all parts of
                      Kenya
                    </span>
                  </li>
                  <li className="text-party-hotpink font-medium flex items-start">
                    <span className="text-party-hotpink mr-2">•</span>
                    <span className="text-gray-700">
                      <strong className="text-party-hotpink">Environmental conservation</strong> for sustainable
                      development
                    </span>
                  </li>
                </ul>
                <p className="mt-6 leading-relaxed">
                  I invite all Kenyans to join our movement and be part of transforming our country into a nation where
                  every citizen has an equal opportunity to thrive and where every voice is heard.
                </p>
                <div className="mt-8 pt-4 border-t border-gray-200">
                  <p className="font-semibold text-gray-800 text-right">
                    -Hon Wycliffe Kamanda Gichuru
                    <br />
                    <span className="font-normal text-gray-600">National Chairperson and Party Founder</span>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Deputy Party Leader Message - Now in a new row */}
          <motion.div
            className="bg-white rounded-xl shadow-lg overflow-hidden relative md:col-span-2 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Decorative top accent */}
            <div className="h-2 bg-gradient-to-r from-party-lightblue via-party-hotpink to-party-gold w-full"></div>

            {/* Background pattern */}
            <div className="absolute inset-0 z-0">
              <div className="absolute top-0 right-0 h-40 w-40 bg-party-lightblue/5 rounded-full -mr-20 -mt-20"></div>
              <div className="absolute bottom-0 left-0 h-40 w-40 bg-party-hotpink/5 rounded-full -ml-20 -mb-20"></div>
            </div>

            <div className="p-6 md:p-8 relative z-10">
              <div className="flex items-center justify-center mb-6 flex-col">
                <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-party-lightblue shadow-lg mb-4 relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-party-lightblue/20 to-party-hotpink/20 group-hover:opacity-0 transition-opacity duration-300"></div>
                  <img
                    src="/lovable-uploads/bf3e08b0-1631-4d2d-8b64-849276bbee0c.png"
                    alt="Deputy Party Leader"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-party-lightblue">Message from the Deputy Party Leader</h3>
              </div>

              <div className="prose prose-lg max-w-none text-gray-600 bg-gray-50/70 rounded-lg p-6 border border-gray-100">
                <p className="leading-relaxed">
                  Fellow Kenyans, I address you today with a vision for a united, prosperous, and equitable Kenya. Our
                  party, Forty-Seven Voices of Kenya, stands firm on the principle that every Kenyan voice matters.
                </p>
                <p className="mt-4 leading-relaxed">
                  We are committed to transforming our nation through good governance, transparency, and inclusive
                  policies that serve all citizens regardless of their background, tribe, or social status.
                </p>
                <p className="mt-4 font-medium text-gray-700">
                  Our party manifesto focuses on key areas that impact the daily lives of Kenyans:
                </p>
                <ul className="mt-4 space-y-3 list-disc list-inside">
                  <li className="text-party-hotpink font-medium flex items-start">
                    <span className="text-party-hotpink mr-2">•</span>
                    <span className="text-gray-700">
                      <strong className="text-party-hotpink">Economic development</strong> that creates jobs and
                      opportunities for all
                    </span>
                  </li>
                  <li className="text-party-lightblue font-medium flex items-start">
                    <span className="text-party-lightblue mr-2">•</span>
                    <span className="text-gray-700">
                      <strong className="text-party-lightblue">Quality healthcare</strong> accessible to every Kenyan as
                      a fundamental right
                    </span>
                  </li>
                  <li className="text-party-green font-medium flex items-start">
                    <span className="text-party-green mr-2">•</span>
                    <span className="text-gray-700">
                      <strong className="text-party-green">Education reform</strong> that equips our youth with relevant
                      skills for the future
                    </span>
                  </li>
                  <li className="text-party-gold font-medium flex items-start">
                    <span className="text-party-gold mr-2">•</span>
                    <span className="text-gray-700">
                      <strong className="text-party-gold">Infrastructure development</strong> that connects all parts of
                      Kenya
                    </span>
                  </li>
                  <li className="text-party-hotpink font-medium flex items-start">
                    <span className="text-party-hotpink mr-2">•</span>
                    <span className="text-gray-700">
                      <strong className="text-party-hotpink">Environmental conservation</strong> for sustainable
                      development
                    </span>
                  </li>
                </ul>
                <p className="mt-6 leading-relaxed">
                  I invite all Kenyans to join our movement and be part of transforming our country into a nation where
                  every citizen has an equal opportunity to thrive and where every voice is heard.
                </p>
                <div className="mt-8 pt-4 border-t border-gray-200">
                  <p className="font-semibold text-gray-800 text-right">
                    -Hon Wycliffe Kamanda Gichuru
                    <br />
                    <span className="font-normal text-gray-600">National Chairperson and Party Founder</span>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Message
