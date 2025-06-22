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
import { signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail } from "firebase/auth"
import { auth } from "@/lib/firebase"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const LoginForm = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResetModalOpen, setIsResetModalOpen] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [isResetting, setIsResetting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please enter both email address and password")
      return
    }

    setIsSubmitting(true)

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      
      // Check if email is verified
      if (!userCredential.user.emailVerified) {
        // Send verification email
        await sendEmailVerification(userCredential.user)
        navigate("/verify-email")
        toast.info("Please verify your email to continue", {
          description: "A verification email has been sent to your inbox.",
          duration: 5000,
        })
        return
      }

      // If email is verified, proceed with login
      await login(email, password)
      
      // Get the latest user data from localStorage since it was just updated by login
      const userData = JSON.parse(localStorage.getItem("currentUser") || "{}")
      if (userData.isAdmin) {
        navigate("/admin")
      } else {
        navigate("/dashboard")
      }
    } catch (err: any) {
      if (err.code === "auth/user-not-found") {
        setError("No account found with this email address")
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password")
      } else {
        setError("Failed to log in. Please try again.")
      }
      console.error("Login error:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!resetEmail) {
      toast.error("Please enter your email address")
      return
    }

    setIsResetting(true)
    try {
      await sendPasswordResetEmail(auth, resetEmail)
      toast.success("Password reset email sent", {
        description: "Please check your inbox for further instructions.",
      })
      setIsResetModalOpen(false)
      setResetEmail("")
    } catch (err: any) {
      if (err.code === "auth/user-not-found") {
        toast.error("No account found with this email address")
      } else {
        toast.error("Failed to send reset email. Please try again.")
      }
      console.error("Password reset error:", err)
    } finally {
      setIsResetting(false)
    }
  }

  return (
    <>
      <Dialog open={isResetModalOpen} onOpenChange={setIsResetModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Enter your email address and we'll send you a link to reset your password.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="resetEmail">Email Address</Label>
              <Input
                id="resetEmail"
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>
            <Button
              className="w-full bg-party-gold hover:bg-party-gold/90"
              onClick={handleForgotPassword}
              disabled={isResetting}
            >
              {isResetting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md mx-auto shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
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
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
              
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

              <div className="text-sm text-gray-600">
                By logging in, you agree to our{" "}
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
                    Logging in...
                  </>
                ) : (
                  "Log In"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button
              variant="link"
              className="text-party-hotpink hover:text-party-hotpink/90"
              onClick={() => setIsResetModalOpen(true)}
            >
              Forgot your password?
            </Button>
            <div className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Button
                variant="link"
                className="text-party-hotpink hover:text-party-hotpink/90 p-0"
                onClick={() => navigate("/membership")}
              >
                Register now
              </Button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </>
  )
}

export default LoginForm
