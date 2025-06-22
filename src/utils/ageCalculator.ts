/**
 * Calculate age from date of birth
 */
export const calculateAge = (dateOfBirth: Date): number => {
  const today = new Date()
  const birthDate = new Date(dateOfBirth)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }

  return age
}

/**
 * Get age category based on age
 */
export const getAgeCategory = (age: number): string => {
  if (age >= 18 && age <= 35) {
    return "Youth"
  } else if (age >= 36 && age <= 50) {
    return "Adult"
  } else if (age >= 51 && age <= 64) {
    return "Mature Adult"
  } else if (age >= 65) {
    return "Elderly"
  } else {
    return "Under 18 (Not eligible for membership)"
  }
}

/**
 * Check if age is eligible for membership
 */
export const isEligibleAge = (age: number): boolean => {
  return age >= 18
}
