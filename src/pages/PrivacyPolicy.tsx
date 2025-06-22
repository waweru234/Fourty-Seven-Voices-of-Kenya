"use client"


import {  Shield, Lock, FileText, Users, Bell, Settings, Eye, Scale, Clock, RefreshCw } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

const PrivacyPolicy = () => {
  const navigate = useNavigate()

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
     

        <motion.div
          className="bg-white rounded-xl shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header with logo and title */}
          <div className="bg-gradient-to-r from-green-600 to-blue-700 p-8 flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <img src="/vok.png" alt="Forty Seven Voices of Kenya Logo" className="h-20 w-20 object-contain mr-4" />
              <div>
                <h1 className="text-3xl font-bold text-white">Data Privacy Policy</h1>
                <p className="text-green-100">Protecting your information is our priority</p>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
              <p className="text-white">Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {/* Introduction card */}
          <div className="p-8">
            <motion.div
              className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-start">
                <Shield className="text-blue-500 mr-4 mt-1 flex-shrink-0" size={24} />
                <div>
                  <h2 className="text-xl font-semibold text-blue-800 mb-2">Our Commitment to Privacy</h2>
                  <p className="text-blue-700 leading-relaxed">
                    The Forty Seven Voices of Kenya Party ("we," "our," or "us") is committed to protecting your privacy
                    and personal data in accordance with the Data Protection Act, 2019 (Act No. 24 of 2019) and Article
                    31 of the Constitution of Kenya, 2010, which guarantees the right to privacy.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
              {/* Data We Collect */}
              <motion.section
                variants={itemVariants}
                className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 p-2 rounded-full mr-4">
                    <FileText className="text-green-600" size={24} />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-800">Data We Collect</h2>
                </div>
                <p className="mb-4 text-gray-700 leading-relaxed">
                  We collect the following personal data when you register for membership:
                </p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  {[
                    "Full names and identification details(ID, Passport,)",
                    "Contact information (phone number, email)",
                    "Demographic information (gender, ethnicity, age, date of birth,religion,special interest category)",
                    "Location data (county, constituency, ward, polling station)",
                    "Membership type and subscription details",
                    "Disability status (for accessibility purposes)",
                  ].map((item, index) => (
                    <li key={index} className="flex items-center bg-gray-50 p-3 rounded-lg">
                      <div className="h-2 w-2 rounded-full bg-green-500 mr-3"></div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.section>

              {/* Legal Basis */}
              <motion.section
                variants={itemVariants}
                className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-2 rounded-full mr-4">
                    <Scale className="text-blue-600" size={24} />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-800">Legal Basis for Processing</h2>
                </div>
                <p className="mb-4 text-gray-700 leading-relaxed">
                  We process your personal data based on your explicit consent as provided during registration. This
                  consent is freely given, specific, informed, and unambiguous as required under Section 30 of the Data
                  Protection Act, 2019.
                </p>
              </motion.section>

              {/* Purpose of Data */}
              <motion.section
                variants={itemVariants}
                className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 p-2 rounded-full mr-4">
                    <Settings className="text-green-600" size={24} />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-800">Purpose of Data Processing</h2>
                </div>
                <p className="mb-4 text-gray-700 leading-relaxed">Your personal data is used for:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    "Membership registration and management",
                    "Communication regarding party activities and events",
                    "Democratic participation and voting processes",
                    "Statistical analysis for party planning and strategy",
                    "Compliance with electoral laws and regulations",
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-green-50 to-blue-50 p-4 rounded-lg border border-blue-100"
                    >
                      <p className="text-gray-700 font-medium">{item}</p>
                    </div>
                  ))}
                </div>
              </motion.section>

              {/* Data Sharing */}
              <motion.section
                variants={itemVariants}
                className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-2 rounded-full mr-4">
                    <Users className="text-blue-600" size={24} />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-800">Data Sharing and Disclosure</h2>
                </div>
                <p className="mb-4 text-gray-700 leading-relaxed">
                  We do not sell, trade, or otherwise transfer your personal data to third parties without your consent,
                  except as required by law or for legitimate party activities. We may share data with:
                </p>
                <ul className="space-y-3 mb-4">
                  {[
                    "Electoral authorities as required by law",
                    "Authorized party officials for legitimate party business",
                    "Service providers who assist in our operations (under strict confidentiality agreements)",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start bg-gray-50 p-3 rounded-lg">
                      <div className="h-2 w-2 rounded-full bg-blue-500 mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.section>

              {/* Your Rights */}
              <motion.section
                variants={itemVariants}
                className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 p-2 rounded-full mr-4">
                    <Lock className="text-green-600" size={24} />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-800">Your Rights</h2>
                </div>
                <p className="mb-4 text-gray-700 leading-relaxed">
                  Under the Data Protection Act, 2019, you have the right to:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
                  {[
                    "Access your personal data",
                    "Correct inaccurate or incomplete data",
                    "Delete your personal data (right to be forgotten)",
                    "Restrict processing of your data",
                    "Data portability",
                    "Object to processing",
                    "Withdraw consent at any time",
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-green-50 to-blue-50 p-3 rounded-lg border border-green-100 flex items-center"
                    >
                      <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-gray-700 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.section>

              {/* Data Security */}
              <motion.section
                variants={itemVariants}
                className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-2 rounded-full mr-4">
                    <Shield className="text-blue-600" size={24} />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-800">Data Security</h2>
                </div>
                <p className="mb-4 text-gray-700 leading-relaxed">
                  We implement appropriate technical and organizational measures to protect your personal data against
                  unauthorized access, alteration, disclosure, or destruction. This includes encryption, access
                  controls, and regular security assessments.
                </p>
              </motion.section>

              {/* Data Retention */}
              <motion.section
                variants={itemVariants}
                className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 p-2 rounded-full mr-4">
                    <Clock className="text-green-600" size={24} />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-800">Data Retention</h2>
                </div>
                <p className="mb-4 text-gray-700 leading-relaxed">
                  We retain your personal data only for as long as necessary to fulfill the purposes for which it was
                  collected or as required by law. Membership data is typically retained for the duration of your
                  membership and for a reasonable period thereafter for legal and administrative purposes.
                </p>
              </motion.section>

              {/* Contact Information */}
              <motion.section
                variants={itemVariants}
                className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-2 rounded-full mr-4">
                    <Bell className="text-blue-600" size={24} />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-800">Contact Information</h2>
                </div>
                <p className="mb-4 text-gray-700 leading-relaxed">
                  For any questions about this privacy policy or to exercise your rights, please contact our Data
                  Protection Officer:
                </p>
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-blue-100 mb-4">
                  <div className="flex flex-col md:flex-row md:items-center">
                    <div className="bg-white p-4 rounded-full mb-4 md:mb-0 md:mr-6 flex-shrink-0">
                      <img src="/vok.png" alt="Forty Seven Voices of Kenya Logo" className="h-16 w-16 object-contain" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Data Protection Officer</h3>
                      <p className="text-gray-700 mb-1">Forty Seven Voices of Kenya Party</p>
                      <p className="text-gray-700 mb-1">Email: privacy@voicesparty.co.ke</p>
                      <p className="text-gray-700 mb-1">Phone: +254 742 478456</p>
                      <p className="text-gray-700">Address: Nairobi, Kenya</p>
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* Complaints */}
              <motion.section
                variants={itemVariants}
                className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 p-2 rounded-full mr-4">
                    <Eye className="text-green-600" size={24} />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-800">Complaints</h2>
                </div>
                <p className="mb-4 text-gray-700 leading-relaxed">
                  If you believe your data protection rights have been violated, you have the right to lodge a complaint
                  with the Office of the Data Protection Commissioner of Kenya.
                </p>
              </motion.section>

              {/* Changes to Policy */}
              <motion.section
                variants={itemVariants}
                className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-2 rounded-full mr-4">
                    <RefreshCw className="text-blue-600" size={24} />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-800">Changes to This Policy</h2>
                </div>
                <p className="mb-4 text-gray-700 leading-relaxed">
                  We may update this privacy policy from time to time. Any changes will be posted on our website with an
                  updated effective date. We encourage you to review this policy periodically.
                </p>
              </motion.section>

              {/* Constitutional Reference */}
              <motion.section
                variants={itemVariants}
                className="bg-gradient-to-r from-green-600 to-blue-700 p-6 rounded-xl text-white shadow-lg"
              >
                <div className="flex items-start">
                  <Scale className="text-white mr-4 mt-1 flex-shrink-0" size={28} />
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Constitutional Reference</h2>
                    <p className="leading-relaxed">
                      This policy is designed to comply with Article 31 of the Constitution of Kenya, 2010, which
                      states:
                      <span className="italic block mt-2 pl-4 border-l-2 border-white/50">
                        "Every person has the right to privacy, which includes the right not to have their person, home
                        or property searched, their possessions seized, or the privacy of their communications
                        infringed."
                      </span>
                    </p>
                  </div>
                </div>
              </motion.section>
            </motion.div>
          </div>
        </motion.div>


      </div>
    </div>
  )
}

export default PrivacyPolicy
