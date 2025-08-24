"use client"

import { Input } from "@/components/ui/input"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"

export default function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(searchParams.get("title") || "")
  const [lastCategoryId, setLastCategoryId] = useState(
    searchParams.get("categoryId")
  )

  // Synchronize only when the category changes or on initial load
  useEffect(() => {
    const currentCategoryId = searchParams.get("categoryId")
    const currentTitle = searchParams.get("title") || ""

    // If it's the first render or the category has changed
    if (lastCategoryId === null || currentCategoryId !== lastCategoryId) {
      setValue(currentTitle)
      setLastCategoryId(currentCategoryId)
    }
    // Otherwise, do not modify the value if the user is typing
  }, [searchParams.get("categoryId"), lastCategoryId]) // Seulement surveiller categoryId

  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams)
      if (value.trim()) {
        params.set("title", value)
      } else {
        params.delete("title")
      }
      params.set("page", "1")
      router.replace(`?${params.toString()}`)
    }, 400)
    return () => clearTimeout(handler)
  }, [value, searchParams, router])

  return (
    <div className="mb-6 md:w-1/2">
      <Input
        type="text"
        placeholder="...بحث"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  )
}
