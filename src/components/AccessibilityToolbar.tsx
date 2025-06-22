import { useAccessibility } from "@/contexts/AccessibilityContext"
import { Button } from "@/components/ui/button"
import {
  Eye,
  Brain,
  Zap,
  Focus,
  EyeOff,
  RotateCcw,
  X,
  SunMedium,
  Plus,
  Minus,
  ToggleLeft,
  ToggleRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

export function AccessibilityToolbar() {
  const {
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
  } = useAccessibility()

  if (!isToolbarVisible) return null

  return (
    <div className="fixed right-4 top-20 z-50 w-72 bg-white dark:bg-gray-900 shadow-lg rounded-lg border border-gray-200">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Accessibility Settings</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setToolbarVisible(false)}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close accessibility settings"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-4">
          {/* Accessibility Modes */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Display Mode</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={mode === "epilepsy" ? "default" : "outline"}
                onClick={() => setMode(mode === "epilepsy" ? "default" : "epilepsy")}
                className="flex items-center gap-2"
                aria-pressed={mode === "epilepsy"}
              >
                <Zap className="h-4 w-4" />
                <span>Epilepsy Safe</span>
              </Button>

              <Button
                variant={mode === "visual" ? "default" : "outline"}
                onClick={() => setMode(mode === "visual" ? "default" : "visual")}
                className="flex items-center gap-2"
                aria-pressed={mode === "visual"}
              >
                <Eye className="h-4 w-4" />
                <span>Visual</span>
              </Button>

              <Button
                variant={mode === "cognitive" ? "default" : "outline"}
                onClick={() => setMode(mode === "cognitive" ? "default" : "cognitive")}
                className="flex items-center gap-2"
                aria-pressed={mode === "cognitive"}
              >
                <Brain className="h-4 w-4" />
                <span>Cognitive</span>
              </Button>

              <Button
                variant={mode === "adhd" ? "default" : "outline"}
                onClick={() => setMode(mode === "adhd" ? "default" : "adhd")}
                className="flex items-center gap-2"
                aria-pressed={mode === "adhd"}
              >
                <Focus className="h-4 w-4" />
                <span>ADHD</span>
              </Button>

              <Button
                variant={mode === "blind" ? "default" : "outline"}
                onClick={() => setMode(mode === "blind" ? "default" : "blind")}
                className="flex items-center gap-2"
                aria-pressed={mode === "blind"}
              >
                <EyeOff className="h-4 w-4" />
                <span>Blindness</span>
              </Button>
            </div>
          </div>

          {/* Font Size Controls */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Font Size</h3>
            <div className="flex items-center justify-between gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFontSize(Math.max(12, fontSize - 1))}
                aria-label="Decrease font size"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="min-w-[3ch] text-center font-mono">{fontSize}px</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFontSize(Math.min(24, fontSize + 1))}
                aria-label="Increase font size"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Contrast Controls */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Contrast</h3>
            <div className="flex items-center justify-between gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setContrast(Math.max(75, contrast - 5))}
                aria-label="Decrease contrast"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="min-w-[4ch] text-center font-mono">{contrast}%</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setContrast(Math.min(150, contrast + 5))}
                aria-label="Increase contrast"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Reduced Motion Toggle */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Reduce Motion</h3>
            <Button
              variant={reducedMotion ? "default" : "outline"}
              size="sm"
              onClick={() => setReducedMotion(!reducedMotion)}
              className="flex items-center gap-2"
              aria-pressed={reducedMotion}
            >
              {reducedMotion ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
              <span>{reducedMotion ? "On" : "Off"}</span>
            </Button>
          </div>

          {/* Reset Button */}
          <Button
            variant="outline"
            className="w-full mt-4 flex items-center justify-center gap-2"
            onClick={resetSettings}
          >
            <RotateCcw className="h-4 w-4" />
            Reset Settings
          </Button>
        </div>
      </div>
    </div>
  )
} 