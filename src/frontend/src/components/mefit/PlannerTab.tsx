import {
  Bell,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Droplets,
  Pill,
  Stethoscope,
} from "lucide-react";
import { useState } from "react";

interface PlannerEvent {
  id: string;
  name: string;
  date: string;
  type: "wedding" | "birthday" | "festival" | "personal";
  goal: "maintain" | "reduce" | "enjoy";
}

interface PlannerReminder {
  id: string;
  title: string;
  type: "medicine" | "water" | "steps" | "doctor";
  time: string;
  enabled: boolean;
}

const DEMO_EVENTS: PlannerEvent[] = [
  {
    id: "1",
    name: "Wedding Ceremony",
    date: "2026-04-05",
    type: "wedding",
    goal: "reduce",
  },
  {
    id: "2",
    name: "Priya's Birthday Party",
    date: "2026-04-12",
    type: "birthday",
    goal: "enjoy",
  },
  {
    id: "3",
    name: "Baisakhi Festival",
    date: "2026-04-14",
    type: "festival",
    goal: "maintain",
  },
  {
    id: "4",
    name: "Diwali Get-Together",
    date: "2026-10-20",
    type: "festival",
    goal: "enjoy",
  },
];

const DEMO_REMINDERS: PlannerReminder[] = [
  {
    id: "r1",
    title: "Iron + Folic Acid",
    type: "medicine",
    time: "08:00 AM",
    enabled: true,
  },
  {
    id: "r2",
    title: "Drink 250ml Water",
    type: "water",
    time: "Every 2 hrs",
    enabled: true,
  },
  {
    id: "r3",
    title: "10,000 Steps Goal",
    type: "steps",
    time: "During day",
    enabled: false,
  },
  {
    id: "r4",
    title: "Dr. Sharma Visit",
    type: "doctor",
    time: "Apr 10, 11:00 AM",
    enabled: true,
  },
];

const TYPE_COLORS: Record<string, string> = {
  wedding: "#EC4899",
  birthday: "#F97316",
  festival: "#F59E0B",
  personal: "#3B82F6",
};

const REMINDER_ICONS: Record<
  string,
  React.ComponentType<{
    size?: number;
    className?: string;
    style?: React.CSSProperties;
  }>
> = {
  medicine: Pill,
  water: Droplets,
  steps: Bell,
  doctor: Stethoscope,
};

const REMINDER_COLORS: Record<string, string> = {
  medicine: "#8B5CF6",
  water: "#06B6D4",
  steps: "#10B981",
  doctor: "#3B82F6",
};

function getDiffDays(eventDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const ev = new Date(eventDate);
  ev.setHours(0, 0, 0, 0);
  return Math.round((ev.getTime() - today.getTime()) / 86400000);
}

function EventPhaseCard({ event }: { event: PlannerEvent }) {
  const diff = getDiffDays(event.date);
  const color = TYPE_COLORS[event.type] ?? "#3B82F6";

  let phase: { emoji: string; label: string; desc: string; bg: string } | null =
    null;
  if (diff > 1) {
    phase = {
      emoji: "🥗",
      label: "Pre-Event Diet Plan",
      desc: "High protein, low carb for 3 days before. Avoid sugar and processed foods. Drink 3L water daily. Light morning walks recommended.",
      bg: "rgba(59,130,246,0.1)",
    };
  } else if (diff === 0 || diff === 1) {
    phase = {
      emoji: "🎉",
      label: "Event Day — Enjoy Your Cheat Meal!",
      desc: "Relax the rules today. Enjoy the celebration! Start with a protein-rich breakfast to balance cravings. Hydrate well between meals.",
      bg: "rgba(249,115,22,0.1)",
    };
  } else {
    phase = {
      emoji: "💪",
      label: "Recovery Plan",
      desc: "2-3 day recovery: Light salads, lean protein, no alcohol. Extra water. Gentle exercise. Resume normal plan on day 3.",
      bg: "rgba(16,185,129,0.1)",
    };
  }

  const dateStr = new Date(event.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const daysLabel =
    diff > 0
      ? `In ${diff} day${diff !== 1 ? "s" : ""}`
      : diff === 0
        ? "Today!"
        : `${Math.abs(diff)} day${Math.abs(diff) !== 1 ? "s" : ""} ago`;

  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderLeft: `3px solid ${color}`,
      }}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-white font-semibold text-sm">{event.name}</p>
          <p className="text-slate-400 text-xs">{dateStr}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
            style={{ background: `${color}22`, color }}
          >
            {event.type}
          </span>
          <span className="text-[10px] text-slate-500">{daysLabel}</span>
        </div>
      </div>
      {phase && (
        <div className="rounded-xl p-3 mt-2" style={{ background: phase.bg }}>
          <p className="text-xs font-semibold text-white mb-1">
            {phase.emoji} {phase.label}
          </p>
          <p className="text-xs text-slate-300 leading-relaxed">{phase.desc}</p>
        </div>
      )}
    </div>
  );
}

function MiniCalendar() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const eventDates = new Set(DEMO_EVENTS.map((e) => e.date));

  // Build a flat list of cells: null for blank prefix slots, day numbers for actual days
  const blanks = Array.from({ length: firstDay }, (_, k) => `blank-${k}`);
  const days = Array.from({ length: daysInMonth }, (_, k) => k + 1);

  const monthLabel = new Date(year, month).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  function prevMonth() {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
  }
  function nextMonth() {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
  }

  return (
    <div
      className="rounded-3xl p-4"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={prevMonth}
          className="p-1 rounded-lg"
          style={{ color: "#94A3B8" }}
        >
          <ChevronLeft size={18} />
        </button>
        <span className="text-white text-sm font-semibold">{monthLabel}</span>
        <button
          type="button"
          onClick={nextMonth}
          className="p-1 rounded-lg"
          style={{ color: "#94A3B8" }}
        >
          <ChevronRight size={18} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div
            key={d}
            className="text-center text-[10px] font-medium"
            style={{ color: "#475569" }}
          >
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {blanks.map((k) => (
          <div key={k} />
        ))}
        {days.map((day) => {
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const isToday =
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();
          const hasEvent = eventDates.has(dateStr);
          return (
            <div
              key={dateStr}
              className="relative flex flex-col items-center justify-center aspect-square rounded-lg"
              style={{
                background: isToday
                  ? "linear-gradient(135deg, #3B82F6, #8B5CF6)"
                  : "transparent",
              }}
            >
              <span
                className="text-[11px] font-medium"
                style={{ color: isToday ? "white" : "#94A3B8" }}
              >
                {day}
              </span>
              {hasEvent && (
                <span
                  className="absolute bottom-0.5 w-1 h-1 rounded-full"
                  style={{ background: "#F97316" }}
                />
              )}
            </div>
          );
        })}
      </div>
      <p className="text-[10px] text-slate-500 mt-2 text-center">
        Orange dot = event day
      </p>
    </div>
  );
}

export default function PlannerTab() {
  const [reminders, setReminders] = useState(DEMO_REMINDERS);

  function toggleReminder(id: string) {
    setReminders((rs) =>
      rs.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)),
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Calendar size={16} style={{ color: "#818CF8" }} />
          <span
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: "#818CF8" }}
          >
            Calendar
          </span>
        </div>
        <MiniCalendar />
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <span
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: "#818CF8" }}
          >
            Upcoming Events
          </span>
        </div>
        <div className="space-y-3">
          {DEMO_EVENTS.map((ev) => (
            <EventPhaseCard key={ev.id} event={ev} />
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <Bell size={16} style={{ color: "#818CF8" }} />
          <span
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: "#818CF8" }}
          >
            Reminders
          </span>
        </div>
        <div className="space-y-2">
          {reminders.map((r) => {
            const Icon = REMINDER_ICONS[r.type] ?? Bell;
            const color = REMINDER_COLORS[r.type] ?? "#3B82F6";
            return (
              <div
                key={r.id}
                className="flex items-center gap-3 rounded-2xl p-3"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  opacity: r.enabled ? 1 : 0.5,
                }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${color}22` }}
                >
                  <Icon size={16} style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">
                    {r.title}
                  </p>
                  <p className="text-slate-400 text-xs">{r.time}</p>
                </div>
                <button
                  type="button"
                  data-ocid="planner.toggle"
                  onClick={() => toggleReminder(r.id)}
                  className="w-10 h-6 rounded-full relative transition-colors flex-shrink-0"
                  style={{
                    background: r.enabled
                      ? "linear-gradient(135deg, #3B82F6, #8B5CF6)"
                      : "rgba(255,255,255,0.1)",
                  }}
                >
                  <span
                    className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all"
                    style={{
                      left: r.enabled ? "calc(100% - 1.375rem)" : "2px",
                    }}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
