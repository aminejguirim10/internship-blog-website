import CreateBlog from "@/components/app/create-blog"
import WriteWithUsSection from "@/components/app/write-with-us-section"
import { checkEditor } from "@/lib/auth"
import { redirect } from "next/navigation"

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
