
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
  stage?: EducationStage;
  grade?: string;
  subject?: string;
  semester?: Semester;
  branch?: string;
}

export interface QuizAppearance {
  backgroundColor: string;
  backgroundImage?: string; // New: Background Image
  answerBoxBg: string;
  answerTextColor: string;
  selectedColor: string;
  selectedTextColor: string;
  clickEffect: 'none' | 'pulse' | 'shake' | 'glow' | 'scale'; // New: Click Effect
  transitionEffect: 'none' | 'fade' | 'slide' | 'zoom' | 'flip'; // New: Transition Effect
  fontSizeChoices: number;
  spacingChoices: number;
  borderStyle: 'none' | 'solid' | 'dashed' | 'double';
  showSideColumn: boolean;
}

export interface CloudConfig {
  firebaseConfig?: string;
  cloudUrl?: string;
  folderName?: string;
  syncGrades: boolean;
  syncTests: boolean;
  syncBank: boolean;
}

export interface BrandingConfig {
  type: 'none' | 'text' | 'image' | 'both';
  text: string;
  image?: string;
  position: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  textSize: number; 
  imageSize: number;
  color: string;
  fontFamily: string;
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
  maxAttempts: number;
  appearance: QuizAppearance;
  cloudConfig: CloudConfig;
  brandingConfig: BrandingConfig;
  schedulingEnabled: boolean;
  startTime?: string; // ISO String
  endTime?: string;   // ISO String
  schedulingMessage?: string;
  preventSplitScreen: boolean;
  preventScreenshot: boolean;
  offlineMode: boolean;
  designerName?: string;
  designerLogo?: string;
  copyrightPosition: 'left' | 'center' | 'right';
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
