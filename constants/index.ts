import { Icons } from "@/components/shared/icons"

export const navigationItems = [
  { label: "الرئيسية", href: "/" },
  { label: "أبحاث", href: "/recherches" },
  { label: "مقالات", href: "/articles" },
  { label: "تقارير", href: "/rapports" },
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
    href: "/favorites",
    label: "قائمة المفضلة",
    icon: Icons.heart,
  },
  {
    href: "/settings",
    label: "إعدادات",
    icon: Icons.settings,
  },
]

export const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "لوحة القيادة",
      url: "/dashboard",
      icon: Icons.layoutDashboard,
    },
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
