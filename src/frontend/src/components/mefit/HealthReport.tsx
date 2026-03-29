import { Activity, Moon, Scale, Utensils } from "lucide-react";
import PureCaneBlissCard from "./PureCaneBlissCard";
import RadialProgress from "./RadialProgress";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const sugarData = [38, 52, 45, 61, 42, 55, 48];

function calcHealthScore(): number {
  let score = 0;

  try {
    const raw = localStorage.getItem("mefit_sleep_log");
    if (raw) {
      const log = JSON.parse(raw) as { bedtime: string; waketime: string }[];
      if (log.length > 0) {
        const entry = log[0];
        const [bh, bm] = entry.bedtime.split(":").map(Number);
        const [wh, wm] = entry.waketime.split(":").map(Number);
        let diff = wh * 60 + wm - (bh * 60 + bm);
        if (diff < 0) diff += 1440;
        if (diff >= 7 * 60) score += 25;
        else score += 10;
      } else score += 15;
    } else score += 15;
  } catch {
    score += 15;
  }

  try {
    const raw = localStorage.getItem("mefit_streak");
    if (raw) {
      const streak = JSON.parse(raw) as { todaySteps?: number };
      if ((streak.todaySteps ?? 0) >= 8000) score += 25;
      else score += 10;
    } else score += 10;
  } catch {
    score += 10;
  }

  score += 25;

  try {
    const raw = localStorage.getItem("mefit_weight_data");
    if (raw) {
      const wd = JSON.parse(raw) as { current?: number; goal?: number };
      if ((wd.current ?? 999) <= (wd.goal ?? 999)) score += 25;
      else score += 12;
    } else score += 12;
  } catch {
    score += 12;
  }

  return Math.min(100, score);
}

export default function HealthReport() {
  const score = calcHealthScore();
  const scoreColor =
    score > 75 ? "#10B981" : score >= 50 ? "#F97316" : "#EF4444";
  const scoreGradient: [string, string] =
    score > 75
      ? ["#10B981", "#059669"]
      : score >= 50
        ? ["#F97316", "#EF4444"]
        : ["#EF4444", "#DC2626"];
  const scoreLabel =
    score > 75
      ? "Excellent — keep it up! 💪"
      : score >= 50
        ? "Good — room to improve! 📈"
        : "Needs attention — let's go! 🚀";
  const showCTA = score < 75;

  const metricCards = [
    {
      label: "Sleep",
      value: 7.2,
      max: 9,
      unit: "hrs",
      color: "#6366F1",
      gradient: ["#6366F1", "#8B5CF6"] as [string, string],
      bg: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.06))",
      icon: <Moon size={18} />,
    },
    {
      label: "Steps",
      value: 7200,
      max: 10000,
      unit: "steps",
      color: "#3B82F6",
      gradient: ["#3B82F6", "#06B6D4"] as [string, string],
      bg: "linear-gradient(135deg, rgba(59,130,246,0.1), rgba(6,182,212,0.06))",
      icon: <Activity size={18} />,
    },
    {
      label: "Diet",
      value: 78,
      max: 100,
      unit: "%",
      color: "#10B981",
      gradient: ["#10B981", "#059669"] as [string, string],
      bg: "linear-gradient(135deg, rgba(16,185,129,0.1), rgba(5,150,105,0.06))",
      icon: <Utensils size={18} />,
    },
    {
      label: "Weight",
      value: 68,
      max: 90,
      unit: "kg",
      color: "#8B5CF6",
      gradient: ["#8B5CF6", "#EC4899"] as [string, string],
      bg: "linear-gradient(135deg, rgba(139,92,246,0.1), rgba(236,72,153,0.06))",
      icon: <Scale size={18} />,
    },
  ];

  return (
    <div className="flex flex-col gap-5 pb-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Weekly Health Report
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Mar 21 – Mar 27, 2026</p>
        </div>
        <span
          className="text-xs font-bold px-3 py-1.5 rounded-full text-white"
          style={{ background: "linear-gradient(90deg, #3B82F6, #10B981)" }}
        >
          AI Generated
        </span>
      </div>

      {/* Large animated health score */}
      <div
        className="rounded-3xl p-6 flex flex-col items-center gap-3"
        style={{
          background: "linear-gradient(135deg, #0F172A, #1E293B)",
          boxShadow: "0 8px 32px rgba(15,23,42,0.25)",
        }}
        data-ocid="report.card"
      >
        <RadialProgress
          value={score}
          max={100}
          label="Health Score"
          unit="/ 100"
          color={scoreColor}
          gradient={scoreGradient}
          icon={<span style={{ fontSize: 22 }}>🏅</span>}
          size={160}
        />
        <p className="text-sm font-medium" style={{ color: scoreColor }}>
          {scoreLabel}
        </p>
      </div>

      {/* 2x2 Metric Cards */}
      <div className="grid grid-cols-2 gap-3">
        {metricCards.map((m) => (
          <div
            key={m.label}
            className="rounded-2xl p-4 flex flex-col items-center gap-2"
            style={{ background: m.bg, border: `1px solid ${m.color}25` }}
          >
            <RadialProgress
              value={m.value}
              max={m.max}
              label={m.label}
              unit={m.unit}
              color={m.color}
              gradient={m.gradient}
              icon={m.icon}
              size={80}
            />
          </div>
        ))}
      </div>

      {/* Pure Cane Bliss CTA if score low */}
      {showCTA && (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-gray-700">
            💡 Personalized suggestion for you:
          </p>
          <PureCaneBlissCard className="bg-slate-800" />
        </div>
      )}

      <div className="flex flex-col gap-3">
        <h2 className="text-base font-bold text-gray-700">Detected Issues</h2>
        {[
          {
            emoji: "🔴",
            title: "High Sugar Consumption Detected",
            desc: "Your avg daily sugar intake was 48g, exceeding the 25g WHO recommendation.",
            borderColor: "#EF4444",
            bg: "rgba(239,68,68,0.05)",
          },
          {
            emoji: "🟡",
            title: "Low Protein Intake",
            desc: "Average protein intake 52g/day. Recommended: 75g for your goal.",
            borderColor: "#F59E0B",
            bg: "rgba(245,158,11,0.05)",
          },
          {
            emoji: "🟢",
            title: "Good Hydration",
            desc: "You met your water goal 5/7 days this week. Great consistency!",
            borderColor: "#10B981",
            bg: "rgba(16,185,129,0.05)",
          },
        ].map(({ emoji, title, desc, borderColor, bg }) => (
          <div
            key={title}
            className="rounded-2xl p-4 flex gap-3"
            style={{
              background: bg,
              border: `1px solid ${borderColor}40`,
              borderLeft: `3px solid ${borderColor}`,
            }}
          >
            <span className="text-base mt-0.5">{emoji}</span>
            <div>
              <p className="font-semibold text-gray-800 text-sm">{title}</p>
              <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                {desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div
        className="rounded-2xl p-5 bg-white"
        style={{ border: "1px solid rgba(239,68,68,0.2)" }}
      >
        <h3 className="font-bold text-gray-800 mb-1">Sugar Intake Analysis</h3>
        <p className="text-gray-400 text-xs mb-4">
          Daily sugar (g) vs 25g WHO limit
        </p>
        <div className="flex items-end justify-between gap-1.5 h-24 mb-4">
          {days.map((day, i) => {
            const pct = Math.min((sugarData[i] / 70) * 100, 100);
            const isHigh = sugarData[i] > 25;
            return (
              <div
                key={day}
                className="flex flex-col items-center gap-1 flex-1"
              >
                <div
                  className="w-full rounded-t-lg"
                  style={{
                    height: `${pct}%`,
                    minHeight: "8px",
                    background: isHigh
                      ? "linear-gradient(180deg, #EF4444, #F97316)"
                      : "linear-gradient(180deg, #10B981, #3B82F6)",
                  }}
                />
                <span className="text-[9px] text-gray-400">{day}</span>
              </div>
            );
          })}
        </div>
        <div
          className="flex items-center justify-between text-xs mb-4"
          style={{
            borderTop: "1px solid rgba(0,0,0,0.06)",
            paddingTop: "12px",
          }}
        >
          <span className="text-gray-500">
            Avg: <span className="font-bold text-red-500">48.7g/day</span>
          </span>
          <span className="text-gray-500">
            Limit: <span className="font-bold text-emerald-500">25g/day</span>
          </span>
        </div>
        <p className="text-gray-600 text-sm mb-4 font-medium">
          💡 Switch to a healthier alternative
        </p>
        <PureCaneBlissCard className="bg-slate-800" />
      </div>

      <div
        className="rounded-2xl p-4"
        style={{
          background: "rgba(107,114,128,0.07)",
          border: "1px solid rgba(107,114,128,0.2)",
        }}
      >
        <p className="text-gray-500 text-xs leading-relaxed">
          <span className="font-bold">⚕ Medical Disclaimer:</span> This app
          provides general wellness information only. It does not constitute
          medical advice, diagnosis, or treatment. Always consult a qualified
          healthcare professional for medical concerns.
        </p>
      </div>
    </div>
  );
}
