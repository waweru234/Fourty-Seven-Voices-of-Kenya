// County codes mapping - 3-digit codes for each county
export const COUNTY_CODES: Record<string, string> = {
  Mombasa: "001",
  Kwale: "002",
  Kilifi: "003",
  "Tana River": "004",
  Lamu: "005",
  "Taita-Taveta": "006",
  Garissa: "007",
  Wajir: "008",
  Mandera: "009",
  Marsabit: "010",
  Isiolo: "011",
  Meru: "012",
  "Tharaka-Nithi": "013",
  Embu: "014",
  Kitui: "015",
  Machakos: "016",
  Makueni: "017",
  Nyandarua: "018",
  Nyeri: "019",
  Kirinyaga: "020",
  "Murang'a": "021",
  Kiambu: "022",
  Turkana: "023",
  "West Pokot": "024",
  Samburu: "025",
  "Trans Nzoia": "026",
  "Uasin Gishu": "027",
  "Elgeyo-Marakwet": "028",
  Nandi: "029",
  Baringo: "030",
  Laikipia: "031",
  Nakuru: "032",
  Narok: "033",
  Kajiado: "034",
  Kericho: "035",
  Bomet: "036",
  Kakamega: "037",
  Vihiga: "038",
  Bungoma: "039",
  Busia: "040",
  Siaya: "041",
  Kisumu: "042",
  "Homa Bay": "043",
  Migori: "044",
  Kisii: "045",
  Nyamira: "046",
  Nairobi: "047",
  Diaspora: "048",
}

/**
 * Validates mobile number format - must start with 254 and have exactly 12 digits
 */
export const validateMobileNumber = (mobileNumber: string): boolean => {
  // Remove any non-digit characters
  const cleanNumber = mobileNumber.replace(/\D/g, "")

  // Check if it starts with 254 and has exactly 12 digits
  return cleanNumber.startsWith("254") && cleanNumber.length === 12
}

/**
 * Extracts mobile digits from phone number
 * Takes the second and third digits after the first digit
 * Example: 254789564323 -> first digit is 2, next digits are 5,4 -> returns "54"
 */
export const extractMobileDigits = (mobileNumber: string): string => {
  // Remove all non-digit characters
  const cleanNumber = mobileNumber.replace(/\D/g, "")

  // Validate the number format
  if (!validateMobileNumber(cleanNumber)) {
    throw new Error("Invalid mobile number format")
  }

  // Extract second and third digits after the first digit
  // For 254789564323: first digit is 2, second is 5, third is 4
  // So we take positions 1 and 2 (0-indexed)
  return cleanNumber.substring(1, 3)
}

/**
 * Gets the next registration order number
 * In a real application, this would query the database
 * For now, we'll simulate with localStorage
 */
export const getNextRegistrationNumber = (): string => {
  const currentCount = localStorage.getItem("vok_registration_count")
  const nextNumber = currentCount ? Number.parseInt(currentCount) + 1 : 1
  localStorage.setItem("vok_registration_count", nextNumber.toString())

  // Format as 4-digit number with leading zeros
  return nextNumber.toString().padStart(4, "0")
}

/**
 * Generates complete membership number
 * Format: VOK-<mobile_digits><county_code><registration_number>
 * Example: VOK-540220001
 */
export const generateMembershipNumber = (mobileNumber: string, county: string): string => {
  try {
    const mobileDigits = extractMobileDigits(mobileNumber)
    const countyCode = COUNTY_CODES[county] || "000"
    const registrationNumber = getNextRegistrationNumber()

    const membershipNumber = `VOK-${mobileDigits}${countyCode}${registrationNumber}`

    console.log("Membership Number Generation:")
    console.log("Mobile Number:", mobileNumber)
    console.log("Mobile Digits:", mobileDigits)
    console.log("County:", county)
    console.log("County Code:", countyCode)
    console.log("Registration Number:", registrationNumber)
    console.log("Final Membership Number:", membershipNumber)

    return membershipNumber
  } catch (error) {
    console.error("Error generating membership number:", error)
    throw error
  }
}

/**
 * Formats mobile number for display
 */
export const formatMobileNumber = (mobileNumber: string): string => {
  const cleanNumber = mobileNumber.replace(/\D/g, "")
  if (cleanNumber.length === 12 && cleanNumber.startsWith("254")) {
    return `${cleanNumber.substring(0, 3)} ${cleanNumber.substring(3, 6)} ${cleanNumber.substring(6, 9)} ${cleanNumber.substring(9)}`
  }
  return mobileNumber
}
