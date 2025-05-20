"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export default function Component() {
  const { theme, setTheme } = useTheme()

  const smartToggle = () => {
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches
    if (theme === "system") {
      setTheme(prefersDarkScheme ? "light" : "dark")
    } else if (
      (theme === "light" && !prefersDarkScheme) ||
      (theme === "dark" && prefersDarkScheme)
    ) {
      setTheme(theme === "light" ? "dark" : "light")
    } else {
      setTheme("system")
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-8 cursor-pointer [&_svg]:!size-5"
      onClick={smartToggle}
      aria-label="Switch between system/light/dark version"
    >
      <Sun className="dark:hidden" aria-hidden="true" />
      <Moon className="hidden dark:block" aria-hidden="true" />
    </Button>
  )
}
