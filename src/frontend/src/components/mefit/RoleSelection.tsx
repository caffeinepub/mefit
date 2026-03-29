import {
  Apple,
  Briefcase,
  Instagram,
  Stethoscope,
  User,
  Wind,
  X,
} from "lucide-react";
import { useState } from "react";
import type { Role } from "../../types";

interface Props {
  onSelectRole: (role: Role) => void;
}

const PROF_ROLES: {
  id: Role;
  label: string;
  description: string;
  color: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
}[] = [
  {
    id: "doctor",
    label: "Doctor",
    description: "Monitor patients and review health reports",
    color: "#10B981",
    icon: Stethoscope,
  },
  {
    id: "nutritionist",
    label: "Nutritionist",
    description: "Design diet plans and track nutritional goals",
    color: "#F97316",
    icon: Apple,
  },
  {
    id: "yoga_expert",
    label: "Yoga Expert",
    description: "Guide wellness sessions and mindful movement",
    color: "#8B5CF6",
    icon: Wind,
  },
  {
    id: "influencer",
    label: "Influencer",
    description: "Share health content and grow your audience",
    color: "#EC4899",
    icon: Instagram,
  },
];

export default function RoleSelection({ onSelectRole }: Props) {
  const [step, setStep] = useState<"choose" | "professional">("choose");
  const [selected, setSelected] = useState<Role | null>(null);

  function handleConfirmProfessional() {
    if (!selected) return;
    localStorage.setItem("mefit_role", selected);
    onSelectRole(selected);
  }

  function handleUserSelect() {
    localStorage.setItem("mefit_role", "user");
    onSelectRole("user");
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-10"
      style={{
        background:
          "linear-gradient(135deg, #0A0F1E 0%, #0F172A 60%, #1a0a2e 100%)",
      }}
    >
      <div className="w-full max-w-sm">
        {step === "choose" ? (
          <>
            <div className="mb-10 text-center">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{
                  background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
                  boxShadow: "0 0 32px rgba(59,130,246,0.4)",
                }}
              >
                <User size={28} color="white" />
              </div>
              <h2 className="text-3xl font-bold text-white mt-2">
                Who are you?
              </h2>
              <p className="text-white/40 mt-2 text-sm">
                Choose your experience type
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <button
                type="button"
                data-ocid="role.button"
                onClick={handleUserSelect}
                className="w-full text-left rounded-3xl p-6 flex items-center gap-5 transition-all active:scale-[0.98]"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(16,185,129,0.1))",
                  border: "1.5px solid rgba(59,130,246,0.4)",
                  boxShadow: "0 8px 32px rgba(59,130,246,0.15)",
                }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #3B82F6, #10B981)",
                    boxShadow: "0 4px 16px rgba(59,130,246,0.4)",
                  }}
                >
                  <User size={24} color="white" />
                </div>
                <div>
                  <p className="text-white font-bold text-lg">
                    Continue as User
                  </p>
                  <p className="text-white/50 text-sm mt-0.5">
                    Track health, diet &amp; pregnancy
                  </p>
                </div>
                <div className="ml-auto text-white/30 text-2xl">›</div>
              </button>
              <button
                type="button"
                data-ocid="role.button"
                onClick={() => setStep("professional")}
                className="w-full text-left rounded-3xl p-6 flex items-center gap-5 transition-all active:scale-[0.98]"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(236,72,153,0.1))",
                  border: "1.5px solid rgba(139,92,246,0.4)",
                  boxShadow: "0 8px 32px rgba(139,92,246,0.15)",
                }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #8B5CF6, #EC4899)",
                    boxShadow: "0 4px 16px rgba(139,92,246,0.4)",
                  }}
                >
                  <Briefcase size={24} color="white" />
                </div>
                <div>
                  <p className="text-white font-bold text-lg">
                    Continue as Professional
                  </p>
                  <p className="text-white/50 text-sm mt-0.5">
                    Doctor · Nutritionist · Yoga · Influencer
                  </p>
                </div>
                <div className="ml-auto text-white/30 text-2xl">›</div>
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="mb-8">
              <button
                type="button"
                onClick={() => {
                  setStep("choose");
                  setSelected(null);
                }}
                className="flex items-center gap-2 text-white/50 text-sm mb-6 hover:text-white/80 transition-colors"
              >
                <X size={14} /> Back
              </button>
              <h2 className="text-2xl font-bold text-white">
                Select Your Role
              </h2>
              <p className="text-white/40 mt-1 text-sm">
                Choose your professional specialization
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {PROF_ROLES.map(
                ({ id, label, description, color, icon: Icon }) => (
                  <button
                    type="button"
                    key={id}
                    data-ocid="role.button"
                    onClick={() => setSelected(id)}
                    className="w-full text-left rounded-2xl p-4 flex items-center gap-4 transition-all"
                    style={{
                      background:
                        selected === id
                          ? `${color}20`
                          : "rgba(255,255,255,0.04)",
                      border:
                        selected === id
                          ? `1.5px solid ${color}`
                          : "1px solid rgba(255,255,255,0.1)",
                      boxShadow:
                        selected === id ? `0 0 20px ${color}30` : "none",
                    }}
                  >
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: `${color}22`,
                        border: `1px solid ${color}44`,
                      }}
                    >
                      <Icon size={20} color={color} />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-bold text-sm">{label}</p>
                      <p className="text-white/40 text-xs mt-0.5">
                        {description}
                      </p>
                    </div>
                    {selected === id && (
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ background: color }}
                      >
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </button>
                ),
              )}
            </div>
            <button
              type="button"
              data-ocid="role.primary_button"
              onClick={handleConfirmProfessional}
              disabled={!selected}
              className="w-full py-3.5 rounded-2xl text-white font-bold text-base mt-6 transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-30"
              style={{
                background: "linear-gradient(90deg, #8B5CF6 0%, #EC4899 100%)",
                boxShadow: selected
                  ? "0 8px 24px rgba(139,92,246,0.35)"
                  : "none",
              }}
            >
              {selected
                ? `Continue as ${PROF_ROLES.find((r) => r.id === selected)?.label}`
                : "Select a role"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
