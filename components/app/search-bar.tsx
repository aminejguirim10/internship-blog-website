"use client"

import { Input } from "@/components/ui/input"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"

export default function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(searchParams.get("title") || "")

  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams)
      if (value) params.set("title", value)
      else params.delete("title")
      router.replace(`?${params.toString()}`)
    }, 400)
    return () => clearTimeout(handler)
  }, [value])

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
