import CreateBlog from "@/components/app/create-blog"
import WriteWithUsSection from "@/components/app/write-with-us-section"
import { checkEditor } from "@/lib/auth"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "اكتب معنا",
  description: "هل لديك شغف بالكتابة؟ انضم إلينا وشارك أفكارك ومقالاتك.",
}

const WriteWithUsPage = async () => {
  const editor = await checkEditor()
  return (
    <>
      {editor === null ? (
        <WriteWithUsSection />
      ) : (
        <CreateBlog authorId={editor.id} />
      )}
    </>
  )
}

export default WriteWithUsPage
