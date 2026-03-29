import {
  AlertTriangle,
  CheckCircle,
  Info,
  Stethoscope,
  Zap,
} from "lucide-react";
import { useState } from "react";
import type {
  DietLog,
  FitnessLog,
  MotivationalQuote,
  PregnancyReport,
  Reminder,
  Role,
  UserProfile,
} from "../types";
import AvatarDisplay from "./mefit/AvatarDisplay";
import DoctorDirectory from "./mefit/DoctorDirectory";
import PatientDashboard from "./mefit/PatientDashboard";
import RadialProgress from "./mefit/RadialProgress";
import ReelsSection from "./mefit/ReelsSection";

interface Props {
  user: UserProfile;
  dietLogs: DietLog[];
  fitnessLogs: FitnessLog[];
  reminders: Reminder[];
  quotes: MotivationalQuote[];
  reports: PregnancyReport[];
  allUsers: UserProfile[];
  role?: Role | null;
  mefitUserName?: string;
}

const INSIGHTS = [
  {
    id: "sugar",
    icon: AlertTriangle,
    color: "#F97316",
    bg: "rgba(249,115,22,0.12)",
    border: "#F97316",
    text: "Sugar intake slightly high today — try cutting back on processed foods.",
  },
  {
    id: "water",
    icon: CheckCircle,
    color: "#10B981",
    bg: "rgba(16,185,129,0.12)",
    border: "#10B981",
    text: "Great hydration! You've hit 80% of your daily water goal. Keep it up!",
  },
  {
    id: "events",
    icon: Info,
    color: "#3B82F6",
    bg: "rgba(59,130,246,0.12)",
    border: "#3B82F6",
    text: "2 events this week — your pre-event diet plan is ready in Planner.",
  },
  {
    id: "steps",
    icon: Zap,
    color: "#8B5CF6",
    bg: "rgba(139,92,246,0.12)",
    border: "#8B5CF6",
    text: "You're 72% towards your weekly step goal. A short walk today will do it!",
  },
];

function HealthScoreRing({ score }: { score: number }) {
  const size = 120;
  const stroke = 10;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const filled = (score / 100) * circ;
  const color = score >= 70 ? "#10B981" : score >= 50 ? "#F97316" : "#EF4444";

  return (
    <div className="flex flex-col items-center gap-2">
      <svg
        width={size}
        height={size}
        role="img"
        aria-label={`Health score: ${score} out of 100`}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circ}`}
          strokeDashoffset={circ / 4}
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />
        <text
          x={size / 2}
          y={size / 2 - 6}
          textAnchor="middle"
          fill="white"
          fontSize="26"
          fontWeight="700"
        >
          {score}
        </text>
        <text
          x={size / 2}
          y={size / 2 + 14}
          textAnchor="middle"
          fill="#94A3B8"
          fontSize="11"
        >
          Health Score
        </text>
      </svg>
    </div>
  );
}

export default function Dashboard({
  user,
  dietLogs,
  fitnessLogs,
  reminders: _reminders,
  quotes: _quotes,
  reports: _reports,
  allUsers: _allUsers,
  role,
  mefitUserName,
}: Props) {
  const today = new Date().toISOString().split("T")[0];
  const todayDiet = dietLogs.filter(
    (d) => d.userId === user.id && d.date === today,
  );
  const [showDoctors, setShowDoctors] = useState(false);
  const todayFitness = fitnessLogs.filter(
    (f) => f.userId === user.id && f.date === today,
  );
  const totalCal = todayDiet.reduce((s, d) => s + d.calories, 0);
  const totalSteps = todayFitness.reduce((s, f) => s + f.steps, 0);

  const effectiveRole = role ?? user.role;

  if (effectiveRole === "doctor" || effectiveRole === "nutritionist") {
    return (
      <PatientDashboard
        doctorName={mefitUserName ?? user.name}
        role={effectiveRole}
      />
    );
  }

  const displayName = (mefitUserName ?? user.name).split(" ")[0];
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const healthScore = 78;

  const quickStats = [
    {
      label: "Calories",
      value: totalCal || 1840,
      unit: "kcal",
      color: "#F97316",
    },
    { label: "Steps", value: totalSteps || 7200, unit: "", color: "#3B82F6" },
    { label: "Water", value: 1.8, unit: "L", color: "#06B6D4" },
    { label: "Protein", value: 62, unit: "g", color: "#10B981" },
  ];

  return (
    <div className="space-y-4" style={{ animation: "float-up 0.4s ease" }}>
      <style>{`
        @keyframes idle-bounce {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>

      {/* Welcome Banner */}
      <div
        className="rounded-3xl p-5"
        style={{
          background:
            "linear-gradient(135deg, #1E3A8A 0%, #4C1D95 50%, #1E40AF 100%)",
          boxShadow: "0 8px 32px rgba(59,130,246,0.25)",
        }}
      >
        <p className="text-blue-300 text-xs font-medium uppercase tracking-widest">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
        <h1 className="text-white text-2xl font-bold mt-1">
          {greeting}, {displayName}! 👋
        </h1>
        <p className="text-blue-200 text-sm mt-1">
          Your wellness journey continues. Stay strong!
        </p>
      </div>

      {/* Avatar + Health Score */}
      <div
        className="rounded-3xl overflow-hidden"
        style={{
          background: "rgba(10,20,50,0.8)",
          border: "1px solid rgba(59,130,246,0.2)",
          boxShadow:
            "0 8px 40px rgba(0,0,0,0.4), 0 0 60px rgba(59,130,246,0.08)",
        }}
      >
        <div
          className="flex flex-col justify-center items-center pt-6 pb-2 relative"
          style={{ minHeight: "280px" }}
        >
          {/* Radial glow behind avatar */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(59,130,246,0.18) 0%, rgba(139,92,246,0.08) 45%, transparent 70%)",
            }}
          />
          {/* Idle bounce wrapper */}
          <div
            className="relative z-10"
            style={{ animation: "idle-bounce 2.5s ease-in-out infinite" }}
          >
            <AvatarDisplay size={180} userName={displayName} />
          </div>
        </div>

        <div className="flex justify-center pb-4">
          <HealthScoreRing score={healthScore} />
        </div>
      </div>

      {/* Find Doctor CTA */}
      {role === "user" && (
        <button
          type="button"
          onClick={() => setShowDoctors(true)}
          data-ocid="home.primary_button"
          className="w-full py-3 rounded-2xl text-white font-semibold text-sm flex items-center justify-center gap-2"
          style={{
            background:
              "linear-gradient(135deg, rgba(59,130,246,0.25), rgba(139,92,246,0.25))",
            border: "1px solid rgba(59,130,246,0.3)",
          }}
        >
          <Stethoscope size={16} />
          Find a Doctor or Specialist
        </button>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-2">
        {quickStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl p-3 flex flex-col items-center gap-1"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <span className="text-lg font-bold" style={{ color: stat.color }}>
              {stat.value}
            </span>
            <span className="text-[9px] text-slate-400 text-center">
              {stat.label}
              {stat.unit ? ` (${stat.unit})` : ""}
            </span>
          </div>
        ))}
      </div>

      {/* AI Insights */}
      <div
        className="rounded-3xl p-4"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: "#818CF8" }}
          >
            AI Insights
          </span>
          <span
            className="flex-1 h-px"
            style={{ background: "rgba(129,140,248,0.2)" }}
          />
        </div>
        <div className="space-y-2">
          {INSIGHTS.map((ins) => {
            const Icon = ins.icon;
            return (
              <div
                key={ins.id}
                className="flex items-start gap-3 rounded-2xl p-3"
                style={{
                  background: ins.bg,
                  borderLeft: `3px solid ${ins.border}`,
                }}
              >
                <Icon
                  size={16}
                  style={{ color: ins.color, flexShrink: 0, marginTop: 1 }}
                />
                <p className="text-xs text-slate-300 leading-relaxed">
                  {ins.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Radial Metrics */}
      <div
        className="rounded-3xl p-4"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <p
          className="text-xs font-bold uppercase tracking-widest mb-3"
          style={{ color: "#818CF8" }}
        >
          Today's Vitals
        </p>
        <div className="grid grid-cols-4 gap-2">
          {[
            {
              label: "Steps",
              value: totalSteps || 7200,
              max: 10000,
              color: "#3B82F6",
              gradient: ["#3B82F6", "#06B6D4"] as [string, string],
              icon: "👟",
            },
            {
              label: "Water",
              value: 1.8,
              max: 2.5,
              color: "#06B6D4",
              gradient: ["#06B6D4", "#3B82F6"] as [string, string],
              icon: "💧",
            },
            {
              label: "Sugar",
              value: 45,
              max: 50,
              color: "#F97316",
              gradient: ["#F97316", "#EF4444"] as [string, string],
              icon: "🍬",
            },
            {
              label: "Protein",
              value: 62,
              max: 75,
              color: "#10B981",
              gradient: ["#10B981", "#059669"] as [string, string],
              icon: "💪",
            },
          ].map((m) => (
            <RadialProgress
              key={m.label}
              value={m.value}
              max={m.max}
              label={m.label}
              unit=""
              color={m.color}
              gradient={m.gradient}
              icon={<span>{m.icon}</span>}
              size={70}
            />
          ))}
        </div>
      </div>

      {/* Reels */}
      {role === "user" && (
        <div
          className="rounded-3xl p-4"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <ReelsSection />
        </div>
      )}

      <footer className="text-center py-4">
        <p className="text-slate-600 text-xs">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
      {showDoctors && <DoctorDirectory onClose={() => setShowDoctors(false)} />}
    </div>
  );
}
