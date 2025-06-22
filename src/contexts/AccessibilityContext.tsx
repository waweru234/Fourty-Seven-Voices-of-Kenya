import { createContext, useContext, useEffect, useState } from "react"

type AccessibilityMode = "default" | "epilepsy" | "visual" | "cognitive" | "adhd" | "blind"

interface AccessibilityContextType {
  mode: AccessibilityMode
  setMode: (mode: AccessibilityMode) => void
  isToolbarVisible: boolean
  setToolbarVisible: (visible: boolean) => void
  fontSize: number
  setFontSize: (size: number) => void
  contrast: number
  setContrast: (contrast: number) => void
  reducedMotion: boolean
  setReducedMotion: (reduced: boolean) => void
  resetSettings: () => void
  hideToolbarPermanently: () => void
}

const defaultSettings = {
  mode: "default" as AccessibilityMode,
  isToolbarVisible: true,
  fontSize: 16,
  contrast: 100,
  reducedMotion: false,
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState(() => {
    if (typeof window !== "undefined") {
      const savedSettings = localStorage.getItem("accessibility-settings")
      return savedSettings ? JSON.parse(savedSettings) : defaultSettings
    }
    return defaultSettings
  })

  const [mode, setMode] = useState<AccessibilityMode>(settings.mode)
  const [isToolbarVisible, setToolbarVisible] = useState(settings.isToolbarVisible)
  const [fontSize, setFontSize] = useState(settings.fontSize)
  const [contrast, setContrast] = useState(settings.contrast)
  const [reducedMotion, setReducedMotion] = useState(settings.reducedMotion)

  useEffect(() => {
    const newSettings = {
      mode,
      isToolbarVisible,
      fontSize,
      contrast,
      reducedMotion,
    }
    localStorage.setItem("accessibility-settings", JSON.stringify(newSettings))

    // Apply settings to document
    document.documentElement.style.fontSize = `${fontSize}px`
    document.documentElement.style.filter = `contrast(${contrast}%)`
    document.documentElement.classList.toggle("reduce-motion", reducedMotion)
    document.documentElement.setAttribute("data-accessibility-mode", mode)
  }, [mode, isToolbarVisible, fontSize, contrast, reducedMotion])

  const resetSettings = () => {
    setMode(defaultSettings.mode)
    setFontSize(defaultSettings.fontSize)
    setContrast(defaultSettings.contrast)
    setReducedMotion(defaultSettings.reducedMotion)
  }

  const hideToolbarPermanently = () => {
    setToolbarVisible(false)
    localStorage.setItem("accessibility-toolbar-hidden", "true")
  }

  return (
    <AccessibilityContext.Provider
      value={{
        mode,
        setMode,
        isToolbarVisible,
        setToolbarVisible,
        fontSize,
        setFontSize,
        contrast,
        setContrast,
        reducedMotion,
        setReducedMotion,
        resetSettings,
        hideToolbarPermanently,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (context === undefined) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider")
  }
  return context
} 