"use client"
import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"

export function useIsEditor() {
  const { user, isLoaded } = useUser()
  const [isEditor, setIsEditor] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isLoaded) {
      setIsLoading(true)
      return
    }

    if (!user) {
      setIsEditor(false)
      setIsAdmin(false)
      setIsLoading(false)
      return
    }

    const checkEditorRole = async () => {
      try {
        const response = await fetch("/api/user/check-role")

        if (!response.ok) {
          setIsEditor(false)
          setIsAdmin(false)
          setIsLoading(false)
          return
        }

        const data = await response.json()
        setIsEditor(data.isEditor)
        setIsAdmin(data.isAdmin)
      } catch (error) {
        setIsEditor(false)
        setIsAdmin(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkEditorRole()
  }, [user, isLoaded])

  return { isEditor, isAdmin, isLoading }
}
