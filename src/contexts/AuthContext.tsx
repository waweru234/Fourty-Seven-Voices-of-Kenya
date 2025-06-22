"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { ref, set, get, child } from "firebase/database"
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendEmailVerification,
  sendPasswordResetEmail,
  applyActionCode,
  User as FirebaseUser,
  reload
} from "firebase/auth"
import { auth, db } from "@/lib/firebase"
import { update, ref as dbRef } from "firebase/database"

type User = {
  membershipNumber: string
  fullName: string
  county: string
  constituency: string
  membershipType: string
  email: string
  dateOfBirth: string
  idOrPassport: string
  age: number
  ageCategory: string
  hasDisability: boolean
  pwdNumber?: string
  contact: string
  ward: string
  pollingStation: string
  gender: string
  ethnicity: string
  religion: string
  isAdmin: boolean
  registrationDate: string
  emailVerified?: boolean
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  registerUser: (userData: User, password: string) => Promise<FirebaseUser>
  updateProfile: (updates: Partial<Omit<User, "email" | "membershipNumber" | "emailVerified" | "isAdmin">>) => Promise<void>
  isLoading: boolean
  pendingRegistration: User | null
  setPendingRegistration: (user: User | null) => void
  sendVerificationEmail: () => Promise<void>
  verifyEmail: (actionCode: string) => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [pendingRegistration, setPendingRegistration] = useState<User | null>(null)

  useEffect(() => {
    // Check if user is logged in on mount
    const storedUser = localStorage.getItem("currentUser")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)

    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        // Reload the user to get the latest email verification status
        await reload(firebaseUser)
        
        // Get user data from database
        const userSnap = await get(ref(db, `users/${firebaseUser.uid}`))
        if (userSnap.exists()) {
          const userData = userSnap.val()
          // Update verification status based on Firebase Auth
          userData.emailVerified = firebaseUser.emailVerified
          
          // Update database if verification status changed
          if (userData.emailVerified !== userSnap.val().emailVerified) {
            await update(ref(db, `users/${firebaseUser.uid}`), {
              emailVerified: userData.emailVerified
            })
          }
          
          setUser(userData)
          localStorage.setItem("currentUser", JSON.stringify(userData))
        }
      }
    })

    return () => unsubscribe()
  }, [])

  const updateProfile = async (updates: Partial<Omit<User, "email" | "membershipNumber" | "emailVerified" | "isAdmin">>) => {
    if (!user || !auth.currentUser) return

    const uid = auth.currentUser.uid
    const userRef = dbRef(db, `users/${uid}`)

    try {
      // Remove any attempts to update protected fields
      const { email, membershipNumber, emailVerified, isAdmin, ...allowedUpdates } = updates as any

      await update(userRef, allowedUpdates)

      const updatedUser = { ...user, ...allowedUpdates }
      setUser(updatedUser)
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))
    } catch (error) {
      console.error("Failed to update profile:", error)
      throw error
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const uid = userCredential.user.uid

      // Reload user to get latest verification status
      await reload(userCredential.user)

      if (!userCredential.user.emailVerified) {
        // Send verification email if not verified
        await sendEmailVerification(userCredential.user)
        throw new Error("Please verify your email before logging in. A new verification email has been sent.")
      }

      const userSnap = await get(ref(db, `users/${uid}`))

      if (userSnap.exists()) {
        const userData = userSnap.val()
        userData.emailVerified = userCredential.user.emailVerified
        
        // Update database with verification status
        await update(ref(db, `users/${uid}`), {
          emailVerified: userData.emailVerified
        })
        
        setUser(userData)
        localStorage.setItem("currentUser", JSON.stringify(userData))
        setIsLoading(false)
        return true
      }

      setIsLoading(false)
      return false
    } catch (error) {
      console.error("Login error:", error)
      setIsLoading(false)
      throw error
    }
  }

  const logout = async () => {
    try {
      setUser(null)
      localStorage.removeItem("currentUser")
      await auth.signOut()
    } catch (error) {
      console.error("Logout error:", error)
      throw error
    }
  }

  const registerUser = async (userData: User, password: string) => {
    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, password)

      // Save additional user data in Realtime Database
      const userRef = ref(db, `users/${userCredential.user.uid}`)

      await set(userRef, {
        ...userData,
        uid: userCredential.user.uid,
        emailVerified: false
      })

      // Clear pending registration
      setPendingRegistration(null)
      
      return userCredential.user
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    }
  }

  const sendVerificationEmail = async () => {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser)
    }
  }

  const verifyEmail = async (actionCode: string) => {
    await applyActionCode(auth, actionCode)
    
    // After verification, reload the user to get updated status
    if (auth.currentUser) {
      await reload(auth.currentUser)
      
      if (auth.currentUser.emailVerified) {
        const userRef = ref(db, `users/${auth.currentUser.uid}`)
        await update(userRef, { emailVerified: true })
        
        // Update local state if user exists
        const userSnap = await get(userRef)
        if (userSnap.exists()) {
          const userData = userSnap.val()
          userData.emailVerified = true
          setUser(userData)
          localStorage.setItem("currentUser", JSON.stringify(userData))
        }
      }
    }
  }

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email)
  }

  const value = {
    user,
    isAuthenticated: !!user?.emailVerified,
    login,
    logout,
    registerUser,
    isLoading,
    pendingRegistration,
    setPendingRegistration,
    updateProfile,
    sendVerificationEmail,
    verifyEmail,
    resetPassword
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
