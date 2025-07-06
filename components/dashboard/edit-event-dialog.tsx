"use client"

import type * as React from "react"
import { useState, useCallback, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Edit, Upload, X, Loader2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { toast } from "sonner"
import { useDropzone } from "@uploadthing/react"
import { useUploadThing } from "@/lib/uploadthing"
import { updateEvent } from "@/actions/event.actions"
import { fileTypes } from "@/constants"

const eventSchema = z.object({
  title: z.string().min(1, "عنوان الحدث مطلوب"),
  description: z.string().min(1, "وصف الحدث مطلوب"),
  date: z.string().min(1, "تاريخ الحدث مطلوب"),
  hour: z.string().min(1, "وقت الحدث مطلوب"),
  link: z.string().url("يجب أن يكون الرابط صحيحاً"),
  imageUrl: z.string().optional(),
})

type EventFormData = z.infer<typeof eventSchema>

interface Event {
  id: string
  date: Date
  title: string
  description: string
  image: string | null
  link: string
  hour: string
  createdAt: Date
  updatedAt: Date
}

interface EditEventDialogProps {
  event: Event
  trigger?: React.ReactNode
  onSuccess?: () => void
}

export function EditEventDialog({
  event,
  trigger,
  onSuccess,
}: EditEventDialogProps) {
  const [open, setOpen] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(event.image)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: event.title,
      description: event.description,
      date: new Date(event.date).toISOString().split("T")[0],
      hour: event.hour,
      link: event.link,
      imageUrl: event.image || "",
    },
  })

  const { setValue } = form

  // Configuration UploadThing
  const { startUpload } = useUploadThing("imageUploader", {
    onClientUploadComplete: async (res) => {
      const uploadedUrl = res[0]?.url
      if (uploadedUrl) {
        setValue("imageUrl", uploadedUrl)
        setImagePreview(uploadedUrl)
        toast.success("تم رفع الصورة بنجاح!")
      }
      setIsUploading(false)
    },
    onUploadError: (error) => {
      setIsUploading(false)
      toast.error("حدث خطأ أثناء رفع الصورة. يرجى المحاولة مرة أخرى.")
    },
    onUploadBegin: () => {
      setIsUploading(true)
    },
  })

  // Function to handle file drop
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return

      // Clean up the previous image preview URL if it's a blob
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview)
      }

      // Create a new preview URL for the dropped file
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)

      // Start the upload process
      startUpload([file])
    },
    [startUpload, imagePreview]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: fileTypes,
    maxFiles: 1,
    multiple: false,
    disabled: isUploading,
  })

  const removeImage = () => {
    // Clean up the image preview URL if it's a blob
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview)
    }
    setImagePreview(null)
    setValue("imageUrl", "")
  }

  const onSubmit = async (data: EventFormData) => {
    setIsSubmitting(true)
    try {
      // Convert date string to Date object
      const eventDate = new Date(data.date)

      const response = await updateEvent(
        event.id,
        data.title,
        data.description,
        data.imageUrl || "",
        eventDate,
        data.link,
        data.hour
      )

      if (response.status === 200) {
        toast.success("تم تحديث الحدث بنجاح!")
        setOpen(false)
        onSuccess?.() // Appeler le callback pour fermer tous les dialogs
      } else {
        toast.error("حدث خطأ أثناء تحديث الحدث")
      }
    } catch (error: any) {
      toast.error("حدث خطأ أثناء تحديث الحدث")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Cleanup the image preview URL when the component unmounts
  useEffect(() => {
    return () => {
      if (
        imagePreview &&
        imagePreview.startsWith("blob:") &&
        imagePreview !== event.image
      ) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview, event.image])

  // Disable fields when uploading or submitting
  const fieldsDisabled = isUploading || isSubmitting

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="outline"
            size="sm"
            className="border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 transition-all duration-200 hover:scale-[1.02] hover:from-blue-100 hover:to-blue-200 hover:shadow-md"
          >
            <Edit className="ml-2 h-4 w-4" />
            تعديل
          </Button>
        )}
      </DialogTrigger>
      <DialogContent
        className="max-h-[90vh] max-w-2xl overflow-y-auto"
        dir="rtl"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold text-slate-900">
            <div className="rounded-lg bg-blue-100 p-2">
              <Edit className="h-6 w-6 text-blue-600" />
            </div>
            تعديل الحدث
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 py-4"
          >
            {/* Title Field */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-slate-700">
                    عنوان الحدث
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="أدخل عنوان الحدث..."
                      className="focus:ring-primary focus:border-primary h-12 border-slate-200"
                      disabled={fieldsDisabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-slate-700">
                    وصف الحدث
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="أدخل وصف الحدث..."
                      className="focus:ring-primary focus:border-primary min-h-[100px] border-slate-200"
                      disabled={fieldsDisabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date and Time Fields */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-slate-700">
                      تاريخ الحدث
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="date"
                        className="focus:ring-primary focus:border-primary h-12 border-slate-200"
                        disabled={fieldsDisabled}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hour"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-slate-700">
                      وقت الحدث
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="مثال: 14:30"
                        className="focus:ring-primary focus:border-primary h-12 border-slate-200"
                        disabled={fieldsDisabled}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Link Field */}
            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-slate-700">
                    رابط الحدث
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="url"
                      placeholder="https://example.com"
                      className="focus:ring-primary focus:border-primary h-12 border-slate-200"
                      disabled={fieldsDisabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image Upload Field */}
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-slate-700">
                    صورة الحدث (اختياري)
                  </FormLabel>
                  <FormControl>
                    <div
                      {...getRootProps()}
                      className={`relative rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
                        isDragActive
                          ? "border-primary bg-primary/10"
                          : isUploading
                            ? "border-primary/40 bg-primary/5"
                            : "hover:border-primary/80 border-slate-300"
                      } ${isUploading ? "cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      <input {...getInputProps()} />

                      {imagePreview ? (
                        <div className="space-y-4">
                          <div className="relative inline-block">
                            <img
                              src={imagePreview || "/assets/event.png"}
                              alt="معاينة"
                              className="mx-auto max-h-32 rounded-lg object-cover"
                            />
                            {isUploading && (
                              <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50">
                                <div className="text-center text-white">
                                  <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                                </div>
                              </div>
                            )}
                            {!isUploading && (
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  removeImage()
                                }}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                          {!isUploading && (
                            <p className="text-slate-600">
                              انقر أو اسحب صورة جديدة لتغييرها
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {isUploading ? (
                            <>
                              <Loader2 className="text-primary mx-auto h-8 w-8 animate-spin" />
                              <p className="text-primary/70 font-medium">
                                جاري رفع الصورة...
                              </p>
                            </>
                          ) : (
                            <>
                              <Upload className="mx-auto h-8 w-8 text-slate-400" />
                              <div>
                                <p className="text-primary font-medium">
                                  انقر لرفع صورة أو اسحبها هنا
                                </p>
                                <p className="mt-1 text-sm text-slate-500">
                                  PNG, JPG, GIF حتى 16 ميجابايت
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={fieldsDisabled}
                className="flex-1 hover:cursor-pointer"
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                disabled={fieldsDisabled}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:cursor-pointer hover:from-blue-700 hover:to-blue-800"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    جاري التحديث...
                  </>
                ) : (
                  <>
                    <Save className="ml-2 h-4 w-4" />
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
