import CreateBlog from "@/components/app/create-blog"
import WriteWithUsSection from "@/components/app/write-with-us-section"
import { getCategories } from "@/data/get-categories"
import { checkEditor } from "@/lib/auth"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "اكتب معنا",
  description: "هل لديك شغف بالكتابة؟ انضم إلينا وشارك أفكارك ومقالاتك.",
}

const WriteWithUsPage = async () => {
  const editor = await checkEditor()
  if (editor == null) {
    return (
      <>
        <WriteWithUsSection />
      </>
    )
  } else {
    const categories = await getCategories()
    return (
      <>
        <CreateBlog authorId={editor.id} categories={categories} />
      </>
    )
  }
}

export default WriteWithUsPage
