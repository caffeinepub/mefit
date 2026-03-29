import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import BottomNav from "./components/BottomNav";
import Dashboard from "./components/Dashboard";
import AuthScreen from "./components/mefit/AuthScreen";
import DietScreen from "./components/mefit/DietScreen";
import HealthTab from "./components/mefit/HealthTab";
import IntroScreens from "./components/mefit/IntroScreens";
import NotificationBell from "./components/mefit/NotificationBell";
import Onboarding from "./components/mefit/Onboarding";
import PatientDashboard from "./components/mefit/PatientDashboard";
import PlannerTab from "./components/mefit/PlannerTab";
import ProfessionalsSection from "./components/mefit/ProfessionalsSection";
import ProfileTab from "./components/mefit/ProfileTab";
import RoleSelection from "./components/mefit/RoleSelection";
import SOSButton from "./components/mefit/SOSButton";
import {
  DEMO_CHALLENGES,
  DEMO_DIET_LOGS,
  DEMO_FITNESS_LOGS,
  DEMO_HEALTH_LOGS,
  DEMO_MEDIA,
  DEMO_PROGRESS,
  DEMO_QUOTES,
  DEMO_REMINDERS,
  DEMO_REPORTS,
  DEMO_SNAPSHOTS,
  DEMO_USERS,
  DEMO_WEIGHT_HISTORY,
} from "./data/demoData";
import type {
  AppScreen,
  BodySnapshot,
  Challenge,
  ChallengeProgress,
  DietLog,
  FitnessLog,
  HealthLog,
  MeFitUser,
  MediaItem,
  MotivationalQuote,
  PregnancyReport,
  Reminder,
  Role,
  Tab,
  UserProfile,
  WeightEntry,
} from "./types";

let nextId = 1000;
function uid() {
  return String(nextId++);
}

function getAppScreen(
  role: Role | null,
  hasUser: boolean,
  authenticated: boolean,
  introSeen: boolean,
): AppScreen {
  if (!authenticated) return "login";
  if (!role) return "role";
  if (role === "user" && !introSeen) return "intro";
  if (role === "user" && !hasUser) return "onboarding";
  return "app";
}

function InfluencerPanel({
  onSave,
}: { onSave: (url: string, name: string) => void }) {
  const [url, setUrl] = useState(() => {
    try {
      const d = JSON.parse(
        localStorage.getItem("mefit_influencer_link") ?? "{}",
      ) as { url?: string };
      return d.url ?? "";
    } catch {
      return "";
    }
  });
  const [name, setName] = useState(() => {
    try {
      const d = JSON.parse(
        localStorage.getItem("mefit_influencer_link") ?? "{}",
      ) as { name?: string };
      return d.name ?? "";
    } catch {
      return "";
    }
  });
  const [saved, setSaved] = useState(false);

  function handleSave() {
    if (!url.trim()) return;
    onSave(url.trim(), name.trim() || url.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div
      className="space-y-3 rounded-3xl p-5"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <p className="text-white font-semibold text-sm">Your Social Channel</p>
      <p className="text-slate-400 text-xs">
        Add your Instagram or YouTube link to be featured in the Reels section.
      </p>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Channel name (e.g. Mama on a Mission)"
        className="w-full rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 outline-none"
        style={{
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      />
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://instagram.com/youraccount"
        className="w-full rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 outline-none"
        style={{
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      />
      <button
        type="button"
        onClick={handleSave}
        className="w-full py-2.5 rounded-xl text-white text-sm font-bold transition-all"
        style={{
          background: saved
            ? "linear-gradient(90deg, #10B981, #059669)"
            : "linear-gradient(90deg, #EC4899, #8B5CF6)",
        }}
      >
        {saved ? "\u2713 Saved!" : "Save Channel Link"}
      </button>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [showProfessionals, setShowProfessionals] = useState(false);
  const [currentUserId] = useState("sarah");

  const [authenticated, setAuthenticated] = useState(() => {
    try {
      const raw = localStorage.getItem("mefit_auth");
      return raw
        ? (JSON.parse(raw) as { authenticated: boolean }).authenticated === true
        : false;
    } catch {
      return false;
    }
  });

  const [mefitRole, setMefitRole] = useState<Role | null>(() => {
    const raw = localStorage.getItem("mefit_role");
    return (raw as Role) ?? null;
  });

  const [mefitUser, setMefitUser] = useState<MeFitUser | null>(() => {
    try {
      const raw = localStorage.getItem("mefit_user");
      return raw ? (JSON.parse(raw) as MeFitUser) : null;
    } catch {
      return null;
    }
  });

  const [introSeen, setIntroSeen] = useState(() => {
    return !!localStorage.getItem("mefit_intro_seen");
  });

  const appScreen: AppScreen = getAppScreen(
    mefitRole,
    !!mefitUser,
    authenticated,
    introSeen,
  );

  function handleAuth() {
    setAuthenticated(true);
  }

  function handleSelectRole(role: Role) {
    setMefitRole(role);
  }

  function handleIntroComplete() {
    setIntroSeen(true);
  }

  function handleOnboardingComplete(user: MeFitUser) {
    setMefitUser(user);
  }

  function handleSetInfluencerLink(url: string, name: string) {
    localStorage.setItem(
      "mefit_influencer_link",
      JSON.stringify({ url, name }),
    );
  }

  function handleLogout() {
    localStorage.removeItem("mefit_auth");
    localStorage.removeItem("mefit_role");
    localStorage.removeItem("mefit_user");
    setAuthenticated(false);
    setMefitRole(null);
    setMefitUser(null);
  }

  const [users] = useState<UserProfile[]>(DEMO_USERS);
  const [dietLogs, _setDietLogs] = useState<DietLog[]>(DEMO_DIET_LOGS);
  const [fitnessLogs] = useState<FitnessLog[]>(DEMO_FITNESS_LOGS);
  const [_healthLogs] = useState<HealthLog[]>(DEMO_HEALTH_LOGS);
  const [reports, setReports] = useState<PregnancyReport[]>(DEMO_REPORTS);
  const [reminders] = useState<Reminder[]>(DEMO_REMINDERS);
  const [_challenges] = useState<Challenge[]>(DEMO_CHALLENGES);
  const [_progress] = useState<ChallengeProgress[]>(DEMO_PROGRESS);
  const [_mediaItems] = useState<MediaItem[]>(DEMO_MEDIA);
  const [_quotes] = useState<MotivationalQuote[]>(DEMO_QUOTES);
  const [_snapshots] = useState<BodySnapshot[]>(DEMO_SNAPSHOTS);
  const [_weightHistory] = useState<WeightEntry[]>(DEMO_WEIGHT_HISTORY);

  const currentUser = users.find((u) => u.id === currentUserId) ?? users[0];

  function updateProfile(updates: Partial<UserProfile>) {
    console.log("Profile update:", updates);
  }

  if (appScreen === "login") return <AuthScreen onAuth={handleAuth} />;
  if (appScreen === "role")
    return <RoleSelection onSelectRole={handleSelectRole} />;
  if (appScreen === "intro")
    return <IntroScreens onComplete={handleIntroComplete} />;
  if (appScreen === "onboarding")
    return <Onboarding onComplete={handleOnboardingComplete} />;

  const effectiveRole = mefitRole ?? "user";

  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{ background: "#0A0F1E" }}
    >
      {/* Background ambient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, #3B82F6 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          className="absolute top-1/3 -right-40 w-96 h-96 rounded-full opacity-15"
          style={{
            background: "radial-gradient(circle, #8B5CF6 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          className="absolute bottom-40 left-1/4 w-80 h-80 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #06B6D4 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Top bar with notification bell */}
        <div className="fixed top-0 right-0 z-30 p-3">
          <NotificationBell />
        </div>

        <main
          className="max-w-[640px] mx-auto px-4 py-4 pb-24 pt-14"
          style={{ minHeight: "100dvh" }}
        >
          {activeTab === "home" && effectiveRole === "user" && (
            <div className="space-y-4">
              <Dashboard
                user={currentUser}
                dietLogs={dietLogs}
                fitnessLogs={fitnessLogs}
                reminders={reminders}
                quotes={_quotes}
                reports={reports}
                allUsers={users}
                role={effectiveRole}
                mefitUserName={mefitUser?.name}
              />
              <button
                type="button"
                onClick={() => setShowProfessionals(true)}
                data-ocid="home.secondary_button"
                className="w-full py-3.5 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2"
                style={{
                  background: "linear-gradient(90deg, #3B82F6, #8B5CF6)",
                  boxShadow: "0 4px 16px rgba(59,130,246,0.3)",
                }}
              >
                \u2728 Meet Our Experts
              </button>
            </div>
          )}
          {activeTab === "home" &&
            (effectiveRole === "doctor" ||
              effectiveRole === "nutritionist") && (
              <PatientDashboard
                doctorName={mefitUser?.name ?? "Professional"}
                role={effectiveRole}
              />
            )}
          {activeTab === "home" && effectiveRole === "yoga_expert" && (
            <PatientDashboard
              doctorName={mefitUser?.name ?? "Yoga Expert"}
              role={"yoga_expert" as const}
            />
          )}
          {activeTab === "home" && effectiveRole === "influencer" && (
            <div className="space-y-4">
              <div
                className="rounded-3xl p-6"
                style={{
                  background: "linear-gradient(135deg, #2d0a3e, #7C3AED)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                }}
              >
                <p className="text-white/60 text-xs uppercase tracking-widest mb-1">
                  Influencer Dashboard
                </p>
                <h1 className="text-2xl font-bold text-white">
                  {mefitUser?.name ?? "Influencer"}
                </h1>
                <p className="text-white/50 text-sm mt-1">
                  Share health content and inspire your audience
                </p>
              </div>
              <InfluencerPanel onSave={handleSetInfluencerLink} />
            </div>
          )}

          {activeTab === "health" &&
            (effectiveRole === "user" || effectiveRole === "influencer") && (
              <HealthTab
                mefitUser={mefitUser}
                currentUser={currentUser}
                reports={reports}
                onUpdateProfile={updateProfile}
                onAddReport={(r) =>
                  setReports((rs) => [...rs, { ...r, id: uid() }])
                }
              />
            )}

          {activeTab === "diet" &&
            effectiveRole !== "yoga_expert" &&
            effectiveRole !== "doctor" &&
            effectiveRole !== "nutritionist" && (
              <DietScreen
                goal={mefitUser?.goal ?? "maintain"}
                lifestyle={mefitUser?.lifestyle ?? "veg"}
              />
            )}

          {activeTab === "planner" && effectiveRole === "user" && (
            <PlannerTab />
          )}

          {activeTab === "profile" && (
            <ProfileTab
              mefitUser={mefitUser}
              role={effectiveRole}
              onLogout={handleLogout}
            />
          )}

          {/* Doctor/Nutritionist land on home which shows PatientDashboard */}
          {activeTab === "health" &&
            effectiveRole !== "user" &&
            effectiveRole !== "influencer" && (
              <Dashboard
                user={currentUser}
                dietLogs={dietLogs}
                fitnessLogs={fitnessLogs}
                reminders={reminders}
                quotes={_quotes}
                reports={reports}
                allUsers={users}
                role={effectiveRole}
                mefitUserName={mefitUser?.name}
              />
            )}

          {activeTab === "planner" &&
            effectiveRole !== "user" &&
            effectiveRole !== "yoga_expert" &&
            effectiveRole !== "influencer" && (
              <div
                className="rounded-3xl p-8 text-center"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <p className="text-slate-400 text-sm">
                  Planner is not available for your role.
                </p>
              </div>
            )}
        </main>

        <BottomNav
          active={activeTab}
          onChange={setActiveTab}
          role={effectiveRole}
        />

        {effectiveRole === "user" && (
          <SOSButton patientName={mefitUser?.name ?? currentUser.name} />
        )}
      </div>

      {showProfessionals && (
        <ProfessionalsSection onClose={() => setShowProfessionals(false)} />
      )}
      <Toaster />
    </div>
  );
}
