import { Icons } from "@/components/shared/icons"

export const navigationItems = [
  { label: "مدونات", href: "/blogs" },
  { label: "اكتب معنا", href: "/write-with-us" },
  { label: "من نحن", href: "/about-us" },
  { label: "فعاليات", href: "/events" },
  { label: "تواصل معنا", href: "/contact-us" },
]

export const navigationsIconsItems = [
  {
    label: "telegram",
    icon: Icons.telegram,
    href: "telegram.com",
  },
  {
    label: "whatsapp",
    icon: Icons.whatsapp,
    href: "whatsapp.com",
  },
  {
    label: "youtube",
    icon: Icons.youtube,
    href: "youtube.com",
  },
  {
    label: "linkedin",
    icon: Icons.linkedin,
    href: "linkedin.com",
  },
  {
    label: "twitter",
    icon: Icons.twitter,
    href: "twitter.com",
  },
  {
    label: "instagram",
    icon: Icons.instagram,
    href: "instagram.com",
  },
  {
    label: "facebook",
    icon: Icons.facebook,
    href: "facebook.com",
  },
]

export const instituteLinks = [
  { label: "من نحن", href: "/about-us" },
  { label: "تواصل معنا", href: "/contact-us" },
  { label: "اكتب معنا", href: "/write-with-us" },
  { label: "فعاليات المعهد", href: "/events" },
]

export const reportsLinks = [
  { label: "ركن شهري", href: "/rapports" },
  { label: "ركن شهري", href: "/rapports" },
]

export const researchLinks = [
  { label: "الأبحاث المتعلقة بالدين", href: "/recherches" },
  {
    label: "الأبحاث السياسية",
    href: "/recherches",
    underlined: true,
  },
  { label: "العلاقات الدولية", href: "/recherches" },
  {
    label: "العلاقات الإستراتيجية",
    href: "/recherches",
    underlined: true,
  },
]

export const ImageWithDescriptionItems = [
  {
    image: "/assets/about-us.jpg",
    alt: "About Us",
    title: "من نحن",
    description:
      "نحن نؤمن بأن الكلمات لها القوة لتغيير العالم. نحن [اسم موقعك]، مكان يسعى لنقل الأخبار والقضايا الهامة بأسلوب متميز وإلهامي.",
  },
  {
    image: "/assets/write-with-us.jpg",
    alt: "Write With Us",
    title: "اكتب معنا",
    description:
      "هل ترغب في مشاركة مهاراتك ككاتب مع مجتمعنا؟ نحن نبحث دائمًا عن مواهب جديدة لإثراء محتوانا. إذا كنت تمتلك شغفًا للكتابة وترغب في الانضمام إلى فريقنا، فنحن نرحب بك!",
    button: "ابدأ الكتابة الآن!",
    link: "/write-with-us",
  },
  {
    image: "/assets/about-us.jpg",
    alt: "Home",
    title: " أيـقِظ فضولك مع معهدي",
    description:
      "في عالم يتغيّر باستمرار، يصبح تخصيص لحظة للقراءة والتفكير والكتابة فعلًا من الوعي. هذا المدوّنة هي مساحتك الخاصة للإلهام، حيث نكتب بكل شغف لنغذّي عقلك ونمنحك لحظات من التأمّل وسط بساطة الحياة اليومية. أهلاً بك في عالم حيث للكلمات معنى، وللأفكار حياة.",
  },
  {
    image: "/assets/inscription.jpg",
    alt: "Inscription",
    title: "اشتراك ",
    description:
      "هل ترغب في مشاركة مهاراتك ككاتب مع مجتمعنا؟ نحن نبحث دائمًا عن مواهب جديدة لإثراء محتوانا. إذا كنت تمتلك شغفًا للكتابة وترغب في الانضمام إلى فريقنا، فنحن نرحب بك!",
    button: "سجّل اليوم!",
    link: "/sign-up",
  },
]

export const fileTypes = {
  "image/jpeg": [".jpeg", ".jpg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "image/gif": [".gif"],
  "image/bmp": [".bmp"],
  "image/svg+xml": [".svg"],
  "image/tiff": [".tif", ".tiff"],
  "image/x-icon": [".ico"],
  "image/heif": [".heif"],
  "image/heic": [".heic"],
  "image/avif": [".avif"],
}

export const profileNavigationItems = [
  {
    href: "/profile",
    label: "معلوماتي",
    icon: Icons.user,
  },
  {
    href: "/my-blogs",
    label: "قائمة مدوناتي",
    icon: Icons.notbook,
  },
]

export const data = {
  navMain: [
    {
      title: "المستخدمين",
      url: "/dashboard/users",
      icon: Icons.iconUsers,
    },
    {
      title: "طلبات",
      url: "/dashboard/applications",
      icon: Icons.handHelping,
    },
    {
      title: "فعاليات",
      url: "/dashboard/events",
      icon: Icons.calendar2,
    },
    {
      title: "فئات",
      url: "/dashboard/categories",
      icon: Icons.tag,
    },
  ],

  documents: [
    {
      name: "أبحاث",
      url: "/dashboard/recherches",
      icon: Icons.microscope,
    },
    {
      name: "تقارير",
      url: "/dashboard/rapports",
      icon: Icons.iconReport,
    },
    {
      name: "مقالات",
      url: "/dashboard/articles",
      icon: Icons.newspaper,
    },
  ],
}

export const faqItems = [
  {
    id: "item-1",
    question: "كيف يمكنني الكتابة؟",
    answer: "يجب عليك إرسال طلب وسيقوم المشرف بمراجعته وقبوله.",
  },
  {
    id: "item-2",
    question: "كيف يمكنني التسجيل في المنصة؟",
    answer:
      "يمكنك التسجيل مباشرة كمستخدم لقراءة المدونات والاستفادة من المحتوى المتاح.",
  },
  {
    id: "item-3",
    question: "هل المدونات التي أكتبها تخضع للرقابة؟",
    answer:
      "نعم، جميع المدونات تخضع للمراجعة ولا يتم نشرها إلا بعد موافقة المشرف.",
  },
  {
    id: "item-4",
    question: "هل تردون بسرعة على الاستفسارات؟",
    answer:
      "نعم، نحن نحرص على الرد السريع على جميع الاستفسارات والمساعدة في أقرب وقت ممكن.",
  },
]

// Interface pour les catégories dynamiques
export interface CategoryType {
  id: string
  name: string
}

export const notFoundLinks = [
  {
    name: "مدونات",
    href: "/blogs",
    description: "اكتشف مدوناتنا المتنوعة.",
    icon: Icons.newspaper,
  },
  {
    name: "فعاليات",
    href: "/events",
    description: "تابع أحدث فعالياتنا القادمة.",
    icon: Icons.calendar2,
  },
  {
    name: "اكتب معنا",
    href: "/write-with-us",
    description: "ساهم بمقالاتك وأفكارك معنا.",
    icon: Icons.pencil,
  },
  {
    name: "تواصل معنا",
    href: "/contact-us",
    description: "تواصل معنا لأي استفسار.",
    icon: Icons.iconUsers,
  },
]
