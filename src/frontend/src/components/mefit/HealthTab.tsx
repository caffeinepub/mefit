import { Activity, Camera, FileText } from "lucide-react";
import { useState } from "react";
import type { MeFitUser } from "../../types";
import type { PregnancyReport, UserProfile } from "../../types";
import { getDataState } from "../../utils/userDataStore";
import Tracker from "../Tracker";
import BodyProgress from "./BodyProgress";
import BreathingExercise from "./BreathingExercise";
import HealthReport from "./HealthReport";
import PhotoJourneyScreen from "./PhotoJourneyScreen";
import SleepScreen from "./SleepScreen";
import StreakScreen from "./StreakScreen";
import WeightAnalyticsScreen from "./WeightAnalyticsScreen";
import WomensHealthScreen from "./WomensHealthScreen";

interface Props {
  mefitUser: MeFitUser | null;
  currentUser: UserProfile;
  reports: PregnancyReport[];
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onAddReport: (r: Omit<PregnancyReport, "id">) => void;
}

type SubTab =
  | "reports"
  | "tracker"
  | "weight"
  | "women"
  | "sleep"
  | "streak"
  | "photos"
  | "progress"
  | "breathing";

const SUB_TABS: { id: SubTab; label: string; emoji: string }[] = [
  { id: "reports", label: "Reports", emoji: "📋" },
  { id: "tracker", label: "Tracker", emoji: "🩺" },
  { id: "weight", label: "Weight", emoji: "⚖️" },
  { id: "women", label: "Women", emoji: "💗" },
  { id: "sleep", label: "Sleep", emoji: "🌙" },
  { id: "streak", label: "Streak", emoji: "🔥" },
  { id: "photos", label: "Photos", emoji: "📸" },
  { id: "breathing", label: "Breathe", emoji: "🧘" },
];

export default function HealthTab({
  mefitUser,
  currentUser,
  reports,
  onUpdateProfile,
  onAddReport,
}: Props) {
  const [sub, setSub] = useState<SubTab>("reports");
  const dataState = getDataState();

  return (
    <div className="space-y-4">
      {/* Empty state banner — shown above sub-tabs when no data */}
      {dataState === "empty" && sub === "reports" && (
        <div
          className="rounded-2xl p-5 flex flex-col gap-4"
          style={{
            background:
              "linear-gradient(135deg, rgba(99,102,241,0.06), rgba(139,92,246,0.06))",
            border: "1px solid rgba(139,92,246,0.18)",
          }}
          data-ocid="health.empty_state"
        >
          <p className="font-bold text-gray-800">📊 No data yet</p>
          <p className="text-gray-500 text-sm leading-relaxed">
            Start by adding your meals, health data, or reports. Your health
            score and insights will appear automatically.
          </p>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              data-ocid="health.primary_button"
              onClick={() => setSub("tracker")}
              className="flex items-center gap-2 py-3 px-4 rounded-xl text-white font-semibold text-sm"
              style={{
                background: "linear-gradient(135deg, #10B981, #059669)",
              }}
            >
              <FileText size={16} /> Upload Medical Report
            </button>
            <button
              type="button"
              data-ocid="health.secondary_button"
              onClick={() => setSub("streak")}
              className="flex items-center gap-2 py-3 px-4 rounded-xl text-white font-semibold text-sm"
              style={{
                background: "linear-gradient(135deg, #F97316, #EF4444)",
              }}
            >
              <Activity size={16} /> Add Health Data (weight, steps)
            </button>
            <button
              type="button"
              data-ocid="health.upload_button"
              onClick={() => setSub("photos")}
              className="flex items-center gap-2 py-3 px-4 rounded-xl text-white font-semibold text-sm"
              style={{
                background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
              }}
            >
              <Camera size={16} /> Upload Progress Photos
            </button>
          </div>
        </div>
      )}

      {/* Sub-nav pills */}
      <div
        className="flex gap-2 overflow-x-auto pb-1"
        style={{ scrollbarWidth: "none" }}
      >
        {SUB_TABS.map(({ id, label, emoji }) => (
          <button
            key={id}
            type="button"
            data-ocid="health.tab"
            onClick={() => setSub(id)}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold transition-all"
            style={{
              background:
                sub === id
                  ? "linear-gradient(135deg, #3B82F6, #8B5CF6)"
                  : "rgba(255,255,255,0.06)",
              color: sub === id ? "#fff" : "#94A3B8",
              border: sub === id ? "none" : "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <span>{emoji}</span>
            {label}
          </button>
        ))}
      </div>

      {/* Sub content */}
      <div style={{ animation: "float-up 0.3s ease" }}>
        {sub === "reports" && <HealthReport />}
        {sub === "tracker" && (
          <Tracker
            user={currentUser}
            onUpdateProfile={onUpdateProfile}
            reports={reports}
            onAddReport={onAddReport}
          />
        )}
        {sub === "weight" && <WeightAnalyticsScreen user={mefitUser} />}
        {sub === "women" && <WomensHealthScreen />}
        {sub === "sleep" && <SleepScreen />}
        {sub === "streak" && <StreakScreen />}
        {sub === "photos" && <PhotoJourneyScreen />}
        {sub === "progress" && <BodyProgress />}
        {sub === "breathing" && <BreathingExercise stressDetected={false} />}
      </div>
    </div>
  );
}
