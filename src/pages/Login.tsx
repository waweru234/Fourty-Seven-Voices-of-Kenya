"use client"

import Navbar from "@/components/Navbar"
import LoginForm from "@/components/LoginForm"
import { useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useNavigate } from "react-router-dom"

const Login = () => {
  const { isAuthenticated,user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated) {
      navigate("/dashboard")
    }
  }, [isAuthenticated, navigate])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-md mx-auto">
          <LoginForm />
   
        </div>
      </div>
    </div>
  )
}

export default Login
