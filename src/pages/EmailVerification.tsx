"use client"

import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, AlertCircle, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"

const EmailVerification = () => {
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationSent, setVerificationSent] = useState(false)
  const { user, sendVerificationEmail, verifyEmail } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const oobCode = searchParams.get("oobCode")

  useEffect(() => {
    // If there's a verification code in the URL, verify the email
    const verifyEmailWithCode = async () => {
      if (oobCode) {
        setIsVerifying(true)
        try {
          await verifyEmail(oobCode)
          toast.success("Email verified successfully!")
          navigate("/login")
        } catch (error) {
          console.error("Verification error:", error)
          toast.error("Failed to verify email. The link may have expired.")
        } finally {
          setIsVerifying(false)
        }
      }
    }

    verifyEmailWithCode()
  }, [oobCode, verifyEmail, navigate])

  const handleResendVerification = async () => {
    try {
      await sendVerificationEmail()
      setVerificationSent(true)
      toast.success("Verification email sent!")
    } catch (error) {
      console.error("Error sending verification email:", error)
      toast.error("Failed to send verification email. Please try again.")
    }
  }

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Verifying Email</CardTitle>
            <CardDescription className="text-center">
              Please wait while we verify your email address...
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-party-brown" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <Mail className="h-12 w-12 text-party-brown" />
            </div>
            <CardTitle className="text-2xl text-center">Verify Your Email</CardTitle>
            <CardDescription className="text-center">
              Please check your email and click the verification link to activate your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="default" className="bg-amber-50 border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-600">
                You need to verify your email before you can access your account.
              </AlertDescription>
            </Alert>

            {verificationSent && (
              <Alert variant="default" className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-600">
                  A new verification email has been sent. Please check your inbox.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <Button
                onClick={handleResendVerification}
                className="w-full bg-party-brown hover:bg-party-brown/90"
                disabled={verificationSent}
              >
                Resend Verification Email
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/login")}
                className="w-full"
              >
                Back to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default EmailVerification 