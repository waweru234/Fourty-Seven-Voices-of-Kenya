import type { FormData } from "./FormSchema"

// Enhanced Google Sheet submission function with membership number
export const submitToGoogleSheet = async (data: FormData & { membershipNumber: string }) => {
  // Google Apps Script web app URL
  const googleScriptUrl =
    "https://script.google.com/macros/s/AKfycbyXoOKvxY6Xda1CWg0APICaFjhRzViyylAZjG080Xn8QARnTqA3uMzXus-Umkje80tu/exec"

  try {
    // Create enhanced data object with membership number and formatted phone
    const enhancedData = {
      ...data,
      membershipNumber: data.membershipNumber,
      contact: data.contact.replace("+", ""),
      submissionDate: new Date().toISOString(),
      privacyConsentGiven: data.privacyConsent ? "Yes" : "No",
    }

    console.log("Submitting data to Google Sheets:", enhancedData)

    const response = await fetch(googleScriptUrl, {
      method: "POST",
      mode: "no-cors", // Required for Google Apps Script
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(enhancedData),
    })

    console.log("Google Sheets submission completed")
    return true
  } catch (error) {
    console.error("Error submitting to Google Sheets:", error)
    return false
  }
}
