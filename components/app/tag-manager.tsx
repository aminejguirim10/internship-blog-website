"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { toast } from "sonner"
import { Icons } from "@/components/shared/icons"

interface TagData {
  id: string
  name: string
}

interface TagManagerProps {
  selectedTags: string[]
  onTagsChange: (tagNames: string[]) => void
}

export default function TagManager({
  selectedTags,
  onTagsChange,
}: TagManagerProps) {
  const [availableTags, setAvailableTags] = useState<TagData[]>([])
  const [newTagName, setNewTagName] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [isManageDialogOpen, setIsManageDialogOpen] = useState(false)

  const createNewTag = async () => {
    const trimmedName = newTagName.trim()
    if (!trimmedName) return

    // Check for duplicate tag names
    const isDuplicate = availableTags.some(
      (tag) => tag.name.trim().toLowerCase() === trimmedName.toLowerCase()
    )
    if (isDuplicate) {
      toast.error("اسم العلامة موجود بالفعل")
      return
    }

    setIsCreating(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const newTag: TagData = {
        id: Date.now().toString(),
        name: trimmedName,
      }

      setAvailableTags((prev) => [...prev, newTag])
      // Select the new tag automatically
      onTagsChange([...selectedTags, trimmedName])
      setNewTagName("")

      toast.success("تم إنشاء العلامة بنجاح")
    } catch (error) {
      console.error("خطأ في إنشاء العلامة:", error)
      toast.error("فشل في إنشاء العلامة")
    } finally {
      setIsCreating(false)
    }
  }

  const deleteTag = async (tagId: string) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const tagToDelete = availableTags.find((tag) => tag.id === tagId)
      setAvailableTags((prev) => prev.filter((tag) => tag.id !== tagId))

      // If the deleted tag was selected, remove it from selectedTags
      if (tagToDelete && selectedTags.includes(tagToDelete.name)) {
        onTagsChange(selectedTags.filter((name) => name !== tagToDelete.name))
      }

      toast.success(`تم حذف العلامة "${tagToDelete?.name}" بنجاح`)
    } catch (error) {
      console.error("خطأ في حذف العلامة:", error)
      toast.error("فشل في حذف العلامة")
    }
  }

  const toggleTagSelection = (tagName: string) => {
    if (selectedTags.includes(tagName)) {
      onTagsChange(selectedTags.filter((name) => name !== tagName))
    } else {
      onTagsChange([...selectedTags, tagName])
    }
  }

  const getSelectedTagsData = () => {
    return availableTags.filter((tag) => selectedTags.includes(tag.name))
  }

  // Function to check if a tag is selected
  const isTagSelected = (tagName: string) => {
    return selectedTags.includes(tagName)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold text-slate-700">
          العلامات (اختياري)
        </Label>
        <Dialog open={isManageDialogOpen} onOpenChange={setIsManageDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 hover:cursor-pointer"
            >
              <Icons.settings className="ml-1 size-4" />
              إدارة العلامات
            </Button>
          </DialogTrigger>
          <DialogContent
            className="max-h-[80vh] max-w-2xl overflow-y-auto"
            dir="rtl"
          >
            <DialogHeader>
              <DialogTitle>إدارة العلامات</DialogTitle>
              <DialogDescription>
                أنشئ علامات جديدة أو احذف العلامات الموجودة
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Create a new tag */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">إنشاء علامة جديدة</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <Input
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                        placeholder="اسم العلامة الجديدة..."
                        className="h-10"
                        onKeyPress={(e) => e.key === "Enter" && createNewTag()}
                      />
                    </div>

                    <Button
                      onClick={createNewTag}
                      disabled={
                        !newTagName.trim() ||
                        isCreating ||
                        availableTags.some(
                          (tag) =>
                            tag.name.trim().toLowerCase() ===
                            newTagName.trim().toLowerCase()
                        )
                      }
                      className="h-10"
                    >
                      {isCreating ? (
                        <div className="size-4 animate-spin rounded-full border-b-2 border-white"></div>
                      ) : (
                        <Icons.plus className="size-4" />
                      )}
                    </Button>
                  </div>

                  {/* New tag preview */}
                  {newTagName.trim() && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-600">معاينة:</span>
                      <Badge className={"bg-primary border px-3 py-1"}>
                        <Icons.tag className="ml-1 size-3" />
                        {newTagName.trim()}
                      </Badge>
                      {availableTags.some(
                        (tag) =>
                          tag.name.trim().toLowerCase() ===
                          newTagName.trim().toLowerCase()
                      ) && (
                        <span className="text-xs text-red-500">
                          اسم العلامة موجود بالفعل
                        </span>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* List of available tags */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">
                    العلامات الموجودة ({availableTags.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid max-h-60 grid-cols-1 gap-3 overflow-y-auto">
                    {availableTags.map((tag) => (
                      <div
                        key={tag.id}
                        className="flex items-center justify-between rounded-lg border border-slate-200 p-3 hover:bg-slate-50"
                      >
                        <div className="flex items-center gap-3">
                          <Badge className={`bg-primary border px-3 py-1`}>
                            <Icons.tag className="ml-1 size-3" />
                            {tag.name}
                          </Badge>
                        </div>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:cursor-pointer hover:bg-red-50 hover:text-red-700"
                            >
                              <Icons.trash2 className="size-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent dir="rtl">
                            <AlertDialogHeader>
                              <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                              <AlertDialogDescription>
                                هل أنت متأكد من حذف العلامة "{tag.name}"؟ هذا
                                الإجراء لا يمكن التراجع عنه.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>إلغاء</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteTag(tag.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                حذف
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Available tags */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:grid-cols-3 md:grid-cols-4">
          {availableTags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => toggleTagSelection(tag.name)}
              className={`relative rounded-lg border-2 p-2 transition-all duration-200 ${
                isTagSelected(tag.name)
                  ? "border-teal-600 bg-blue-50 shadow-sm"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <Badge
                className={`bg-primary w-full justify-center border px-2 py-1 text-xs`}
              >
                <Icons.tag className="ml-1 size-3" />
                {tag.name}
              </Badge>

              {isTagSelected(tag.name) && (
                <div className="absolute -top-1 -right-1.5 rounded-full bg-teal-700 p-0.5 text-white">
                  <Icons.check className="size-3" />
                </div>
              )}
            </button>
          ))}
        </div>

        {availableTags.length === 0 && (
          <div className="py-4 text-center text-slate-500">
            <Icons.tag className="mx-auto mb-2 size-5 opacity-50 md:size-6" />
            <p>لا توجد علامات بعد</p>
            <p className="text-sm">ابدأ بإنشاء أول علامة لك!</p>
          </div>
        )}
      </div>
    </div>
  )
}
