"use client"
import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"

interface UserData {
  id: string
  role: "USER" | "EDITOR" | "ADMIN"
  email: string
  name: string | null
}

interface UseAdminCheckReturn {
  isAdmin: boolean
  isLoading: boolean
  userData: UserData | null
  error: string | null
}

export function useAdminCheck(): UseAdminCheckReturn {
  const { isSignedIn, isLoaded } = useUser()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!isLoaded) {
        setIsLoading(true)
        return
      }

      if (!isSignedIn) {
        setIsAdmin(false)
        setIsLoading(false)
        setUserData(null)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch("/api/user/admin")

        const data = await response.json()

        if (data.user) {
          setUserData(data.user)
          setIsAdmin(data.user.role === "ADMIN")
        } else {
          setIsAdmin(false)
          setUserData(null)
        }
      } catch (err) {
        setIsAdmin(false)
        setUserData(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAdminStatus()
  }, [isSignedIn, isLoaded])

  return {
    isAdmin,
    isLoading,
    userData,
    error,
  }
}
