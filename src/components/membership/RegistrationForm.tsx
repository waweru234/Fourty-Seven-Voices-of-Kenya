"use client"

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "sonner"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { formSchema, type FormData } from "./FormSchema"
import { submitToGoogleSheet } from "./GoogleSheetSubmitter"
import { Loader2, Shield, ExternalLink, Phone, Info, CalendarIcon, AlertCircle, ChevronDown } from "lucide-react"
import { generateMembershipNumber, formatMobileNumber, validateMobileNumber } from "@/utils/membershipNumberGenerator"
import { calculateAge, getAgeCategory, isEligibleAge } from "@/utils/ageCalculator"
import { useAuth } from "@/contexts/AuthContext"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
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

// Enhanced Date Picker Component
const EnhancedDatePicker = ({ field, onDateChange }: { field: any; onDateChange: (date: Date) => void }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear() - 25)
  const [selectedMonth, setSelectedMonth] = useState<number>(0)
  const [selectedDay, setSelectedDay] = useState<number>(1)

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i)
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const days = Array.from({ length: getDaysInMonth(selectedYear, selectedMonth) }, (_, i) => i + 1)

  const handleDateSelect = () => {
    const newDate = new Date(selectedYear, selectedMonth, selectedDay)
    field.onChange(newDate)
    onDateChange(newDate)
    setIsOpen(false)
  }

  useEffect(() => {
    if (field.value) {
      const date = new Date(field.value)
      setSelectedYear(date.getFullYear())
      setSelectedMonth(date.getMonth())
      setSelectedDay(date.getDate())
    }
  }, [field.value])

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label className="text-xs font-medium text-gray-600">Year</Label>
              <Select
                value={selectedYear.toString()}
                onValueChange={(value) => setSelectedYear(Number.parseInt(value))}
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                  <ChevronDown className="h-3 w-3" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs font-medium text-gray-600">Month</Label>
              <Select
                value={selectedMonth.toString()}
                onValueChange={(value) => setSelectedMonth(Number.parseInt(value))}
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                  <ChevronDown className="h-3 w-3" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {months.map((month, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs font-medium text-gray-600">Day</Label>
              <Select value={selectedDay.toString()} onValueChange={(value) => setSelectedDay(Number.parseInt(value))}>
                <SelectTrigger className="h-8">
                  <SelectValue />
                  <ChevronDown className="h-3 w-3" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {days.map((day) => (
                    <SelectItem key={day} value={day.toString()}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={handleDateSelect} className="w-full bg-party-gold hover:bg-party-gold/90">
            Select Date
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

// List of common ethnicities in Kenya
const ethnicities = [
  "Kikuyu",
  "Luhya",
  "Kalenjin",
  "Luo",
  "Kamba",
  "Kisii",
  "Mijikenda",
  "Meru",
  "Turkana",
  "Maasai",
  "Teso",
  "Embu",
  "Taita",
  "Kuria",
  "Samburu",
  "Tharaka",
  "Pokomo",
  "Pokot",
  "Nubi",
  "Borana",
  "Somali",
  "Rendille",
  "El Molo",
  "Swahili",
  "Arab",
  "Asian",
  "European",
  "Other",
].sort()

// List of religions
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

// Special interest categories
const specialInterestCategories = ["None", "Ethnic Minority", "Marginalized Community"].sort()

const RegistrationForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [counties, setCounties] = useState<County[]>([])
  const [constituencies, setConstituencies] = useState<Constituency[]>([])
  const [wards, setWards] = useState<Ward[]>([])
  const [pollingStations, setPollingStations] = useState<PollingStation[]>([])
  const [mobilePreview, setMobilePreview] = useState("")
  const [ageInfo, setAgeInfo] = useState<{ age: number; category: string; eligible: boolean } | null>(null)
  const { setPendingRegistration } = useAuth()
  const navigate = useNavigate()
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [showTermsError, setShowTermsError] = useState(false)

  // Initialize the form with react-hook-form
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      dateOfBirth: undefined,
      idOrPassport: "",
      gender: "",
      ethnicity: "",
      religion: "",
      disability: "none",
      pwdNumber: "",
      specialInterestCategory: "",
      contact: "",
      county: "",
      constituency: "",
      ward: "",
      pollingStation: "",
      membershipType: "",
      privacyConsent: false,
    },
  })

  // Watch for form field changes
  const selectedCounty = form.watch("county")
  const selectedConstituency = form.watch("constituency")
  const selectedWard = form.watch("ward")
  const contactValue = form.watch("contact")
  const dateOfBirth = form.watch("dateOfBirth")

  // Initialize counties on component mount
  useEffect(() => {
    const allCounties = getCounties()
    setCounties(allCounties)
  }, [])

  // Update constituencies when county changes
  useEffect(() => {
    if (selectedCounty) {
      const constituenciesData = getConstituenciesByCounty(selectedCounty)
      setConstituencies(constituenciesData)
      // Reset dependent fields
      form.setValue("constituency", "")
      form.setValue("ward", "")
      form.setValue("pollingStation", "")
      setWards([])
      setPollingStations([])
    }
  }, [selectedCounty, form])

  // Update wards when constituency changes
  useEffect(() => {
    if (selectedCounty && selectedConstituency) {
      const wardsData = getWardsByConstituency(selectedCounty, selectedConstituency)
      setWards(wardsData)
      // Reset dependent fields
      form.setValue("ward", "")
      form.setValue("pollingStation", "")
      setPollingStations([])
    }
  }, [selectedCounty, selectedConstituency, form])

  // Update polling stations when ward changes
  useEffect(() => {
    if (selectedCounty && selectedConstituency && selectedWard) {
      const pollingStationsData = getPollingStationsByWard(selectedCounty, selectedConstituency, selectedWard)
      setPollingStations(pollingStationsData)
      // Reset polling station field
      form.setValue("pollingStation", "")
    }
  }, [selectedCounty, selectedConstituency, selectedWard, form])

  // Update mobile preview when contact changes
  useEffect(() => {
    if (contactValue) {
      const cleanNumber = contactValue.replace(/\D/g, "")
      if (validateMobileNumber(cleanNumber)) {
        setMobilePreview(formatMobileNumber(cleanNumber))
      } else {
        setMobilePreview("")
      }
    } else {
      setMobilePreview("")
    }
  }, [contactValue])

  // Calculate age when date of birth changes
  useEffect(() => {
    if (dateOfBirth) {
      const age = calculateAge(dateOfBirth)
      const category = getAgeCategory(age)
      const eligible = isEligibleAge(age)
      setAgeInfo({ age, category, eligible })
    } else {
      setAgeInfo(null)
    }
  }, [dateOfBirth])

  // Submit handler
  const onSubmit = async (data: FormData) => {
    try {
      // Check terms acceptance
      if (!acceptedTerms) {
        setShowTermsError(true)
        toast.error("Please accept the terms and conditions to proceed.")
        return
      }

      // Check age eligibility
      if (ageInfo && !ageInfo.eligible) {
        toast.error("You must be at least 18 years old to register for membership.")
        return
      }

      setIsSubmitting(true)

      // Format the contact number
      const formattedContact = formatMobileNumber(data.contact)

      // Generate membership number using county code
      const membershipNumber = generateMembershipNumber(formattedContact, data.county)

      console.log("Submitting registration with data:", {
        ...data,
        membershipNumber,
        formattedContact,
      })

      // Submit to Google Sheets
      const success = await submitToGoogleSheet({
        ...data,
        contact: formattedContact,
        membershipNumber,
      })

      if (success) {
        toast.success("Registration submitted successfully!")

        // Create user object for authentication context
        const userData = {
          membershipNumber,
          fullName: `${data.firstName} ${data.lastName}`,
          county: data.county,
          constituency: data.constituency,
          membershipType: data.membershipType,
          email: data.email,
          dateOfBirth: data.dateOfBirth ? format(data.dateOfBirth, "yyyy-MM-dd") : undefined,
          idOrPassport: data.idOrPassport,
          age: ageInfo?.age || 0,
          ageCategory: ageInfo?.category || "",
          specialInterestCategory: data.disability,
          hasDisability: data.disability === "person with disability (pwd)",
          pwdNumber: data.pwdNumber || "",
          contact: formattedContact,
          ward: data.ward,
          pollingStation: data.pollingStation,
          gender: data.gender,
          ethnicity: data.ethnicity,
          religion: data.religion,
          isAdmin: false,
          registrationDate: format(new Date(), "yyyy-MM-dd"),
          emailVerified: false,
        }

        // Set pending registration in auth context
        setPendingRegistration(userData)

        // Reset form and states
        form.reset()
        setAcceptedTerms(false)
        setShowTermsError(false)
        setMobilePreview("")
        setAgeInfo(null)

        // Navigate to set password page
        navigate("/set-password")
      } else {
        toast.error("Failed to submit registration. Please try again.")
      }
    } catch (error) {
      console.error("Submission error:", error)
      toast.error("An error occurred during submission. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-xl p-6 md:p-8">
      <h3 className="text-xl font-bold mb-6">Membership Registration</h3>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information Section */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">Personal Information</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      Other Names <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="eg Christopher Gitau"
                        {...field}
                        onBlur={(e) => {
                          field.onBlur()
                          form.trigger("firstName")
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      Surname <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Waweru"
                        {...field}
                        onBlur={(e) => {
                          field.onBlur()
                          form.trigger("lastName")
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="idOrPassport"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      National ID/Passport No. <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter ID or Passport number"
                        {...field}
                        onBlur={(e) => {
                          field.onBlur()
                          form.trigger("idOrPassport")
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      Email Address <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="christopher@example.com"
                        {...field}
                        onBlur={(e) => {
                          field.onBlur()
                          form.trigger("email")
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="flex items-center gap-1">
                      Date of Birth <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <EnhancedDatePicker
                        field={field}
                        onDateChange={(date) => {
                          const age = calculateAge(date)
                          const category = getAgeCategory(age)
                          const eligible = isEligibleAge(age)
                          setAgeInfo({ age, category, eligible })
                        }}
                      />
                    </FormControl>
                    {ageInfo && (
                      <div
                        className={cn(
                          "text-sm p-3 rounded-lg border",
                          ageInfo.eligible
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-red-50 text-red-700 border-red-200",
                        )}
                      >
                        <div className="flex items-center gap-2">
                          {ageInfo.eligible ? <Info className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                          <span className="font-medium">
                            Age: {ageInfo.age} years - {ageInfo.category}
                          </span>
                        </div>
                        {!ageInfo.eligible && (
                          <p className="mt-1 text-xs">You must be at least 18 years old to register.</p>
                        )}
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Mobile Number <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <Input
                          placeholder="254712345678"
                          type="tel"
                          {...field}
                          className="font-mono"
                          onBlur={(e) => {
                            const cleanedValue = e.target.value.replace(/\s+/g, "")
                            field.onChange(cleanedValue)
                            field.onBlur()
                            form.trigger("contact")
                          }}
                        />
                        {mobilePreview && (
                          <div className="flex items-center gap-2 text-sm text-green-600">
                            <Info className="h-3 w-3" />
                            <span>Formatted: {mobilePreview}</span>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <div className="text-xs text-gray-500 mt-1">
                      Must start with 254 and have exactly 12 digits (e.g., 254712345678)
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      Sex <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <RadioGroup value={field.value} onValueChange={field.onChange} className="flex gap-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="male" id="male" />
                          <Label htmlFor="male">Male</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="female" id="female" />
                          <Label htmlFor="female">Female</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ethnicity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      Ethnicity <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select ethnicity" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-[200px] overflow-y-auto">
                        {ethnicities.map((ethnicity) => (
                          <SelectItem key={ethnicity} value={ethnicity.toLowerCase()}>
                            {ethnicity}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="religion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      Religion <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select religion" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-[200px] overflow-y-auto">
                        {religions.map((religion) => (
                          <SelectItem key={religion} value={religion.toLowerCase()}>
                            {religion}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="disability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      Person with Disability (PWD) <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        value={field.value === "person with disability (pwd)" ? "yes" : "no"}
                        onValueChange={(value) => {
                          field.onChange(value === "yes" ? "person with disability (pwd)" : "none")
                          if (value === "no") {
                            form.setValue("pwdNumber", "")
                          }
                        }}
                        className="flex gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="pwd-yes" />
                          <Label htmlFor="pwd-yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="pwd-no" />
                          <Label htmlFor="pwd-no">No</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {form.watch("disability") === "person with disability (pwd)" && (
              <FormField
                control={form.control}
                name="pwdNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      PWD Number <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your PWD number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="specialInterestCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    Special Interest Category <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-[200px] overflow-y-auto">
                      {specialInterestCategories.map((category) => (
                        <SelectItem key={category} value={category.toLowerCase()}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Location Information Section */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">Location Information</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="county"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      County <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select county" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-[200px] overflow-y-auto">
                        {counties.map((county) => (
                          <SelectItem key={county.code} value={county.name}>
                            {county.name} ({county.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="constituency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      Constituency <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={!selectedCounty}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={selectedCounty ? "Select constituency" : "Select county first"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-[200px] overflow-y-auto">
                        {constituencies.map((constituency) => (
                          <SelectItem key={constituency.code} value={constituency.name}>
                            {constituency.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="ward"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      Ward <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={!selectedConstituency}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={selectedConstituency ? "Select ward" : "Select constituency first"}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-[200px] overflow-y-auto">
                        {wards.map((ward) => (
                          <SelectItem key={ward.code} value={ward.name}>
                            {ward.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pollingStation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      Polling Station <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={!selectedWard}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={selectedWard ? "Select polling station" : "Select ward first"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-[200px] overflow-y-auto">
                        {pollingStations.map((station) => (
                          <SelectItem key={station.code} value={station.name}>
                            {station.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Membership Information Section */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-800 border-b pb-2">Membership Information</h4>

            <FormField
              control={form.control}
              name="membershipType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    Membership Subscription <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="ordinary" id="ordinary" />
                        <Label htmlFor="ordinary">Ordinary membership - Ksh 0-1000</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="bronze" id="bronze" />
                        <Label htmlFor="bronze">Bronze member - Ksh 1,000-20,000</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="silver" id="silver" />
                        <Label htmlFor="silver">Silver member - Ksh 20,000-50,000</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="gold" id="gold" />
                        <Label htmlFor="gold">Gold membership - Ksh 50,000-200,000</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="platinum" id="platinum" />
                        <Label htmlFor="platinum">Platinum membership - Ksh 200,000-1,000,000</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Terms and Conditions Section */}
          <div className="border-t pt-6">
            <div className="flex flex-row items-start space-x-3 space-y-0 mb-4">
              <Checkbox
                id="terms"
                checked={acceptedTerms}
                onCheckedChange={(checked) => {
                  setAcceptedTerms(checked === true)
                  setShowTermsError(false)
                }}
              />
              <div className="space-y-1 leading-none">
                <Label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Accept Terms & Conditions <span className="text-red-500">*</span>
                </Label>
                <p className="text-sm text-gray-600">
                  I agree to the{" "}
                  <Link
                    to="/terms-of-service"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-party-gold hover:underline inline-flex items-center gap-1"
                  >
                    Terms & Conditions
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </p>
                {showTermsError && (
                  <p className="text-sm text-red-500">You must accept the terms and conditions to proceed</p>
                )}
              </div>
            </div>

            <FormField
              control={form.control}
              name="privacyConsent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-party-gold" />
                      Privacy Consent & Declaration <span className="text-red-500">*</span>
                    </FormLabel>
                    <p className="text-sm text-gray-600">
                      I willingly submit this as my main data and agree to the{" "}
                      <Link
                        to="/privacy-policy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-party-gold hover:underline inline-flex items-center gap-1"
                      >
                        Data Privacy Policy
                        <ExternalLink className="h-3 w-3" />
                      </Link>{" "}
                      and accept the{" "}
                      <Link
                        to="/declaration"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-party-gold hover:underline inline-flex items-center gap-1"
                      >
                        Member Declaration
                        <ExternalLink className="h-3 w-3" />
                      </Link>{" "}
                      in accordance with Kenya's Data Protection Act, 2019.
                    </p>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-party-gold hover:bg-party-gold/90"
            disabled={isSubmitting || (ageInfo && !ageInfo.eligible) || !acceptedTerms}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing Registration...
              </>
            ) : (
              "Submit Registration"
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default RegistrationForm
