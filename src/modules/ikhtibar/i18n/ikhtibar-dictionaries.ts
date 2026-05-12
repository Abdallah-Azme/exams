export const IKHTIBAR_LOCALES = ["ar", "en"] as const;
export type IkhtibarLocale = (typeof IKHTIBAR_LOCALES)[number];

export const defaultIkhtibarLocale: IkhtibarLocale = "ar";

export function parseIkhtibarLocale(lang: string | undefined): IkhtibarLocale {
  if (lang === "en") return "en";
  return "ar";
}

const ar = {
  metaTitle: "اختبر | منصة الاختبارات والتعلم",
  metaDescription:
    "اختبر مستقبلك وابنِ طريق نجاحك — اختبارات تفاعلية، شروحات مبسطة، وتقارير أداء فورية.",
  metaOgDescription: "منصة عربية للاختبارات الذكية والشروحات الواضحة.",

  brandName: "اختبر",
  brandAria: "اختبر — الصفحة الرئيسية",

  navMain: "التنقل الرئيسي",
  navHome: "الرئيسية",
  navFeatures: "مميزات المنصة",
  navCourses: "الدورات",
  navAbout: "من نحن",
  navContact: "تواصل معنا",
  ctaHeader: "ابدأ رحلتك الآن",

  langSwitchLabel: "اللغة",
  langAr: "العربية",
  langEn: "English",

  heroTeacherAlt: "د. طارق صلاح — مؤسس منصة اختبر",
  heroTeacherName: "د. طارق صلاح",
  heroTeacherTitle: "مؤسس منصة اختبر",
  heroTeacherBio: "خبرة أكثر من 10 سنوات في التدريس",

  heroPrev: "الشريحة السابقة",
  heroNext: "الشريحة التالية",
  heroDots: "مؤشر الشرائح",
  heroDotLabel: "الشريحة {n}",
  heroCta: "ابدأ الاختبار الآن",

  heroFeat1: "اختبارات تفاعلية",
  heroFeat2: "شروحات مبسطة",
  heroFeat3: "تقارير أداء فورية",
  heroFeat4: "تحديات ومسابقات",

  heroS1Title: "اختبر مستقبلك وابنِ طريق نجاحك",
  heroS1Sub:
    "منصة تعليمية متكاملة تجمع بين الاختبارات الذكية والشروحات الواضحة لتصل إلى أهدافك الأكاديمية بثقة وخطوات مدروسة.",
  heroS2Title: "تعلم بالممارسة وتتبع تقدمك لحظة بلحظة",
  heroS2Sub:
    "اختبارات مصممة وفق أحدث المناهج مع تقارير فورية تساعدك على معرفة نقاط القوة ومجالات التحسين بسهولة.",
  heroS3Title: "انضم لآلاف الطلاب الذين حققوا نتائجهم المميزة",
  heroS3Sub:
    "محتوى منظم، دعم مستمر، وتحديات تعليمية تجعل رحلة التعلم أكثر متعة وفعالية.",
  heroS4Title: "ابدأ اليوم وخطّط لمستقبلك بثقة",
  heroS4Sub:
    "جلسات تفاعلية ومسارات تعليمية مرنة تناسب جدولك وتساعدك على التفوق خطوة بخطوة.",

  testimonialsTitle: "آراء طلابنا",
  testimonialsStars: "تقييم 5 من 5",
  testimonialsAvatar: "صورة {name}",

  t1Name: "محمد علي",
  t1Role: "طالب ثانوية عامة",
  t1Text:
    "المنصة ساعدتني أراجع بسرعة وأفهم نقاط ضعفي. التقارير بعد كل اختبار وضحت لي إيه اللي محتاج أركز عليه.",
  t2Name: "سارة أحمد",
  t2Role: "طالبة علمي رياضة",
  t2Text:
    "الشروحات مبسطة والأسئلة قريبة من امتحانات المدرسة. حسيت إن عندي خطة واضحة بدل العشوائية.",
  t3Name: "خالد ياسر",
  t3Role: "طالب آداب",
  t3Text:
    "أحب جزء التحديات والمسابقات، خلّاني أتمرن يوميًا من غير ملل. الدعم سريع لما احتجت مساعدة.",

  statsSection: "إحصائيات المنصة",
  statStudents: "طالب مسجل",
  statTests: "اختبار متاح",
  statCourses: "دورة تدريبية",
  statSupport: "دعم فني",

  footerPlatform: "المنصة",
  footerSupport: "الدعم",
  footerFaq: "الأسئلة الشائعة",
  footerPrivacy: "سياسة الخصوصية",
  footerNewsletter: "النشرة البريدية",
  footerNewsletterHint: "اشترك لتصلك نصائح التعلم والجديد في المحتوى والاختبارات.",
  footerSubscribe: "اشتراك",
  footerBlurb:
    "منصة عربية للاختبارات والتعلم الذاتي. نساعدك تبني ثقتك وتتابع تقدمك بخطوات واضحة.",
  footerCopyright: "© {year} منصة اختبر. جميع الحقوق محفوظة.",
  footerTagline: "صُممت لتعليم أوضح واختبارات أذكى.",

  socialYoutube: "يوتيوب",
  socialFacebook: "فيسبوك",
  socialInstagram: "إنستغرام",
  socialX: "إكس",

  emailPlaceholder: "you@example.com",
} as const;

const en = {
  metaTitle: "Ikhtibar | Exams & learning platform",
  metaDescription:
    "Test your future and build your path to success — interactive tests, clear explanations, and instant performance reports.",
  metaOgDescription: "An Arabic-first platform for smart quizzes and clear learning paths.",

  brandName: "Ikhtibar",
  brandAria: "Ikhtibar — home",

  navMain: "Main navigation",
  navHome: "Home",
  navFeatures: "Platform features",
  navCourses: "Courses",
  navAbout: "About us",
  navContact: "Contact",
  ctaHeader: "Start your journey",

  langSwitchLabel: "Language",
  langAr: "العربية",
  langEn: "English",

  heroTeacherAlt: "Dr. Tarek Salah — founder of Ikhtibar",
  heroTeacherName: "Dr. Tarek Salah",
  heroTeacherTitle: "Founder of Ikhtibar",
  heroTeacherBio: "More than 10 years of teaching experience",

  heroPrev: "Previous slide",
  heroNext: "Next slide",
  heroDots: "Slide indicators",
  heroDotLabel: "Slide {n}",
  heroCta: "Start the test now",

  heroFeat1: "Interactive tests",
  heroFeat2: "Clear explanations",
  heroFeat3: "Instant performance reports",
  heroFeat4: "Challenges & contests",

  heroS1Title: "Test your future and build your path to success",
  heroS1Sub:
    "An integrated learning platform that combines smart quizzes and clear explanations so you can reach your academic goals with confidence and a structured plan.",
  heroS2Title: "Learn by doing and track your progress in real time",
  heroS2Sub:
    "Tests aligned with up-to-date curricula and instant reports that highlight strengths and areas to improve.",
  heroS3Title: "Join thousands of students who achieved standout results",
  heroS3Sub:
    "Organized content, steady support, and learning challenges that make studying more engaging and effective.",
  heroS4Title: "Start today and plan your future with confidence",
  heroS4Sub:
    "Interactive sessions and flexible learning paths that fit your schedule and help you excel step by step.",

  testimonialsTitle: "What our students say",
  testimonialsStars: "5 out of 5 rating",
  testimonialsAvatar: "Photo of {name}",

  t1Name: "Mohamed Ali",
  t1Role: "High school student",
  t1Text:
    "The platform helped me review faster and understand my weak spots. After each test, the reports showed exactly what to focus on.",
  t2Name: "Sara Ahmed",
  t2Role: "Science track student",
  t2Text:
    "Explanations are simple and questions feel close to school exams. I finally felt I had a clear plan instead of random studying.",
  t3Name: "Khaled Yasser",
  t3Role: "Arts track student",
  t3Text:
    "I love the challenges and contests—they kept me practicing daily without boredom. Support was quick whenever I needed help.",

  statsSection: "Platform statistics",
  statStudents: "Registered students",
  statTests: "Available tests",
  statCourses: "Training courses",
  statSupport: "Technical support",

  footerPlatform: "Platform",
  footerSupport: "Support",
  footerFaq: "FAQ",
  footerPrivacy: "Privacy policy",
  footerNewsletter: "Newsletter",
  footerNewsletterHint:
    "Subscribe for study tips and updates on new content and tests.",
  footerSubscribe: "Subscribe",
  footerBlurb:
    "A platform for quizzes and self-paced learning. Build confidence and track progress with clear steps.",
  footerCopyright: "© {year} Ikhtibar. All rights reserved.",
  footerTagline: "Built for clearer teaching and smarter tests.",

  socialYoutube: "YouTube",
  socialFacebook: "Facebook",
  socialInstagram: "Instagram",
  socialX: "X",

  emailPlaceholder: "you@example.com",
} as const;

export type IkhtibarMessageKey = keyof typeof ar;

export const ikhtibarMessages = { ar, en } as const;

export function ikhtibarT(
  locale: IkhtibarLocale,
  key: IkhtibarMessageKey,
  vars?: Record<string, string | number>,
): string {
  let s = (ikhtibarMessages[locale] as Record<string, string>)[key] ?? String(key);
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      s = s.replaceAll(`{${k}}`, String(v));
    }
  }
  return s;
}
