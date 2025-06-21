import WriteWithUsForm from "@/components/form/write-with-us-form"
import ImageWithDescription from "@/components/shared/image-with-description"
import { ImageWithDescriptionItems } from "@/constants"

const { alt, description, image, title } = ImageWithDescriptionItems[1]
const WriteWithUsSection = () => {
  return (
    <div className="py-4">
      <ImageWithDescription
        alt={alt}
        description={description}
        image={image}
        title={title}
      />
      <section className="flex flex-col gap-4 px-4 py-8 sm:px-6 md:gap-8 md:py-10 lg:px-8">
        <h2 className="text-primary text-2xl font-bold">
          اكتب معنا وشارك مقالاتك مع العالم 🌍
        </h2>
        <div className="flex flex-col gap-4 md:gap-6 md:text-xl">
          <p>
            مرحبًا بكم في قسم "اكتب معنا" على موقعنا. نحن نبحث دائمًا عن الأصوات
            الإبداعية والمبدعين الذين يرغبون في مشاركة أفكارهم وآرائهم مع
            الجمهور العربي.
          </p>
          <p>
            هل تمتلك موهبة الكتابة وتود الانضمام إلى مجتمعنا؟ إليك فرصة رائعة
            للمشاركة معنا. نحن نرحب بمقالات تتناول مواضيع متنوعة من الأخبار
            والمشكلات الاجتماعية.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="text-2xl font-bold">لماذا تكتب معنا؟ </h2>
          <div className="flex flex-col gap-2 md:text-xl">
            <div className="flex items-center gap-2">
              <span>✨</span>
              احصل على فرصة للتعبير عن أفكارك وتجاربك.
            </div>
            <div className="flex items-center gap-2">
              <span>✨</span>
              وجودك سيساعد في إثراء المحتوى العربي على الإنترنت.
            </div>
            <div className="flex items-center gap-2">
              <span>✨</span>
              اجعل اسمك معروفًا وابني سيرتك الاحترافية.
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="text-2xl font-bold">كيف يمكنك المشاركة؟</h2>
          <div className="flex flex-col gap-2 md:text-xl">
            <div className="flex items-center gap-2">
              <span className="font-bold">1.</span>يرجى ملء الاستمارة أدناه
              لتقديم طلب الكتابة معنا
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold">2.</span>
              سنراجع مقترحك ونتواصل معك في أقرب وقت ممكن.
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold">3.</span>
              بعد الموافقة على مقترحك، قم بكتابة مقالك وإرساله لنا.
            </div>
          </div>
        </div>
        <p className="text-xl font-bold">
          انضم إلى مجتمعنا وشارك أفكارك ومعرفتك مع العالم. سنكون سعداء بالعمل
          معك ونشر أعمالك على موقعنا. اجعل كلماتك تلامس قلوب القراء وتلهم
          العقول. تعال وابدأ رحلة الكتابة معنا اليوم!
        </p>

        <WriteWithUsForm />
      </section>
    </div>
  )
}

export default WriteWithUsSection
