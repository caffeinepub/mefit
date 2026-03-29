import { useState } from "react";
import type { PregnancyReport, UserProfile } from "../types";
import AIReportInsights from "./mefit/AIReportInsights";

interface Props {
  user: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  reports: PregnancyReport[];
  onAddReport: (r: Omit<PregnancyReport, "id">) => void;
}

const MILESTONES = [
  { week: 4, t: 1, text: "Implantation complete. Heart begins to form." },
  { week: 8, t: 1, text: "All major organs forming. Embryo is now a fetus." },
  {
    week: 12,
    t: 1,
    text: "End of first trimester! Miscarriage risk drops significantly.",
  },
  { week: 16, t: 2, text: "You may start feeling baby kicks (quickening)." },
  {
    week: 20,
    t: 2,
    text: "Halfway there! Anatomy scan typically done this week.",
  },
  {
    week: 24,
    t: 2,
    text: "Baby is now viable outside the womb. Lungs developing.",
  },
  {
    week: 28,
    t: 3,
    text: "Third trimester begins! Baby opens eyes and can see light.",
  },
  { week: 32, t: 3, text: "Baby practices breathing. Gaining weight rapidly." },
  {
    week: 36,
    t: 3,
    text: "Baby is considered early-term. Ready for labor positioning.",
  },
  { week: 40, t: 3, text: "Full term! Your baby could arrive any day now." },
];

function calcEDD(lmp: string): string {
  if (!lmp) return "Not set";
  const d = new Date(lmp);
  d.setDate(d.getDate() + 280);
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function Tracker({
  user,
  onUpdateProfile,
  reports,
  onAddReport,
}: Props) {
  const [lmp, setLmp] = useState(user.lmp);
  const [showVisitForm, setShowVisitForm] = useState(false);
  const [visitForm, setVisitForm] = useState({
    date: "",
    doctorName: "",
    notes: "",
  });
  const myReports = reports.filter((r) => r.userId === user.id);
  const week = user.pregnancyWeek;

  function saveLmp() {
    const d = new Date(lmp);
    const diff = Math.floor(
      (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24 * 7),
    );
    onUpdateProfile({ lmp, pregnancyWeek: Math.min(diff, 40) });
  }

  function submitVisit(e: React.FormEvent) {
    e.preventDefault();
    onAddReport({
      userId: user.id,
      date: visitForm.date,
      doctorName: visitForm.doctorName,
      notes: visitForm.notes,
    });
    setVisitForm({ date: "", doctorName: "", notes: "" });
    setShowVisitForm(false);
  }

  const trimester = week <= 12 ? 1 : week <= 26 ? 2 : 3;
  const trimesterColor = [
    "",
    "from-yellow-100 to-orange-50",
    "from-blue-100 to-indigo-50",
    "from-purple-100 to-pink-50",
  ][trimester];

  const latestReport = myReports.length > 0 ? myReports[0] : null;

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-gray-800">Pregnancy Tracker</h2>

      {/* LMP & EDD */}
      <div className="bg-white rounded-2xl shadow-md p-5">
        <h3 className="font-bold text-gray-700 mb-3">Dates</h3>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-gray-500">Last Menstrual Period (LMP)</p>
            <div className="flex gap-2 mt-1">
              <input
                type="date"
                value={lmp}
                onChange={(e) => setLmp(e.target.value)}
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={saveLmp}
                className="px-4 py-2 bg-[#C7A1E3] text-white rounded-xl text-sm font-medium"
              >
                Update
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-purple-50 rounded-xl p-3">
              <p className="text-xs text-gray-500">Current Week</p>
              <p className="text-2xl font-bold text-[#9B7BC4]">Week {week}</p>
            </div>
            <div className="bg-pink-50 rounded-xl p-3">
              <p className="text-xs text-gray-500">Expected Delivery</p>
              <p className="text-sm font-bold text-pink-700">
                {calcEDD(user.lmp)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Trimester banner */}
      <div className={`bg-gradient-to-br ${trimesterColor} rounded-2xl p-5`}>
        <div className="flex items-center gap-3 mb-4">
          {[1, 2, 3].map((t) => (
            <div
              key={t}
              className={`flex-1 py-2 rounded-xl text-center text-sm font-semibold ${
                trimester === t
                  ? "bg-white shadow-sm text-[#9B7BC4]"
                  : "text-gray-400"
              }`}
            >
              T{t}
            </div>
          ))}
        </div>
        <p className="text-sm font-semibold text-gray-700">
          {["", "First", "Second", "Third"][trimester]} Trimester
        </p>
        <div className="h-2 bg-white/50 rounded-full mt-2">
          <div
            className="h-full bg-white rounded-full"
            style={{ width: `${(week / 40) * 100}%` }}
          />
        </div>
        <p className="text-xs text-gray-600 mt-1">{week} / 40 weeks</p>
      </div>

      {/* Milestones */}
      <div className="bg-white rounded-2xl shadow-md p-5">
        <h3 className="font-bold text-gray-700 mb-3">Milestones</h3>
        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {MILESTONES.map((m) => (
            <div
              key={m.week}
              className={`flex gap-3 p-3 rounded-xl ${
                week >= m.week ? "bg-purple-50" : "bg-gray-50 opacity-60"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  week >= m.week
                    ? "bg-[#C7A1E3] text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                W{m.week}
              </div>
              <p className="text-xs text-gray-600 leading-relaxed pt-1">
                {m.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Doctor visits */}
      <div className="bg-white rounded-2xl shadow-md p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-700">Doctor Visits & Reports</h3>
          <button
            type="button"
            onClick={() => setShowVisitForm(!showVisitForm)}
            className="text-xs px-3 py-1.5 bg-[#C7A1E3] text-white rounded-xl font-medium"
          >
            + Add
          </button>
        </div>

        {showVisitForm && (
          <form
            onSubmit={submitVisit}
            className="bg-purple-50 rounded-xl p-4 mb-3 space-y-2"
          >
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                required
                value={visitForm.date}
                onChange={(e) =>
                  setVisitForm({ ...visitForm, date: e.target.value })
                }
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm"
              />
              <input
                placeholder="Doctor name"
                required
                value={visitForm.doctorName}
                onChange={(e) =>
                  setVisitForm({ ...visitForm, doctorName: e.target.value })
                }
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm"
              />
            </div>
            <textarea
              placeholder="Visit notes..."
              value={visitForm.notes}
              onChange={(e) =>
                setVisitForm({ ...visitForm, notes: e.target.value })
              }
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
              rows={2}
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 py-2 bg-[#C7A1E3] text-white rounded-xl text-sm"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowVisitForm(false)}
                className="flex-1 py-2 bg-white text-gray-600 rounded-xl text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {myReports.length === 0 ? (
          <p className="text-gray-400 text-sm">No visits recorded yet.</p>
        ) : (
          myReports.map((r) => (
            <div
              key={r.id}
              className="border-b border-gray-50 pb-3 mb-3 last:border-0 last:mb-0"
            >
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-semibold text-gray-700">
                  {r.doctorName}
                </p>
                <span className="text-xs text-gray-400">{r.date}</span>
              </div>
              <p className="text-xs text-gray-600">{r.notes}</p>
            </div>
          ))
        )}
      </div>

      {/* AI Report Insights (shown when reports exist) */}
      {latestReport && (
        <AIReportInsights
          reportDate={latestReport.date}
          reportType="Pregnancy Blood Panel"
        />
      )}
    </div>
  );
}
