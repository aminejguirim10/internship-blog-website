import ImageWithDescription from "@/components/shared/image-with-description"
import { ImageWithDescriptionItems } from "@/constants"

const { alt, description, image, title } = ImageWithDescriptionItems[0]
const AboutUsPage = () => {
  return (
    <div className="py-4">
      <ImageWithDescription
        alt={alt}
        description={description}
        image={image}
        title={title}
      />
      <section className="flex flex-col gap-4 px-4 py-8 sm:px-6 md:gap-6 md:py-10 lg:px-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold">مهمتنا : </h2>
          <p className="md:text-xl">
            منصة لتسليط الضوء على الأحداث والتحليلات الأكثر أهمية في العالم
            العربي. نسعى لتوفير منصة للمفكرين والكتّاب والخبراء للتعبير عن
            أفكارهم وآرائهم بحرية.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="text-2xl font-bold">ماذا نقدم : </h2>
          <div className="flex flex-col gap-2 md:text-xl">
            <div className="flex items-center gap-2">
              <span>✒️</span>
              مقالات وتحليلات حصرية تغطي مواضيع متنوعة.
            </div>
            <div className="flex items-center gap-2">
              <span>🌍</span>
              تغطية شاملة للأخبار الهامة.
            </div>
            <div className="flex items-center gap-2">
              <span>🤝</span>
              فرصة للكتّاب المبدعين للمشاركة والتألق.
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold">لماذا نحن :</h2>
          <p className="md:text-xl">
            نحن ملتزمون بتقديم محتوى عالي الجودة وموثوق به. نعمل بشغف لنشارك
            المعرفة ونلهم القراء. فلنتشارك سويًا في رحلة استكشاف العالم من
            حولنا. انضموا إلينا وكونوا جزءًا من مجتمعنا الديناميكي.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold">رؤيتنا وقيمنا :</h2>
          <p className="md:text-xl">
            في [اسم موقعك]، نؤمن بأن الكلمات تمتلك القوة للتغيير والإلهام. هدفنا
            هو توفير مصدر موثوق للمعلومات والتحليلات على الإنترنت وإثراء الحوار
            العربي.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold">رؤيتنا : </h2>
          <p className="md:text-xl">
            أن نصبح واحدة من أبرز المنصات العربية لتوجيه الضوء على الأحداث
            والمشكلات الهامة في العالم. نسعى لتمكين القرّاء من فهم التحديات
            والفرص التي تشكل عالمنا.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="text-2xl font-bold">ماذا نقدم : </h2>
          <div className="flex flex-col gap-2 md:text-xl">
            <div className="flex items-center gap-2">
              <span>✒️</span>
              <span className="underline underline-offset-8">تعاون</span>: نؤمن
              بقوة التعاون والتبادل الثقافي.
            </div>
            <div className="flex items-center gap-2">
              <span>📚</span>
              <span className="underline underline-offset-8">المعرفة</span>:
              نقدم المعرفة والتحليلات العميقة لتمكين القرّاء.
            </div>
            <div className="flex items-center gap-2">
              <span>🔎</span>
              <span className="underline underline-offset-8">الشفافية</span>:
              نلتزم بالشفافية والنزاهة في تقديم المعلومات.
            </div>
            <div className="flex items-center gap-2">
              <span>🌱</span>
              <span className="underline underline-offset-8">الإبداع</span>:
              نشجع على التفكير الإبداعي والتعبير عن الآراء بحرية.
            </div>
          </div>
        </div>

        <div className="tex-xl flex flex-col gap-2 pb-4 font-bold md:text-2xl">
          <div className="flex gap-2 md:items-center">
            <span>🙏</span>
            نحن ممتنون لكل قارئ وكاتب يشارك في رحلتنا. شكرًا لثقتكم ودعمكم.
          </div>
          <div className="flex gap-2 md:items-center">
            <span>📢</span>
            انضموا إلى مجتمعنا وشاركوا أفكاركم ومعرفتكم. معًا، نستطيع أن نجعل
            فارقًا في عالم الإعلام والمعرفة.
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutUsPage
