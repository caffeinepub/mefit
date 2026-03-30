// Shared localStorage data utility for MeFit

export interface MealLog {
  id: string;
  timestamp: string;
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  sugar: number;
  fat?: number;
  source: "photo" | "voice" | "manual";
}

export interface HealthLog {
  id: string;
  timestamp: string;
  weight?: number;
  steps?: number;
  notes?: string;
}

export interface UploadedReport {
  id: string;
  timestamp: string;
  name: string;
}

export type DataState = "empty" | "partial" | "full";

// ─── Meal Logs ───────────────────────────────────────────────────────────────

export function getMealLogs(): MealLog[] {
  try {
    return JSON.parse(localStorage.getItem("mealLogs") ?? "[]") as MealLog[];
  } catch {
    return [];
  }
}

export function addMealLog(log: Omit<MealLog, "id" | "timestamp">): void {
  const existing = getMealLogs();
  const entry: MealLog = {
    id: String(Date.now()),
    timestamp: new Date().toISOString(),
    ...log,
  };
  localStorage.setItem("mealLogs", JSON.stringify([entry, ...existing]));
  incrementStreak();
}

// ─── Health Logs ─────────────────────────────────────────────────────────────

export function getHealthLogs(): HealthLog[] {
  try {
    return JSON.parse(
      localStorage.getItem("healthLogs") ?? "[]",
    ) as HealthLog[];
  } catch {
    return [];
  }
}

export function addHealthLog(log: Omit<HealthLog, "id" | "timestamp">): void {
  const existing = getHealthLogs();
  const entry: HealthLog = {
    id: String(Date.now()),
    timestamp: new Date().toISOString(),
    ...log,
  };
  localStorage.setItem("healthLogs", JSON.stringify([entry, ...existing]));
  incrementStreak();
}

// ─── Uploaded Reports ─────────────────────────────────────────────────────────

export function getUploadedReports(): UploadedReport[] {
  try {
    return JSON.parse(
      localStorage.getItem("uploadedReports") ?? "[]",
    ) as UploadedReport[];
  } catch {
    return [];
  }
}

export function addUploadedReport(
  r: Omit<UploadedReport, "id" | "timestamp">,
): void {
  const existing = getUploadedReports();
  const entry: UploadedReport = {
    id: String(Date.now()),
    timestamp: new Date().toISOString(),
    ...r,
  };
  localStorage.setItem("uploadedReports", JSON.stringify([entry, ...existing]));
}

// ─── Steps ────────────────────────────────────────────────────────────────────

export function getSteps(): number {
  try {
    return Number(localStorage.getItem("steps") ?? "0") || 0;
  } catch {
    return 0;
  }
}

export function setSteps(n: number): void {
  localStorage.setItem("steps", String(n));
}

// ─── Streak ───────────────────────────────────────────────────────────────────

export function getStreak(): number {
  try {
    return Number(localStorage.getItem("streak") ?? "0") || 0;
  } catch {
    return 0;
  }
}

export function incrementStreak(): void {
  const today = new Date().toISOString().split("T")[0];
  const lastActive = localStorage.getItem("streakLastDate") ?? "";
  if (lastActive === today) return; // already counted today
  localStorage.setItem("streakLastDate", today);
  const current = getStreak();
  localStorage.setItem("streak", String(current + 1));
}

// ─── Data State ───────────────────────────────────────────────────────────────

export function getDataState(): DataState {
  const meals = getMealLogs();
  const health = getHealthLogs();
  const reports = getUploadedReports();

  if (meals.length === 0 && health.length === 0 && reports.length === 0) {
    return "empty";
  }
  if (meals.length >= 3 && health.length >= 1 && reports.length >= 1) {
    return "full";
  }
  return "partial";
}

// ─── Derived analytics ────────────────────────────────────────────────────────

export interface NutrientAverages {
  calories: number;
  protein: number;
  carbs: number;
  sugar: number;
}

export function getNutrientAverages(): NutrientAverages | null {
  const meals = getMealLogs();
  if (meals.length === 0) return null;
  const sum = meals.reduce(
    (acc, m) => ({
      calories: acc.calories + m.calories,
      protein: acc.protein + m.protein,
      carbs: acc.carbs + m.carbs,
      sugar: acc.sugar + m.sugar,
    }),
    { calories: 0, protein: 0, carbs: 0, sugar: 0 },
  );
  return {
    calories: Math.round(sum.calories / meals.length),
    protein: Math.round(sum.protein / meals.length),
    carbs: Math.round(sum.carbs / meals.length),
    sugar: Math.round(sum.sugar / meals.length),
  };
}

export interface DetectedIssue {
  emoji: string;
  title: string;
  desc: string;
  borderColor: string;
  bg: string;
}

export function getDetectedIssues(): DetectedIssue[] {
  const avg = getNutrientAverages();
  if (!avg) return [];
  const issues: DetectedIssue[] = [];

  if (avg.sugar > 40) {
    issues.push({
      emoji: "🔴",
      title: "High Sugar Consumption",
      desc: `Your avg sugar intake is ${avg.sugar}g/day, exceeding the 25g WHO recommendation.`,
      borderColor: "#EF4444",
      bg: "rgba(239,68,68,0.05)",
    });
  }
  if (avg.protein < 50) {
    issues.push({
      emoji: "🟡",
      title: "Low Protein Intake",
      desc: `Your avg protein intake is ${avg.protein}g/day. Aim for at least 50g.`,
      borderColor: "#F59E0B",
      bg: "rgba(245,158,11,0.05)",
    });
  }
  if (avg.calories > 2500) {
    issues.push({
      emoji: "🟠",
      title: "High Calorie Intake",
      desc: `Avg ${avg.calories} kcal/day is above typical daily needs. Consider portion sizes.`,
      borderColor: "#F97316",
      bg: "rgba(249,115,22,0.05)",
    });
  }
  return issues;
}

export function calcHealthScore(): number {
  const state = getDataState();
  if (state === "empty") return 0;
  const avg = getNutrientAverages();
  if (!avg) return 0;

  let score = 50;
  if (avg.protein >= 50) score += 15;
  if (avg.sugar <= 25) score += 15;
  else if (avg.sugar <= 40) score += 7;
  const steps = getSteps();
  if (steps >= 10000) score += 20;
  else if (steps >= 5000) score += 10;
  return Math.min(100, score);
}

// ─── Food Corrections ─────────────────────────────────────────────────────────

export interface FoodCorrectionEntry {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar: number;
}

export function getFoodCorrections(): Record<string, FoodCorrectionEntry> {
  try {
    return JSON.parse(
      localStorage.getItem("foodCorrections") || "{}",
    ) as Record<string, FoodCorrectionEntry>;
  } catch {
    return {};
  }
}

export function saveFoodCorrection(
  originalName: string,
  data: FoodCorrectionEntry,
): void {
  const corrections = getFoodCorrections();
  corrections[originalName.toLowerCase()] = data;
  localStorage.setItem("foodCorrections", JSON.stringify(corrections));
}
