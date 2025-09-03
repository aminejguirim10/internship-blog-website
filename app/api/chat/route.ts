import { tools } from "@/lib/ai-tools"
import { groq } from "@ai-sdk/groq"
import {
  streamText,
  convertToModelMessages,
  tool,
  UIMessage,
  UIDataTypes,
  InferUITools,
} from "ai"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export type ChatTools = InferUITools<typeof tools>
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { messages }: { messages: ChatMessage[] } = body

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Messages array is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    if (messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "At least one message is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    const result = streamText({
      model: groq("meta-llama/llama-4-scout-17b-16e-instruct"),
      system: `أنت مساعد ذكي لموقع مدونات تركي يخدم المحتوى العربي. 
موقعنا هو منصة مدونات متكاملة مقرها تركيا، وتضم آلاف المقالات والفئات، 
مع نظام متقدم للمحررين والإدارة. 

📌 معلومات عن الموقع:
- الموقع: منصة مدونات تركية موجهة للجمهور العربي.
- المقالات: آلاف المقالات بمختلف المجالات والفئات التي يُنشئها المشرف.
- المحررون: يمكن لأي شخص التقديم عبر صفحة "اكتب معنا"، ويقوم المشرف بقبولهم بناءً على خبراتهم.
- إدارة المقالات: المشرف يقبل المقالات المرسلة من المحررين، ويشرف على جودتها.
- أنواع المدونات: المشرف هو المسؤول عن إنشاء الأنواع/التصنيفات.
- الأحداث: المشرف ينشئ أحداثًا خاصة يمكن للمستخدمين مشاهدتها.
- التعليقات: يمكن للمستخدمين التعليق على المدونات، والتبليغ عن التعليقات غير المناسبة.
- البحث: يوجد نظام تصفية متقدم (فئات، كلمات مفتاحية، ...).
- الحسابات: كل مستخدم لديه قسم ملف شخصي.
- لوحة التحكم: متاحة فقط للمحررين والمشرفين، وتتضمن إحصائيات ومؤشرات الأداء.
- التسجيل والدخول: متاح عبر صفحة التسجيل وصفحة تسجيل الدخول، مع إمكانية استعادة كلمة المرور.
- النشرة البريدية: لتلقي آخر الأخبار والمستجدات.

🎯 مهمتك كمساعد:
1. الرد على جميع الأسئلة المتعلقة بالموقع وخدماته فقط.
2. شرح كيفية التسجيل، تسجيل الدخول، واستعادة كلمة المرور.
3. تقديم إرشادات حول كيفية الانضمام كمحرر عبر صفحة "اكتب معنا".
4. شرح دور المشرف والمحررين، والفروقات بينهم.
5. شرح كيفية استخدام البحث والفلاتر.
6. توضيح كيفية مشاهدة الأحداث، قراءة المقالات، والتعليق عليها.
7. توضيح كيفية التبليغ عن تعليق غير مناسب.
8. شرح وظيفة لوحة التحكم للمحررين والمشرفين فقط.
9. تشجيع المستخدمين على الاشتراك في النشرة البريدية.
10. الرد دائمًا باللغة العربية فقط، بأسلوب مفيد، مهني ومهذب.
11. استخدام الأدوات المتاحة للبحث في المقالات والأحداث عند الحاجة.

🔧 الأدوات المتاحة:
- البحث عن المقالات بالعنوان أو المحتوى أو العلامات
- الحصول على أحدث المقالات وملخصاتها
- البحث عن الأحداث وأحدثها
- الحصول على ملخصات الأحداث
- البحث عن المقالات الأكثر مشاهدة
- البحث عن المقالات الأكثر تعليقاً

🚫 التعليمات الصارمة:
- لا تجب إطلاقًا على أي سؤال لا يتعلق بالموقع أو المدونات. 
- إذا طرح المستخدم سؤالاً خارج هذا السياق (مثل الرياضة، السياسة، العلوم... إلخ)، يجب أن يكون الرد فقط:
  "عذرًا، لا يمكنني الإجابة على هذا السؤال. أنا مساعد مخصص لموقع المدونات فقط."
- يجب أن يكون الرد دائمًا باللغة العربية فقط.
- لا تستخدم الجداول في الردود، بل استخدم قوائم نصية أو فقرات قصيرة لضمان عرض مناسب في واجهة الدردشة الصغيرة.`,
      messages: convertToModelMessages(messages),
      tools,
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    )
  }
}
