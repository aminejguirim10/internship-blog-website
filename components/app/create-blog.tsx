"use client"

import type React from "react"
import { useState, useCallback, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Icons } from "@/components/shared/icons"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { fileTypes } from "@/constants"
import RichTextEditor from "@/components/app/rich-text-editor"
import TagManager from "@/components/app/tag-manager"
import { createBlog } from "@/actions/blog.actions"
import { blogSchema } from "@/lib/schema"

type BlogFormData = z.infer<typeof blogSchema>

export default function CreateBlog({ authorId }: { authorId: string }) {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [resetKey, setResetKey] = useState(0) // Key to force reset of components

  const form = useForm<BlogFormData>({
    //@ts-ignore
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      content: "",
      type: undefined,
      imageUrl: "",
      tags: [],
    },
  })

  const { setValue, getValues, reset } = form

  // Function to reset the form and its state
  const resetForm = () => {
    reset({
      title: "",
      content: "",
      type: undefined,
      imageUrl: "",
      tags: [],
    })

    setImagePreview(null)
    // Increment the reset key to force a re-render of components
    // Force reset of components that depend on the key
    setResetKey((prev) => prev + 1)

    // Clean up the image preview URL if it's a blob
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview)
    }
  }

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

  const handleTagsChange = (tagNames: string[]) => {
    setValue("tags", tagNames)
  }

  const removeImage = () => {
    // Clean up the image preview URL if it's a blob
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview)
    }
    setImagePreview(null)
    setValue("imageUrl", "")
  }

  const onSubmit = async (data: BlogFormData) => {
    setIsSubmitting(true)
    try {
      const response = await createBlog(
        data.title,
        data.content,
        data.type,
        data.imageUrl || "/assets/blog.png",
        data.tags,
        authorId
      )

      if (response.status === 201) {
        toast.success(
          "تم نشر المدونة بنجاح! سيتم الآن مراجعتها من قبل الإدارة لتأكيد النشر."
        )
        resetForm()
      } else {
        toast.error("حدث خطأ أثناء نشر المدونة")
      }
    } catch (error: any) {
      toast.error("حدث خطأ أثناء نشر المدونة")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Cleanup the image preview URL when the component unmounts or when the imagePreview changes
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview])

  // Disable fields when uploading or submitting
  const fieldsDisabled = isUploading || isSubmitting

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 py-10 md:py-16"
      dir="rtl"
    >
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-slate-900">
            إنشاء مدونة جديدة
          </h1>
          <p className="text-xl text-slate-600">شارك أفكارك مع العالم</p>
          {isUploading && (
            <div className="text-primary/60 mt-4 flex items-center justify-center gap-2">
              <Icons.loader2 className="size-4 animate-spin" />
              <span>جاري رفع الصورة... </span>
            </div>
          )}
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit as any)}
            className="space-y-6"
          >
            <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl text-slate-800">
                  معلومات المدونة
                </CardTitle>
                <CardDescription className="md:text-lg">
                  املأ تفاصيل مقالتك
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Title Field */}
                <FormField
                  control={form.control as any}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-slate-700">
                        عنوان المدونة
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="أدخل عنواناً جذاباً..."
                          className="focus:ring-primary focus:border-primary h-12 border-slate-200 text-lg"
                          disabled={fieldsDisabled}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Blog Type Field */}
                <FormField
                  control={form.control as any}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-slate-700">
                        نوع المدونة
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={fieldsDisabled}
                        key={`type-${resetKey}`} // Ajout de la clé pour forcer le reset
                      >
                        <FormControl>
                          <SelectTrigger className="focus:border-primary h-12 border-slate-200">
                            <SelectValue placeholder="اختر نوع المدونة" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="text-start">
                          <SelectItem
                            value="ARTICLE"
                            className="flex justify-end"
                          >
                            مقال 📝
                          </SelectItem>
                          <SelectItem
                            value="RAPPORT"
                            className="flex justify-end"
                          >
                            تقرير 📊
                          </SelectItem>
                          <SelectItem
                            value="RECHERCHE"
                            className="flex justify-end"
                          >
                            بحث 🔬
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Tags Manager */}
                <FormField
                  control={form.control as any}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div
                          className={
                            fieldsDisabled
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                        >
                          <TagManager
                            key={`tags-${resetKey}`}
                            selectedTags={field.value || []}
                            onTagsChange={handleTagsChange}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Image Upload Field with UploadThing */}
                <FormField
                  control={form.control as any}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-slate-700">
                        صورة الغلاف (اختياري)
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
                          } ${isUploading || fieldsDisabled ? "pointer-events-none cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                        >
                          <input
                            {...getInputProps()}
                            disabled={fieldsDisabled}
                          />

                          {imagePreview ? (
                            <div className="space-y-4">
                              <div className="relative inline-block">
                                <img
                                  src={imagePreview}
                                  alt="معاينة"
                                  className="mx-auto max-h-48 rounded-lg object-cover"
                                />
                                {isUploading && (
                                  <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50">
                                    <div className="text-center text-white">
                                      <Icons.loader2 className="mx-auto size-8 animate-spin" />
                                    </div>
                                  </div>
                                )}
                                {!isUploading && !fieldsDisabled && (
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    className="absolute -top-2 -right-2 size-6 rounded-full p-0 hover:cursor-pointer"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      removeImage()
                                    }}
                                  >
                                    <Icons.x className="size-3" />
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
                                  <Icons.loader2 className="text-primary mx-auto size-10 animate-spin" />
                                  <div>
                                    <p className="text-primary/70 font-medium">
                                      جاري رفع الصورة...
                                    </p>
                                    <div className="mx-auto mt-2 h-2 w-48 rounded-full bg-slate-200">
                                      <div className="bg-primary/50 h-2 rounded-full transition-all duration-300" />
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <Icons.imageIcon className="mx-auto size-10 text-slate-400" />
                                  <div>
                                    <p className="text-primary font-medium">
                                      <Icons.upload className="ml-1 inline size-4" />
                                      انقر لرفع صورة أو اسحبها هنا
                                    </p>
                                    <p className="mt-1 text-sm text-slate-500">
                                      ...,PNG, JPG, GIF حتى 16 ميجابايت
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
              </CardContent>
            </Card>

            {/* Content Editor */}
            <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl text-slate-800">
                  محتوى المدونة
                </CardTitle>
                <CardDescription className="md:text-lg">
                  اكتب محتواك باستخدام محررنا المتقدم
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control as any}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-slate-700">
                        المحتوى
                      </FormLabel>
                      <FormControl>
                        <div
                          className={`relative ${fieldsDisabled ? "pointer-events-none opacity-50" : ""}`}
                        >
                          <RichTextEditor
                            key={`editor-${resetKey}`} // Ajout de la clé pour forcer le reset
                            content={field.value}
                            onChange={field.onChange}
                            placeholder="ابدأ في كتابة قصتك..."
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div>
              <Button
                type="submit"
                disabled={fieldsDisabled}
                variant={"default"}
                className="flex h-12 w-full items-center gap-2 hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Icons.loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Icons.save className="h-4 w-4" />
                )}
                {isSubmitting
                  ? "جاري النشر..."
                  : isUploading
                    ? "جاري رفع الصورة..."
                    : "نشر المدونة"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
