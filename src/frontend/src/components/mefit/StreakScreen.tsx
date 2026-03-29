import { Lock } from "lucide-react";
import { useEffect, useState } from "react";
import type { StreakData } from "../../types";

const DEFAULTS: StreakData = {
  currentStreak: 5,
  lastWalkDate: "",
  longestStreak: 12,
  todaySteps: 0,
};

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

function yesterdayStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}

export default function StreakScreen() {
  const [data, setData] = useState<StreakData>(() => {
    try {
      const raw = localStorage.getItem("mefit_streak");
      return raw ? (JSON.parse(raw) as StreakData) : DEFAULTS;
    } catch {
      return DEFAULTS;
    }
  });
  const [stepInput, setStepInput] = useState("");
  const [achievement, setAchievement] = useState<number | null>(null);

  useEffect(() => {
    localStorage.setItem("mefit_streak", JSON.stringify(data));
  }, [data]);

  function logSteps() {
    const steps = Number(stepInput);
    if (Number.isNaN(steps) || steps <= 0) return;
    const today = todayStr();
    const yesterday = yesterdayStr();

    setData((prev) => {
      const newSteps =
        prev.lastWalkDate === today ? prev.todaySteps + steps : steps;
      let streak = prev.currentStreak;

      if (newSteps >= 10000) {
        if (prev.lastWalkDate === today) {
          // already counted today
        } else if (prev.lastWalkDate === yesterday) {
          streak += 1;
        } else {
          streak = 1;
        }
      } else if (prev.lastWalkDate !== today) {
        if (prev.lastWalkDate !== yesterday) {
          streak = 0;
        }
      }

      const longest = Math.max(streak, prev.longestStreak);
      const next: StreakData = {
        currentStreak: streak,
        lastWalkDate: today,
        longestStreak: longest,
        todaySteps: newSteps,
      };

      if (
        [7, 30, 100].includes(streak) &&
        ![7, 30, 100].includes(prev.currentStreak)
      ) {
        setAchievement(streak);
        setTimeout(() => setAchievement(null), 3500);
      }

      return next;
    });
    setStepInput("");
  }

  const milestones = [
    { days: 7, emoji: "🥉", label: "7 Day Streak", color: "#CD7F32" },
    { days: 30, emoji: "🥈", label: "30 Day Streak", color: "#C0C0C0" },
    { days: 100, emoji: "🥇", label: "100 Day Streak", color: "#FFD700" },
  ];

  return (
    <div className="flex flex-col gap-5 pb-4 relative">
      {/* Achievement popup */}
      {achievement && (
        <button
          type="button"
          className="fixed inset-0 z-50 flex items-center justify-center w-full border-0"
          style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
          onClick={() => setAchievement(null)}
          onKeyDown={(e) => e.key === "Escape" && setAchievement(null)}
        >
          <div
            className="rounded-3xl p-8 text-center shadow-2xl"
            style={{
              background: "linear-gradient(135deg, #FEF3C7, #FDE68A)",
              border: "2px solid #F59E0B",
            }}
          >
            <p className="text-6xl mb-3 animate-bounce">🎉</p>
            <p className="text-2xl font-black text-amber-800">
              Achievement Unlocked!
            </p>
            <p className="text-amber-700 font-bold mt-1">
              {achievement}-Day Streak 🔥
            </p>
            <p className="text-xs text-amber-600 mt-3">
              Tap anywhere to continue
            </p>
          </div>
        </button>
      )}

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Step Streak</h1>
          <p className="text-gray-500 text-sm mt-0.5">Goal: 10,000 steps/day</p>
        </div>
      </div>

      {/* Streak Counter */}
      <div
        className="rounded-3xl p-8 flex flex-col items-center"
        style={{
          background: "linear-gradient(135deg, #1C0A00, #3B1500)",
          boxShadow: "0 8px 40px rgba(249,115,22,0.35)",
        }}
      >
        <div
          className="text-8xl mb-2"
          style={{
            animation: "flamePulse 1.5s ease-in-out infinite",
            filter: "drop-shadow(0 0 20px #F97316)",
          }}
        >
          🔥
        </div>
        <p
          className="font-black text-7xl"
          style={{
            color: data.currentStreak > 0 ? "#F97316" : "#64748B",
            textShadow:
              data.currentStreak > 0 ? "0 0 30px rgba(249,115,22,0.6)" : "none",
          }}
        >
          {data.currentStreak}
        </p>
        <p className="text-white/60 text-sm mt-1 uppercase tracking-widest">
          Day Streak
        </p>
        <p className="text-white/40 text-xs mt-3">
          Best: {data.longestStreak} days
        </p>
        <div className="mt-4 bg-white/10 rounded-xl px-4 py-2">
          <p className="text-white/80 text-sm">
            Today:{" "}
            <span className="font-bold text-orange-300">
              {data.todaySteps.toLocaleString()}
            </span>{" "}
            / 10,000 steps
          </p>
        </div>
      </div>

      {/* Step Logger */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 p-4">
        <h2 className="font-bold text-gray-800 mb-3">Log Today's Steps</h2>
        <div className="flex gap-2">
          <input
            type="number"
            value={stepInput}
            onChange={(e) => setStepInput(e.target.value)}
            placeholder="Enter steps..."
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-300"
            onKeyDown={(e) => e.key === "Enter" && logSteps()}
            data-ocid="streak.input"
          />
          <button
            type="button"
            onClick={logSteps}
            data-ocid="streak.primary_button"
            className="px-5 py-2.5 rounded-xl font-bold text-white"
            style={{ background: "linear-gradient(90deg, #F97316, #EF4444)" }}
          >
            Log
          </button>
        </div>
      </div>

      {/* Milestone Badges */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 p-4">
        <h2 className="font-bold text-gray-800 mb-3">Milestone Badges</h2>
        <div className="flex gap-3">
          {milestones.map(({ days, emoji, label, color }) => {
            const unlocked = data.currentStreak >= days;
            return (
              <div
                key={days}
                data-ocid="streak.card"
                className="flex-1 rounded-2xl p-3 text-center transition-all"
                style={{
                  background: unlocked
                    ? `${color}20`
                    : "rgba(100,116,139,0.05)",
                  border: `1px solid ${unlocked ? color : "rgba(100,116,139,0.2)"}`,
                  boxShadow: unlocked ? `0 0 20px ${color}40` : "none",
                }}
              >
                <div className="text-3xl mb-1">
                  {unlocked ? (
                    emoji
                  ) : (
                    <Lock size={24} className="text-gray-300 mx-auto" />
                  )}
                </div>
                <p
                  className="text-xs font-bold"
                  style={{ color: unlocked ? color : "#94A3B8" }}
                >
                  {days} days
                </p>
                <p className="text-[9px] text-gray-400 mt-0.5">{label}</p>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes flamePulse {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 0 20px #F97316); }
          50% { transform: scale(1.1); filter: drop-shadow(0 0 35px #EF4444); }
        }
      `}</style>
    </div>
  );
}
