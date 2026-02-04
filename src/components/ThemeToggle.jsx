import { Moon, Sun } from "lucide-react"
import { useState, useEffect } from "react"

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Verificar el tema actual al montar
    const savedTheme = localStorage.getItem("theme")
    const currentIsDark = savedTheme === "dark" || document.documentElement.classList.contains("dark")
    setIsDark(currentIsDark)
    
    // Asegurar que la clase esté aplicada
    if (currentIsDark) {
      document.documentElement.classList.remove("light")
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
      document.documentElement.classList.add("light")
    }
  }, [])

  const toggleTheme = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)
    
    // Actualizar las clases del HTML
    if (newIsDark) {
      document.documentElement.classList.remove("light")
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      document.documentElement.classList.add("light")
      localStorage.setItem("theme", "light")
    }
    
    console.log("Tema cambiado a:", newIsDark ? "dark" : "light")
  }

  return (
    <button
      onClick={toggleTheme}
      className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-transparent/20 transition-colors"
      aria-label="Toggle theme"
      style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
    >
      {isDark ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  )
}
