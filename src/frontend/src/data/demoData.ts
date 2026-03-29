import type {
  BodySnapshot,
  Challenge,
  ChallengeProgress,
  DietLog,
  FitnessLog,
  HealthLog,
  MediaItem,
  MotivationalQuote,
  PregnancyReport,
  Reminder,
  UserProfile,
  WeightEntry,
} from "../types";

export const DEMO_USERS: UserProfile[] = [
  {
    id: "sarah",
    role: "user",
    name: "Sarah Johnson",
    weight: 68,
    height: 165,
    pregnancyWeek: 28,
    bloodPressure: "120/80",
    bloodSugar: "95 mg/dL",
    lmp: "2024-07-01",
    friends: ["dr_jones", "emma_w"],
  },
  {
    id: "dr_jones",
    role: "doctor",
    name: "Dr. Emily Jones",
    weight: 62,
    height: 168,
    pregnancyWeek: 0,
    bloodPressure: "",
    bloodSugar: "",
    lmp: "",
    friends: ["sarah"],
  },
  {
    id: "nutritionist_amy",
    role: "nutritionist",
    name: "Amy Chen",
    weight: 58,
    height: 160,
    pregnancyWeek: 0,
    bloodPressure: "",
    bloodSugar: "",
    lmp: "",
    friends: ["sarah"],
  },
  {
    id: "emma_w",
    role: "user",
    name: "Emma Williams",
    weight: 72,
    height: 162,
    pregnancyWeek: 22,
    bloodPressure: "118/75",
    bloodSugar: "88 mg/dL",
    lmp: "2024-08-12",
    friends: ["sarah"],
  },
];

const today = new Date().toISOString().split("T")[0];

export const DEMO_DIET_LOGS: DietLog[] = [
  {
    id: "d1",
    userId: "sarah",
    date: today,
    mealType: "breakfast",
    items: "Oatmeal with berries, Greek yogurt",
    calories: 380,
    protein: 18,
    carbs: 52,
    fat: 8,
  },
  {
    id: "d2",
    userId: "sarah",
    date: today,
    mealType: "lunch",
    items: "Grilled chicken salad, whole wheat bread",
    calories: 520,
    protein: 42,
    carbs: 38,
    fat: 16,
  },
  {
    id: "d3",
    userId: "sarah",
    date: today,
    mealType: "snack",
    items: "Apple, almonds",
    calories: 210,
    protein: 5,
    carbs: 28,
    fat: 9,
  },
  {
    id: "d4",
    userId: "emma_w",
    date: today,
    mealType: "breakfast",
    items: "Smoothie bowl, granola",
    calories: 420,
    protein: 12,
    carbs: 65,
    fat: 10,
  },
];

export const DEMO_FITNESS_LOGS: FitnessLog[] = [
  {
    id: "f1",
    userId: "sarah",
    date: today,
    steps: 4200,
    exerciseType: "Walking",
    duration: 35,
    notes: "Prenatal walk in the park, feeling great!",
  },
  {
    id: "f2",
    userId: "sarah",
    date: today,
    steps: 800,
    exerciseType: "Prenatal Yoga",
    duration: 20,
    notes: "Gentle stretching, focused on breathing",
  },
  {
    id: "f3",
    userId: "emma_w",
    date: today,
    steps: 6100,
    exerciseType: "Swimming",
    duration: 30,
    notes: "Light laps",
  },
];

export const DEMO_HEALTH_LOGS: HealthLog[] = [
  {
    id: "h1",
    userId: "sarah",
    date: today,
    logType: "Blood Pressure",
    value: "120/80 mmHg",
  },
  {
    id: "h2",
    userId: "sarah",
    date: today,
    logType: "Blood Sugar",
    value: "95 mg/dL",
  },
  {
    id: "h3",
    userId: "sarah",
    date: "2024-11-01",
    logType: "Weight",
    value: "67 kg",
  },
];

export const DEMO_REPORTS: PregnancyReport[] = [
  {
    id: "r1",
    userId: "sarah",
    date: "2024-11-15",
    doctorName: "Dr. Emily Jones",
    notes:
      "Everything looks perfect! Baby is in great position. Continue prenatal vitamins.",
  },
  {
    id: "r2",
    userId: "sarah",
    date: "2024-10-01",
    doctorName: "Dr. Emily Jones",
    notes: "Anatomy scan completed. All measurements within normal range.",
  },
];

export const DEMO_REMINDERS: Reminder[] = [
  {
    id: "rem1",
    userId: "sarah",
    reminderType: "medicine",
    title: "Prenatal Vitamin",
    datetime: `${today}T08:00`,
    repeat: "daily",
  },
  {
    id: "rem2",
    userId: "sarah",
    reminderType: "appointment",
    title: "Dr. Jones Checkup",
    datetime: "2024-12-20T10:30",
    repeat: "none",
  },
  {
    id: "rem3",
    userId: "sarah",
    reminderType: "checkup",
    title: "Blood Pressure Check",
    datetime: "2024-12-18T09:00",
    repeat: "weekly",
  },
  {
    id: "rem4",
    userId: "sarah",
    reminderType: "medicine",
    title: "Iron Supplement",
    datetime: `${today}T12:00`,
    repeat: "daily",
  },
];

export const DEMO_CHALLENGES: Challenge[] = [
  {
    id: "ch1",
    title: "Walk 5000 Steps Daily",
    description:
      "Stay active with gentle daily walks during your pregnancy journey.",
    targetValue: 5000,
    unit: "steps",
    isActive: true,
  },
  {
    id: "ch2",
    title: "Drink 8 Glasses of Water",
    description: "Stay hydrated for you and your baby.",
    targetValue: 8,
    unit: "glasses",
    isActive: true,
  },
  {
    id: "ch3",
    title: "Eat 3 Balanced Meals",
    description: "Maintain consistent nutrition with balanced meals each day.",
    targetValue: 3,
    unit: "meals",
    isActive: true,
  },
];

export const DEMO_PROGRESS: ChallengeProgress[] = [
  { userId: "sarah", challengeId: "ch1", currentValue: 5000 },
  { userId: "sarah", challengeId: "ch2", currentValue: 6 },
  { userId: "sarah", challengeId: "ch3", currentValue: 2 },
  { userId: "emma_w", challengeId: "ch1", currentValue: 6100 },
  { userId: "emma_w", challengeId: "ch2", currentValue: 7 },
];

export const DEMO_MEDIA: MediaItem[] = [
  {
    id: "m1",
    mediaType: "tip",
    title: "Nutrition in Third Trimester",
    content:
      "Focus on iron-rich foods, calcium, and omega-3 fatty acids. Your baby needs 200mg of DHA daily for brain development.",
  },
  {
    id: "m2",
    mediaType: "tip",
    title: "Safe Prenatal Exercises",
    content:
      "Walking, swimming, and yoga are great options. Avoid lying flat on your back after week 20. Listen to your body!",
  },
  {
    id: "m3",
    mediaType: "video",
    title: "Gentle Prenatal Yoga Flow",
    content:
      "20-minute guided prenatal yoga session perfect for all trimesters.",
    link: "https://www.youtube.com/watch?v=placeholder1",
  },
  {
    id: "m4",
    mediaType: "tip",
    title: "Managing Pregnancy Fatigue",
    content:
      "Rest when you need to, take short naps, maintain a consistent sleep schedule, and stay hydrated throughout the day.",
  },
  {
    id: "m5",
    mediaType: "video",
    title: "Breathing Techniques for Labor",
    content:
      "Learn essential breathing exercises to prepare for labor and delivery.",
    link: "https://www.youtube.com/watch?v=placeholder2",
  },
  {
    id: "m6",
    mediaType: "tip",
    title: "Baby Kicks & Fetal Movement",
    content:
      "Track kicks daily starting at week 28. Aim for 10 movements within 2 hours. Contact your doctor if you notice changes.",
  },
];

export const DEMO_QUOTES: MotivationalQuote[] = [
  {
    id: "q1",
    text: "You are growing a whole human being. Be proud of every step of this incredible journey.",
    author: "Mama on a Mission",
  },
  {
    id: "q2",
    text: "Strength doesn't come from what you can do. It comes from overcoming the things you once thought you couldn't.",
    author: "Rikki Rogers",
  },
  {
    id: "q3",
    text: "Making the decision to have a child is momentous. It is to decide forever to have your heart go walking outside your body.",
    author: "Elizabeth Stone",
  },
  {
    id: "q4",
    text: "Your body knows how to do this. Trust the process and be gentle with yourself.",
    author: "Mama on a Mission",
  },
  {
    id: "q5",
    text: "A baby fills a place in your heart that you never knew was empty.",
    author: "Unknown",
  },
];

export const DEMO_SNAPSHOTS: BodySnapshot[] = [];

export const DEMO_WEIGHT_HISTORY: WeightEntry[] = [
  { date: "2024-08-01", weight: 62, bmi: 22.8 },
  { date: "2024-09-01", weight: 63.5, bmi: 23.3 },
  { date: "2024-10-01", weight: 65, bmi: 23.9 },
  { date: "2024-11-01", weight: 67, bmi: 24.6 },
  { date: "2024-12-01", weight: 68, bmi: 25.0 },
];

export const LEADERBOARD = [
  {
    userId: "emma_w",
    name: "Emma Williams",
    weeklySteps: 38200,
    dietScore: 92,
    challengeScore: 87,
  },
  {
    userId: "sarah",
    name: "Sarah Johnson",
    weeklySteps: 35000,
    dietScore: 88,
    challengeScore: 82,
  },
  {
    userId: "lisa_m",
    name: "Lisa Martinez",
    weeklySteps: 29500,
    dietScore: 85,
    challengeScore: 78,
  },
  {
    userId: "jade_k",
    name: "Jade Kim",
    weeklySteps: 25000,
    dietScore: 80,
    challengeScore: 74,
  },
];
