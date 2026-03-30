import { Activity, Moon, Scale, Utensils } from "lucide-react";
import { Camera, FileText, Heart } from "lucide-react";
import {
  calcHealthScore,
  getDataState,
  getDetectedIssues,
  getMealLogs,
  getNutrientAverages,
} from "../../utils/userDataStore";
import PureCaneBlissCard from "./PureCaneBlissCard";
import RadialProgress from "./RadialProgress";

export default function HealthReport() {
  const dataState = getDataState();

  // ── Empty state ──────────────────────────────────────────────────────────────
  if (dataState === "empty") {
    return (
      <div className="flex flex-col gap-5 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Weekly Health Report
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Your personalised health insights
          </p>
        </div>
        <div
          className="rounded-3xl p-8 flex flex-col items-center text-center gap-4"
          style={{
            background:
              "linear-gradient(135deg, rgba(99,102,241,0.06), rgba(139,92,246,0.06))",
            border: "1px solid rgba(139,92,246,0.15)",
          }}
          data-ocid="report.empty_state"
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }}
          >
            <Heart size={28} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-gray-800 text-lg">No data yet</p>
            <p className="text-gray-500 text-sm mt-1 leading-relaxed">
              Start by adding your meals, health data, or reports.
              <br />
              Your insights will appear here automatically.
            </p>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <div
              className="flex items-center gap-3 rounded-xl p-3 text-left"
              style={{
                background: "rgba(249,115,22,0.08)",
                border: "1px solid rgba(249,115,22,0.2)",
              }}
            >
              <Camera size={16} style={{ color: "#F97316" }} />
              <span className="text-sm text-gray-700">
                Upload a meal photo in the Diet tab
              </span>
            </div>
            <div
              className="flex items-center gap-3 rounded-xl p-3 text-left"
              style={{
                background: "rgba(59,130,246,0.08)",
                border: "1px solid rgba(59,130,246,0.2)",
              }}
            >
              <Activity size={16} style={{ color: "#3B82F6" }} />
              <span className="text-sm text-gray-700">
                Log steps or weight in the Streak tab
              </span>
            </div>
            <div
              className="flex items-center gap-3 rounded-xl p-3 text-left"
              style={{
                background: "rgba(16,185,129,0.08)",
                border: "1px solid rgba(16,185,129,0.2)",
              }}
            >
              <FileText size={16} style={{ color: "#10B981" }} />
              <span className="text-sm text-gray-700">
                Upload a medical report in the Tracker tab
              </span>
            </div>
          </div>
        </div>
        <Disclaimer />
      </div>
    );
  }

  // ── Partial state ─────────────────────────────────────────────────────────────
  if (dataState === "partial") {
    const meals = getMealLogs();
    const avg = getNutrientAverages();
    return (
      <div className="flex flex-col gap-5 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Weekly Health Report
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Partial insights — keep logging!
          </p>
        </div>
        <div
          className="rounded-2xl p-4"
          style={{
            background: "rgba(245,158,11,0.07)",
            border: "1px solid rgba(245,158,11,0.25)",
          }}
          data-ocid="report.card"
        >
          <p className="text-amber-700 font-semibold text-sm">
            ⚠ Not enough data for a full report
          </p>
          <p className="text-amber-600 text-xs mt-1">
            Log at least 3 meals and 1 health entry. You have {meals.length}{" "}
            meal{meals.length !== 1 ? "s" : ""} so far.
          </p>
        </div>
        {avg && (
          <div className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-gray-700">
              What we know so far
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  label: "Avg Calories",
                  value: `${avg.calories} kcal`,
                  color: "#F97316",
                },
                {
                  label: "Avg Protein",
                  value: `${avg.protein}g`,
                  color: "#3B82F6",
                },
                {
                  label: "Avg Carbs",
                  value: `${avg.carbs}g`,
                  color: "#10B981",
                },
                {
                  label: "Avg Sugar",
                  value: `${avg.sugar}g`,
                  color: "#8B5CF6",
                },
              ].map(({ label, value, color }) => (
                <div
                  key={label}
                  className="rounded-2xl p-4"
                  style={{
                    background: `${color}10`,
                    border: `1px solid ${color}25`,
                  }}
                >
                  <p className="text-xs text-gray-500">{label}</p>
                  <p className="font-bold text-lg mt-1" style={{ color }}>
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
        <Disclaimer />
      </div>
    );
  }

  // ── Full state ────────────────────────────────────────────────────────────────
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
  const issues = getDetectedIssues();
  const avg = getNutrientAverages();

  const metricCards = avg
    ? [
        {
          label: "Calories",
          value: avg.calories,
          max: 2500,
          unit: "kcal",
          color: "#F97316",
          gradient: ["#F97316", "#EF4444"] as [string, string],
          bg: "linear-gradient(135deg, rgba(249,115,22,0.1), rgba(239,68,68,0.06))",
          icon: <Utensils size={18} />,
        },
        {
          label: "Protein",
          value: avg.protein,
          max: 100,
          unit: "g",
          color: "#3B82F6",
          gradient: ["#3B82F6", "#06B6D4"] as [string, string],
          bg: "linear-gradient(135deg, rgba(59,130,246,0.1), rgba(6,182,212,0.06))",
          icon: <Activity size={18} />,
        },
        {
          label: "Carbs",
          value: avg.carbs,
          max: 300,
          unit: "g",
          color: "#10B981",
          gradient: ["#10B981", "#059669"] as [string, string],
          bg: "linear-gradient(135deg, rgba(16,185,129,0.1), rgba(5,150,105,0.06))",
          icon: <Moon size={18} />,
        },
        {
          label: "Sugar",
          value: avg.sugar,
          max: 50,
          unit: "g",
          color: "#8B5CF6",
          gradient: ["#8B5CF6", "#EC4899"] as [string, string],
          bg: "linear-gradient(135deg, rgba(139,92,246,0.1), rgba(236,72,153,0.06))",
          icon: <Scale size={18} />,
        },
      ]
    : [];

  return (
    <div className="flex flex-col gap-5 pb-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Weekly Health Report
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Based on your logged data
          </p>
        </div>
        <span
          className="text-xs font-bold px-3 py-1.5 rounded-full text-white"
          style={{ background: "linear-gradient(90deg, #3B82F6, #10B981)" }}
        >
          AI Generated
        </span>
      </div>

      {/* Health score */}
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

      {/* Metric cards */}
      {metricCards.length > 0 && (
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
      )}

      {showCTA && <PureCaneBlissCard className="bg-slate-800" />}

      {/* Detected issues */}
      {issues.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-base font-bold text-gray-700">Detected Issues</h2>
          {issues.map(({ emoji, title, desc, borderColor, bg }) => (
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
      )}

      {issues.length === 0 && (
        <div
          className="rounded-2xl p-4 flex gap-3"
          style={{
            background: "rgba(16,185,129,0.05)",
            border: "1px solid rgba(16,185,129,0.3)",
            borderLeft: "3px solid #10B981",
          }}
        >
          <span className="text-base mt-0.5">🟢</span>
          <div>
            <p className="font-semibold text-gray-800 text-sm">
              No issues detected
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Your nutrition looks balanced. Keep it up!
            </p>
          </div>
        </div>
      )}

      <Disclaimer />
    </div>
  );
}

function Disclaimer() {
  return (
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
  );
}
