export interface User {
  membershipNumber: string
  fullName: string
  county: string
  constituency: string
  membershipType: string
  email: string
  dateOfBirth?: string
  idOrPassport: string
  age: number
  ageCategory: string
  specialInterestCategory: string
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
  emailVerified: boolean
} 