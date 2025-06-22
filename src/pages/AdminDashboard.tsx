"use client"
import { ref, get,update, remove } from "firebase/database"
import { db } from "@/lib/firebase"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Users,
  Download,
  BarChart3,
  PieChart,
  Calendar,
  Shield,
  Settings,
  Search,
  FileText,
  TrendingUp,
  Activity,
  Eye,
  Crown,
  Accessibility,
  Loader2,
  AlertCircle,
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar
} from 'recharts'
import { useNavigate } from "react-router-dom"
import { toast } from "@/components/ui/use-toast"
import { getAuth, deleteUser } from "firebase/auth"
import { httpsCallable } from "firebase/functions"
import { functions } from "@/lib/firebase"


interface Member {
  membershipNumber: string
  fullName: string
  county: string
  constituency: string
  membershipType: string
  email: string,
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
  uid: string
  isResigned?: boolean
}

interface ReportData {
  totalMembers: number
  ageCategories: {
    youth: number
    adult: number
    matureAdult: number
    elderly: number
  }
  membershipTypes: {
    [key: string]: number
  }
  disabilityStats: {
    withDisability: number
    withoutDisability: number
  }
  genderStats: {
    male: number
    female: number
    other: number
  }
  registrationPeriods: {
    last30Days: number
    last3Months: number
    last6Months: number
    lastYear: number
  }
  adminCount: number
  recentRegistrations: number
}

interface EditableMemberData {
  fullName: string
  idOrPassport: string
  contact: string
  ward: string
  pollingStation: string
  pwdNumber?: string
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

export default function AdminDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [members, setMembers] = useState<Member[]>([])
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [selectedReport, setSelectedReport] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [isPromotingDialogOpen, setIsPromotingDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isPromoting, setIsPromoting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [editableData, setEditableData] = useState<EditableMemberData | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [memberToPromote, setMemberToPromote] = useState<Member | null>(null)

  useEffect(() => {
    loadMembersData()
  }, [])

  const loadMembersData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      console.log("Starting to load members data...")

      const snapshot = await get(ref(db, "users"))
      console.log("Firebase snapshot received:", snapshot.exists())

      if (snapshot.exists()) {
        const data = snapshot.val()
        console.log("Processing members data...")

        const allMembers: Member[] = Object.entries(data).map(([_, entry]: [string, any]) => {
          try {
            return {
              membershipNumber: entry.membershipNumber || "",
              fullName: entry.fullName || "",
              county: entry.county || "",
              constituency: entry.constituency || "",
              membershipType: entry.membershipType || "",
              email: entry.email || "",
              dateOfBirth: entry.dateOfBirth || "",
              idOrPassport: entry.idOrPassport || "",
              age: entry.age || 0,
              ageCategory: entry.ageCategory || "Youth or Young Adult",
              hasDisability: entry.hasDisability || false,
              pwdNumber: entry.pwdNumber,
              contact: entry.contact || "",
              ward: entry.ward || "",
              pollingStation: entry.pollingStation || "",
              gender: entry.gender || "",
              isAdmin: entry.isAdmin || false,
              registrationDate: entry.registrationDate || new Date().toISOString(),
              uid: entry.uid || "",
              isResigned: entry.isResigned || false,
            }
          } catch (err) {
            console.error("Error processing member data:", err)
            return null
          }
        }).filter(Boolean) // Remove any null entries

        console.log(`Processed ${allMembers.length} members`)
        setMembers(allMembers)
        generateReportData(allMembers)
      } else {
        console.log("No members data found")
        setMembers([])
        setReportData(null)
      }
    } catch (error) {
      console.error("Error fetching members from Firebase:", error)
      setError("Failed to load members data. Please try refreshing the page.")
      setMembers([])
      setReportData(null)
    } finally {
      setIsLoading(false)
    }
  }

  const generateReportData = (membersData: Member[]) => {
    try {
      const now = new Date()
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
      const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000)
      const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)

      const ageCategories = { 
        youth: 0, 
        adult: 0, 
        matureAdult: 0, 
        elderly: 0
      }
      const membershipTypes: { [key: string]: number } = {}
      const disabilityStats = { withDisability: 0, withoutDisability: 0 }
      const genderStats = { male: 0, female: 0, other: 0 }
      const registrationPeriods = {
        last30Days: 0,
        last3Months: 0,
        last6Months: 0,
        lastYear: 0
      }
      let adminCount = 0
      let recentRegistrations = 0

      membersData.forEach((member) => {
        // Age Categories
        switch (member.ageCategory) {
          case "Youth or Young Adult":
            ageCategories.youth++
            break
          case "Adult":
            ageCategories.adult++
            break
          case "Mature Adult or Pre-senior":
            ageCategories.matureAdult++
            break
          case "Elderly":
            ageCategories.elderly++
            break
        }

        // Membership Types
        if (member.membershipType) {
          membershipTypes[member.membershipType] = (membershipTypes[member.membershipType] || 0) + 1
        }

        // Disability Stats
        if (member.hasDisability) {
          disabilityStats.withDisability++
        } else {
          disabilityStats.withoutDisability++
        }

        // Gender Stats
        switch (member.gender?.toLowerCase()) {
          case 'male':
            genderStats.male++
            break
          case 'female':
            genderStats.female++
            break
          default:
            genderStats.other++
        }

        // Admin Count
        if (member.isAdmin) {
          adminCount++
        }

        // Registration Periods
        try {
          const regDate = new Date(member.registrationDate)
          if (regDate >= thirtyDaysAgo) {
            registrationPeriods.last30Days++
            recentRegistrations++
          }
          if (regDate >= threeMonthsAgo) {
            registrationPeriods.last3Months++
          }
          if (regDate >= sixMonthsAgo) {
            registrationPeriods.last6Months++
          }
          if (regDate >= oneYearAgo) {
            registrationPeriods.lastYear++
          }
        } catch (error) {
          console.error("Invalid registration date:", member.registrationDate)
        }
      })

      setReportData({
        totalMembers: membersData.length,
        ageCategories,
        membershipTypes,
        disabilityStats,
        genderStats,
        registrationPeriods,
        adminCount,
        recentRegistrations,
      })
    } catch (error) {
      console.error("Error generating report data:", error)
      setReportData(null)
    }
  }

  const prepareChartData = (reportData: ReportData | null) => {
    if (!reportData) return { ageData: [], membershipData: [], genderData: [] }

    const ageData = [
      { name: 'Youth (18-35)', value: reportData.ageCategories.youth },
      { name: 'Adults (36-50)', value: reportData.ageCategories.adult },
      { name: 'Mature (51-64)', value: reportData.ageCategories.matureAdult },
      { name: 'Elderly (65+)', value: reportData.ageCategories.elderly },
    ]

    const membershipData = Object.entries(reportData.membershipTypes).map(([type, count]) => ({
      name: type,
      value: count
    }))

    // Calculate gender distribution
    const genderData = members.reduce((acc: { [key: string]: number }, member) => {
      acc[member.gender] = (acc[member.gender] || 0) + 1
      return acc
    }, {})

    return {
      ageData,
      membershipData,
      genderData: Object.entries(genderData).map(([gender, count]) => ({
        name: gender,
        value: count
      }))
    }
  }

  const filteredMembers = members.filter((member) => {
    try {
      // Search matching
      const searchTermLower = searchTerm.toLowerCase().trim()
      const matchesSearch = searchTermLower === "" || [
        member.fullName,
        member.email,
        member.membershipNumber,
        member.county,
        member.constituency,
        member.ward,
        member.contact
      ].some(field => field?.toLowerCase().includes(searchTermLower))

      // Filter matching
      let matchesFilter = false
      switch (filterType) {
        case "all":
          matchesFilter = true
          break
        case "admin":
          matchesFilter = member.isAdmin
          break
        case "regular":
          matchesFilter = !member.isAdmin
          break
        case "disability":
          matchesFilter = member.hasDisability
          break
        case "youth":
          matchesFilter = member.ageCategory === "Youth or Young Adult"
          break
        case "adults":
          matchesFilter = member.ageCategory === "Adult"
          break
        case "mature":
          matchesFilter = member.ageCategory === "Mature Adult or Pre-senior"
          break
        case "elderly":
          matchesFilter = member.ageCategory === "Elderly"
          break
        default:
          matchesFilter = true
      }

      return matchesSearch && matchesFilter
    } catch (error) {
      console.error("Error filtering member:", member, error)
      return false
    }
  })


  const promoteToAdmin = async (uid: string) => {
    setIsPromoting(true)
    try {
      const userRef = ref(db, `users/${uid}`)
      await update(userRef, { isAdmin: true })
      
      // Update local state
      setMembers(members.map(member => 
        member.uid === uid 
          ? { ...member, isAdmin: true }
          : member
      ))
      
      toast({
        title: "Success",
        description: "Member has been promoted to administrator.",
      })
      
      setIsPromotingDialogOpen(false)
      setMemberToPromote(null)
    } catch (error) {
      console.error("Error promoting member to admin:", error)
      toast({
        title: "Error",
        description: "Failed to promote member to admin. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsPromoting(false)
    }
  }

  const exportReport = (reportType: string, subCategory?: string) => {
    let data: any[] = []
    let filename = ""

    switch (reportType) {
      case "all":
        data = members.map(member => ({
          fullName: member.fullName,
          membershipNumber: member.membershipNumber,
          email: member.email,
          contact: member.contact,
          gender: member.gender,
          age: member.age,
          ageCategory: member.ageCategory,
          membershipType: member.membershipType,
          county: member.county,
          constituency: member.constituency,
          ward: member.ward,
          pollingStation: member.pollingStation,
          registrationDate: member.registrationDate,
          hasDisability: member.hasDisability,
          pwdNumber: member.pwdNumber || ""
        }))
        filename = "complete_members_report.csv"
        break

      case "age":
        let ageFilteredMembers = members
        if (subCategory) {
          switch (subCategory) {
            case "youth":
              ageFilteredMembers = members.filter(member => member.ageCategory === "Youth or Young Adult")
              filename = "youth_members_report.csv"
              break
            case "adult":
              ageFilteredMembers = members.filter(member => member.ageCategory === "Adult")
              filename = "adult_members_report.csv"
              break
            case "mature":
              ageFilteredMembers = members.filter(member => member.ageCategory === "Mature Adult or Pre-senior")
              filename = "mature_adult_members_report.csv"
              break
            case "elderly":
              ageFilteredMembers = members.filter(member => member.ageCategory === "Elderly")
              filename = "elderly_members_report.csv"
              break
          }
        }
        data = ageFilteredMembers.map((member) => ({
          fullName: member.fullName,
          membershipNumber: member.membershipNumber,
          idOrPassport: member.idOrPassport,
          email: member.email,
          gender: member.gender,
          hasDisability: member.hasDisability,
          pwdNumber: member.pwdNumber || "",
          
          membershipType: member.membershipType,
          age: member.age,
          ageCategory: member.ageCategory,
          contact: member.contact,
          county: member.county,
          constituency: member.constituency,
          ward: member.ward,
          pollingStation: member.pollingStation,
          registrationDate: member.registrationDate,
        }))
        if (!filename) filename = "all_age_categories_report.csv"
        break

      case "membershipType":
        if (subCategory) {
          data = members
            .filter(member => member.membershipType.toLowerCase() === subCategory.toLowerCase())
            .map(member => ({
              fullName: member.fullName,
              membershipNumber: member.membershipNumber,
              idOrPassport: member.idOrPassport,
              email: member.email,
              age: member.age,
              ageCategory: member.ageCategory,
              membershipType: member.membershipType,
              contact: member.contact,
              county: member.county,
              constituency: member.constituency,
              ward: member.ward,
              pollingStation: member.pollingStation,
              registrationDate: member.registrationDate,
            }))
          filename = `${subCategory}_members_report.csv`
        }
        break

      case "gender":
        if (subCategory) {
          data = members
            .filter(member => member.gender.toLowerCase() === subCategory.toLowerCase())
            .map(member => ({
              fullName: member.fullName,
              membershipNumber: member.membershipNumber,
              idOrPassport: member.idOrPassport,
              email: member.email,
              age: member.age,
              ageCategory: member.ageCategory,
              membershipType: member.membershipType,
              registrationDate: member.registrationDate,
              hasDisability: member.hasDisability,
              pwdNumber: member.pwdNumber || "",
              gender: member.gender,
              contact: member.contact,
              county: member.county,
              constituency: member.constituency,
              ward: member.ward,
              pollingStation: member.pollingStation,
          
            }))
          filename = `${subCategory}_gender_report.csv`
        } else {
          data = members.map(member => ({
            fullName: member.fullName,
            membershipNumber: member.membershipNumber,
            idOrPassport: member.idOrPassport,
            email: member.email,
            age: member.age,
            ageCategory: member.ageCategory,
            membershipType: member.membershipType,
            gender: member.gender,
            contact: member.contact,
            county: member.county,
            constituency: member.constituency,
            ward: member.ward,
            registrationDate: member.registrationDate,
            hasDisability: member.hasDisability,
            pwdNumber: member.pwdNumber || "",
            pollingStation: member.pollingStation,
          }))
          filename = "all_gender_report.csv"
        }
        break

      case "registration":
        const now = new Date()
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000)
        const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)

        let filteredMembers = members
        if (subCategory) {
          switch (subCategory) {
            case "last30Days":
              filteredMembers = members.filter(member => new Date(member.registrationDate) >= thirtyDaysAgo)
              filename = "last_30_days_registrations.csv"
              break
            case "last3Months":
              filteredMembers = members.filter(member => new Date(member.registrationDate) >= threeMonthsAgo)
              filename = "last_3_months_registrations.csv"
              break
            case "last6Months":
              filteredMembers = members.filter(member => new Date(member.registrationDate) >= sixMonthsAgo)
              filename = "last_6_months_registrations.csv"
              break
            case "lastYear":
              filteredMembers = members.filter(member => new Date(member.registrationDate) >= oneYearAgo)
              filename = "last_year_registrations.csv"
              break
          }
        }

        data = filteredMembers.map(member => ({
          fullName: member.fullName,
          membershipNumber: member.membershipNumber,
          email: member.email,
          idOrPassport: member.idOrPassport,
          registrationDate: member.registrationDate,
          contact: member.contact,
          county: member.county,
          constituency: member.constituency,
          ward: member.ward,
          hasDisability: member.hasDisability,
          pwdNumber: member.pwdNumber || "",
        
          age: member.age,
          ageCategory: member.ageCategory,
          membershipType: member.membershipType,
          pollingStation: member.pollingStation,
        }))
        
        if (!filename) filename = "all_registration_periods_report.csv"
        break

      case "disability":
        if (subCategory) {
          switch (subCategory) {
            case "withDisability":
              data = members.filter(member => member.hasDisability).map(member => ({
                fullName: member.fullName,
                membershipNumber: member.membershipNumber,
                pwdNumber: member.pwdNumber || "",
                email: member.email,
                idOrPassport: member.idOrPassport,
                age: member.age,
                ageCategory: member.ageCategory,
                membershipType: member.membershipType,

                contact: member.contact,
                county: member.county,
                constituency: member.constituency,
                ward: member.ward,
                registrationDate: member.registrationDate,
                pollingStation: member.pollingStation,
              }))
              filename = "members_with_disability_report.csv"
              break
            case "withoutDisability":
              data = members.filter(member => !member.hasDisability).map(member => ({
                fullName: member.fullName,
                membershipNumber: member.membershipNumber,
                email: member.email,
                idOrPassport: member.idOrPassport,
                age: member.age,
                ageCategory: member.ageCategory,
                membershipType: member.membershipType,

                contact: member.contact,
                county: member.county,
                constituency: member.constituency,
                ward: member.ward,
                registrationDate: member.registrationDate,
                pollingStation: member.pollingStation,
              }))
              filename = "members_without_disability_report.csv"
              break
          }
        } else {
          data = members.map(member => ({
            fullName: member.fullName,
            membershipNumber: member.membershipNumber,
            email: member.email,
            idOrPassport: member.idOrPassport,
            age: member.age,
            ageCategory: member.ageCategory,
            membershipType: member.membershipType,

            hasDisability: member.hasDisability,
            pwdNumber: member.pwdNumber || "",
            contact: member.contact,
            county: member.county,
            constituency: member.constituency,
            ward: member.ward,
            registrationDate: member.registrationDate,
            pollingStation: member.pollingStation,
          }))
          filename = "all_disability_status_report.csv"
        }
        break

      // ... other cases ...
    }

    if (data.length === 0) {
      toast({
        title: "No Data",
        description: "No members found for this category.",
        variant: "destructive"
      })
      return
    }

    const csvContent = [
      Object.keys(data[0]).join(","),
      ...data.map((row) => Object.values(row).join(",")),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleSaveMemberChanges = async () => {
    if (!selectedMember || !editableData) return

    setIsSaving(true)
    try {
      const userRef = ref(db, `users/${selectedMember.uid}`)
      await update(userRef, editableData)
      
      // Update local state
      setMembers(members.map(member => 
        member.uid === selectedMember.uid 
          ? { ...member, ...editableData }
          : member
      ))
      
      setSelectedMember({ ...selectedMember, ...editableData })
      setEditMode(false)
      
      toast({
        title: "Success",
        description: "Member details updated successfully.",
      })
    } catch (error) {
      console.error("Error updating member:", error)
      toast({
        title: "Error",
        description: "Failed to update member details. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleEditableDataChange = (field: keyof EditableMemberData, value: string) => {
    if (editableData) {
      setEditableData({ ...editableData, [field]: value })
    }
  }

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
        <Alert className="max-w-md">
          <Shield className="h-4 w-4" />
          <AlertDescription>Access denied. You need administrator privileges to view this page.</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-20 pb-8">
      <div className="max-w-7xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sticky top-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-4 z-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Crown className="h-8 w-8 text-yellow-600" />
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-1">Manage members and generate comprehensive reports</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => navigate("/dashboard")}
            >
              <Users className="h-4 w-4" />
              Member Dashboard
            </Button>
            <Button 
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600"
              onClick={() => loadMembersData()}
            >
              <Download className="h-4 w-4" />
              Refresh Data
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        {reportData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium opacity-90">Total Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">{reportData.totalMembers}</div>
                  <Users className="h-8 w-8 opacity-80" />
                </div>
                <p className="text-xs opacity-80 mt-1">+{reportData.recentRegistrations} this month</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium opacity-90">Youth Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">{reportData.ageCategories.youth}</div>
                  <TrendingUp className="h-8 w-8 opacity-80" />
                </div>
                <p className="text-xs opacity-80 mt-1">≤ 35 years old</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium opacity-90">With Disability</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">{reportData.disabilityStats.withDisability}</div>
                  <Accessibility className="h-8 w-8 opacity-80" />
                </div>
                <p className="text-xs opacity-80 mt-1">Special needs members</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium opacity-90">Administrators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">{reportData.adminCount}</div>
                  <Shield className="h-8 w-8 opacity-80" />
                </div>
                <p className="text-xs opacity-80 mt-1">System administrators</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 sticky top-40 bg-white z-10 rounded-lg shadow-sm">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="members" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Members
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Reports
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {reportData && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                      Age Distribution
                    </CardTitle>
                    <CardDescription>Members by age category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            {
                              name: 'Youth (18-35)',
                              value: reportData?.ageCategories.youth || 0,
                              fill: '#0088FE'
                            },
                            {
                              name: 'Adults (36-50)',
                              value: reportData?.ageCategories.adult || 0,
                              fill: '#00C49F'
                            },
                            {
                              name: 'Mature (51-64)',
                              value: reportData?.ageCategories.matureAdult || 0,
                              fill: '#FFBB28'
                            },
                            {
                              name: 'Elderly (65+)',
                              value: reportData?.ageCategories.elderly || 0,
                              fill: '#FF8042'
                            }
                          ]}
                          margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 60
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="name"
                            angle={-45}
                            textAnchor="end"
                            height={60}
                            interval={0}
                          />
                          <YAxis />
                          <Tooltip
                            formatter={(value: number) => [`${value} members`, 'Count']}
                            contentStyle={{ backgroundColor: 'white', borderRadius: '8px' }}
                          />
                          <Bar 
                            dataKey="value"
                            radius={[4, 4, 0, 0]}
                          >
                            {reportData && Object.entries(reportData.ageCategories).map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`}
                                fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][index]}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Age Distribution Stats */}
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="p-3 rounded-lg bg-blue-50">
                        <div className="text-sm text-gray-600">Youth (18-35)</div>
                        <div className="text-xl font-bold text-blue-600">{reportData?.ageCategories.youth || 0}</div>
                        <div className="text-xs text-gray-500">
                          {((reportData?.ageCategories.youth || 0) / (reportData?.totalMembers || 1) * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-green-50">
                        <div className="text-sm text-gray-600">Adults (36-50)</div>
                        <div className="text-xl font-bold text-green-600">{reportData?.ageCategories.adult || 0}</div>
                        <div className="text-xs text-gray-500">
                          {((reportData?.ageCategories.adult || 0) / (reportData?.totalMembers || 1) * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-yellow-50">
                        <div className="text-sm text-gray-600">Mature (51-64)</div>
                        <div className="text-xl font-bold text-yellow-600">{reportData?.ageCategories.matureAdult || 0}</div>
                        <div className="text-xs text-gray-500">
                          {((reportData?.ageCategories.matureAdult || 0) / (reportData?.totalMembers || 1) * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-orange-50">
                        <div className="text-sm text-gray-600">Elderly (65+)</div>
                        <div className="text-xl font-bold text-orange-600">{reportData?.ageCategories.elderly || 0}</div>
                        <div className="text-xs text-gray-500">
                          {((reportData?.ageCategories.elderly || 0) / (reportData?.totalMembers || 1) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Membership Types
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {reportData && (
                      <div className="space-y-4">
                        {Object.entries(reportData.membershipTypes).map(([type, count]) => (
                          <div key={type} className="flex justify-between items-center">
                            <span className="capitalize">{type}</span>
                            <Badge variant="outline">{count}</Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="members">
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Member Management</CardTitle>
                <CardDescription>View and manage all registered members</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <Label htmlFor="search">Search Members</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="search"
                        placeholder="Search by name, email, or membership number..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="filter">Filter</Label>
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Members</SelectItem>
                        <SelectItem value="admin">Administrators</SelectItem>
                        <SelectItem value="regular">Regular Members</SelectItem>
                        <SelectItem value="disability">With Disability</SelectItem>
                        <SelectItem value="youth">Youth (18-35)</SelectItem>
                        <SelectItem value="adults">Adults (36-50)</SelectItem>
                        <SelectItem value="mature">Mature Adults (51-64)</SelectItem>
                        <SelectItem value="elderly">Elderly (65+)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Member</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Age Category</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMembers.map((member) => (
                        <TableRow key={member.membershipNumber}>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {member.fullName}
                              </div>
                              <div className="text-sm text-gray-500">{member.membershipNumber}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="text-sm">{member.email}</div>
                              <div className="text-sm text-gray-500">{member.contact}</div>
                            </div>
                          </TableCell>
                          <TableCell>{member.ageCategory}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {member.membershipType}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {member.isAdmin && (
                                <Badge className="bg-yellow-100 text-yellow-800">
                                  <Crown className="h-3 w-3 mr-1" />
                                  Admin
                                </Badge>
                              )}
                              {member.hasDisability && (
                                <Badge variant="secondary">
                                  <Accessibility className="h-3 w-3 mr-1" />
                                  PWD
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm" onClick={() => {
                                    setSelectedMember(member)
                                    setEditableData({
                                      fullName: member.fullName,
                                      idOrPassport: member.idOrPassport,
                                      contact: member.contact,
                                      ward: member.ward,
                                      pollingStation: member.pollingStation,
                                      pwdNumber: member.pwdNumber,
                                    })
                                    setEditMode(false)
                                  }}>
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                  <DialogHeader>
                                    <div className="flex justify-between items-center">
                                      <div>
                                        <DialogTitle>Member Details</DialogTitle>
                                        <DialogDescription>
                                          Complete information for {selectedMember?.fullName}
                                        </DialogDescription>
                                      </div>
                                      <Button
                                        variant="outline"
                                        onClick={() => setEditMode(!editMode)}
                                        disabled={isSaving}
                                      >
                                        {editMode ? "Cancel Edit" : "Edit Details"}
                                      </Button>
                                    </div>
                                  </DialogHeader>
                                  {selectedMember && editableData && (
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label>Full Name</Label>
                                        {editMode ? (
                                          <Input
                                            value={editableData.fullName}
                                            onChange={(e) => handleEditableDataChange("fullName", e.target.value)}
                                            className="mt-1"
                                          />
                                        ) : (
                                          <p className="text-sm">{selectedMember.fullName}</p>
                                        )}
                                      </div>
                                      <div>
                                        <Label>Membership Number</Label>
                                        <p className="text-sm">{selectedMember.membershipNumber}</p>
                                      </div>
                                      <div>
                                        <Label>Email</Label>
                                        <p className="text-sm">{selectedMember.email}</p>
                                      </div>
                                      <div>
                                        <Label>Phone</Label>
                                        {editMode ? (
                                          <Input
                                            value={editableData.contact}
                                            onChange={(e) => handleEditableDataChange("contact", e.target.value)}
                                            className="mt-1"
                                          />
                                        ) : (
                                          <p className="text-sm">{selectedMember.contact}</p>
                                        )}
                                      </div>
                                      <div>
                                        <Label>ID Number</Label>
                                        {editMode ? (
                                          <Input
                                            value={editableData.idOrPassport}
                                            onChange={(e) => handleEditableDataChange("idOrPassport", e.target.value)}
                                            className="mt-1"
                                            disabled
                                          />
                                        ) : (
                                          <p className="text-sm">{selectedMember.idOrPassport}</p>
                                        )}
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
                                        {editMode ? (
                                          <Input
                                            value={editableData.ward}
                                            onChange={(e) => handleEditableDataChange("ward", e.target.value)}
                                            className="mt-1"
                                          />
                                        ) : (
                                          <p className="text-sm">{selectedMember.ward}</p>
                                        )}
                                      </div>
                                      <div>
                                        <Label>Polling Station</Label>
                                        {editMode ? (
                                          <Input
                                            value={editableData.pollingStation}
                                            onChange={(e) => handleEditableDataChange("pollingStation", e.target.value)}
                                            className="mt-1"
                                          />
                                        ) : (
                                          <p className="text-sm">{selectedMember.pollingStation}</p>
                                        )}
                                      </div>
                                      <div className="col-span-2">
                                        <Label>Status</Label>
                                        <div className="mt-1 flex gap-2">
                                          {selectedMember.isAdmin && (
                                            <Badge className="bg-yellow-100 text-yellow-800">
                                              <Crown className="h-3 w-3 mr-1" />
                                              Administrator
                                            </Badge>
                                          )}
                                          {selectedMember.hasDisability && (
                                            <Badge variant="secondary">
                                              <Accessibility className="h-3 w-3 mr-1" />
                                              PWD
                                            </Badge>
                                          )}
                                        </div>
                                      </div>
                                      {selectedMember.hasDisability && (
                                        <div className="col-span-2">
                                          <Label>PWD Number</Label>
                                          {editMode ? (
                                            <Input
                                              value={editableData.pwdNumber || ""}
                                              onChange={(e) => handleEditableDataChange("pwdNumber", e.target.value)}
                                              className="mt-1"
                                              disabled
                                            />
                                          ) : (
                                            <p className="text-sm">{selectedMember.pwdNumber || "Not provided"}</p>
                                          )}
                                        </div>
                                      )}
                                      {editMode && (
                                        <div className="col-span-2 flex justify-end gap-2 mt-4">
                                          <Button
                                            variant="outline"
                                            onClick={() => setEditMode(false)}
                                            disabled={isSaving}
                                          >
                                            Cancel
                                          </Button>
                                          <Button
                                            onClick={handleSaveMemberChanges}
                                            disabled={isSaving}
                                          >
                                            {isSaving ? (
                                              <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Saving...
                                              </>
                                            ) : (
                                              "Save Changes"
                                            )}
                                          </Button>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                              {!member.isAdmin && (
                                <Dialog open={isPromotingDialogOpen} onOpenChange={(open) => {
                                  setIsPromotingDialogOpen(open)
                                  if (!open) setMemberToPromote(null)
                                }}>
                                  <DialogTrigger asChild>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => {
                                        setMemberToPromote(member)
                                        setIsPromotingDialogOpen(true)
                                      }}
                                    >
                                      <Crown className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Promote to Administrator</DialogTitle>
                                      <DialogDescription>
                                        Are you sure you want to promote {memberToPromote?.fullName} to administrator?
                                        This will give them full access to manage all members and system settings.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="mt-4 space-y-4">
                                      <Alert>
                                        <AlertDescription>
                                          Administrators can:
                                          <ul className="list-disc list-inside mt-2 space-y-1">
                                            <li>View all member details</li>
                                            <li>Edit member information</li>
                                            <li>Promote other members to admin</li>
                                            <li>Generate and download reports</li>
                                          </ul>
                                        </AlertDescription>
                                      </Alert>
                                      <div className="flex justify-end gap-2">
                                        <Button 
                                          variant="outline" 
                                          onClick={() => {
                                            setIsPromotingDialogOpen(false)
                                            setMemberToPromote(null)
                                          }}
                                          disabled={isPromoting}
                                        >
                                          Cancel
                                        </Button>
                                        <Button 
                                          onClick={() => memberToPromote && promoteToAdmin(memberToPromote.uid)}
                                          disabled={isPromoting}
                                        >
                                          {isPromoting ? (
                                            <>
                                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                              Promoting...
                                            </>
                                          ) : (
                                            <>
                                              <Crown className="h-4 w-4 mr-2" />
                                              Promote to Admin
                                            </>
                                          )}
                                        </Button>
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {/* Age Category Reports */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    Age Category Reports
                  </CardTitle>
                  <CardDescription>Download reports by age category</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => exportReport("age", "youth")}
                      className="justify-start"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Youth Members (18-35)
                      <Badge variant="secondary" className="ml-auto">{reportData?.ageCategories.youth}</Badge>
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => exportReport("age", "adult")}
                      className="justify-start"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Adult Members (36-50)
                      <Badge variant="secondary" className="ml-auto">{reportData?.ageCategories.adult}</Badge>
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => exportReport("age", "mature")}
                      className="justify-start"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Mature Adults (51-64)
                      <Badge variant="secondary" className="ml-auto">{reportData?.ageCategories.matureAdult}</Badge>
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => exportReport("age", "elderly")}
                      className="justify-start"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Elderly Members (65+)
                      <Badge variant="secondary" className="ml-auto">{reportData?.ageCategories.elderly}</Badge>
                    </Button>
                    <Button 
                      size="sm" 
                      className="w-full mt-2"
                      onClick={() => exportReport("age")}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export All Age Categories
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Membership Type Reports */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-yellow-600" />
                    Membership Type Reports
                  </CardTitle>
                  <CardDescription>Download reports by membership level</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => exportReport("membershipType", "platinum")}
                      className="justify-start"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Platinum Members
                      <Badge variant="secondary" className="ml-auto">{reportData?.membershipTypes.platinum || 0}</Badge>
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => exportReport("membershipType", "gold")}
                      className="justify-start"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Gold Members
                      <Badge variant="secondary" className="ml-auto">{reportData?.membershipTypes.gold || 0}</Badge>
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => exportReport("membershipType", "silver")}
                      className="justify-start"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Silver Members
                      <Badge variant="secondary" className="ml-auto">{reportData?.membershipTypes.silver || 0}</Badge>
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => exportReport("membershipType", "bronze")}
                      className="justify-start"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Bronze Members
                      <Badge variant="secondary" className="ml-auto">{reportData?.membershipTypes.bronze || 0}</Badge>
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => exportReport("membershipType", "ordinary")}
                      className="justify-start"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Ordinary Members
                      <Badge variant="secondary" className="ml-auto">{reportData?.membershipTypes.ordinary || 0}</Badge>
                    </Button>
                    <Button 
                      size="sm" 
                      className="w-full mt-2"
                      onClick={() => exportReport("all")}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export All Members
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Gender Distribution Reports */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    Gender Distribution Reports
                  </CardTitle>
                  <CardDescription>Download reports by gender</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => exportReport("gender", "female")}
                      className="justify-start"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Female Members
                      <Badge variant="secondary" className="ml-auto">{reportData?.genderStats.female}</Badge>
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => exportReport("gender", "male")}
                      className="justify-start"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Male Members
                      <Badge variant="secondary" className="ml-auto">{reportData?.genderStats.male}</Badge>
                    </Button>
                    {reportData?.genderStats.other > 0 && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => exportReport("gender", "other")}
                        className="justify-start"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Other
                        <Badge variant="secondary" className="ml-auto">{reportData?.genderStats.other}</Badge>
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      className="w-full mt-2"
                      onClick={() => exportReport("gender")}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export All Gender Categories
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Registration Period Reports */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-green-600" />
                    Registration Period Reports
                  </CardTitle>
                  <CardDescription>Download reports by registration period</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => exportReport("registration", "last30Days")}
                      className="justify-start"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Last 30 Days
                      <Badge variant="secondary" className="ml-auto">{reportData?.registrationPeriods.last30Days}</Badge>
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => exportReport("registration", "last3Months")}
                      className="justify-start"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Last 3 Months
                      <Badge variant="secondary" className="ml-auto">{reportData?.registrationPeriods.last3Months}</Badge>
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => exportReport("registration", "last6Months")}
                      className="justify-start"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Last 6 Months
                      <Badge variant="secondary" className="ml-auto">{reportData?.registrationPeriods.last6Months}</Badge>
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => exportReport("registration", "lastYear")}
                      className="justify-start"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Last Year
                      <Badge variant="secondary" className="ml-auto">{reportData?.registrationPeriods.lastYear}</Badge>
                    </Button>
                    <Button 
                      size="sm" 
                      className="w-full mt-2"
                      onClick={() => exportReport("registration")}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export All Registration Periods
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Disability Reports */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Accessibility className="h-5 w-5 text-purple-600" />
                    Disability Reports
                  </CardTitle>
                  <CardDescription>Download reports by disability status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => exportReport("disability", "withDisability")}
                      className="justify-start"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Members with Disability
                      <Badge variant="secondary" className="ml-auto">{reportData?.disabilityStats.withDisability}</Badge>
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => exportReport("disability", "withoutDisability")}
                      className="justify-start"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Members without Disability
                      <Badge variant="secondary" className="ml-auto">{reportData?.disabilityStats.withoutDisability}</Badge>
                    </Button>
                    <Button 
                      size="sm" 
                      className="w-full mt-2"
                      onClick={() => exportReport("disability")}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export All Disability Status
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Complete Members Report */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-purple-600" />
                    Complete Members Report
                  </CardTitle>
                  <CardDescription>Download comprehensive report of all members</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold">{reportData?.totalMembers}</div>
                      <div className="text-sm text-gray-500">Total Registered Members</div>
                    </div>
                    <Button 
                      className="w-full"
                      onClick={() => exportReport("all")}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export Complete Members Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Age Distribution</CardTitle>
                  <CardDescription>Members by age category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          {
                            name: 'Youth (18-35)',
                            value: reportData?.ageCategories.youth || 0,
                            fill: '#0088FE'
                          },
                          {
                            name: 'Adults (36-50)',
                            value: reportData?.ageCategories.adult || 0,
                            fill: '#00C49F'
                          },
                          {
                            name: 'Mature (51-64)',
                            value: reportData?.ageCategories.matureAdult || 0,
                            fill: '#FFBB28'
                          },
                          {
                            name: 'Elderly (65+)',
                            value: reportData?.ageCategories.elderly || 0,
                            fill: '#FF8042'
                          }
                        ]}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 60
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="name"
                          angle={-45}
                          textAnchor="end"
                          height={60}
                          interval={0}
                        />
                        <YAxis />
                        <Tooltip
                          formatter={(value: number) => [`${value} members`, 'Count']}
                          contentStyle={{ backgroundColor: 'white', borderRadius: '8px' }}
                        />
                        <Bar 
                          dataKey="value"
                          radius={[4, 4, 0, 0]}
                        >
                          {reportData && Object.entries(reportData.ageCategories).map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`}
                              fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][index]}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* Age Distribution Stats */}
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="p-3 rounded-lg bg-blue-50">
                      <div className="text-sm text-gray-600">Youth (18-35)</div>
                      <div className="text-xl font-bold text-blue-600">{reportData?.ageCategories.youth || 0}</div>
                      <div className="text-xs text-gray-500">
                        {((reportData?.ageCategories.youth || 0) / (reportData?.totalMembers || 1) * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-green-50">
                      <div className="text-sm text-gray-600">Adults (36-50)</div>
                      <div className="text-xl font-bold text-green-600">{reportData?.ageCategories.adult || 0}</div>
                      <div className="text-xs text-gray-500">
                        {((reportData?.ageCategories.adult || 0) / (reportData?.totalMembers || 1) * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-yellow-50">
                      <div className="text-sm text-gray-600">Mature (51-64)</div>
                      <div className="text-xl font-bold text-yellow-600">{reportData?.ageCategories.matureAdult || 0}</div>
                      <div className="text-xs text-gray-500">
                        {((reportData?.ageCategories.matureAdult || 0) / (reportData?.totalMembers || 1) * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-orange-50">
                      <div className="text-sm text-gray-600">Elderly (65+)</div>
                      <div className="text-xl font-bold text-orange-600">{reportData?.ageCategories.elderly || 0}</div>
                      <div className="text-xs text-gray-500">
                        {((reportData?.ageCategories.elderly || 0) / (reportData?.totalMembers || 1) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Membership Growth</CardTitle>
                  <CardDescription>Registration trend over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={Object.entries(
                          members.reduce((acc: { [key: string]: number }, member) => {
                            const date = new Date(member.registrationDate).toLocaleDateString()
                            acc[date] = (acc[date] || 0) + 1
                            return acc
                          }, {})
                        )
                        .map(([date, count]) => ({
                          date,
                          count
                        }))
                        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="count" stroke="#8884d8" fill="#8884d8" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Membership Types</CardTitle>
                  <CardDescription>Distribution by membership type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={prepareChartData(reportData).membershipData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8884d8">
                          {prepareChartData(reportData).membershipData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    Gender Distribution
                  </CardTitle>
                  <CardDescription>Members by gender</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Female Members</span>
                      <Badge variant="secondary">{reportData?.genderStats.female}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Male Members</span>
                      <Badge variant="secondary">{reportData?.genderStats.male}</Badge>
                    </div>
                    {reportData?.genderStats.other > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Other</span>
                        <Badge variant="secondary">{reportData?.genderStats.other}</Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-green-600" />
                    Registration Periods
                  </CardTitle>
                  <CardDescription>New members by time period</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Last 30 Days</span>
                      <Badge variant="secondary">{reportData?.registrationPeriods.last30Days}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Last 3 Months</span>
                      <Badge variant="secondary">{reportData?.registrationPeriods.last3Months}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Last 6 Months</span>
                      <Badge variant="secondary">{reportData?.registrationPeriods.last6Months}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Last Year</span>
                      <Badge variant="secondary">{reportData?.registrationPeriods.lastYear}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
