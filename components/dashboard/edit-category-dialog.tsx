"use client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Save, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { toast } from "sonner"
import { updateCategory } from "@/actions/category.actions"
import { categorySchema } from "@/lib/schema"

type CategoryFormData = z.infer<typeof categorySchema>

interface Category {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
  blogs: Array<{
    id: string
    status: string
  }>
}

interface EditCategoryDialogProps {
  category: Category
  onSuccess?: () => void
  trigger: React.ReactNode
}

export function EditCategoryDialog({
  category,
  onSuccess,
  trigger,
}: EditCategoryDialogProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category.name,
    },
  })

  const onSubmit = async (values: CategoryFormData) => {
    setIsSubmitting(true)
    try {
      const result = await updateCategory(category.id, values.name)

      if (result.status === 200) {
        toast.success("لقد قمت بتحديث هذه الفئة")
        form.reset()
        setOpen(false)
        onSuccess?.()
      } else if (result.status === 400) {
        toast.error("فئة بهذا الاسم موجودة بالفعل", {
          description: "يرجى اختيار اسم آخر للفئة",
        })
      } else {
        toast.error("فشل إنشاء الفئة", {
          description: "حدث خطأ أثناء إنشاء الفئة",
        })
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء تحديث الفئة")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-emerald-700">
            تعديل الفئة
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      اسم الفئة *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="أدخل اسم الفئة..."
                        {...field}
                        disabled={isSubmitting}
                        className="h-11 rounded-lg border-gray-200 bg-gray-50/50 transition-all duration-200 focus:border-emerald-500 focus:bg-white focus:shadow-sm"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
                className="border-gray-200 px-6 py-2 text-gray-600 hover:cursor-pointer hover:bg-gray-50"
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="hover:cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    جارٍ التحديث...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    حفظ التغييرات
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
