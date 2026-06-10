export const translations = {
  en: {
    // Sidebar
    nav: {
      translator: "Translation Editor",
      glossary: "GTR Glossary",
      vectordb: "Vector Database",
      models: "AI Models",
      apiKeys: "API Keys",
      settings: "Settings",
    },
    sidebar: {
      copilot: "Copilot",
      expand: "Expand sidebar",
      collapse: "Collapse sidebar",
    },
    // Status Bar
    status: {
      engine: {
        hybrid: "HYBRID",
        local: "LOCAL",
        cloud: "CLOUD",
      },
      gtr: {
        active: "GTR Active",
        zeroShot: "GTR Zero-Shot",
      },
      webgpu: {
        ready: "WebGPU Ready",
        unavailable: "WebGPU N/A",
        loading: "WebGPU Loading...",
      },
      segments: "Segments",
      words: "Words",
      ready: "Ready",
      footer: "RDAT Copilot v1.0 | EN↔AR",
    },
    // Workspace
    workspace: {
      title: {
        translator: "Translation Editor",
        glossary: "GTR Glossary",
        vectordb: "Vector Database",
        models: "AI Models",
        apiKeys: "API Keys",
        settings: "Settings",
      },
    },
    // Toast
    toast: {
      copied: "Copied to clipboard",
      exported: "Exported successfully",
      imported: "File imported successfully",
      cleared: "Panes cleared",
      error: "An error occurred",
      warning: "Warning",
    },
    // AI Tutor
    tutor: {
      title: "AI Tutor",
      placeholder: "Ask the AI Tutor...",
      evaluate: "Evaluate this translation",
      improve: "Suggest improvements",
      cultural: "Explain cultural nuances",
      terminology: "Check terminology accuracy",
      noApiKey: "Please add your Gemini API key in Settings first",
    },
    // Glossary Panel
    glossaryPanel: {
      title: "Glossary",
      search: "Search Glossary...",
      matched: "Matched Terminology",
      notes: "Contextual Notes",
      noTerms: "No matching terms. Type to search.",
    },
    // Drag & Drop
    dragdrop: {
      dropHere: "Drop file here",
      supports: "Supports .txt, .docx, .md",
    },
    // Welcome Tab
    welcome: {
      greeting: "Welcome to RDAT Copilot",
      subtitle:
        "Your AI-powered professional English↔Arabic translation environment",
      quickStart: "Quick Start Guide",
      quickStartAr: "دليل البدء السريع",
      cards: [
        {
          step: "01",
          title: "Translation Editor",
          titleAr: "محرر الترجمة",
          description:
            "Use the split-pane Monaco editor with source-target line sync, ghost text completions, and AI-powered inline suggestions.",
          descriptionAr:
            "استخدم محرر مونكو ثنائي اللوحات مع مزامنة الأسطر والنص الشبحي والاقتراحات الذكية المدعومة بالذكاء الاصطناعي.",
        },
        {
          step: "02",
          title: "Glossary Management",
          titleAr: "إدارة المسرد",
          description:
            "Maintain consistent terminology with the GTR Glossary. Search, browse, and manage translation pairs with contextual notes.",
          descriptionAr:
            "حافظ على مصطلحات متسقة مع مسرد GTR. ابحث وتصفح وأدر أزواج الترجمة مع ملاحظات سياقية.",
        },
        {
          step: "03",
          title: "AI Translation Tutor",
          titleAr: "معلم الترجمة الذكي",
          description:
            "Get instant translation evaluation, improvement suggestions, and cultural nuance explanations from the AI Tutor panel.",
          descriptionAr:
            "احصل على تقييم فوري للترجمة واقتراحات التحسين وشروحات الفروق الثقافية من لوحة المعلم الذكي.",
        },
        {
          step: "04",
          title: "AI Models",
          titleAr: "نماذج الذكاء الاصطناعي",
          description:
            "Configure local WebGPU inference or cloud fallback. Choose between on-device and API-based translation engines.",
          descriptionAr:
            "قم بتكوين الاستدلال المحلي عبر WebGPU أو السحابة. اختر بين محركات الترجمة على الجهاز أو عبر واجهة البرمجة.",
        },
      ],
      shortcuts: "Keyboard Shortcuts",
      shortcutsAr: "اختصارات لوحة المفاتيح",
      shortcutList: [
        { keys: "Alt + ]", action: "Cycle translation alternatives", actionAr: "التبديل بين بدائل الترجمة" },
        { keys: "Ctrl + →", action: "Accept next word", actionAr: "قبول الكلمة التالية" },
        { keys: "Tab", action: "Accept full suggestion", actionAr: "قبول الاقتراح كاملاً" },
        { keys: "Esc", action: "Dismiss suggestion", actionAr: "تجاهل الاقتراح" },
      ],
      getStarted: "Get Started",
      getStartedAr: "ابدأ الآن",
    },
  },
  ar: {
    // Sidebar
    nav: {
      translator: "محرر الترجمة",
      glossary: "مسرد GTR",
      vectordb: "قاعدة بيانات المتجهات",
      models: "نماذج الذكاء الاصطناعي",
      apiKeys: "مفاتيح API",
      settings: "الإعدادات",
    },
    sidebar: {
      copilot: "المساعد",
      expand: "توسيع الشريط الجانبي",
      collapse: "طي الشريط الجانبي",
    },
    // Status Bar
    status: {
      engine: {
        hybrid: "هجين",
        local: "محلي",
        cloud: "سحابة",
      },
      gtr: {
        active: "GTR نشط",
        zeroShot: "GTR بدون تدريب",
      },
      webgpu: {
        ready: "WebGPU جاهز",
        unavailable: "WebGPU غير متاح",
        loading: "WebGPU جاري التحميل...",
      },
      segments: "المقاطع",
      words: "الكلمات",
      ready: "جاهز",
      footer: "المساعد RDAT الإصدار 1.0 | إن↔عر",
    },
    // Workspace
    workspace: {
      title: {
        translator: "محرر الترجمة",
        glossary: "مسرد GTR",
        vectordb: "قاعدة بيانات المتجهات",
        models: "نماذج الذكاء الاصطناعي",
        apiKeys: "مفاتيح API",
        settings: "الإعدادات",
      },
    },
    // Toast
    toast: {
      copied: "تم النسخ إلى الحافظة",
      exported: "تم التصدير بنجاح",
      imported: "تم استيراد الملف بنجاح",
      cleared: "تم مسح اللوحات",
      error: "حدث خطأ",
      warning: "تحذير",
    },
    // AI Tutor
    tutor: {
      title: "المعلم الذكي",
      placeholder: "اسأل المعلم الذكي...",
      evaluate: "قيّم هذه الترجمة",
      improve: "اقترح تحسينات",
      cultural: "اشرح الفروق الثقافية",
      terminology: "تحقق من المصطلحات",
      noApiKey: "يرجى إضافة مفتاح Gemini API في الإعدادات أولاً",
    },
    // Glossary Panel
    glossaryPanel: {
      title: "المسرد",
      search: "ابحث في المسرد...",
      matched: "المصطلحات المتطابقة",
      notes: "ملاحظات سياقية",
      noTerms: "لا توجد مصطلحات متطابقة. اكتب للبحث.",
    },
    // Drag & Drop
    dragdrop: {
      dropHere: "أفلت الملف هنا",
      supports: "يدعم .txt, .docx, .md",
    },
    // Welcome Tab
    welcome: {
      greeting: "مرحباً بك في المساعد RDAT",
      subtitle: "بيئة الترجمة الاحترافية الإنجليزية↔العربية المدعومة بالذكاء الاصطناعي",
      quickStart: "دليل البدء السريع",
      quickStartAr: "Quick Start Guide",
      cards: [
        {
          step: "01",
          title: "محرر الترجمة",
          titleAr: "Translation Editor",
          description:
            "استخدم محرر مونكو ثنائي اللوحات مع مزامنة الأسطر والنص الشبحي والاقتراحات الذكية المدعومة بالذكاء الاصطناعي.",
          descriptionAr:
            "Use the split-pane Monaco editor with source-target line sync, ghost text completions, and AI-powered inline suggestions.",
        },
        {
          step: "02",
          title: "إدارة المسرد",
          titleAr: "Glossary Management",
          description:
            "حافظ على مصطلحات متسقة مع مسرد GTR. ابحث وتصفح وأدر أزواج الترجمة مع ملاحظات سياقية.",
          descriptionAr:
            "Maintain consistent terminology with the GTR Glossary. Search, browse, and manage translation pairs with contextual notes.",
        },
        {
          step: "03",
          title: "معلم الترجمة الذكي",
          titleAr: "AI Translation Tutor",
          description:
            "احصل على تقييم فوري للترجمة واقتراحات التحسين وشروحات الفروق الثقافية من لوحة المعلم الذكي.",
          descriptionAr:
            "Get instant translation evaluation, improvement suggestions, and cultural nuance explanations from the AI Tutor panel.",
        },
        {
          step: "04",
          title: "نماذج الذكاء الاصطناعي",
          titleAr: "AI Models",
          description:
            "قم بتكوين الاستدلال المحلي عبر WebGPU أو السحابة. اختر بين محركات الترجمة على الجهاز أو عبر واجهة البرمجة.",
          descriptionAr:
            "Configure local WebGPU inference or cloud fallback. Choose between on-device and API-based translation engines.",
        },
      ],
      shortcuts: "اختصارات لوحة المفاتيح",
      shortcutsAr: "Keyboard Shortcuts",
      shortcutList: [
        { keys: "Alt + ]", action: "التبديل بين بدائل الترجمة", actionAr: "Cycle translation alternatives" },
        { keys: "Ctrl + →", action: "قبول الكلمة التالية", actionAr: "Accept next word" },
        { keys: "Tab", action: "قبول الاقتراح كاملاً", actionAr: "Accept full suggestion" },
        { keys: "Esc", action: "تجاهل الاقتراح", actionAr: "Dismiss suggestion" },
      ],
      getStarted: "ابدأ الآن",
      getStartedAr: "Get Started",
    },
  },
} as const;

export type TranslationKeys = typeof translations;
export type Locale = keyof TranslationKeys;
