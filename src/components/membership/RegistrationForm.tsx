"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { formSchema, type FormData } from "./FormSchema"
import { submitToGoogleSheet } from "./GoogleSheetSubmitter"
import { Loader2 } from "lucide-react"
import { generateMembershipNumber } from "@/utils/membershipUtils"
import { useAuth } from "@/contexts/AuthContext"

// County and constituency data
const countyConstituencyMap: Record<string, string[]> = {
  Mombasa: ["Changamwe", "Jomvu", "Kisauni", "Nyali", "Likoni", "Mvita"],
  Kwale: ["Msambweni", "Lunga Lunga", "Matuga", "Kinango"],
  Kilifi: ["Kilifi North", "Kilifi South", "Kaloleni", "Rabai", "Ganze", "Malindi", "Magarini"],
  "Tana River": ["Garsen", "Galole", "Bura"],
  Lamu: ["Lamu East", "Lamu West"],
  "Taita-Taveta": ["Taveta", "Wundanyi", "Mwatate", "Voi"],
  Garissa: ["Garissa Township", "Balambala", "Lagdera", "Dadaab", "Fafi", "Ijara"],
  Wajir: ["Wajir North", "Wajir East", "Tarbaj", "Wajir West", "Eldas", "Wajir South"],
  Mandera: ["Mandera West", "Banissa", "Mandera North", "Mandera South", "Mandera East", "Lafey"],
  Marsabit: ["Moyale", "North Horr", "Saku", "Laisamis"],
  Isiolo: ["Isiolo North", "Isiolo South"],
  Meru: [
    "Igembe South",
    "Igembe Central",
    "Igembe North",
    "Tigania West",
    "Tigania East",
    "North Imenti",
    "Buuri",
    "Central Imenti",
    "South Imenti",
  ],
  "Tharaka-Nithi": ["Maara", "Chuka/Igambang'ombe", "Tharaka"],
  Embu: ["Manyatta", "Runyenjes", "Mbeere South", "Mbeere North"],
  Kitui: [
    "Mwingi North",
    "Mwingi West",
    "Mwingi Central",
    "Kitui West",
    "Kitui Rural",
    "Kitui Central",
    "Kitui East",
    "Kitui South",
  ],
  Machakos: ["Masinga", "Yatta", "Kangundo", "Matungulu", "Kathiani", "Mavoko", "Machakos Town", "Mwala"],
  Makueni: ["Mbooni", "Kilome", "Kaiti", "Makueni", "Kibwezi West", "Kibwezi East"],
  Nyandarua: ["Kinangop", "Kipipiri", "Ol Kalou", "Ol Jorok", "Ndaragwa"],
  Nyeri: ["Tetu", "Kieni", "Mathira", "Othaya", "Mukurweini", "Nyeri Town"],
  Kirinyaga: ["Mwea", "Gichugu", "Ndia", "Kirinyaga Central"],
  "Murang'a": ["Kangema", "Mathioya", "Kiharu", "Kigumo", "Maragwa", "Kandara", "Gatanga"],
  Kiambu: [
    "Gatundu South",
    "Gatundu North",
    "Juja",
    "Thika Town",
    "Ruiru",
    "Githunguri",
    "Kiambu",
    "Kiambaa",
    "Kabete",
    "Kikuyu",
    "Limuru",
    "Lari",
  ],
  Turkana: ["Turkana North", "Turkana West", "Turkana Central", "Loima", "Turkana South", "Turkana East"],
  "West Pokot": ["Kapenguria", "Sigor", "Kacheliba", "Pokot South"],
  Samburu: ["Samburu West", "Samburu North", "Samburu East"],
  "Trans Nzoia": ["Kwanza", "Endebess", "Saboti", "Kiminini", "Cherangany"],
  "Uasin Gishu": ["Soy", "Turbo", "Moiben", "Ainabkoi", "Kapseret", "Kesses"],
  "Elgeyo-Marakwet": ["Marakwet East", "Marakwet West", "Keiyo North", "Keiyo South"],
  Nandi: ["Tinderet", "Aldai", "Nandi Hills", "Chesumei", "Emgwen", "Mosop"],
  Baringo: ["Tiaty", "Baringo North", "Baringo Central", "Baringo South", "Mogotio", "Eldama Ravine"],
  Laikipia: ["Laikipia West", "Laikipia East", "Laikipia North"],
  Nakuru: [
    "Molo",
    "Njoro",
    "Naivasha",
    "Gilgil",
    "Kuresoi South",
    "Kuresoi North",
    "Subukia",
    "Rongai",
    "Bahati",
    "Nakuru Town West",
    "Nakuru Town East",
  ],
  Narok: ["Kilgoris", "Emurua Dikirr", "Narok North", "Narok East", "Narok South", "Narok West"],
  Kajiado: ["Kajiado North", "Kajiado Central", "Kajiado East", "Kajiado West", "Kajiado South"],
  Kericho: ["Kipkelion East", "Kipkelion West", "Ainamoi", "Bureti", "Belgut", "Sigowet-Soin"],
  Bomet: ["Sotik", "Chepalungu", "Bomet East", "Bomet Central", "Konoin"],
  Kakamega: [
    "Lugari",
    "Likuyani",
    "Malava",
    "Lurambi",
    "Navakholo",
    "Mumias West",
    "Mumias East",
    "Matungu",
    "Butere",
    "Khwisero",
    "Shinyalu",
    "Ikolomani",
  ],
  Vihiga: ["Vihiga", "Sabatia", "Hamisi", "Luanda", "Emuhaya"],
  Bungoma: [
    "Mount Elgon",
    "Sirisia",
    "Kabuchai",
    "Bumula",
    "Kanduyi",
    "Webuye East",
    "Webuye West",
    "Kimilili",
    "Tongaren",
  ],
  Busia: ["Teso North", "Teso South", "Nambale", "Matayos", "Butula", "Funyula", "Budalangi"],
  Siaya: ["Ugenya", "Ugunja", "Alego Usonga", "Gem", "Bondo", "Rarieda"],
  Kisumu: ["Kisumu East", "Kisumu West", "Kisumu Central", "Seme", "Nyando", "Muhoroni", "Nyakach"],
  "Homa Bay": [
    "Kasipul",
    "Kabondo Kasipul",
    "Karachuonyo",
    "Rangwe",
    "Homa Bay Town",
    "Ndhiwa",
    "Suba North",
    "Suba South",
  ],
  Migori: ["Rongo", "Awendo", "Suna East", "Suna West", "Uriri", "Nyatike", "Kuria West", "Kuria East"],
  Kisii: [
    "Bonchari",
    "South Mugirango",
    "Bomachoge Borabu",
    "Bobasi",
    "Bomachoge Chache",
    "Nyaribari Masaba",
    "Nyaribari Chache",
    "Kitutu Chache North",
    "Kitutu Chache South",
  ],
  Nyamira: ["Kitutu Masaba", "West Mugirango", "North Mugirango", "Borabu"],
  Nairobi: [
    "Westlands",
    "Dagoretti North",
    "Dagoretti South",
    "Lang'ata",
    "Kibra",
    "Roysambu",
    "Kasarani",
    "Ruaraka",
    "Embakasi South",
    "Embakasi North",
    "Embakasi Central",
    "Embakasi East",
    "Embakasi West",
    "Makadara",
    "Kamukunji",
    "Starehe",
    "Mathare",
  ],
  Diaspora: ["Africa", "Americas", "Asia", "Europe", "Australia", "Middle East"],
}

// List of Kenya counties in alphabetical order
const counties = Object.keys(countyConstituencyMap).sort()

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

const RegistrationForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedConstituencies, setSelectedConstituencies] = useState<string[]>([])
  const { setPendingRegistration } = useAuth()
  const navigate = useNavigate()

  // Initialize the form with react-hook-form
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      idNumber: "",
      gender: "",
      ethnicity: "",
      disability: "",
      maritalStatus: "",
      address: "",
      contact: "",
      county: "",
      constituency: "",
      ward: "",
      pollingStation: "",
      membershipType: "",
    },
  })

  // Watch for county changes to update constituency options
  const selectedCounty = form.watch("county")

  // Update constituencies when county changes
  useEffect(() => {
    if (selectedCounty) {
      const constituencies = countyConstituencyMap[selectedCounty] || []
      setSelectedConstituencies(constituencies)
      // Reset constituency value when county changes
      form.setValue("constituency", "")
    }
  }, [selectedCounty, form])

  // Submit handler
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)

    try {
      // Generate a membership number
      const membershipNumber = generateMembershipNumber()

      // Submit to Google Sheets
      const success = await submitToGoogleSheet(data)

      if (success) {
        toast.success("Registration submitted successfully!")

        // Create user object for authentication context
        const userData = {
          membershipNumber,
          fullName: data.fullName,
          county: data.county,
          constituency: data.constituency,
          membershipType: data.membershipType,
        }

        // Set pending registration in auth context
        setPendingRegistration(userData)

        // Reset form
        form.reset()

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Names</FormLabel>
                  <FormControl>
                    <Input placeholder="Christopher Waweru" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="idNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>National ID/Passport Number</FormLabel>
                  <FormControl>
                    <Input placeholder="ID/Passport Number" {...field} />
                  </FormControl>
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
                  <FormLabel>Gender</FormLabel>
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
              name="maritalStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marital Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="married">Married</SelectItem>
                      <SelectItem value="divorced">Divorced</SelectItem>
                      <SelectItem value="widowed">Widowed</SelectItem>
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
              name="ethnicity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ethnicity</FormLabel>
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

            <FormField
              control={form.control}
              name="disability"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Do you have any disability?</FormLabel>
                  <FormControl>
                    <RadioGroup value={field.value} onValueChange={field.onChange} className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="disability-yes" />
                        <Label htmlFor="disability-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="disability-no" />
                        <Label htmlFor="disability-no">No</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Home Address/Diaspora State</FormLabel>
                  <FormControl>
                    <Input placeholder="Your address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Official Contact</FormLabel>
                  <FormControl>
                    <Input placeholder="+254 XXX XXX XXX" type="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="county"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>County</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select county" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-[200px] overflow-y-auto">
                      {counties.map((county) => (
                        <SelectItem key={county} value={county}>
                          {county}
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
                  <FormLabel>Constituency</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={!selectedCounty}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={selectedCounty ? "Select constituency" : "Select county first"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-[200px] overflow-y-auto">
                      {selectedConstituencies.map((constituency) => (
                        <SelectItem key={constituency} value={constituency}>
                          {constituency}
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
                  <FormLabel>Ward</FormLabel>
                  <FormControl>
                    <Input placeholder="Your ward" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pollingStation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Polling Station</FormLabel>
                  <FormControl>
                    <Input placeholder="Your polling station" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="membershipType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Membership Subscription</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ordinary" id="ordinary" />
                      <Label htmlFor="ordinary">Ordinary membership - Ksh 200</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="silver" id="silver" />
                      <Label htmlFor="silver">Silver member - Ksh 2,000</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="bronze" id="bronze" />
                      <Label htmlFor="bronze">Bronze member - Ksh 5,000-10,000</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="gold" id="gold" />
                      <Label htmlFor="gold">Gold membership - Ksh 20,000-100,000</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="platinum" id="platinum" />
                      <Label htmlFor="platinum">Platinum membership - Ksh 500,000-1,000,000</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full bg-party-gold hover:bg-party-gold/90" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
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
