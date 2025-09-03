import { JSDOM } from "jsdom"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

export function cleanHtmlContent(htmlContent: string): string {
  try {
    // Create a virtual DOM
    const dom = new JSDOM(htmlContent)
    const document = dom.window.document

    // Extract text without HTML tags
    const textContent = document.body
      ? document.body.textContent || ""
      : htmlContent

    // Clean up extra spaces and line breaks
    return textContent
      .replace(/\s+/g, " ") // Replace multiple spaces with a single space
      .replace(/\n+/g, " ") // Replace line breaks with spaces
      .trim()
  } catch (error) {
    // If HTML parsing fails, return the content as is
    return htmlContent.replace(/<[^>]*>/g, "").trim()
  }
}

export async function generateAISummary(
  content: string,
  type: "blog" | "event" = "blog"
): Promise<string> {
  try {
    // Clean the content if it contains HTML
    const cleanContent = type === "blog" ? cleanHtmlContent(content) : content

    // Limit the length of the content to avoid errors
    const truncatedContent =
      cleanContent.length > 2000
        ? cleanContent.substring(0, 2000) + "..."
        : cleanContent

    const prompt =
      type === "blog"
        ? `أنت خبير في تلخيص المقالات. قم بإنشاء ملخص مفيد وموجز باللغة العربية للمقال التالي. 
         يجب أن يكون الملخص مفهوماً ويحتوي على النقاط الرئيسية دون تفاصيل مفرطة.
         المقال: ${truncatedContent}`
        : `أنت خبير في تلخيص الأحداث. قم بإنشاء ملخص مفيد وموجز باللغة العربية للحدث التالي.
         يجب أن يكون الملخص يوضح ما هو الحدث وما الفائدة منه.
         الحدث: ${truncatedContent}`

    const result = await generateText({
      model: groq("meta-llama/llama-4-scout-17b-16e-instruct"),
      prompt,
      maxOutputTokens: 400, // for summary
    })

    return (
      result.text ||
      (type === "blog"
        ? "لا يمكن إنشاء ملخص للمقال حالياً"
        : "لا يمكن إنشاء ملخص للحدث حالياً")
    )
  } catch (error) {
    console.error("خطأ في إنشاء الملخص:", error)
    const cleanContent = type === "blog" ? cleanHtmlContent(content) : content
    return cleanContent.length > 150
      ? cleanContent.substring(0, 150) + "..."
      : cleanContent
  }
}
