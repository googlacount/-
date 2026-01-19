
import { QuestionType, QuizSettings, DifficultyLevel, EducationStage, Semester } from './types';

export const EDUCATION_DATA = {
  [EducationStage.PRIMARY]: [
    'الأول الابتدائي', 'الثاني الابتدائي', 'الثالث الابتدائي', 
    'الرابع الابتدائي', 'الخامس الابتدائي', 'السادس الابتدائي'
  ],
  [EducationStage.PREPARATORY]: [
    'الأول الإعدادي', 'الثاني الإعدادي', 'الثالث الإعدادي'
  ],
  [EducationStage.SECONDARY]: [
    'الأول الثانوي', 'الثاني الثانوي', 'الثالث الثانوي'
  ]
};

export const SUBJECTS_LIST = ['لغة عربية', 'رياضيات', 'لغة انجليزية', 'علوم', 'دراسات'];
export const MATH_BRANCHES = ['جبر', 'هندسة', 'حساب مثلثات'];
export const UNIT_LABELS = ['وحدة', 'باب', 'فصل'];

export const ARABIC_FONTS = [
  { name: 'Tajawal', value: "'Tajawal', sans-serif" },
  { name: 'Cairo', value: "'Cairo', sans-serif" },
  { name: 'Amiri', value: "'Amiri', serif" }
];

export const DEFAULT_APPEARANCE = {
  backgroundColor: '#0f172a', 
  answerBoxBg: '#ffffff',
  answerTextColor: '#1e293b',
  selectedColor: '#10b981', // Emerald 500
  selectedTextColor: '#ffffff',
  clickEffect: 'scale' as const,
  transitionEffect: 'fade' as const,
  fontSizeChoices: 18,
  spacingChoices: 12,
  borderStyle: 'solid' as const,
  showSideColumn: true,
};

export const getCurrentLocalDateTime = () => {
  const now = new Date();
  return now.toISOString();
};

export const DEFAULT_SETTINGS: QuizSettings = {
  language: 'ar',
  title: 'كويز جديد',
  className: '',
  subject: 'لغة عربية',
  branch: '',
  unit: 'الأولى',
  lesson: '',
  timerEnabled: false,
  timerSeconds: 3600,
  teacherWhatsApp: '',
  skipNameEntry: false,
  welcomeMessage: 'مرحباً بك في الاختبار! بالتوفيق.',
  messageDuration: 5,
  maxAttempts: 0,
  appearance: DEFAULT_APPEARANCE,
  cloudConfig: {
    syncGrades: true,
    syncTests: false,
    syncBank: false
  },
  brandingConfig: {
    type: 'none',
    text: 'حقوق الطبع محفوظة ©',
    position: 'bottom-center',
    textSize: 24,
    imageSize: 80,
    color: '#ffffff',
    fontFamily: "'Tajawal', sans-serif"
  },
  schedulingEnabled: false,
  startTime: getCurrentLocalDateTime(),
  schedulingMessage: 'عذراً، الاختبار غير متاح حالياً. يرجى الانتظار للموعد المحدد.',
  preventSplitScreen: false,
  preventScreenshot: false,
  offlineMode: false,
  designerName: '',
  designerLogo: '',
  copyrightPosition: 'center',
  defaultStage: EducationStage.PRIMARY,
  defaultGrade: 'الأول الابتدائي',
  defaultSemester: Semester.FIRST,
};

export const CHOICE_COLORS = ['#e74c3c', '#3498db', '#2ecc71', '#f1c40f'];

export const TRANSLATIONS: any = {
  ar: {
    dashboard: 'لوحة تحكم المعلم',
    addQuestion: 'إضافة سؤال',
    questions: 'الأسئلة',
    download: 'تحميل الاختبار',
    preview: 'معاينة',
    share: 'مشاركة',
    settings: 'الإعدادات',
    builder: 'منشئ الاختبار',
    bank: 'بنك الأسئلة',
    library: 'المكتبة',
    cloud: 'السحابة',
    title: 'عنوان الاختبار',
    subject: 'المادة',
    branch: 'الفرع',
    unit: 'الوحدة / الباب',
    unitLabel: 'التصنيف',
    lesson: 'اسم الدرس',
    whatsapp: 'واتساب المعلم',
    timer: 'زمن الاختبار',
    timerMinutes: 'دقيقة',
    timerSeconds: 'ثانية',
    skipName: 'تجاوز إدخال الاسم',
    guestDesc: 'يسمح بالدخول دون كتابة الاسم',
    stage: 'المرحلة',
    grade: 'الصف الدراسي',
    semester: 'الفصل الدراسي',
    security: 'الأمان والمراقبة',
    branding: 'الشعار والبيانات',
    upload: 'رفع من الجهاز',
    logo: 'شعار الاختبار',
    next: 'التالي',
    prev: 'السابق',
    finish: 'إنهاء الاختبار',
    results: 'النتيجة النهائية',
    score: 'الدرجة',
    sendWhatsApp: 'إرسال الدرجة للمعلم',
    enterName: 'من فضلك أدخل اسمك الثلاثي:',
    studentName: 'اسم الطالب',
    enterTest: 'دخول الاختبار',
    yes: 'موافق',
    expired: 'انتهى الوقت المخصص لهذا الاختبار.',
    notYetAvailable: 'الاختبار غير متاح حالياً.',
    attemptsReached: 'لقد استنفدت عدد محاولات الحل المسموح بها.',
    points: 'درجة',
    search: 'بحث...',
    import: 'استيراد',
    load: 'فتح',
    emptyBank: 'البنك فارغ',
    emptyLibrary: 'المكتبة فارغة',
    saveToLibrary: 'حفظ للمكتبة',
    export: 'تصدير للبنك',
    image: 'صورة',
    answers: 'الخيارات',
    type: 'النوع',
    difficulty: 'الصعوبة',
    category: 'التصنيف',
    selectAll: 'تحديد الكل',
    deselectAll: 'إلغاء التحديد',
    addSelectedToBank: 'إضافة للبنك',
    appearance: 'المظهر والتأثيرات',
    bgImage: 'صورة الخلفية',
    bgColor: 'لون الخلفية',
    selColor: 'لون الاختيار',
    selTextColor: 'لون نص الاختيار',
    transEffect: 'حركة التنقل',
    clickEffect: 'تأثير النقر',
    effects: {
      none: 'بدون',
      fade: 'تلاشي',
      slide: 'انزلاق',
      zoom: 'تكبير',
      flip: 'شقلبة',
      scale: 'نبض',
      glow: 'توهج',
      shake: 'اهتزاز'
    },
    stages: {
      [EducationStage.PRIMARY]: 'الابتدائية',
      [EducationStage.PREPARATORY]: 'الإعدادية',
      [EducationStage.SECONDARY]: 'الثانوية',
    },
    semesters: {
      [Semester.FIRST]: 'الفصل الأول',
      [Semester.SECOND]: 'الفصل الثاني',
    },
    questionTypes: {
      [QuestionType.MULTIPLE_CHOICE]: 'اختيارات',
      [QuestionType.TRUE_FALSE]: 'صح/خطأ',
      [QuestionType.FILL_IN_THE_BLANK]: 'إكمال',
      [QuestionType.ESSAY]: 'مقالي',
      [QuestionType.MATCHING]: 'توصيل',
      [QuestionType.OTHER]: 'أخرى',
    },
    difficultyLevels: {
      [DifficultyLevel.HIGH]: 'صعب',
      [DifficultyLevel.MEDIUM]: 'متوسط',
      [DifficultyLevel.EASY]: 'سهل',
    }
  },
  en: {
    dashboard: 'Dashboard',
    addQuestion: 'Add Question',
    questions: 'Questions',
    download: 'Download',
    preview: 'Preview',
    settings: 'Settings',
    builder: 'Builder',
    bank: 'Bank',
    library: 'Library',
    cloud: 'Cloud',
    title: 'Quiz Title',
    subject: 'Subject',
    branch: 'Branch',
    unit: 'Unit',
    lesson: 'Lesson',
    timer: 'Timer',
    stage: 'Stage',
    grade: 'Grade',
    finish: 'Finish',
    results: 'Results',
    score: 'Score',
    enterName: 'Enter your name:',
    studentName: 'Student Name',
    enterTest: 'Enter Test',
    points: 'Points',
    search: 'Search...',
    import: 'Import',
    load: 'Load',
    saveToLibrary: 'Save',
    appearance: 'Appearance & Effects',
    bgImage: 'Background Image',
    bgColor: 'Background Color',
    selColor: 'Selected Color',
    selTextColor: 'Selected Text Color',
    transEffect: 'Transition',
    clickEffect: 'Click Effect',
    effects: {
      none: 'None',
      fade: 'Fade',
      slide: 'Slide',
      zoom: 'Zoom',
      flip: 'Flip',
      scale: 'Pulse',
      glow: 'Glow',
      shake: 'Shake'
    },
    stages: {
      [EducationStage.PRIMARY]: 'Primary',
      [EducationStage.PREPARATORY]: 'Preparatory',
      [EducationStage.SECONDARY]: 'Secondary',
    },
    semesters: {
      [Semester.FIRST]: '1st Semester',
      [Semester.SECOND]: '2nd Semester',
    },
    questionTypes: {
      [QuestionType.MULTIPLE_CHOICE]: 'MCQ',
      [QuestionType.TRUE_FALSE]: 'True/False',
      [QuestionType.FILL_IN_THE_BLANK]: 'Fill in',
      [QuestionType.ESSAY]: 'Essay',
      [QuestionType.MATCHING]: 'Matching',
      [QuestionType.OTHER]: 'Other',
    },
    difficultyLevels: {
      [DifficultyLevel.HIGH]: 'Hard',
      [DifficultyLevel.MEDIUM]: 'Medium',
      [DifficultyLevel.EASY]: 'Easy',
    }
  }
};
