"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
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

  const formatDateToLocal = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  // Function to parse a date from a local string
  const parseDateFromLocal = (dateString: string): Date => {
    const [year, month, day] = dateString.split("-").map(Number)
    return new Date(year, month - 1, day) // month - 1 because months are zero-based
  }

  const [selectedType, setSelectedType] = useState(
    searchParams.get("categoryId")
  )
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    searchParams.get("date")
      ? parseDateFromLocal(searchParams.get("date")!)
      : undefined
  )
  const [authorInput, setAuthorInput] = useState(
    searchParams.get("author") || ""
  )
  const [lastCategoryId, setLastCategoryId] = useState(
    searchParams.get("categoryId")
  )

  // Synchronize states only when the category changes or on initial load
  useEffect(() => {
    const currentCategoryId = searchParams.get("categoryId")

    // If it's the first render or the category has changed
    if (lastCategoryId === null || currentCategoryId !== lastCategoryId) {
      // Reset all filters when the category changes
      setSelectedType(currentCategoryId)
      setSelectedDate(
        searchParams.get("date")
          ? parseDateFromLocal(searchParams.get("date")!)
          : undefined
      )
      const newAuthor = searchParams.get("author") || ""
      setAuthorInput(newAuthor)
      setLastCategoryId(currentCategoryId)
    }
  }, [searchParams.get("categoryId"), lastCategoryId])

  // Debounce author input
  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams)
      if (authorInput.trim()) {
        params.set("author", authorInput)
      } else {
        params.delete("author")
      }
      params.set("page", "1")
      router.replace(`?${params.toString()}`)
    }, 400)
    return () => clearTimeout(handler)
  }, [authorInput, searchParams, router])

  // Update URL params on filter change
  const updateParams = (key: string, value: string | undefined) => {
    const params = new URLSearchParams(searchParams)
    if (value) params.set(key, value)
    else params.delete(key)
    params.set("page", "1")
    router.replace(`?${params.toString()}`)
  }

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
                      const newCategoryId = checked ? category.id : undefined
                      setSelectedType(newCategoryId || null)
                      updateParams("categoryId", newCategoryId)
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
              onSelect={(date) => {
                setSelectedDate(date)
                updateParams("date", date ? formatDateToLocal(date) : undefined)
              }}
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
              onChange={(e) => setAuthorInput(e.target.value)}
            />
          </div>
        </>
      )}
    </aside>
  )
}
