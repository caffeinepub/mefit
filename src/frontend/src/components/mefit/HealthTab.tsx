import { useState } from "react";
import type { MeFitUser } from "../../types";
import BreathingExercise from "./BreathingExercise";
import HealthReport from "./HealthReport";
import PhotoJourneyScreen from "./PhotoJourneyScreen";
import SleepScreen from "./SleepScreen";
import StreakScreen from "./StreakScreen";
import WeightAnalyticsScreen from "./WeightAnalyticsScreen";
import WomensHealthScreen from "./WomensHealthScreen";

import type { PregnancyReport, UserProfile } from "../../types";
import Tracker from "../Tracker";
import BodyProgress from "./BodyProgress";

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

  return (
    <div className="space-y-4">
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
