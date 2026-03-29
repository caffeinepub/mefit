import { Calendar, HeartPulse, Home, User, Utensils } from "lucide-react";
import type { Role, Tab } from "../types";

interface Props {
  active: Tab;
  onChange: (tab: Tab) => void;
  role?: Role | null;
}

const ALL_TABS: {
  id: Tab;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
}[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "health", label: "Health", icon: HeartPulse },
  { id: "diet", label: "Diet", icon: Utensils },
  { id: "planner", label: "Planner", icon: Calendar },
  { id: "profile", label: "Profile", icon: User },
];

const DOCTOR_TABS: Tab[] = ["home", "health", "profile"];
const NUTRITIONIST_TABS: Tab[] = ["home", "diet", "profile"];

export default function BottomNav({ active, onChange, role }: Props) {
  let visibleIds: Tab[] = ALL_TABS.map((t) => t.id);
  if (role === "doctor") visibleIds = DOCTOR_TABS;
  else if (role === "nutritionist") visibleIds = NUTRITIONIST_TABS;

  const tabs = ALL_TABS.filter((t) => visibleIds.includes(t.id));

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-center"
      style={{
        background: "rgba(10,15,30,0.95)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        height: "64px",
      }}
    >
      <div className="w-full max-w-[640px] flex items-center justify-around px-2 h-full">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              type="button"
              data-ocid="nav.link"
              onClick={() => onChange(id)}
              className="flex flex-col items-center gap-1 flex-1 h-full justify-center relative transition-all"
            >
              {isActive && (
                <span
                  className="absolute inset-x-2 top-1 bottom-1 rounded-xl"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.2))",
                  }}
                />
              )}
              <span
                className="relative z-10 flex flex-col items-center gap-1"
                style={{ color: isActive ? "#818CF8" : "#475569" }}
              >
                <Icon size={20} />
                <span
                  className="text-[10px] font-semibold tracking-wide"
                  style={{
                    background: isActive
                      ? "linear-gradient(135deg, #3B82F6, #8B5CF6)"
                      : "none",
                    WebkitBackgroundClip: isActive ? "text" : undefined,
                    WebkitTextFillColor: isActive ? "transparent" : undefined,
                    color: isActive ? undefined : "#475569",
                  }}
                >
                  {label}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
