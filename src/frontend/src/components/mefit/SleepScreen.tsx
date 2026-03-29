import { Clock, Moon, Plus, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import type { SleepEntry } from "../../types";

const DEMO_SLEEP_LOG: SleepEntry[] = [
  {
    date: "2026-03-22",
    bedtime: "22:15",
    waketime: "06:45",
    deepMins: 90,
    lightMins: 150,
    awakeMins: 25,
  },
  {
    date: "2026-03-23",
    bedtime: "23:00",
    waketime: "07:00",
    deepMins: 80,
    lightMins: 140,
    awakeMins: 20,
  },
  {
    date: "2026-03-24",
    bedtime: "22:30",
    waketime: "06:30",
    deepMins: 100,
    lightMins: 130,
    awakeMins: 10,
  },
  {
    date: "2026-03-25",
    bedtime: "00:00",
    waketime: "07:30",
    deepMins: 60,
    lightMins: 160,
    awakeMins: 30,
  },
  {
    date: "2026-03-26",
    bedtime: "22:45",
    waketime: "06:15",
    deepMins: 110,
    lightMins: 120,
    awakeMins: 15,
  },
];

function parseMins(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function calcDuration(bed: string, wake: string) {
  let diff = parseMins(wake) - parseMins(bed);
  if (diff < 0) diff += 1440;
  return diff;
}

function fmtDuration(mins: number) {
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

function softAlarm(wake: string) {
  const total = parseMins(wake) - 30;
  const h = Math.floor((((total % 1440) + 1440) % 1440) / 60);
  const m = (((total % 1440) + 1440) % 1440) % 60;
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

export default function SleepScreen() {
  const [bedtime, setBedtime] = useState("22:30");
  const [waketime, setWaketime] = useState("06:30");
  const [log, setLog] = useState<SleepEntry[]>(() => {
    try {
      const raw = localStorage.getItem("mefit_sleep_log");
      return raw ? (JSON.parse(raw) as SleepEntry[]) : DEMO_SLEEP_LOG;
    } catch {
      return DEMO_SLEEP_LOG;
    }
  });

  useEffect(() => {
    localStorage.setItem("mefit_sleep_log", JSON.stringify(log));
  }, [log]);

  const duration = calcDuration(bedtime, waketime);

  function logTonight() {
    const today = new Date().toISOString().split("T")[0];
    const entry: SleepEntry = {
      date: today,
      bedtime,
      waketime,
      deepMins: Math.round(duration * 0.35),
      lightMins: Math.round(duration * 0.5),
      awakeMins: Math.round(duration * 0.15),
    };
    setLog((prev) => [entry, ...prev.slice(0, 9)]);
  }

  const recentLog = log.slice(0, 5);

  return (
    <div className="flex flex-col gap-5 pb-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Smart Sleep</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Track & optimize your rest
          </p>
        </div>
        <span
          className="text-xs font-bold px-3 py-1.5 rounded-full text-white"
          style={{ background: "linear-gradient(90deg, #6366F1, #3B82F6)" }}
        >
          Sleep AI
        </span>
      </div>

      {/* Time Picker Card */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Moon size={18} className="text-indigo-500" />
          <h2 className="font-bold text-gray-800">Set Sleep Schedule</h2>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-1.5 font-medium">
              🌙 Bedtime
            </p>
            <input
              type="time"
              value={bedtime}
              onChange={(e) => setBedtime(e.target.value)}
              className="w-full text-center text-2xl font-bold text-indigo-600 bg-indigo-50 border-0 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              data-ocid="sleep.input"
            />
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="w-0.5 h-6 bg-gray-200 rounded" />
            <span className="text-xs text-gray-400 my-1">to</span>
            <div className="w-0.5 h-6 bg-gray-200 rounded" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-1.5 font-medium">
              ☀️ Wake up
            </p>
            <input
              type="time"
              value={waketime}
              onChange={(e) => setWaketime(e.target.value)}
              className="w-full text-center text-2xl font-bold text-blue-600 bg-blue-50 border-0 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
              data-ocid="sleep.input"
            />
          </div>
        </div>
        <div className="mt-4 text-center">
          <span className="text-3xl font-black text-gray-800">
            {fmtDuration(duration)}
          </span>
          <p className="text-gray-400 text-xs mt-0.5">Total sleep duration</p>
        </div>
      </div>

      {/* Smart Alarm Card */}
      <div
        className="rounded-2xl p-4 flex items-center gap-3"
        style={{
          background: "linear-gradient(135deg, #1E1B4B, #312E81)",
          boxShadow: "0 8px 32px rgba(30,27,75,0.3)",
        }}
      >
        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
          <Zap size={20} className="text-yellow-300" />
        </div>
        <div>
          <p className="text-white/60 text-xs">
            Smart Alarm — 30 min before wake
          </p>
          <p className="text-white font-bold text-lg">
            Soft alarm at {softAlarm(waketime)}
          </p>
          <p className="text-purple-300 text-xs mt-0.5">
            Gentle vibration to ease you awake
          </p>
        </div>
      </div>

      {/* Sleep Quality Chart */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Clock size={16} className="text-blue-500" />
          <h2 className="font-semibold text-gray-800">Sleep Quality</h2>
        </div>
        {(() => {
          const total =
            (recentLog[0]?.deepMins ?? 90) +
            (recentLog[0]?.lightMins ?? 150) +
            (recentLog[0]?.awakeMins ?? 25);
          const deep = recentLog[0]?.deepMins ?? 90;
          const light = recentLog[0]?.lightMins ?? 150;
          const awake = recentLog[0]?.awakeMins ?? 25;
          return (
            <>
              <div className="flex rounded-xl overflow-hidden h-8 mb-4">
                <div
                  style={{
                    width: `${(deep / total) * 100}%`,
                    background: "linear-gradient(90deg, #4338CA, #6366F1)",
                  }}
                  className="transition-all"
                />
                <div
                  style={{
                    width: `${(light / total) * 100}%`,
                    background: "linear-gradient(90deg, #3B82F6, #60A5FA)",
                  }}
                  className="transition-all"
                />
                <div
                  style={{
                    width: `${(awake / total) * 100}%`,
                    background: "linear-gradient(90deg, #F97316, #FB923C)",
                  }}
                  className="transition-all"
                />
              </div>
              <div className="flex gap-4 justify-center">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-indigo-500" />
                  <span className="text-xs text-gray-600">Deep {deep}m</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-blue-400" />
                  <span className="text-xs text-gray-600">Light {light}m</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-orange-400" />
                  <span className="text-xs text-gray-600">Awake {awake}m</span>
                </div>
              </div>
            </>
          );
        })()}
      </div>

      {/* Log Button */}
      <button
        type="button"
        onClick={logTonight}
        data-ocid="sleep.primary_button"
        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-bold text-white shadow-lg transition-all active:scale-95"
        style={{ background: "linear-gradient(90deg, #6366F1, #3B82F6)" }}
      >
        <Plus size={18} />
        Log Tonight's Sleep
      </button>

      {/* Sleep Log */}
      <div className="flex flex-col gap-2">
        <h2 className="font-bold text-gray-700 text-sm">Recent Sleep Log</h2>
        {recentLog.map((entry) => {
          const dur = calcDuration(entry.bedtime, entry.waketime);
          return (
            <div
              key={entry.date}
              className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/50 p-3 flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-semibold text-gray-700">
                  {entry.date}
                </p>
                <p className="text-xs text-gray-500">
                  {entry.bedtime} → {entry.waketime}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-indigo-600">{fmtDuration(dur)}</p>
                <p className="text-xs text-gray-400">Deep {entry.deepMins}m</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
