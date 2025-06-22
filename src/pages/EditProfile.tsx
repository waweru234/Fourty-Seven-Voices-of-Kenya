"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, User, Phone, MapPin, CreditCard, Mail, Vote, Lock, Info } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { auth } from "@/lib/firebase"
import { sendPasswordResetEmail } from "firebase/auth"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  getCounties,
  getConstituenciesByCounty,
  getWardsByConstituency,
  getPollingStationsByWard,
  type County,
  type Constituency,
  type Ward,
  type PollingStation,
} from "@/components/membership/kenya-administrative-data"

const wardPollingStationsMap: Record<string, string[]> = {
  "Kitisuru": [
    "St Martin's School Kibagare",
    "Kabete Vetlab Primary School",
    "Loresho Primary School",
    "Farasi Lane Primary School",
    "Lower Kabete Primary School",
    "Kabete Rehabilitation Centre"
  ]
}

const EditProfile = () => {
  const { user, updateProfile } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [isResettingPassword, setIsResettingPassword] = useState(false)
  const [selectedPollingStations, setSelectedPollingStations] = useState<string[]>([])

  const [counties, setCounties] = useState<County[]>([])
  const [constituencies, setConstituencies] = useState<Constituency[]>([])
  const [wards, setWards] = useState<Ward[]>([])
  const [pollingStations, setPollingStations] = useState<PollingStation[]>([])

  const membershipTypes = [
    { value: "ordinary", label: "Ordinary membership - Ksh 0-1000" },
    { value: "bronze", label: "Bronze member - Ksh 1,000-20,000" },
    { value: "silver", label: "Silver member - Ksh 20,000-50,000" },
    { value: "gold", label: "Gold membership - Ksh 50,000-200,000" },
    { value: "platinum", label: "Platinum membership - Ksh 200,000-1,000,000" },
  ]

  const [formData, setFormData] = useState({
    ward: "",
    pollingStation: "",
    fullName: "",
    county: "",
    constituency: "",
    contact: "",
    idOrPassport: "",
    gender: "",
    ethnicity: "",
    disability: "",
    pwdNumber: "",
    religion: "",
    membershipType: "",
  })

  const religions = [
    "Christianity",
    "Islam",
    "Hinduism",
    "Sikhism",
    "Buddhism",
    "African Traditional Religion",
    "Bahai Faith",
    "Judaism",
    "Other",
  ].sort()

  useEffect(() => {
    if (user) {
      setFormData({
        ward: user.ward || "",
        pollingStation: user.pollingStation || "",
        fullName: user.fullName || "",
        county: user.county || "",
        constituency: user.constituency || "",
        contact: user.contact || "",
        idOrPassport: user.idOrPassport || "",
        gender: user.gender || "",
        ethnicity: user.ethnicity || "",
        disability: user.hasDisability ? "yes" : "no",
        pwdNumber: user.pwdNumber || "",
        religion: user.religion || "",
        membershipType: user.membershipType || "",
      })
    }
  }, [user])

  useEffect(() => {
    if (formData.ward === "Kitisuru") {
      setSelectedPollingStations(wardPollingStationsMap["Kitisuru"])
    } else {
      setSelectedPollingStations([])
    }
  }, [formData.ward])

  useEffect(() => {
    setCounties(getCounties())
  }, [])

  useEffect(() => {
    if (formData.county) {
      setConstituencies(getConstituenciesByCounty(formData.county))
      setFormData((prev) => ({ ...prev, constituency: "", ward: "", pollingStation: "" }))
      setWards([])
      setPollingStations([])
    }
  }, [formData.county])

  useEffect(() => {
    if (formData.county && formData.constituency) {
      setWards(getWardsByConstituency(formData.county, formData.constituency))
      setFormData((prev) => ({ ...prev, ward: "", pollingStation: "" }))
      setPollingStations([])
    }
  }, [formData.county, formData.constituency])

  useEffect(() => {
    if (formData.county && formData.constituency && formData.ward) {
      setPollingStations(getPollingStationsByWard(formData.county, formData.constituency, formData.ward))
      setFormData((prev) => ({ ...prev, pollingStation: "" }))
    }
  }, [formData.county, formData.constituency, formData.ward])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePasswordReset = async () => {
    if (!user?.email) {
      toast.error("No email address found for your account.")
      return
    }

    setIsResettingPassword(true)

    try {
      await sendPasswordResetEmail(auth, user.email)
      toast.success("Password reset email has been sent to your email address.")
    } catch (error) {
      console.error("Error sending password reset email:", error)
      toast.error("Failed to send password reset email. Please try again.")
    } finally {
      setIsResettingPassword(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await updateProfile({
        ward: formData.ward,
        pollingStation: formData.pollingStation,
        county: formData.county,
        constituency: formData.constituency,
        contact: formData.contact,
        religion: formData.religion,
        membershipType: formData.membershipType,
      })

      toast.success("Your profile has been updated successfully.")
      navigate("/dashboard")
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8 sticky top-20 bg-gradient-to-br from-blue-50 via-white to-green-50 py-4 z-10"
        >
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => navigate("/dashboard")} className="h-10 w-10">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
              <p className="text-gray-600">Update your profile information</p>
            </div>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Basic Info */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <Card className="sticky top-40">
                <CardHeader>
                  <div className="text-center">
                    <h3 className="text-xl font-semibold">{formData.fullName}</h3>
                    <Badge variant="secondary" className="mt-2">
                      {user.membershipType?.charAt(0).toUpperCase() + user.membershipType?.slice(1)} Member
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Read-only fields */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-500">Membership Number</Label>
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <CreditCard className="h-4 w-4 text-party-hotpink" />
                        <span className="font-mono font-semibold text-party-hotpink">{user.membershipNumber}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-500">Email Address</Label>
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span>{user.email}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Editable Form Fields */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-party-green" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Read-only fields */}
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input value={formData.fullName} disabled className="bg-gray-50" />
                  </div>

                  <div className="space-y-2">
                    <Label>National ID/Passport No.</Label>
                    <Input value={formData.idOrPassport} disabled className="bg-gray-50" />
                  </div>

                  <div className="space-y-2">
                    <Label>Mobile Number</Label>
                    <Input
                      value={formData.contact}
                      onChange={(e) => handleInputChange("contact", e.target.value)}
                      placeholder="254712345678"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <Input value={formData.gender} disabled className="bg-gray-50" />
                  </div>

                  <div className="space-y-2">
                    <Label>Ethnicity</Label>
                    <Input value={formData.ethnicity} disabled className="bg-gray-50" />
                  </div>

                  <div className="space-y-2">
                    <Label>Religion</Label>
                    <Select value={formData.religion} onValueChange={(value) => handleInputChange("religion", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select religion" />
                      </SelectTrigger>
                      <SelectContent>
                        {religions.map((religion) => (
                          <SelectItem key={religion} value={religion.toLowerCase()}>
                            {religion}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Disability Status</Label>
                    <Input value={formData.disability === "yes" ? "Yes" : "No"} disabled className="bg-gray-50" />
                  </div>

                  {formData.disability === "yes" && (
                    <div className="space-y-2">
                      <Label>PWD Number</Label>
                      <Input value={formData.pwdNumber} disabled className="bg-gray-50" />
                    </div>
                  )}

                  <div className="space-y-2 md:col-span-2">
                    <Label>Membership Type</Label>
                    <Select value={formData.membershipType} onValueChange={(value) => handleInputChange("membershipType", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select membership type" />
                      </SelectTrigger>
                      <SelectContent>
                        {membershipTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-gray-500 mt-1">
                      You can upgrade or downgrade your membership type. The change will be effective after approval.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Location Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-party-green" />
                    Location Information
                  </CardTitle>
                  <CardDescription>Update your location details</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>County</Label>
                    <Select value={formData.county} onValueChange={value => handleInputChange("county", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select county" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px] overflow-y-auto">
                        {counties.slice().sort((a, b) => a.name.localeCompare(b.name)).map(county => (
                          <SelectItem key={county.code} value={county.name}>{county.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Constituency</Label>
                    <Select value={formData.constituency} onValueChange={value => handleInputChange("constituency", value)} disabled={!formData.county}>
                      <SelectTrigger>
                        <SelectValue placeholder={formData.county ? "Select constituency" : "Select county first"} />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px] overflow-y-auto">
                        {constituencies.map(constituency => (
                          <SelectItem key={constituency.code} value={constituency.name}>{constituency.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Ward</Label>
                    <Select value={formData.ward} onValueChange={value => handleInputChange("ward", value)} disabled={!formData.constituency}>
                      <SelectTrigger>
                        <SelectValue placeholder={formData.constituency ? "Select ward" : "Select constituency first"} />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px] overflow-y-auto">
                        {wards.map(ward => (
                          <SelectItem key={ward.code} value={ward.name}>{ward.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Polling Station</Label>
                    <Select value={formData.pollingStation} onValueChange={value => handleInputChange("pollingStation", value)} disabled={!formData.ward}>
                      <SelectTrigger>
                        <SelectValue placeholder={formData.ward ? "Select polling station" : "Select ward first"} />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px] overflow-y-auto">
                        {pollingStations.map(station => (
                          <SelectItem key={station.code} value={station.name}>{station.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Password Reset Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-party-green" />
                    Password Management
                  </CardTitle>
                  <CardDescription>Reset your account password via email</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      To change your password, click the button below. We'll send you an email with instructions to reset
                      your password securely.
                    </p>
                    <Button
                      type="button"
                      onClick={handlePasswordReset}
                      disabled={isResettingPassword}
                      className="w-full bg-party-gold hover:bg-party-gold/90"
                    >
                      {isResettingPassword ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Sending Reset Email...
                        </>
                      ) : (
                        "Send Password Reset Email"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Information Notice */}
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Info className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-2">Profile Information</h4>
                      <p className="text-blue-700 text-sm leading-relaxed">
                        For security reasons, some of your personal information cannot be changed. If you need to update any of the read-only fields, please contact party administration. You can upgrade or downgrade your membership type at any time.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-6">
                <Button type="button" variant="outline" onClick={() => navigate("/dashboard")} disabled={isLoading}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gradient-to-r from-party-hotpink to-party-gold hover:from-party-gold hover:to-party-hotpink text-white px-8"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditProfile
