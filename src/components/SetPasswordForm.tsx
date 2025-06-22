"use client"

import type React from "react"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2, Eye, EyeOff } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"

const SetPasswordForm = () => {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { pendingRegistration, registerUser } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!password || !confirmPassword) {
      setError("Please enter and confirm your password")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (!pendingRegistration) {
      setError("Registration information is missing. Please try registering again.")
      return
    }

    setIsSubmitting(true)

    try {
      // Register the user with the provided password
      await registerUser(pendingRegistration, password)
      
      toast.success("Registration successful! Please log in to continue.", {
        duration: 5000,
      })

      // Navigate to login page
      navigate("/login")
    } catch (err) {
      setError("An error occurred during registration. Please try again.")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!pendingRegistration) {
    return (
      <Card className="w-full max-w-md mx-auto shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Error</CardTitle>
          <CardDescription className="text-center">
            No registration information found. Please go back and complete the registration form.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button className="w-full bg-party-gold hover:bg-party-gold/90" onClick={() => navigate("/join")}>
            Back to Registration
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="w-full max-w-md mx-auto shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create Your Password</CardTitle>
          <CardDescription className="text-center">
            Your membership number is:{" "}
            <span className="font-bold text-party-hotpink">{pendingRegistration.membershipNumber}</span>
          </CardDescription>
          <CardDescription className="text-center">
            Please create a password to complete your registration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              By creating an account, you agree to our{" "}
              <Link 
                to="/terms-of-service" 
                className="text-party-hotpink hover:underline"
              >
                Terms of Service
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full bg-party-gold hover:bg-party-gold/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default SetPasswordForm
