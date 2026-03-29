export type Role =
  | "user"
  | "doctor"
  | "nutritionist"
  | "yoga_expert"
  | "influencer";

export interface UserProfile {
  id: string;
  role: Role;
  name: string;
  weight: number;
  height: number;
  pregnancyWeek: number;
  bloodPressure: string;
  bloodSugar: string;
  lmp: string;
  friends: string[];
}

export interface DietLog {
  id: string;
  userId: string;
  date: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  items: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  photoUrl?: string;
}

export interface FitnessLog {
  id: string;
  userId: string;
  date: string;
  steps: number;
  exerciseType: string;
  duration: number;
  notes: string;
}

export interface HealthLog {
  id: string;
  userId: string;
  date: string;
  logType: string;
  value: string;
}

export interface PregnancyReport {
  id: string;
  userId: string;
  date: string;
  doctorName: string;
  notes: string;
  fileUrl?: string;
  fileName?: string;
}

export interface Reminder {
  id: string;
  userId: string;
  reminderType: "medicine" | "appointment" | "checkup";
  title: string;
  datetime: string;
  repeat: "none" | "daily" | "weekly";
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  targetValue: number;
  unit: string;
  isActive: boolean;
}

export interface ChallengeProgress {
  userId: string;
  challengeId: string;
  currentValue: number;
}

export interface MediaItem {
  id: string;
  mediaType: "tip" | "video";
  title: string;
  content: string;
  link?: string;
}

export interface MotivationalQuote {
  id: string;
  text: string;
  author: string;
}

export interface BodySnapshot {
  id: string;
  userId: string;
  date: string;
  photoUrl: string;
}

export interface WeightEntry {
  date: string;
  weight: number;
  bmi: number;
}

export interface SleepEntry {
  date: string;
  bedtime: string;
  waketime: string;
  deepMins: number;
  lightMins: number;
  awakeMins: number;
}

export interface CycleEntry {
  date: string;
  type: "period" | "fertile" | "predicted";
  symptoms: string[];
}

export interface StreakData {
  currentStreak: number;
  lastWalkDate: string;
  longestStreak: number;
  todaySteps: number;
}

export type Tab = "home" | "health" | "diet" | "planner" | "profile";

export interface MeFitUser {
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  height: number;
  weight: number;
  goal: "loss" | "gain" | "maintain";
  lifestyle: "veg" | "nonveg" | "vegan" | "eggetarian";
}

export interface SOSContact {
  id: string;
  name: string;
  phone: string;
  isPrimary: boolean;
}

export type AppScreen = "login" | "role" | "onboarding" | "intro" | "app";
