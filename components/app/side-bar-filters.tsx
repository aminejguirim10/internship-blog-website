"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect, useCallback, useRef } from "react"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarIcon } from "lucide-react"
import { Category } from "@prisma/client"

export default function SidebarFilters({
  hasCategories,
  categories,
  isBlog,
}: {
  hasCategories: boolean
  categories?: Category[]
  isBlog: boolean
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const authorTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const formatDateToLocal = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const parseDateFromLocal = (dateString: string): Date => {
    const [year, month, day] = dateString.split("-").map(Number)
    return new Date(year, month - 1, day)
  }

  // Initialize states from URL params
  const [selectedType, setSelectedType] = useState(
    searchParams.get("categoryId") || null
  )
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    searchParams.get("date")
      ? parseDateFromLocal(searchParams.get("date")!)
      : undefined
  )
  const [authorInput, setAuthorInput] = useState(
    searchParams.get("author") || ""
  )

  // Centralized URL update function
  const updateURL = useCallback(
    (updates: Record<string, string | undefined>, resetPage = true) => {
      const params = new URLSearchParams(searchParams)

      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value)
        } else {
          params.delete(key)
        }
      })

      if (resetPage) {
        params.set("page", "1")
      }

      router.replace(`?${params.toString()}`)
    },
    [searchParams, router]
  )

  // Sync states with URL params when URL changes
  useEffect(() => {
    const urlCategoryId = searchParams.get("categoryId")
    const urlDate = searchParams.get("date")
    const urlAuthor = searchParams.get("author") || ""

    setSelectedType(urlCategoryId)
    setSelectedDate(urlDate ? parseDateFromLocal(urlDate) : undefined)
    setAuthorInput(urlAuthor)
  }, [searchParams])

  // Handle category change
  const handleCategoryChange = useCallback(
    (categoryId: string | null) => {
      setSelectedType(categoryId)
      updateURL({ categoryId: categoryId || undefined })
    },
    [updateURL]
  )

  // Handle date change
  const handleDateChange = useCallback(
    (date: Date | undefined) => {
      setSelectedDate(date)
      updateURL({ date: date ? formatDateToLocal(date) : undefined })
    },
    [updateURL]
  )

  // Handle author input change with debouncing
  const handleAuthorChange = useCallback(
    (value: string) => {
      setAuthorInput(value)

      // Clear existing timeout
      if (authorTimeoutRef.current) {
        clearTimeout(authorTimeoutRef.current)
      }

      // Set new timeout
      authorTimeoutRef.current = setTimeout(() => {
        updateURL({ author: value.trim() || undefined })
      }, 400)
    },
    [updateURL]
  )

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (authorTimeoutRef.current) {
        clearTimeout(authorTimeoutRef.current)
      }
    }
  }, [])

  return (
    <aside className="h-fit w-96 p-4 max-lg:mr-4 lg:w-[160px] lg:border-r lg:border-r-gray-200 xl:w-64">
      {hasCategories && (
        <>
          <div className="mb-6">
            <div className="mb-2 font-bold">فئة :</div>
            {categories?.length === 0 ? (
              <div className="text-muted-foreground text-sm">
                لا توجد فئات متاحة
              </div>
            ) : (
              categories?.map((category) => (
                <div key={category.id} className="mb-2 flex items-center">
                  <Checkbox
                    checked={selectedType === category.id}
                    onCheckedChange={(checked) => {
                      const newCategoryId = checked ? category.id : null
                      handleCategoryChange(newCategoryId)
                    }}
                  />
                  <span className="mr-2">{category.name}</span>
                </div>
              ))
            )}
          </div>
          <div className="mb-4 border border-gray-200" />
        </>
      )}

      <div className="mb-6">
        <div className="mb-2 font-bold">تاريخ :</div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between font-normal"
            >
              {selectedDate
                ? `${String(selectedDate.getDate()).padStart(2, "0")}/${String(selectedDate.getMonth() + 1).padStart(2, "0")}/${selectedDate.getFullYear()}`
                : "اختر التاريخ"}
              <CalendarIcon className="ml-2 h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {isBlog && (
        <>
          <div className="mb-4 border border-gray-200" />
          <div>
            <div className="mb-2 font-bold">كاتب :</div>
            <Input
              type="text"
              placeholder="اسم الكاتب"
              value={authorInput}
              onChange={(e) => handleAuthorChange(e.target.value)}
            />
          </div>
        </>
      )}
    </aside>
  )
}
