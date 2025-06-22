"use client"

import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ref, remove } from "firebase/database"
import { deleteUser, User as FirebaseUser, getAuth } from "firebase/auth"
import { db } from "@/lib/firebase"
import { Link } from "react-router-dom"
import {
  Download,
  FileText,
  BookOpen,
  Scale,
  Award,
  LogOut,
  Edit,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  IdCard,
  Vote,
  Users,
  TrendingUp,
  Heart,
  Accessibility,
  AlertCircle,
  Loader2,
  Shield
} from "lucide-react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "@/components/ui/use-toast"

interface CustomUserData {
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
  isAdmin: boolean
  registrationDate: string
}

// Combine Firebase User with our custom data
type User = FirebaseUser & CustomUserData;

const MemberDashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [profileData, setProfileData] = useState<CustomUserData | null>(null)
  const [selectedMember, setSelectedMember] = useState<CustomUserData | null>(null)
  const [showResignDialog, setShowResignDialog] = useState(false)
  const [isResigning, setIsResigning] = useState(false)

  useEffect(() => {
    if (user) {
      // Load profile data from localStorage
      const savedProfile = localStorage.getItem(`profile_${(user as unknown as CustomUserData).membershipNumber}`)
      if (savedProfile) {
        setProfileData(JSON.parse(savedProfile))
      } else {
        setProfileData(user as unknown as CustomUserData)
      }
    }
  }, [user])

  if (!user) {
    return null
  }

  const currentUser = profileData || (user as unknown as CustomUserData)

  const documents = [
    {
      title: "Party Constitution",
      description: "The official constitution of the Forty Seven Voices of Kenya Party",
      icon: <BookOpen className="h-6 w-6 text-party-hotpink" />,
      path: "/documents/VOICES PARTY CONSTITUTION.pdf",
      color: "party-hotpink",
      restricted: true,
    },
    {
      title: "Party Manifesto",
      description: "Our vision and commitments for Kenya's future",
      icon: <FileText className="h-6 w-6 text-party-green" />,
      path: "/documents/47 VOICES MANIFESTO 2027-2032.pdf",
      color: "party-green",
      restricted: false,
    },
    {
      title: "Election Rules",
      description: "Guidelines and procedures for party elections and nominations",
      icon: <Scale className="h-6 w-6 text-party-gold" />,
      path: "/documents/Election & Nomination Rules of The Voices  Party final amended cover.pdf",
      color: "party-gold",
      restricted: false,
    },
    {
      title: "Statement of Ideology",
      description: "The core principles and ideology of our party",
      icon: <Award className="h-6 w-6 text-party-lightblue" />,
      path: "/documents/Statement of Ideology  of 47 voices.pdf",
      color: "party-lightblue",
      restricted: false,
    },
  ]

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const handleResign = async () => {
    try {
      setIsResigning(true)

      if (!user) {
        throw new Error("User not found")
      }

      // Get the current Firebase Auth instance
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        throw new Error("No authenticated user found");
      }

      // Delete user data from Realtime Database
      const userRef = ref(db, `users/${currentUser.uid}`)
      await remove(userRef)

      // Delete user from Authentication
      await currentUser.delete()

      // Logout and redirect
      await logout()
      navigate("/")
      
      toast({
        title: "Membership Resigned",
        description: "Your membership has been successfully terminated. We're sorry to see you go.",
        variant: "default"
      })
    } catch (error) {
      console.error("Error during resignation:", error)
      
      // Check if the error is due to requiring recent login
      if (error.code === 'auth/requires-recent-login') {
        toast({
          title: "Authentication Required",
          description: "For security reasons, please log out and log in again before resigning.",
          variant: "destructive"
        })
      } else {
        toast({
          title: "Resignation Failed",
          description: "There was an error processing your resignation. Please try again or contact support.",
          variant: "destructive"
        })
      }
      setShowResignDialog(false)
    } finally {
      setIsResigning(false)
    }
  }

  const getMembershipTypeColor = () => {
    switch (currentUser.membershipType) {
      case "platinum":
        return "bg-gray-300 text-gray-800 border-gray-400"
      case "gold":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "silver":
        return "bg-gray-100 text-gray-800 border-gray-300"
      case "bronze":
        return "bg-amber-100 text-amber-800 border-amber-300"
      default:
        return "bg-green-100 text-green-800 border-green-300"
    }
  }

  const membershipProgress = {
    standard: 20,
    bronze: 40,
    silver: 60,
    gold: 80,
    platinum: 100,
  }

  const currentProgress = membershipProgress[currentUser.membershipType as keyof typeof membershipProgress] || 20

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome back, <span className="text-party-hotpink">{currentUser.fullName?.split(" ")[0]}</span>
            </h1>
            <p className="text-gray-600 text-lg">Member Dashboard - Forty Seven Voices of Kenya</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="default"
              className="flex items-center gap-2 bg-gradient-to-r from-party-hotpink to-party-gold hover:from-party-gold hover:to-party-hotpink text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              onClick={() => navigate("/edit-profile")}
            >
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
            <Button variant="outline" className="flex items-center gap-2 px-6 py-3" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card className="sticky top-4 shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
              <CardHeader className="text-center pb-4">
                <div className="flex flex-col items-center space-y-4">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900">{currentUser.fullName}</h3>
                    <Badge className={`mt-2 border ${getMembershipTypeColor()}`}>
                      {currentUser.membershipType?.charAt(0).toUpperCase() + currentUser.membershipType?.slice(1)}{" "}
                      Member
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Membership Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Membership Level</span>
                    <span className="text-sm text-party-hotpink font-semibold">{currentProgress}%</span>
                  </div>
                  <Progress value={currentProgress} className="h-2" />
                </div>

                {/* Key Information */}
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-4 w-4 text-party-hotpink" />
                    <div>
                      <p className="text-xs text-gray-500">Membership Number</p>
                      <p className="font-mono font-semibold text-party-hotpink">{currentUser.membershipNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <IdCard className="h-4 w-4 text-party-hotpink" />
                    <div>
                      <p className="text-xs text-gray-500">ID Number</p>
                      <p className="font-mono font-semibold text-party-hotpink">{currentUser.idOrPassport}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-party-green" />
                    <div>
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="font-medium">
                        {currentUser.constituency}, {currentUser.county}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-party-gold" />
                    <div>
                      <p className="text-xs text-gray-500">Mobile</p>
                      <p className="font-medium">{currentUser.contact}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-party-lightblue" />
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="font-medium text-sm">{currentUser.email}</p>
                    </div>
                  </div>

                  {currentUser.ward && (
                    <div className="flex items-center gap-3">
                      <Vote className="h-4 w-4 text-purple-500" />
                      <div>
                        <p className="text-xs text-gray-500">Ward</p>
                        <p className="font-medium">{currentUser.ward}</p>
                      </div>
                    </div>
                  )}

                  {currentUser.pollingStation && (
                    <div className="flex items-center gap-3">
                      <Vote className="h-4 w-4 text-indigo-500" />
                      <div>
                        <p className="text-xs text-gray-500">Polling Station</p>
                        <p className="font-medium">{currentUser.pollingStation}</p>
                      </div>
                    </div>
                  )}

                  {currentUser.hasDisability && currentUser.pwdNumber && (
                    <div className="flex items-center gap-3">
                      <Accessibility className="h-4 w-4 text-purple-600" />
                      <div>
                        <p className="text-xs text-gray-500">PWD Number</p>
                        <p className="font-medium">{currentUser.pwdNumber}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Resignation Button */}
                <div className="pt-4 border-t">
                  <Button 
                    variant="destructive" 
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => setShowResignDialog(true)}
                  >
                    <AlertCircle className="h-4 w-4" />
                    Resign Membership
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Column - Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-party-hotpink to-pink-500 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-pink-100 text-sm">Membership</p>
                      <p className="text-2xl font-bold">Active</p>
                    </div>
                    <Users className="h-8 w-8 text-pink-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-party-green to-green-500 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Documents</p>
                      <p className="text-2xl font-bold">{documents.length}</p>
                    </div>
                    <FileText className="h-8 w-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-party-gold to-yellow-500 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-100 text-sm">Level</p>
                      <p className="text-2xl font-bold capitalize">{currentUser.membershipType}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-yellow-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Party Documents */}
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="h-6 w-6 text-party-hotpink" />
                  Party Documents
                </CardTitle>
                <CardDescription className="text-lg">Access official party documents and resources</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {documents.map((doc, index) => (
                    <motion.div
                      key={doc.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card className="h-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-l-4 border-l-party-hotpink">
                        <CardHeader className="pb-3">
                          <div className="flex items-start gap-4">
                            <div className={`p-2 rounded-lg bg-${doc.color}/10`}>{doc.icon}</div>
                            <div className="flex-1">
                              <CardTitle className="text-lg">{doc.title}</CardTitle>
                              <CardDescription className="mt-1">{doc.description}</CardDescription>
                              {doc.restricted && (
                                <Badge variant="secondary" className="mt-2 text-xs">
                                  Members Only
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <a href={doc.path} download className="w-full">
                            <Button className="w-full flex items-center gap-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800">
                              <Download className="h-4 w-4" />
                              Download PDF
                            </Button>
                          </a>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Support Section */}
            <Card className="shadow-xl border-0 bg-gradient-to-r from-party-hotpink/5 to-party-gold/5">
              <CardContent className="p-8">
                <div className="text-center">
                  <Heart className="h-12 w-12 text-party-hotpink mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Support Our Movement</h3>
                  <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                    Help us build a stronger Kenya by supporting our initiatives and programs across the nation.
                  </p>
                  <Button
                    onClick={() => navigate("/donate")}
                    className="bg-gradient-to-r from-party-hotpink to-party-gold hover:from-party-gold hover:to-party-hotpink text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Heart className="h-5 w-5 mr-2" />
                    Support the Movement
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Member Details Dialog */}
            <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
              <DialogHeader>
                
                <DialogDescription>
                   {selectedMember?.fullName}
                </DialogDescription>
              </DialogHeader>
              {selectedMember && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Full Name</Label>
                    <p className="text-sm">{selectedMember.fullName}</p>
                  </div>
                  <div>
                  <div>
                    <Label>ID Number</Label>
                    <p className="text-sm">{selectedMember.idOrPassport}</p>
                  </div>
                    <Label>Membership Number</Label>
                    <p className="text-sm">{selectedMember.membershipNumber}</p>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p className="text-sm">{selectedMember.email}</p>
                  </div>
                  
                  <div>
                    <Label>Phone</Label>
                    <p className="text-sm">{selectedMember.contact}</p>
                  </div>
                  <div>
                    <Label>Age Category</Label>
                    <p className="text-sm capitalize">{selectedMember.ageCategory}</p>
                  </div>
                  <div>
                    <Label>Membership Type</Label>
                    <p className="text-sm capitalize">{selectedMember.membershipType}</p>
                  </div>
                  <div>
                    <Label>Ward</Label>
                    <p className="text-sm">{selectedMember.ward}</p>
                  </div>
                  <div>
                    <Label>Polling Station</Label>
                    <p className="text-sm">{selectedMember.pollingStation}</p>
                  </div>
                  <div className="col-span-2">
                    <Label>Disability Status</Label>
                    {selectedMember.hasDisability ? (
                      <div className="mt-1 space-y-2">
                        <Badge className="bg-purple-100 text-purple-800">
                          <Accessibility className="h-3 w-3 mr-1" />
                          Person with Disability
                        </Badge>
                        {selectedMember.pwdNumber && (
                          <p className="text-sm">PWD Number: {selectedMember.pwdNumber}</p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm">No disability registered</p>
                    )}
                  </div>
                </div>
              )}
            </Dialog>

            {/* Terms of Service Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Shield className="h-5 w-5 text-party-brown" />
                  Legal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Link
                    to="/terms-of-service"
                    className="flex items-center text-gray-600 hover:text-party-brown transition-colors"
                  >
                    <Scale className="h-4 w-4 mr-2" />
                    Terms of Service
                  </Link>
                  <Link
                    to="/privacy-policy"
                    className="flex items-center text-gray-600 hover:text-party-brown transition-colors"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Privacy Policy
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Resignation Confirmation Dialog */}
      <Dialog open={showResignDialog} onOpenChange={setShowResignDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Resignation</DialogTitle>
            <DialogDescription>
              Are you sure you want to resign from the Forty Seven Voices of Kenya Party? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              By resigning, you will lose all membership privileges and access to party resources. Your data will be permanently deleted.
            </AlertDescription>
          </Alert>
          <DialogFooter className="flex gap-2 mt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowResignDialog(false)}
              disabled={isResigning}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleResign}
              disabled={isResigning}
            >
              {isResigning ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Confirm Resignation'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default MemberDashboard
