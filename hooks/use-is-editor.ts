"use client"
import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"

export function useIsEditor() {
  const { user, isLoaded } = useUser()
  const [isEditor, setIsEditor] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isLoaded) {
      setIsLoading(true)
      return
    }

    if (!user) {
      setIsEditor(false)
      setIsLoading(false)
      return
    }

    const checkEditorRole = async () => {
      try {
        const response = await fetch("/api/user/check-role")

        if (!response.ok) {
          setIsEditor(false)
          setIsLoading(false)
          return
        }

        const data = await response.json()
        setIsEditor(data.isEditor)
      } catch (error) {
        setIsEditor(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkEditorRole()
  }, [user, isLoaded])

  return { isEditor, isLoading }
}
