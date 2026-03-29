import {
  Activity,
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

interface SOSAlert {
  id: string;
  patientName: string;
  message: string;
  timestamp: string;
  resolved: boolean;
}

interface Patient {
  id: string;
  name: string;
  pregnancyWeek: number;
  sugar: number;
  sugarMax: number;
  protein: number;
  proteinMax: number;
  water: number;
  waterMax: number;
  steps: number;
  stepsMax: number;
  lastReport: string;
  trimester: number;
}

const DEMO_PATIENTS: Patient[] = [
  {
    id: "p1",
    name: "Sarah Johnson",
    pregnancyWeek: 24,
    sugar: 62,
    sugarMax: 50,
    protein: 48,
    proteinMax: 75,
    water: 2.1,
    waterMax: 2.5,
    steps: 7200,
    stepsMax: 10000,
    lastReport: "2026-03-25",
    trimester: 2,
  },
  {
    id: "p2",
    name: "Priya Sharma",
    pregnancyWeek: 32,
    sugar: 38,
    sugarMax: 50,
    protein: 68,
    proteinMax: 75,
    water: 2.3,
    waterMax: 2.5,
    steps: 9100,
    stepsMax: 10000,
    lastReport: "2026-03-26",
    trimester: 3,
  },
  {
    id: "p3",
    name: "Amina Bakr",
    pregnancyWeek: 16,
    sugar: 71,
    sugarMax: 50,
    protein: 42,
    proteinMax: 75,
    water: 1.4,
    waterMax: 2.5,
    steps: 3200,
    stepsMax: 10000,
    lastReport: "2026-03-20",
    trimester: 2,
  },
  {
    id: "p4",
    name: "Liu Mei",
    pregnancyWeek: 8,
    sugar: 30,
    sugarMax: 50,
    protein: 55,
    proteinMax: 75,
    water: 2.0,
    waterMax: 2.5,
    steps: 6800,
    stepsMax: 10000,
    lastReport: "2026-03-27",
    trimester: 1,
  },
];

const DEMO_SESSIONS = [
  {
    id: "s1",
    user: "Rina Patel",
    date: "2026-03-29",
    time: "9:00 AM",
    type: "Prenatal Yoga",
    status: "confirmed",
  },
  {
    id: "s2",
    user: "Meghna Iyer",
    date: "2026-03-30",
    time: "11:00 AM",
    type: "Meditation & Breathwork",
    status: "pending",
  },
  {
    id: "s3",
    user: "Sunita Das",
    date: "2026-03-31",
    time: "4:00 PM",
    type: "Postnatal Recovery Yoga",
    status: "confirmed",
  },
];

function indicatorColor(value: number, max: number, invert = false) {
  const ratio = value / max;
  if (invert) {
    if (ratio > 1) return "#EF4444";
    if (ratio > 0.8) return "#F59E0B";
    return "#10B981";
  }
  if (ratio < 0.4) return "#EF4444";
  if (ratio < 0.7) return "#F59E0B";
  return "#10B981";
}

export interface PatientDashboardProps {
  doctorName: string;
  role: "doctor" | "nutritionist" | "yoga_expert";
}

interface BookingRequest {
  id: string;
  patientName: string;
  doctorName: string;
  day: string;
  time: string;
  price: number;
  status: "pending" | "confirmed";
}

const HEADER_STYLES = {
  doctor: {
    gradient: "linear-gradient(135deg, #1E3A5F, #2563EB)",
    label: "Doctor Dashboard",
  },
  nutritionist: {
    gradient: "linear-gradient(135deg, #064E3B, #059669)",
    label: "Nutritionist Dashboard",
  },
  yoga_expert: {
    gradient: "linear-gradient(135deg, #3b1f6e, #7C3AED)",
    label: "Yoga Expert Dashboard",
  },
};

const glass = {
  background: "rgba(255,255,255,0.04)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255,255,255,0.08)",
} as React.CSSProperties;

export default function PatientDashboard({
  doctorName,
  role,
}: PatientDashboardProps) {
  const [alerts, setAlerts] = useState<SOSAlert[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [bookings, setBookings] = useState<BookingRequest[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("mefit_sos_alerts");
      if (raw) setAlerts(JSON.parse(raw) as SOSAlert[]);
    } catch {
      setAlerts([]);
    }
    try {
      const raw = localStorage.getItem("mefit_bookings");
      if (raw) setBookings(JSON.parse(raw) as BookingRequest[]);
    } catch {
      setBookings([]);
    }
  }, []);

  function confirmBooking(id: string) {
    const updated = bookings.map((b) =>
      b.id === id ? { ...b, status: "confirmed" as const } : b,
    );
    setBookings(updated);
    localStorage.setItem("mefit_bookings", JSON.stringify(updated));
  }
  function declineBooking(id: string) {
    const updated = bookings.filter((b) => b.id !== id);
    setBookings(updated);
    localStorage.setItem("mefit_bookings", JSON.stringify(updated));
  }
  function markResolved(id: string) {
    const updated = alerts.map((a) =>
      a.id === id ? { ...a, resolved: true } : a,
    );
    setAlerts(updated);
    localStorage.setItem("mefit_sos_alerts", JSON.stringify(updated));
  }

  const activeAlerts = alerts.filter((a) => !a.resolved);
  const resolvedAlerts = alerts.filter((a) => a.resolved);
  const hs = HEADER_STYLES[role];

  return (
    <div className="flex flex-col gap-5">
      <div
        className="rounded-3xl p-6"
        style={{
          background: hs.gradient,
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        }}
      >
        <p className="text-white/60 text-xs uppercase tracking-widest mb-1">
          {hs.label}
        </p>
        <h1 className="text-2xl font-bold text-white">
          {role === "yoga_expert" ? "" : "Dr. "}
          {doctorName}
        </h1>
        <p className="text-white/50 text-sm mt-1">
          {role === "yoga_expert"
            ? `${DEMO_SESSIONS.length} upcoming sessions`
            : `${DEMO_PATIENTS.length} patients assigned`}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {(role === "yoga_expert"
          ? [
              {
                icon: <Users size={18} />,
                label: "Members",
                value: 8,
                color: "#8B5CF6",
              },
              {
                icon: <Calendar size={18} />,
                label: "Sessions",
                value: DEMO_SESSIONS.length,
                color: "#EC4899",
              },
              {
                icon: <Activity size={18} />,
                label: "Active",
                value: 5,
                color: "#10B981",
              },
            ]
          : [
              {
                icon: <Users size={18} />,
                label: "Patients",
                value: DEMO_PATIENTS.length,
                color: "#3B82F6",
              },
              {
                icon: <AlertTriangle size={18} />,
                label: "Alerts",
                value: activeAlerts.length,
                color: activeAlerts.length > 0 ? "#EF4444" : "#10B981",
              },
              {
                icon: <FileText size={18} />,
                label: "Reports",
                value: 3,
                color: "#8B5CF6",
              },
            ]
        ).map(({ icon, label, value, color }) => (
          <div
            key={label}
            className="rounded-2xl p-4 text-center"
            style={glass}
          >
            <div className="flex justify-center mb-1" style={{ color }}>
              {icon}
            </div>
            <p className="text-2xl font-bold" style={{ color }}>
              {value}
            </p>
            <p className="text-xs text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      {role === "yoga_expert" && (
        <div>
          <h2 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
            <Calendar size={15} color="#8B5CF6" /> Wellness Sessions
          </h2>
          <div className="flex flex-col gap-2">
            {DEMO_SESSIONS.map((s, idx) => (
              <div
                key={s.id}
                data-ocid={`session.item.${idx + 1}`}
                className="rounded-2xl p-4"
                style={{
                  ...glass,
                  borderLeft: `3px solid ${s.status === "confirmed" ? "#10B981" : "#8B5CF6"}`,
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold text-sm">{s.user}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{s.type}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock size={11} color="rgba(148,163,184,0.5)" />
                      <span className="text-slate-500 text-xs">
                        {s.date} &middot; {s.time}
                      </span>
                    </div>
                  </div>
                  <span
                    className="text-[10px] font-bold px-2 py-1 rounded-full"
                    style={{
                      background:
                        s.status === "confirmed"
                          ? "rgba(16,185,129,0.2)"
                          : "rgba(139,92,246,0.2)",
                      color: s.status === "confirmed" ? "#10B981" : "#8B5CF6",
                    }}
                  >
                    {s.status === "confirmed" ? "Confirmed" : "Pending"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {role !== "yoga_expert" && (
        <div>
          <h2 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
            <Users size={15} color="#3B82F6" /> Your Patients
          </h2>
          <div className="flex flex-col gap-2">
            {DEMO_PATIENTS.map((p, idx) => (
              <button
                key={p.id}
                type="button"
                className="rounded-2xl overflow-hidden text-left w-full transition-all"
                style={glass}
                onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}
                data-ocid={`patient.item.${idx + 1}`}
              >
                <div className="p-4 flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-base flex-shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${indicatorColor(p.sugar, p.sugarMax, true)}, ${indicatorColor(p.protein, p.proteinMax)})`,
                    }}
                  >
                    {p.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm">{p.name}</p>
                    <p className="text-xs text-slate-500">
                      Week {p.pregnancyWeek} &middot; Trimester {p.trimester}
                    </p>
                  </div>
                  <div className="flex gap-1.5">
                    {[
                      { v: p.sugar, m: p.sugarMax, invert: true, label: "S" },
                      {
                        v: p.protein,
                        m: p.proteinMax,
                        invert: false,
                        label: "P",
                      },
                      { v: p.water, m: p.waterMax, invert: false, label: "W" },
                      { v: p.steps, m: p.stepsMax, invert: false, label: "A" },
                    ].map(({ v, m, invert, label }) => (
                      <div
                        key={label}
                        className="w-5 h-5 rounded-full flex items-center justify-center text-white"
                        style={{
                          background: indicatorColor(v, m, invert),
                          fontSize: "8px",
                          fontWeight: 700,
                        }}
                      >
                        {label}
                      </div>
                    ))}
                  </div>
                </div>
                {expandedId === p.id && (
                  <div
                    className="px-4 pb-4"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      {[
                        {
                          label: "Sugar",
                          value: `${p.sugar}g`,
                          max: `${p.sugarMax}g`,
                          color: indicatorColor(p.sugar, p.sugarMax, true),
                        },
                        {
                          label: "Protein",
                          value: `${p.protein}g`,
                          max: `${p.proteinMax}g`,
                          color: indicatorColor(p.protein, p.proteinMax),
                        },
                        {
                          label: "Water",
                          value: `${p.water}L`,
                          max: `${p.waterMax}L`,
                          color: indicatorColor(p.water, p.waterMax),
                        },
                        {
                          label: "Steps",
                          value: p.steps.toLocaleString(),
                          max: p.stepsMax.toLocaleString(),
                          color: indicatorColor(p.steps, p.stepsMax),
                        },
                      ].map(({ label, value, max, color }) => (
                        <div
                          key={label}
                          className="rounded-xl p-2.5"
                          style={{ background: `${color}18` }}
                        >
                          <p className="text-xs text-slate-500">{label}</p>
                          <p className="font-bold text-sm" style={{ color }}>
                            {value}
                          </p>
                          <p className="text-[10px] text-slate-600">
                            Goal: {max}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <Activity size={12} color="rgba(148,163,184,0.5)" />
                      <p className="text-xs text-slate-500">
                        Last report: {p.lastReport}
                      </p>
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {activeAlerts.length > 0 && (
        <div className="flex flex-col gap-2">
          <h2 className="font-bold text-white text-sm flex items-center gap-2">
            <AlertTriangle size={15} color="#EF4444" /> Priority Alerts{" "}
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              {activeAlerts.length}
            </span>
          </h2>
          {activeAlerts.map((alert) => (
            <div
              key={alert.id}
              data-ocid="patient.alert"
              className="rounded-2xl p-4"
              style={{
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.2)",
                borderLeft: "3px solid #EF4444",
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-red-400 text-sm">
                    {alert.patientName}
                  </p>
                  <p className="text-slate-300 text-sm mt-0.5">
                    {alert.message}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {new Date(alert.timestamp).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => markResolved(alert.id)}
                  data-ocid="alert.confirm_button"
                  className="flex-shrink-0 flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full"
                  style={{
                    background: "rgba(16,185,129,0.15)",
                    border: "1px solid rgba(16,185,129,0.4)",
                    color: "#10B981",
                  }}
                >
                  <CheckCircle size={12} /> Resolve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {bookings.length > 0 && (
        <div className="flex flex-col gap-2">
          <h2 className="font-bold text-white text-sm flex items-center gap-2">
            Consultation Requests{" "}
            <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              {bookings.length}
            </span>
          </h2>
          {bookings.map((b, idx) => (
            <div
              key={b.id}
              data-ocid={`booking.item.${idx + 1}`}
              className="rounded-2xl p-4"
              style={{
                ...glass,
                borderLeft: `3px solid ${b.status === "confirmed" ? "#10B981" : "#3B82F6"}`,
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-bold text-white text-sm">
                    {b.patientName}
                  </p>
                  <p className="text-slate-400 text-xs mt-0.5">
                    {b.doctorName} &middot; {b.day} at {b.time}
                  </p>
                  <p className="text-slate-500 text-xs">\u20B9{b.price}</p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{
                      background:
                        b.status === "confirmed"
                          ? "rgba(16,185,129,0.2)"
                          : "rgba(245,158,11,0.2)",
                      color: b.status === "confirmed" ? "#10B981" : "#F59E0B",
                    }}
                  >
                    {b.status === "confirmed" ? "Confirmed" : "Pending"}
                  </span>
                  {b.status === "pending" && (
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => confirmBooking(b.id)}
                        data-ocid="booking.confirm_button"
                        className="text-xs font-bold px-2 py-1 rounded-lg"
                        style={{
                          background: "rgba(16,185,129,0.15)",
                          border: "1px solid rgba(16,185,129,0.4)",
                          color: "#10B981",
                        }}
                      >
                        Confirm
                      </button>
                      <button
                        type="button"
                        onClick={() => declineBooking(b.id)}
                        data-ocid="booking.delete_button"
                        className="text-xs font-bold px-2 py-1 rounded-lg"
                        style={{
                          background: "rgba(239,68,68,0.1)",
                          border: "1px solid rgba(239,68,68,0.3)",
                          color: "#EF4444",
                        }}
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {resolvedAlerts.length > 0 && (
        <div>
          <h3 className="font-semibold text-slate-500 text-xs uppercase tracking-widest mb-2">
            Alert History
          </h3>
          {resolvedAlerts.map((a) => (
            <div
              key={a.id}
              className="flex items-center gap-2 py-2"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
            >
              <CheckCircle size={13} color="#10B981" />
              <p className="text-xs text-slate-500">
                {a.patientName}: {a.message}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="text-center pb-4">
        <p className="text-xs text-slate-600">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            className="underline"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}
