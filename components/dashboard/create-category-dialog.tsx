"use client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Save, FolderPlus } from "lucide-react"
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
import { createCategory } from "@/actions/category.actions"
import { useRouter } from "next/navigation"
import { categorySchema } from "@/lib/schema"

type CategoryFormData = z.infer<typeof categorySchema>

export function CreateCategoryDialog() {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
    },
  })

  const onSubmit = async (values: CategoryFormData) => {
    setIsSubmitting(true)
    try {
      const result = await createCategory(values.name)

      if (result.status === 201) {
        toast.success("تم إنشاء الفئة بنجاح", {
          description: "لقد قمت بإنشاء فئة جديدة",
        })
        form.reset()
        setOpen(false)
        router.refresh()
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
      toast.error("حدث خطأ أثناء إنشاء الفئة")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"default"} className="hover:cursor-pointer">
          <FolderPlus className="h-4 w-4" />
          إضافة فئة
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-emerald-700">
            إنشاء فئة جديدة
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
                variant={"default"}
                className="hover:cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    جاري الإنشاء...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    إنشاء الفئة
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
