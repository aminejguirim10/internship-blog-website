import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { faqItems } from "@/constants"
import Link from "next/link"
const HomeFaqs = () => {
  return (
    <section className="py-8 md:py-16" dir="rtl">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-bold text-balance md:text-4xl lg:text-5xl">
            الأسئلة الشائعة
          </h2>
          <p className="text-muted-foreground mt-4 text-balance">
            اكتشف إجابات سريعة وشاملة للأسئلة الشائعة حول منصتنا وخدماتنا
            وميزاتنا.
          </p>
        </div>
        <div className="mx-auto mt-12 max-w-xl">
          <Accordion
            type="single"
            collapsible
            className="bg-card ring-muted w-full rounded-2xl border px-8 py-3 shadow-sm ring-4 dark:ring-0"
          >
            {faqItems.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="border-dashed"
              >
                <AccordionTrigger className="cursor-pointer text-right text-base hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-right text-base">{item.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <p className="text-muted-foreground mt-6 px-8 text-right">
            لا تجد ما تبحث عنه؟ تواصل مع{" "}
            <Link
              href="/contact-us"
              className="text-primary font-medium hover:underline"
            >
              فريق الدعم الفني
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}

export default HomeFaqs
