"use client"

import type React from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const { user, isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    // If not authenticated, redirect to login
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (!user?.emailVerified) {
    // If email is not verified, redirect to verification page
    return <Navigate to="/verify-email" replace />
  }

  if (requireAdmin && !user?.isAdmin) {
    // If admin access is required but user is not admin, redirect to dashboard
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
