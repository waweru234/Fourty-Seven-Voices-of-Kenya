"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Download, Lock, FileText, Scale, BookOpen, Shield } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"

const Message = () => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleRestrictedDownload = (e: React.MouseEvent<HTMLAnchorElement>, documentName: string) => {
    e.preventDefault()
    toast.error(`${documentName} is only available to registered members`, {
      description: "Please login to access this document",
      action: {
        label: "Login",
        onClick: () => navigate("/login"),
      },
    })
  }

  return (
    <section id="message" className="py-20 bg-gradient-to-br from-gray-50 via-white to-party-lightblue/5">
      <div className="container mx-auto px-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Party{" "}
            <span className="text-party-green bg-gradient-to-r from-party-green to-party-lightblue bg-clip-text text-transparent">
              Manifesto
            </span>
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-party-green to-party-lightblue mx-auto my-6 rounded-full"></div>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Our comprehensive commitment and promise to the people of Kenya - building a stronger, more inclusive nation
            together
          </p>
        </motion.div>

        {/* Document Downloads Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">Official Party Documents</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Party Manifesto - Public */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-party-green/5 to-party-green/10">
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <BookOpen className="h-12 w-12 text-party-green mx-auto mb-3" />
                  <h4 className="font-bold text-lg text-gray-800">Party Manifesto</h4>
                  <p className="text-sm text-gray-600 mt-2">Our vision for Kenya 2027-2032</p>
                </div>
                <a
                  href="/documents/47 VOICES MANIFESTO 2027-2032.pdf"
                  download
                  className="inline-flex items-center gap-2 bg-party-green hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md hover:shadow-lg w-full justify-center"
                >
                  <Download size={16} />
                  Download
                </a>
                <p className="text-xs text-party-green mt-2 font-medium">✓ Public Access</p>
              </CardContent>
            </Card>

            {/* Election Rules - Public */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-party-gold/5 to-party-gold/10">
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <Scale className="h-12 w-12 text-party-gold mx-auto mb-3" />
                  <h4 className="font-bold text-lg text-gray-800">Election Rules</h4>
                  <p className="text-sm text-gray-600 mt-2">Nomination and election procedures</p>
                </div>
                <a
                  href="/documents/Election & Nomination Rules of The Voices  Party final amended cover.pdf"
                  download
                  className="inline-flex items-center gap-2 bg-party-gold hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md hover:shadow-lg w-full justify-center"
                >
                  <Download size={16} />
                  Download
                </a>
                <p className="text-xs text-party-gold mt-2 font-medium">✓ Public Access</p>
              </CardContent>
            </Card>

            {/* Statement of Ideology - Public */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-party-lightblue/5 to-party-lightblue/10">
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <FileText className="h-12 w-12 text-party-lightblue mx-auto mb-3" />
                  <h4 className="font-bold text-lg text-gray-800">Statement of Ideology</h4>
                  <p className="text-sm text-gray-600 mt-2">Our core beliefs and principles</p>
                </div>
                <a
                  href="/documents/Statement of Ideology  of 47 voices.pdf"
                  download
                  className="inline-flex items-center gap-2 bg-party-lightblue hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md hover:shadow-lg w-full justify-center"
                >
                  <Download size={16} />
                  Download
                </a>
                <p className="text-xs text-party-lightblue mt-2 font-medium">✓ Public Access</p>
              </CardContent>
            </Card>

            {/* Party Constitution - Members Only */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-party-hotpink/5 to-party-hotpink/10">
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <Shield className="h-12 w-12 text-party-hotpink mx-auto mb-3" />
                  <h4 className="font-bold text-lg text-gray-800">Party Constitution</h4>
                  <p className="text-sm text-gray-600 mt-2">Internal governance framework</p>
                </div>
                {isAuthenticated ? (
                  <a
                    href="/documents/VOICES PARTY CONSTITUTION.pdf"
                    download
                    className="inline-flex items-center gap-2 bg-party-hotpink hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md hover:shadow-lg w-full justify-center"
                  >
                    <Download size={16} />
                    Download
                  </a>
                ) : (
                  <a
                    href="#"
                    onClick={(e) => handleRestrictedDownload(e, "Party Constitution")}
                    className="inline-flex items-center gap-2 bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors shadow-md hover:shadow-lg w-full justify-center cursor-not-allowed"
                  >
                    <Lock size={16} />
                    Members Only
                  </a>
                )}
                <p className={`text-xs mt-2 font-medium ${isAuthenticated ? "text-party-hotpink" : "text-gray-500"}`}>
                  {isAuthenticated ? "✓ Member Access" : "🔒 Login Required"}
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Call to Action for Non-Members */}
        {!isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mb-16 bg-gradient-to-r from-party-hotpink/10 to-party-gold/10 rounded-2xl p-8"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Join Our Movement</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Become a registered member to access exclusive party documents, participate in party activities, and help
              shape Kenya's future.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                onClick={() => navigate("/login")}
                className="bg-party-hotpink hover:bg-party-hotpink/90 text-white"
              >
                Login to Your Account
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/membership")}
                className="border-party-gold text-party-gold hover:bg-party-gold/10"
              >
                Register as Member
              </Button>
            </div>
          </motion.div>
        )}

        {/* Leadership Messages Section */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.6 }}>
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            Messages from Our <span className="text-party-gold">Leadership</span>
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {/* National Chairperson Message */}
            <motion.div
              className="bg-white rounded-2xl shadow-xl overflow-hidden relative group hover:shadow-2xl transition-all duration-300"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              {/* Decorative top accent */}
              <div className="h-2 bg-gradient-to-r from-party-green via-party-gold to-party-lightblue w-full"></div>

              {/* Background pattern */}
              <div className="absolute inset-0 z-0">
                <div className="absolute top-0 right-0 h-40 w-40 bg-party-green/5 rounded-full -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 h-40 w-40 bg-party-gold/5 rounded-full -ml-20 -mb-20"></div>
              </div>

              <div className="p-8 relative z-10">
                <div className="flex items-center justify-center mb-6 flex-col">
                  <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-party-green shadow-lg mb-4 relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-party-green/20 to-party-gold/20 group-hover:opacity-0 transition-opacity duration-300"></div>
                    <img
                      src="/lovable-uploads/0266e8af-6d34-4c02-8bc3-b5203bc131d5.png"
                      alt="National Chairperson"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-party-green mb-2">Message from the National Chairperson</h3>
                  <p className="text-sm text-gray-600 font-medium">Hon. Wycliffe Kamanda Gichuru</p>
                </div>

                <div className="prose prose-lg max-w-none text-gray-600 bg-gradient-to-br from-gray-50/70 to-party-green/5 rounded-xl p-6 border border-gray-100">
                  <p className="leading-relaxed text-gray-700">
                    Fellow Kenyans, I address you today with a vision for a united, prosperous, and equitable Kenya. Our
                    party, Forty-Seven Voices of Kenya, stands firm on the principle that every Kenyan voice matters.
                  </p>
                  <p className="mt-4 leading-relaxed text-gray-700">
                    We are committed to transforming our nation through good governance, transparency, and inclusive
                    policies that serve all citizens regardless of their background, tribe, or social status.
                  </p>
                  <p className="mt-4 font-medium text-gray-800">
                    Our party manifesto focuses on key areas that impact the daily lives of Kenyans:
                  </p>
                  <ul className="mt-4 space-y-3">
                    <li className="flex items-start">
                      <span className="text-party-green mr-3 mt-1 text-lg">•</span>
                      <span className="text-gray-700">
                        <strong className="text-party-green">Economic development</strong> that creates jobs and
                        opportunities for all
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-party-lightblue mr-3 mt-1 text-lg">•</span>
                      <span className="text-gray-700">
                        <strong className="text-party-lightblue">Quality healthcare</strong> accessible to every Kenyan
                        as a fundamental right
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-party-gold mr-3 mt-1 text-lg">•</span>
                      <span className="text-gray-700">
                        <strong className="text-party-gold">Education reform</strong> that equips our youth with
                        relevant skills for the future
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-party-hotpink mr-3 mt-1 text-lg">•</span>
                      <span className="text-gray-700">
                        <strong className="text-party-hotpink">Infrastructure development</strong> that connects all
                        parts of Kenya
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-party-green mr-3 mt-1 text-lg">•</span>
                      <span className="text-gray-700">
                        <strong className="text-party-green">Environmental conservation</strong> for sustainable
                        development
                      </span>
                    </li>
                  </ul>
                  <p className="mt-6 leading-relaxed text-gray-700">
                    I invite all Kenyans to join our movement and be part of transforming our country into a nation
                    where every citizen has an equal opportunity to thrive and where every voice is heard.
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

            {/* Secretary General Message */}
            <motion.div
              className="bg-white rounded-2xl shadow-xl overflow-hidden relative group hover:shadow-2xl transition-all duration-300"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              {/* Decorative top accent */}
              <div className="h-2 bg-gradient-to-r from-party-hotpink via-party-lightblue to-party-gold w-full"></div>

              {/* Background pattern */}
              <div className="absolute inset-0 z-0">
                <div className="absolute top-0 right-0 h-40 w-40 bg-party-hotpink/5 rounded-full -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 h-40 w-40 bg-party-lightblue/5 rounded-full -ml-20 -mb-20"></div>
              </div>

              <div className="p-8 relative z-10">
                <div className="flex items-center justify-center mb-6 flex-col">
                <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-party-green shadow-lg mb-4 relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-party-green/20 to-party-gold/20 group-hover:opacity-0 transition-opacity duration-300"></div>
                    <img
                      src="/lovable-uploads/bf3e08b0-1631-4d2d-8b64-849276bbee0c.png"
                      alt="National Chairperson"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-party-hotpink mb-2">Message from the Secretary General</h3>
                  <p className="text-sm text-gray-600 font-medium">Jibril Manyasa</p>
                </div>

                <div className="prose prose-lg max-w-none text-gray-600 bg-gradient-to-br from-gray-50/70 to-party-hotpink/5 rounded-xl p-6 border border-gray-100">
                  <p className="leading-relaxed text-gray-700">Fellow Kenyans,</p>
                  <p className="mt-4 leading-relaxed text-gray-700">
                    On behalf of the 47 Voices of Kenya Congress Party, I bring you warm greetings and renewed hope for
                    a united, just, and prosperous nation.
                  </p>
                  <p className="mt-4 leading-relaxed text-gray-700">
                    Our party stands firmly on the foundation of{" "}
                    <strong className="text-party-hotpink">Nationalism</strong>—a belief that Kenya's greatness lies in
                    the strength of her people, the unity of her counties, and the dignity of every citizen. In every
                    corner of our beloved nation, from the mountains of Elgeyo-Marakwet to the shores of Mombasa, we see
                    a people ready to build and defend a future rooted in{" "}
                    <strong className="text-party-lightblue">patriotism, inclusivity, and self-reliance</strong>.
                  </p>
                  <p className="mt-4 leading-relaxed text-gray-700">
                    At a time when our democracy is being tested and our institutions are under scrutiny, the 47 Voices
                    of Kenya Congress Party offers a clear and principled alternative:{" "}
                    <strong className="text-party-gold">a government that listens, empowers, and unites</strong>. We
                    envision a Kenya where no county is left behind, where the youth have opportunity, where our farmers
                    thrive, and where leadership is built on integrity and service—not self-interest.
                  </p>
                  <p className="mt-4 leading-relaxed text-gray-700">
                    As your Secretary General, I pledge to uphold the values of transparency, accountability, and
                    tireless service to the people. Together, with our vibrant membership across all 47 counties, we are
                    building a movement that is not only political but{" "}
                    <strong className="text-party-green">patriotic at its core</strong>—a movement for every Kenyan who
                    believes that our strength is in our unity, our voice, and our common destiny.
                  </p>
                  <p className="mt-6 leading-relaxed text-gray-700 font-medium">
                    Join us as we reclaim the dream of a truly sovereign and people-centered Kenya. The time is now. The
                    voice is yours.
                  </p>
                  <div className="mt-8 pt-4 border-t border-gray-200">
                    <p className="font-semibold text-gray-800 text-right">
                      -Jibril Manyasa
                      <br />
                      <span className="font-normal text-gray-600">Secretary General</span>
                      <br />
                      <span className="font-normal text-gray-600 text-sm">47 Voices of Kenya Congress Party</span>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Message
