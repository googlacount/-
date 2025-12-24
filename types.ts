
export enum QuestionType {
  MULTIPLE_CHOICE = 'Multiple Choice',
  TRUE_FALSE = 'True/False',
  FILL_IN_THE_BLANK = 'Fill in the blank',
  ESSAY = 'Essay',
  MATCHING = 'Matching',
  OTHER = 'Other'
}

export enum DifficultyLevel {
  HIGH = 'High',
  MEDIUM = 'Medium',
  EASY = 'Easy'
}

export enum EducationStage {
  PRIMARY = 'Primary',
  PREPARATORY = 'Preparatory',
  SECONDARY = 'Secondary'
}

export enum Semester {
  FIRST = 'First',
  SECOND = 'Second'
}

export interface Choice {
  id: string;
  text: string;
  isCorrect: boolean;
  image?: string; // base64
  matchText?: string; // For Matching type questions
}

export interface Question {
  id: string;
  type: QuestionType;
  difficulty: DifficultyLevel;
  category: string;
  text: string;
  image?: string; // base64
  choices: Choice[];
  correctAnswer?: string; // For fill in blank or essay (optional)
  points: number;
  bgColor?: string; // Custom bg color for this question
  // Classification fields for the bank
  stage?: EducationStage;
  grade?: string;
  subject?: string;
  semester?: Semester;
  branch?: string;
}

export interface QuizAppearance {
  backgroundColor: string;
  answerBoxBg: string;
  answerTextColor: string;
  selectedColor: string;
  selectedTextColor: string;
  fontSizeChoices: number;
  spacingChoices: number;
  borderStyle: 'none' | 'solid' | 'dashed' | 'double';
  showSideColumn: boolean;
}

export interface CloudConfig {
  firebaseConfig?: string; // JSON string or URL
  cloudUrl?: string; // API endpoint for results/banks
  folderName?: string; // Folder name for storage
  syncGrades: boolean;
  syncTests: boolean;
  syncBank: boolean;
}

export interface QuizSettings {
  language: 'en' | 'ar';
  title: string;
  className: string;
  subject: string;
  branch: string;
  unit: string;
  lesson: string;
  timerEnabled: boolean;
  timerSeconds: number;
  teacherWhatsApp: string;
  skipNameEntry: boolean;
  welcomeMessage: string;
  messageDuration: number;
  maxAttempts: number; // 0 for unlimited, 1 for single, N for specific
  appearance: QuizAppearance;
  cloudConfig: CloudConfig;
  schedulingEnabled: boolean;
  startTime?: string;
  endTime?: string;
  preventSplitScreen: boolean;
  preventScreenshot: boolean;
  offlineMode: boolean;
  designerName?: string;
  designerLogo?: string;
  copyrightPosition: 'left' | 'center' | 'right';
  // Default classification for new questions
  defaultStage?: EducationStage;
  defaultGrade?: string;
  defaultSemester?: Semester;
}

export interface QuizData {
  questions: Question[];
  settings: QuizSettings;
}

export interface SavedQuizEntry {
  id: string;
  data: QuizData;
  savedAt: string;
}
