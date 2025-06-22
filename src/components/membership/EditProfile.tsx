import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { User, MapPin, CreditCard, Mail, Lock, Save, Info, ArrowLeft } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"
import { auth } from "@/lib/firebase"
import { sendPasswordResetEmail } from "firebase/auth"
import {
  getCounties,
  getConstituenciesByCounty,
  getWardsByConstituency,
  getPollingStationsByWard,
  type County,
  type Constituency,
  type Ward,
  type PollingStation,
} from "./kenya-administrative-data"

const EditProfile = () => {
  const { user, updateProfile } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [isResettingPassword, setIsResettingPassword] = useState(false)

  const [counties, setCounties] = useState<County[]>([])
  const [constituencies, setConstituencies] = useState<Constituency[]>([])
  const [wards, setWards] = useState<Ward[]>([])
  const [pollingStations, setPollingStations] = useState<PollingStation[]>([])

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
  })

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
      })
    }
  }, [user])

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
                    <Label>Mobile Number</Label>
                    <Input
                      value={formData.contact}
                      onChange={(e) => handleInputChange("contact", e.target.value)}
                      placeholder="254712345678"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>ID/Passport Number</Label>
                    <Input value={formData.idOrPassport} disabled className="bg-gray-50" />
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
                    <Label>Disability Status</Label>
                    <Input value={formData.disability} disabled className="bg-gray-50" />
                  </div>

                  {formData.disability === "yes" && (
                    <div className="space-y-2">
                      <Label>PWD Number</Label>
                      <Input value={formData.pwdNumber} disabled className="bg-gray-50" />
                    </div>
                  )}
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
                    <select
                      className="w-full border rounded p-2"
                      value={formData.county}
                      onChange={e => handleInputChange("county", e.target.value)}
                    >
                      <option value="">Select county</option>
                      {counties.slice().sort((a, b) => a.name.localeCompare(b.name)).map(county => (
                        <option key={county.code} value={county.name}>{county.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>Constituency</Label>
                    <select
                      className="w-full border rounded p-2"
                      value={formData.constituency}
                      onChange={e => handleInputChange("constituency", e.target.value)}
                      disabled={!formData.county}
                    >
                      <option value="">{formData.county ? "Select constituency" : "Select county first"}</option>
                      {constituencies.map(constituency => (
                        <option key={constituency.code} value={constituency.name}>{constituency.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>Ward</Label>
                    <select
                      className="w-full border rounded p-2"
                      value={formData.ward}
                      onChange={e => handleInputChange("ward", e.target.value)}
                      disabled={!formData.constituency}
                    >
                      <option value="">{formData.constituency ? "Select ward" : "Select constituency first"}</option>
                      {wards.map(ward => (
                        <option key={ward.code} value={ward.name}>{ward.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>Polling Station</Label>
                    <select
                      className="w-full border rounded p-2"
                      value={formData.pollingStation}
                      onChange={e => handleInputChange("pollingStation", e.target.value)}
                      disabled={!formData.ward}
                    >
                      <option value="">{formData.ward ? "Select polling station" : "Select ward first"}</option>
                      {pollingStations.map(station => (
                        <option key={station.code} value={station.name}>{station.name}</option>
                      ))}
                    </select>
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
                        For security reasons, some of your personal information cannot be changed. If you need to update any of the read-only fields, please contact party administration.
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