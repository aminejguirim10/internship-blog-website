"use client"

import { Input } from "@/components/ui/input"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect, useCallback, useRef } from "react"

export default function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const [value, setValue] = useState(searchParams.get("title") || "")

  // Sync value with URL params when URL changes
  useEffect(() => {
    const urlTitle = searchParams.get("title") || ""
    setValue(urlTitle)
  }, [searchParams])

  // Centralized URL update function
  const updateURL = useCallback(
    (title: string) => {
      const params = new URLSearchParams(searchParams)

      if (title.trim()) {
        params.set("title", title)
      } else {
        params.delete("title")
      }

      // Reset to page 1 when searching
      params.set("page", "1")

      router.replace(`?${params.toString()}`)
    },
    [searchParams, router]
  )

  // Handle input change with debouncing
  const handleInputChange = useCallback(
    (inputValue: string) => {
      setValue(inputValue)

      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        updateURL(inputValue)
      }, 400)
    },
    [updateURL]
  )

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="mb-6 md:w-1/2">
      <Input
        type="text"
        placeholder="...بحث"
        value={value}
        onChange={(e) => handleInputChange(e.target.value)}
      />
    </div>
  )
}
