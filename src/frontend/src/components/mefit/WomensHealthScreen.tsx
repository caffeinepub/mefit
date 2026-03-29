import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import type { CycleEntry } from "../../types";

const BABY_SIZES: Record<number, string> = {
  4: "poppy seed",
  8: "kidney bean",
  12: "lime",
  16: "avocado",
  20: "banana",
  24: "corn cob",
  28: "eggplant",
  32: "squash",
  36: "honeydew melon",
  40: "watermelon",
};

function getBabySize(week: number) {
  const keys = Object.keys(BABY_SIZES)
    .map(Number)
    .sort((a, b) => a - b);
  for (let i = keys.length - 1; i >= 0; i--) {
    if (week >= keys[i]) return BABY_SIZES[keys[i]];
  }
  return "sesame seed";
}

const SYMPTOMS = ["Cramps 🤕", "Mood 😔", "Heavy Flow 🩸"];
const DAY_HEADERS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const DEMO_CYCLE: CycleEntry[] = [
  { date: "2026-03-01", type: "period", symptoms: ["Cramps 🤕"] },
  { date: "2026-03-02", type: "period", symptoms: ["Heavy Flow 🩸"] },
  { date: "2026-03-03", type: "period", symptoms: ["Mood 😔"] },
  { date: "2026-03-04", type: "period", symptoms: [] },
  { date: "2026-03-05", type: "period", symptoms: [] },
  { date: "2026-03-12", type: "fertile", symptoms: [] },
  { date: "2026-03-13", type: "fertile", symptoms: [] },
  { date: "2026-03-14", type: "fertile", symptoms: [] },
  { date: "2026-03-27", type: "predicted", symptoms: [] },
  { date: "2026-03-28", type: "predicted", symptoms: [] },
  { date: "2026-03-29", type: "predicted", symptoms: [] },
];

export default function WomensHealthScreen() {
  const [pregnancyMode, setPregnancyMode] = useState(() => {
    return localStorage.getItem("mefit_pregnancy_mode") === "true";
  });
  const [pregnancyWeek, setPregnancyWeek] = useState(() => {
    return Number(localStorage.getItem("mefit_pregnancy_week") ?? "20");
  });
  const [cycleData, setCycleData] = useState<CycleEntry[]>(() => {
    try {
      const raw = localStorage.getItem("mefit_cycle_data");
      return raw ? (JSON.parse(raw) as CycleEntry[]) : DEMO_CYCLE;
    } catch {
      return DEMO_CYCLE;
    }
  });
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("mefit_pregnancy_mode", String(pregnancyMode));
  }, [pregnancyMode]);

  useEffect(() => {
    localStorage.setItem("mefit_pregnancy_week", String(pregnancyWeek));
  }, [pregnancyWeek]);

  useEffect(() => {
    localStorage.setItem("mefit_cycle_data", JSON.stringify(cycleData));
  }, [cycleData]);

  const startDate = new Date("2026-03-01");
  const gridDays = Array.from({ length: 35 }, (_, i) => {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    return d.toISOString().split("T")[0];
  });

  function getDayInfo(date: string) {
    return cycleData.find((e) => e.date === date);
  }

  function toggleSymptom(sym: string) {
    if (!selectedDay) return;
    setCycleData((prev) => {
      const existing = prev.find((e) => e.date === selectedDay);
      if (existing) {
        const newSyms = existing.symptoms.includes(sym)
          ? existing.symptoms.filter((s) => s !== sym)
          : [...existing.symptoms, sym];
        return prev.map((e) =>
          e.date === selectedDay ? { ...e, symptoms: newSyms } : e,
        );
      }
      return [...prev, { date: selectedDay, type: "period", symptoms: [sym] }];
    });
  }

  const selectedEntry = selectedDay ? getDayInfo(selectedDay) : null;

  return (
    <div className="flex flex-col gap-5 pb-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Women's Health</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Cycle &amp; pregnancy tracking
          </p>
        </div>
      </div>

      {/* Toggle */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 p-4 flex items-center justify-between">
        <div>
          <p className="font-semibold text-gray-800">🤰 Pregnancy Mode</p>
          <p className="text-xs text-gray-500">
            {pregnancyMode
              ? "Week-by-week tracking active"
              : "Switch to cycle tracking"}
          </p>
        </div>
        <Switch
          id="pregnancy-toggle"
          checked={pregnancyMode}
          onCheckedChange={setPregnancyMode}
          data-ocid="womens.switch"
        />
      </div>

      {pregnancyMode ? (
        <div className="flex flex-col gap-4">
          <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-gray-800">Pregnancy Week</h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPregnancyWeek((w) => Math.max(1, w - 1))}
                  className="w-8 h-8 rounded-full bg-pink-50 text-pink-500 font-bold text-lg flex items-center justify-center"
                  data-ocid="womens.secondary_button"
                >
                  -
                </button>
                <span className="font-black text-2xl text-pink-600 w-8 text-center">
                  {pregnancyWeek}
                </span>
                <button
                  type="button"
                  onClick={() => setPregnancyWeek((w) => Math.min(42, w + 1))}
                  className="w-8 h-8 rounded-full bg-pink-50 text-pink-500 font-bold text-lg flex items-center justify-center"
                  data-ocid="womens.secondary_button"
                >
                  +
                </button>
              </div>
            </div>
            <div
              className="rounded-xl p-3"
              style={{
                background: "rgba(236,72,153,0.07)",
                border: "1px solid rgba(236,72,153,0.2)",
              }}
            >
              <p className="text-pink-600 font-semibold">
                🍌 Baby is the size of a{" "}
                <span className="font-black">{getBabySize(pregnancyWeek)}</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Week {pregnancyWeek} of 40
              </p>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              {[
                { w: 12, label: "First trimester ends" },
                { w: 20, label: "Halfway milestone! Anatomy scan" },
                { w: 28, label: "Third trimester begins" },
                { w: 37, label: "Full term reached" },
                { w: 40, label: "Due date 🎉" },
              ].map(({ w, label }) => (
                <div
                  key={w}
                  className={`flex items-center gap-2 text-sm ${
                    pregnancyWeek >= w ? "text-pink-600" : "text-gray-400"
                  }`}
                >
                  <span>{pregnancyWeek >= w ? "✅" : "⭕"}</span>
                  <span>
                    Week {w}: {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 p-4">
            <h2 className="font-bold text-gray-800 mb-1">Cycle Calendar</h2>
            <p className="text-xs text-gray-400 mb-3">
              March 2026 — tap a day to log symptoms
            </p>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAY_HEADERS.map((d) => (
                <span
                  key={d}
                  className="text-center text-[9px] font-bold text-gray-400"
                >
                  {d.slice(0, 1)}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {gridDays.map((date) => {
                const info = getDayInfo(date);
                const dayNum = new Date(date).getDate();
                const isSelected = selectedDay === date;
                let bg = "bg-gray-50";
                let textColor = "text-gray-700";
                if (info?.type === "period") {
                  bg = "bg-red-400";
                  textColor = "text-white";
                } else if (info?.type === "fertile") {
                  bg = "bg-pink-200";
                  textColor = "text-pink-700";
                } else if (info?.type === "predicted") {
                  bg = "bg-purple-100";
                  textColor = "text-purple-600";
                }
                return (
                  <button
                    type="button"
                    key={date}
                    data-ocid="womens.toggle"
                    onClick={() => setSelectedDay(isSelected ? null : date)}
                    className={`aspect-square rounded-lg text-xs font-semibold transition-all ${
                      bg
                    } ${textColor} ${
                      isSelected
                        ? "ring-2 ring-offset-1 ring-pink-400 scale-110"
                        : ""
                    }`}
                  >
                    {dayNum}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-3 mt-3 flex-wrap">
              {[
                ["bg-red-400", "Period"],
                ["bg-pink-200", "Fertile"],
                ["bg-purple-100", "Predicted"],
              ].map(([c, l]) => (
                <span
                  key={l}
                  className="flex items-center gap-1 text-xs text-gray-500"
                >
                  <span className={`w-3 h-3 rounded-full ${c}`} />
                  {l}
                </span>
              ))}
            </div>
          </div>

          {selectedDay && (
            <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 p-4">
              <h2 className="font-bold text-gray-800 mb-3">
                Log symptoms — {selectedDay}
              </h2>
              <div className="flex gap-2 flex-wrap">
                {SYMPTOMS.map((sym) => {
                  const active = selectedEntry?.symptoms.includes(sym) ?? false;
                  return (
                    <button
                      type="button"
                      key={sym}
                      data-ocid="womens.toggle"
                      onClick={() => toggleSymptom(sym)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        active
                          ? "bg-pink-500 text-white shadow"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {sym}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Safety Card */}
      <div
        className="rounded-2xl p-4"
        style={{
          background: "rgba(245,158,11,0.08)",
          border: "1px solid rgba(245,158,11,0.3)",
        }}
      >
        <div className="flex gap-2">
          <span className="text-lg">⚠️</span>
          <div>
            <p className="font-semibold text-amber-800 text-sm">
              "Ghar ke experienced logon aur doctor se salah lein."
            </p>
            <p className="text-amber-700 text-xs mt-1">
              This app does not provide medical advice. Always consult your
              doctor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
