"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem("ecotrack_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // Mock authentication
    const mockUser = {
      id: "1",
      email,
      name: email.split("@")[0],
    }
    localStorage.setItem("ecotrack_user", JSON.stringify(mockUser))
    setUser(mockUser)
    router.push("/dashboard")
  }

  const register = async (email: string, password: string, name: string) => {
    // Mock registration
    const mockUser = {
      id: "1",
      email,
      name,
    }
    localStorage.setItem("ecotrack_user", JSON.stringify(mockUser))
    setUser(mockUser)
    router.push("/dashboard")
  }

  const logout = () => {
    localStorage.removeItem("ecotrack_user")
    setUser(null)
    router.push("/login")
  }

  return <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
