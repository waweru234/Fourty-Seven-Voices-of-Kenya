"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield } from "lucide-react"

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 50 }}>
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center">
            <Shield className="h-12 w-12 text-party-brown" />
          </div>
          <CardTitle className="text-3xl font-bold">Terms of Service</CardTitle>
          <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-250px)] pr-4">
            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-party-brown mb-3">1. Introduction</h2>
                <p className="text-gray-700 leading-relaxed">
                  Welcome to the Forty-Seven Voices Party platform. By accessing or using our services, you agree to be bound by these Terms of Service. Please read them carefully.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-party-brown mb-3">2. Membership Eligibility</h2>
                <p className="text-gray-700 leading-relaxed">
                  To be eligible for membership, you must:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-700">
                  <li>Be at least 18 years of age</li>
                  <li>Be a Kenyan citizen</li>
                  <li>Provide accurate and truthful information during registration</li>
                  <li>Maintain only one membership account</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-party-brown mb-3">3. Account Security</h2>
                <p className="text-gray-700 leading-relaxed">
                  You are responsible for:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-700">
                  <li>Maintaining the confidentiality of your account credentials</li>
                  <li>All activities that occur under your account</li>
                  <li>Notifying us immediately of any unauthorized use</li>
                  <li>Verifying your email address when requested</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-party-brown mb-3">4. Code of Conduct</h2>
                <p className="text-gray-700 leading-relaxed">
                  As a member, you agree to:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-700">
                  <li>Uphold the party's values and principles</li>
                  <li>Engage respectfully with other members</li>
                  <li>Not engage in hate speech or discriminatory behavior</li>
                  <li>Not use the platform for unauthorized political activities</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-party-brown mb-3">5. Privacy and Data</h2>
                <p className="text-gray-700 leading-relaxed">
                  We are committed to protecting your privacy. Your use of our services is also governed by our Privacy Policy, which outlines how we collect, use, and protect your personal information.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-party-brown mb-3">6. Termination</h2>
                <p className="text-gray-700 leading-relaxed">
                  We reserve the right to suspend or terminate your membership if:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-700">
                  <li>You violate these terms</li>
                  <li>You provide false information</li>
                  <li>You engage in prohibited activities</li>
                  <li>Required by law or party regulations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-party-brown mb-3">7. Changes to Terms</h2>
                <p className="text-gray-700 leading-relaxed">
                  We may modify these terms at any time. Continued use of our services after changes constitutes acceptance of the modified terms.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-party-brown mb-3">8. Contact</h2>
                <p className="text-gray-700 leading-relaxed">
                  For questions about these terms, please contact the party secretariat.
                </p>
              </section>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

export default TermsOfService 