import * as z from "zod"
import { validateMobileNumber } from "@/utils/membershipNumberGenerator"

// Define schema for form validation
export const formSchema = z
  .object({
    firstName: z.string()
      .min(2, "Other names must be at least 2 characters")
      .regex(/^[A-Za-z\s-]+$/, "Other names should only contain letters, spaces, and hyphens"),
    lastName: z.string()
      .min(2, "Surname must be at least 2 characters")
      .regex(/^[A-Za-z\s-]+$/, "Surname should only contain letters, spaces, and hyphens"),
    email: z.string()
      .email("Please enter a valid email address")
      .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please enter a valid email address"),
    dateOfBirth: z.date({
      required_error: "Please select your date of birth",
    }),
    idOrPassport: z.string()
      .min(1, "National ID/Passport number is required")
      .regex(/^\d{1,8}$/, "ID number should be between 1-8 digits")
      .or(z.string().regex(/^[A-Z]\d{7}$/, "Passport number should be in format A1234567")),
    gender: z.string().min(1, "Please select your gender"),
    ethnicity: z.string().min(1, "Please select your ethnicity"),
    religion: z.string().min(1, "Please select your religion"),
    disability: z.string().min(1, "Please select disability status"),
    pwdNumber: z.string().optional(),
    specialInterestCategory: z.string().min(1, "Please select a special interest category"),
    contact: z.string().regex(/^254\d{9}$/, "Please enter a valid mobile number starting with 254"),
    county: z.string().min(1, "Please select your county"),
    constituency: z.string().min(1, "Please select your constituency"),
    ward: z.string().min(1, "Please enter your ward"),
    pollingStation: z.string().min(1, "Please enter your polling station"),
    membershipType: z.string().min(1, "Please select your membership type"),
    privacyConsent: z.boolean().refine((val) => val === true, {
      message: "You must accept the privacy policy",
    }),
  })
  .refine(
    (data) => {
      // If disability is PWD, PWD number must be provided
      if (data.disability === "person with disability (pwd)") {
        return !!data.pwdNumber
      }
      return true
    },
    {
      message: "PWD number is required for persons with disabilities",
      path: ["pwdNumber"],
    }
  )

export type FormData = z.infer<typeof formSchema>
