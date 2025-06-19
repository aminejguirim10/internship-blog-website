"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User } from "@prisma/client"
import { useDropzone } from "@uploadthing/react"
import { useUploadThing } from "@/lib/uploadthing"
import { useCallback, useState, useEffect } from "react"
import { toast } from "sonner"
import Image from "next/image"
import { fileTypes } from "@/constants"
import { getFallback } from "@/lib/utils"
import { updatePhoto } from "@/actions/user.actions"

const ProfileImage = ({ user }: { user: User }) => {
  const [loading, setLoading] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [urls, setUrls] = useState<string[]>([])
  const [preview, setPreview] = useState<string>("")
  const [urlsUpdated, setUrlsUpdated] = useState(false)

  const { startUpload } = useUploadThing("imageUploader", {
    onClientUploadComplete: async (res) => {
      setUrls(res.map((file) => file.url))
      setUrlsUpdated(true)
    },
    onUploadError: () => {
      setLoading(false)
      toast.error("حدث خطأ أثناء الرفع. يرجى المحاولة مرة أخرى.")
    },
    onUploadBegin: () => {
      setLoading(true)
    },
  })

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return
      const previewUrl = URL.createObjectURL(file)
      setPreview(previewUrl)
      setFiles([file])
      startUpload([file])
    },
    [startUpload]
  )

  useEffect(() => {
    if (urlsUpdated) {
      const UpdateUserImage = async () => {
        const response = await updatePhoto(urls[0] || user.image || "")
        if (response.status === 200) {
          setFiles([])
          setUrls([])
          setPreview("")
          setLoading(false)
          toast.success("تم تحديث الصورة بنجاح!")
        } else {
          setLoading(false)
          toast.error("حدث خطأ أثناء تحديث الصورة. يرجى المحاولة مرة أخرى.")
        }
        setUrlsUpdated(false)
      }
      UpdateUserImage()
    }
  }, [urlsUpdated, urls])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: fileTypes,
    maxFiles: 1,
    multiple: false,
  })

  return (
    <div className="relative flex flex-col justify-center px-4 py-8 sm:px-6 md:py-10 lg:px-8">
      <div className="relative">
        <div className="relative h-[250px] w-full md:h-[350px]">
          <Image
            src={"/assets/profile.jpg"}
            alt="image"
            width={2664}
            height={2000}
            className="h-full w-full rounded-lg object-cover shadow-lg"
          />
          <Image
            src={"/assets/gradient.png"}
            alt="gradient"
            width={1332}
            height={316}
            className="pointer-events-none absolute top-0 left-0 z-10 h-full w-full rounded-lg object-cover opacity-75"
          />
        </div>
        <Avatar
          className="border-primary absolute bottom-[-45px] left-1/2 z-20 size-24 -translate-x-1/2 cursor-pointer border shadow-2xl md:bottom-[-75px] md:left-32 md:size-40 md:translate-x-0"
          {...getRootProps()}
        >
          <AvatarImage src={preview || user?.image || ""} />
          <AvatarFallback>{getFallback(user.name)}</AvatarFallback>
          <input {...getInputProps()} disabled={loading} />
        </Avatar>
      </div>
    </div>
  )
}

export default ProfileImage
