import Link from "next/link"

export default function Write() {
  return (
    <div dir="rtl">
      <div className="mx-auto max-w-7xl py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="relative isolate overflow-hidden bg-gray-900 px-6 py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16">
          <h2 className="text-4xl font-semibold tracking-tight text-balance text-white sm:text-5xl">
            اكتب معنا وشارك إبداعك
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg/8 text-pretty text-white/90">
            هل تمتلك شغفاً للكتابة؟ انضم إلى مجتمعنا من الكتاب المبدعين واكتشف
            عالماً جديداً من الأفكار والإلهام. نحن نبحث عن أصوات جديدة لتثري
            محتوانا وتشارك قصصها مع العالم.
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-base/7 text-white/80">
            في عالم مليء بالضوضاء، كن الصوت الذي يحمل معنى. اكتب بصدق، شارك بحب،
            وألهم الآخرين بكلماتك. مساحتك الإبداعية تنتظرك هنا، حيث كل كلمة لها
            قيمة وكل فكرة تستحق أن تُسمع.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/write-with-us"
              className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-teal-600 shadow-xs hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              ابدأ الكتابة الآن
            </Link>
            <Link
              href="/about-us"
              className="text-sm/6 font-semibold text-white hover:text-white/80"
            >
              اعرف المزيد
              <span aria-hidden="true" className="mr-2">
                ←
              </span>
            </Link>
          </div>
          <svg
            viewBox="0 0 1024 1024"
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 -z-10 size-256 -translate-x-1/2 mask-[radial-gradient(closest-side,white,transparent)]"
          >
            <circle
              r={512}
              cx={512}
              cy={512}
              fill="url(#teal-radial-gradient)"
              fillOpacity="0.7"
            />
            <defs>
              <radialGradient id="teal-radial-gradient">
                <stop stopColor="#14b8a6" />
                <stop offset={1} stopColor="#0f766e" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  )
}
