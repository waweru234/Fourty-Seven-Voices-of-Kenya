"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "@/components/Navbar"
import MembershipForm from "@/components/MembershipForm"
import Footer from "@/components/Footer"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, User, ArrowRight } from "lucide-react"

const Membership = () => {
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // If user is already logged in, show them a different view
    if (isAuthenticated) {
      // Don't redirect, just show the logged-in view
    }
  }, [isAuthenticated])

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-party-lightblue/10 to-party-green/10">
        <Navbar />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mx-auto">
              <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <div className="mb-6">
                    <CheckCircle className="h-16 w-16 text-party-green mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back, Member!</h1>
                    <p className="text-lg text-gray-600">
                      You are already registered as a member of the Forty Seven Voices of Kenya.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-party-hotpink/10 to-party-gold/10 rounded-lg p-6 mb-6">
                    <div className="flex items-center justify-center mb-4">
                      <User className="h-8 w-8 text-party-hotpink mr-3" />
                      <div className="text-left">
                        <h3 className="font-semibold text-gray-800">Member Information</h3>
                        <p className="text-gray-600">{user?.fullName}</p>
                        <p className="text-sm text-party-hotpink font-medium">
                          Membership ID: {user?.membershipNumber}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-gray-600 mb-6">
                      Since you're already a member, you can access your dashboard to view your profile, download party
                      documents, and manage your membership.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button
                        onClick={() => navigate("/dashboard")}
                        className="bg-party-gold hover:bg-party-gold/90 text-white"
                      >
                        <User className="mr-2 h-4 w-4" />
                        Go to Dashboard
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => navigate("/")}
                        className="border-party-hotpink text-party-hotpink hover:bg-party-hotpink/10"
                      >
                        <ArrowRight className="mr-2 h-4 w-4" />
                        Back to Home
                      </Button>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                      Need help? Contact our support team or visit the{" "}
                      <button onClick={() => navigate("/about")} className="text-party-hotpink hover:underline">
                        About page
                      </button>{" "}
                      for more information.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-16">
        <MembershipForm />
      </div>
      <Footer />
    </div>
  )
}

export default Membership
