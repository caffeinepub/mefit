import {
  Copy,
  Gift,
  Globe,
  LogOut,
  Palette,
  PhoneCall,
  Plus,
  Settings,
  Shield,
  ShoppingBag,
  Star,
  Trash2,
  Trophy,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { MeFitUser, Role, SOSContact } from "../../types";
import AvatarCreator from "./AvatarCreator";
import AvatarDisplay from "./AvatarDisplay";
import AvatarShop from "./AvatarShop";
import Leaderboard from "./Leaderboard";

interface Props {
  mefitUser: MeFitUser | null;
  role: Role;
  onLogout: () => void;
}

function getBMI(height: number, weight: number): string {
  if (!height || !weight) return "N/A";
  const bmi = weight / (height / 100) ** 2;
  return bmi.toFixed(1);
}

function getBMILabel(bmi: string): { label: string; color: string } {
  const v = Number.parseFloat(bmi);
  if (Number.isNaN(v)) return { label: "", color: "#94A3B8" };
  if (v < 18.5) return { label: "Underweight", color: "#3B82F6" };
  if (v < 25) return { label: "Normal", color: "#10B981" };
  if (v < 30) return { label: "Overweight", color: "#F97316" };
  return { label: "Obese", color: "#EF4444" };
}

const ROLE_STYLES: Record<Role, { label: string; color: string; bg: string }> =
  {
    user: { label: "User", color: "#3B82F6", bg: "rgba(59,130,246,0.15)" },
    doctor: { label: "Doctor", color: "#10B981", bg: "rgba(16,185,129,0.15)" },
    nutritionist: {
      label: "Nutritionist",
      color: "#8B5CF6",
      bg: "rgba(139,92,246,0.15)",
    },
    yoga_expert: {
      label: "Yoga Expert",
      color: "#7C3AED",
      bg: "rgba(124,58,237,0.15)",
    },
    influencer: {
      label: "Influencer",
      color: "#EC4899",
      bg: "rgba(236,72,153,0.15)",
    },
  };

const LANGUAGES = [
  "English",
  "Hindi",
  "Urdu",
  "Gujarati",
  "Punjabi",
  "Tamil",
  "Telugu",
  "Bengali",
  "Marathi",
];

const STAT_KEYS = ["height", "weight", "bmi", "bmi-label"] as const;

const DIET_LABELS: Record<
  string,
  { label: string; color: string; emoji: string }
> = {
  veg: { label: "Vegetarian", color: "#10B981", emoji: "\uD83E\uDD57" },
  nonveg: { label: "Non-Vegetarian", color: "#F97316", emoji: "\uD83C\uDF57" },
  vegan: { label: "Vegan", color: "#10B981", emoji: "\uD83C\uDF31" },
  eggetarian: { label: "Eggetarian", color: "#F59E0B", emoji: "\uD83E\uDD5A" },
};

function loadContacts(): SOSContact[] {
  try {
    const raw = localStorage.getItem("mefit_sos_contacts");
    return raw
      ? (JSON.parse(raw) as SOSContact[])
      : [
          {
            id: "c1",
            name: "Dr. Anjali Sharma",
            phone: "+91 98765 43210",
            isPrimary: true,
          },
          {
            id: "c2",
            name: "Raj (Husband)",
            phone: "+91 99887 76655",
            isPrimary: false,
          },
        ];
  } catch {
    return [];
  }
}

function saveContacts(contacts: SOSContact[]) {
  localStorage.setItem("mefit_sos_contacts", JSON.stringify(contacts));
}

export default function ProfileTab({ mefitUser, role, onLogout }: Props) {
  const [contacts, setContacts] = useState<SOSContact[]>(loadContacts);
  const [showAddContact, setShowAddContact] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newPrimary, setNewPrimary] = useState(false);

  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState(
    () => localStorage.getItem("mefit_language") ?? "English",
  );
  const [clarifaiKey, setClarifaiKey] = useState(
    () => localStorage.getItem("clarifai_api_key") ?? "",
  );
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showAvatarShop, setShowAvatarShop] = useState(false);
  const [showAvatarCreator, setShowAvatarCreator] = useState(false);
  const [avatarKey, setAvatarKey] = useState(0);
  const [referralInput, setReferralInput] = useState("");
  const [rewardPoints, setRewardPoints] = useState(() =>
    Number.parseInt(localStorage.getItem("mefit_rewards_points") ?? "0", 10),
  );

  const name = mefitUser?.name ?? "User";
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const referralCode = (() => {
    const stored = localStorage.getItem("mefit_referral_code");
    if (stored) return stored;
    const code = `MEFIT-${name.slice(0, 3).toUpperCase()}${new Date().getFullYear().toString().slice(2)}`;
    localStorage.setItem("mefit_referral_code", code);
    return code;
  })();

  const bmi = mefitUser ? getBMI(mefitUser.height, mefitUser.weight) : "N/A";
  const bmiInfo = getBMILabel(bmi);
  const roleStyle = ROLE_STYLES[role];

  function handleLanguageChange(lang: string) {
    setLanguage(lang);
    localStorage.setItem("mefit_language", lang);
  }

  function copyReferral() {
    navigator.clipboard.writeText(referralCode).catch(() => {});
    toast.success("Referral code copied!");
  }

  function shareInvite() {
    const link = `https://mefit.app/join?ref=${referralCode}`;
    navigator.clipboard.writeText(link).catch(() => {});
    toast.success("Link copied!");
  }

  function redeemReferral() {
    if (!referralInput.trim().startsWith("MEFIT-")) {
      toast.error("Invalid referral code.");
      return;
    }
    const newPts = rewardPoints + 100;
    setRewardPoints(newPts);
    localStorage.setItem("mefit_rewards_points", String(newPts));
    setReferralInput("");
    toast.success("100 points earned!");
  }

  function addContact() {
    if (!newName.trim() || !newPhone.trim()) return;
    const updated = [
      ...contacts,
      {
        id: String(Date.now()),
        name: newName.trim(),
        phone: newPhone.trim(),
        isPrimary: newPrimary,
      },
    ];
    setContacts(updated);
    saveContacts(updated);
    setNewName("");
    setNewPhone("");
    setNewPrimary(false);
    setShowAddContact(false);
    toast.success("Contact added!");
  }

  function removeContact(id: string) {
    const updated = contacts.filter((c) => c.id !== id);
    setContacts(updated);
    saveContacts(updated);
  }

  function handleAvatarSaved() {
    setAvatarKey((k) => k + 1);
  }

  const cardStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
    padding: "1rem",
  };

  const stats = mefitUser
    ? [
        {
          key: STAT_KEYS[0],
          label: "Height",
          value: `${mefitUser.height}cm`,
          color: "white",
        },
        {
          key: STAT_KEYS[1],
          label: "Weight",
          value: `${mefitUser.weight}kg`,
          color: "white",
        },
        { key: STAT_KEYS[2], label: "BMI", value: bmi, color: "white" },
        {
          key: STAT_KEYS[3],
          label: "Status",
          value: bmiInfo.label,
          color: bmiInfo.color,
        },
      ]
    : [];

  const dietInfo = mefitUser
    ? (DIET_LABELS[mefitUser.lifestyle] ?? DIET_LABELS.veg)
    : null;

  return (
    <div className="space-y-4 pb-4">
      {/* Avatar Section */}
      <div
        style={{
          background:
            "linear-gradient(135deg, rgba(139,92,246,0.12), rgba(236,72,153,0.08))",
          border: "1px solid rgba(139,92,246,0.2)",
          borderRadius: "20px",
          padding: "1.25rem",
        }}
      >
        <div className="flex flex-col items-center gap-3">
          <AvatarDisplay
            size={140}
            avatarKey={avatarKey}
            onCreateAvatar={() => setShowAvatarCreator(true)}
            showPrompt={true}
          />
          <button
            type="button"
            data-ocid="profile.open_modal_button"
            onClick={() => setShowAvatarCreator(true)}
            className="flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-full transition-all"
            style={{
              background: "linear-gradient(135deg, #8B5CF6, #EC4899)",
              color: "white",
              boxShadow: "0 4px 16px rgba(139,92,246,0.35)",
            }}
          >
            <Palette size={14} /> Customize Avatar
          </button>
        </div>
      </div>

      {/* User Info Card */}
      <div style={cardStyle}>
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)" }}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-lg truncate">{name}</p>
            {mefitUser && (
              <p className="text-slate-400 text-xs">
                {mefitUser.age}y &middot; {mefitUser.gender} &middot;{" "}
                {mefitUser.goal === "loss"
                  ? "Weight Loss"
                  : mefitUser.goal === "gain"
                    ? "Weight Gain"
                    : "Maintain"}
              </p>
            )}
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span
                className="inline-block text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ background: roleStyle.bg, color: roleStyle.color }}
              >
                {roleStyle.label}
              </span>
              {dietInfo && (
                <span
                  className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    background: `${dietInfo.color}22`,
                    color: dietInfo.color,
                  }}
                >
                  {dietInfo.emoji} {dietInfo.label}
                </span>
              )}
            </div>
          </div>
        </div>

        {stats.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mt-4">
            {stats.map((s) => (
              <div
                key={s.key}
                className="rounded-xl p-2 text-center"
                style={{ background: "rgba(255,255,255,0.05)" }}
              >
                <p className="font-bold text-sm" style={{ color: s.color }}>
                  {s.value}
                </p>
                <p className="text-slate-500 text-[10px]">{s.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SOS Contacts */}
      <div style={cardStyle}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Shield size={16} style={{ color: "#EF4444" }} />
            <span className="text-white font-semibold text-sm">
              SOS Contacts
            </span>
          </div>
          <button
            type="button"
            data-ocid="profile.open_modal_button"
            onClick={() => setShowAddContact(true)}
            className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full font-semibold"
            style={{ background: "rgba(59,130,246,0.2)", color: "#3B82F6" }}
          >
            <Plus size={12} /> Add
          </button>
        </div>

        <div className="space-y-2">
          {contacts.map((c, i) => (
            <div
              key={c.id}
              data-ocid={`profile.item.${i + 1}`}
              className="flex items-center gap-3 rounded-xl p-3"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(239,68,68,0.15)" }}
              >
                <PhoneCall size={14} style={{ color: "#EF4444" }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <p className="text-white text-sm font-medium truncate">
                    {c.name}
                  </p>
                  {c.isPrimary && (
                    <Star
                      size={12}
                      fill="#F59E0B"
                      style={{ color: "#F59E0B", flexShrink: 0 }}
                    />
                  )}
                </div>
                <p className="text-slate-400 text-xs">{c.phone}</p>
              </div>
              <button
                type="button"
                data-ocid={`profile.delete_button.${i + 1}`}
                onClick={() => removeContact(c.id)}
                className="p-1.5 rounded-lg"
                style={{ color: "#475569" }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          {contacts.length === 0 && (
            <p
              className="text-slate-500 text-xs text-center py-3"
              data-ocid="profile.empty_state"
            >
              No contacts added yet.
            </p>
          )}
        </div>

        {showAddContact && (
          <div
            className="mt-3 rounded-2xl p-4 space-y-3"
            style={{
              background: "rgba(59,130,246,0.06)",
              border: "1px solid rgba(59,130,246,0.2)",
            }}
            data-ocid="profile.dialog"
          >
            <div className="flex items-center justify-between">
              <p className="text-white text-sm font-semibold">
                Add Emergency Contact
              </p>
              <button
                type="button"
                data-ocid="profile.close_button"
                onClick={() => setShowAddContact(false)}
              >
                <X size={16} style={{ color: "#94A3B8" }} />
              </button>
            </div>
            <input
              type="text"
              placeholder="Contact name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              data-ocid="profile.input"
              className="w-full rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 outline-none"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            />
            <input
              type="tel"
              placeholder="Phone number"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              data-ocid="profile.input"
              className="w-full rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 outline-none"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            />
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={newPrimary}
                onChange={(e) => setNewPrimary(e.target.checked)}
                data-ocid="profile.checkbox"
                className="w-4 h-4 rounded"
              />
              <span className="text-slate-300 text-xs">
                Mark as primary contact
              </span>
            </label>
            <button
              type="button"
              data-ocid="profile.submit_button"
              onClick={addContact}
              className="w-full py-2.5 rounded-xl text-white text-sm font-bold"
              style={{
                background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
              }}
            >
              Save Contact
            </button>
          </div>
        )}
      </div>

      {/* Avatar Shop Card */}
      <div style={cardStyle}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingBag size={16} style={{ color: "#8B5CF6" }} />
            <div>
              <span className="text-white font-semibold text-sm block">
                Avatar Shop
              </span>
              <span className="text-slate-500 text-xs">
                Buy outfits & accessories
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Mini avatar preview */}
            <div
              className="rounded-xl overflow-hidden flex items-center justify-center"
              style={{
                background: "rgba(139,92,246,0.1)",
                border: "1px solid rgba(139,92,246,0.2)",
                width: 44,
                height: 52,
              }}
            >
              <AvatarDisplay
                size={44}
                avatarKey={avatarKey}
                showPrompt={false}
              />
            </div>
            <button
              type="button"
              data-ocid="profile.open_modal_button"
              onClick={() => setShowAvatarShop(true)}
              className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full font-semibold"
              style={{
                background: "linear-gradient(90deg, #8B5CF6, #EC4899)",
                color: "white",
              }}
            >
              <ShoppingBag size={11} /> Shop
            </button>
          </div>
        </div>
      </div>

      {/* My Rewards & Refer */}
      <div style={cardStyle}>
        <div className="flex items-center gap-2 mb-3">
          <Gift size={16} style={{ color: "#F59E0B" }} />
          <span className="text-white font-semibold text-sm">My Rewards</span>
        </div>

        <div
          className="rounded-2xl p-4 text-center mb-3"
          style={{
            background:
              "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(251,191,36,0.08))",
            border: "1px solid rgba(245,158,11,0.25)",
          }}
        >
          <p className="text-yellow-400 text-3xl font-black">{rewardPoints}</p>
          <p className="text-slate-400 text-xs mt-0.5">Reward Points</p>
          <p className="text-slate-500 text-[10px] mt-1">
            100 pts = \u20b910 off consultations
          </p>
        </div>

        <div
          className="rounded-xl p-3 flex items-center justify-between mb-2"
          style={{ background: "rgba(255,255,255,0.04)" }}
        >
          <div>
            <p className="text-slate-400 text-xs">Your Referral Code</p>
            <p className="text-white font-bold text-sm">{referralCode}</p>
          </div>
          <button
            type="button"
            onClick={copyReferral}
            data-ocid="profile.secondary_button"
            className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full font-semibold"
            style={{ background: "rgba(245,158,11,0.2)", color: "#F59E0B" }}
          >
            <Copy size={11} /> Copy
          </button>
        </div>

        <button
          type="button"
          onClick={shareInvite}
          data-ocid="profile.secondary_button"
          className="w-full py-2.5 rounded-xl text-sm font-semibold mb-2"
          style={{
            background: "rgba(59,130,246,0.12)",
            color: "#60A5FA",
            border: "1px solid rgba(59,130,246,0.2)",
          }}
        >
          Share Invite Link
        </button>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter a referral code (MEFIT-...)"
            value={referralInput}
            onChange={(e) => setReferralInput(e.target.value)}
            data-ocid="profile.input"
            className="flex-1 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          />
          <button
            type="button"
            onClick={redeemReferral}
            data-ocid="profile.submit_button"
            className="px-4 py-2 rounded-xl text-xs font-bold text-white"
            style={{ background: "linear-gradient(135deg, #F59E0B, #D97706)" }}
          >
            Redeem
          </button>
        </div>
        <p className="text-slate-600 text-[10px] mt-2 text-center">
          1 referral = 100 points &nbsp;|&nbsp; 100 points = \u20b910 off
          consultations
        </p>
      </div>

      {/* Leaderboard */}
      <div style={cardStyle}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Trophy size={16} style={{ color: "#F59E0B" }} />
            <span className="text-white font-semibold text-sm">
              Leaderboard
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowLeaderboard((v) => !v)}
            data-ocid="profile.toggle"
            className="text-xs px-3 py-1.5 rounded-full font-semibold"
            style={{
              background: showLeaderboard
                ? "rgba(245,158,11,0.2)"
                : "rgba(255,255,255,0.06)",
              color: showLeaderboard ? "#F59E0B" : "#94A3B8",
            }}
          >
            {showLeaderboard ? "Hide" : "View"}
          </button>
        </div>
        {showLeaderboard && <Leaderboard inline />}
      </div>

      {/* Settings */}
      <div style={cardStyle}>
        <div className="flex items-center gap-2 mb-3">
          <Settings size={16} style={{ color: "#818CF8" }} />
          <span className="text-white font-semibold text-sm">Settings</span>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-200 text-sm">Notifications</p>
              <p className="text-slate-500 text-xs">
                Reminders, alerts, insights
              </p>
            </div>
            <button
              type="button"
              data-ocid="profile.toggle"
              onClick={() => setNotifications((v) => !v)}
              className="w-11 h-6 rounded-full relative transition-colors"
              style={{
                background: notifications
                  ? "linear-gradient(135deg, #3B82F6, #8B5CF6)"
                  : "rgba(255,255,255,0.1)",
              }}
            >
              <span
                className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all"
                style={{
                  left: notifications ? "calc(100% - 1.375rem)" : "2px",
                }}
              />
            </button>
          </div>

          <div
            className="h-px"
            style={{ background: "rgba(255,255,255,0.06)" }}
          />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-200 text-sm">Dark Mode</p>
              <p className="text-slate-500 text-xs">Appearance preference</p>
            </div>
            <button
              type="button"
              data-ocid="profile.toggle"
              onClick={() => setDarkMode((v) => !v)}
              className="w-11 h-6 rounded-full relative transition-colors"
              style={{
                background: darkMode
                  ? "linear-gradient(135deg, #3B82F6, #8B5CF6)"
                  : "rgba(255,255,255,0.1)",
              }}
            >
              <span
                className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all"
                style={{ left: darkMode ? "calc(100% - 1.375rem)" : "2px" }}
              />
            </button>
          </div>

          <div
            className="h-px"
            style={{ background: "rgba(255,255,255,0.06)" }}
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe size={14} style={{ color: "#818CF8" }} />
              <div>
                <p className="text-slate-200 text-sm">Language</p>
                <p className="text-slate-500 text-xs">App display language</p>
              </div>
            </div>
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              data-ocid="profile.select"
              className="text-xs rounded-xl px-3 py-1.5 outline-none"
              style={{
                background: "rgba(59,130,246,0.15)",
                color: "#818CF8",
                border: "1px solid rgba(59,130,246,0.2)",
              }}
            >
              {LANGUAGES.map((l) => (
                <option
                  key={l}
                  value={l}
                  style={{ background: "#0A0F1E", color: "white" }}
                >
                  {l}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Role Info */}
      {/* Clarifai API Key */}
      <div style={cardStyle}>
        <div className="flex items-center gap-2 mb-3">
          <span style={{ fontSize: 14, color: "#818CF8" }}>🤖</span>
          <span className="text-white font-semibold text-sm">
            AI Food Detection
          </span>
        </div>
        <div className="space-y-2">
          <p className="text-slate-200 text-sm">
            Clarifai API Key (for food AI)
          </p>
          <input
            type="password"
            value={clarifaiKey}
            onChange={(e) => setClarifaiKey(e.target.value)}
            placeholder="Enter your Clarifai API key"
            data-ocid="profile.input"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 10,
              color: "white",
              padding: "8px 12px",
              fontSize: 13,
              width: "100%",
              outline: "none",
            }}
          />
          <p className="text-slate-500 text-xs">
            Get a free key at clarifai.com — improves food detection accuracy
          </p>
          <button
            type="button"
            data-ocid="profile.save_button"
            onClick={() => {
              localStorage.setItem("clarifai_api_key", clarifaiKey);
              toast.success("API key saved!");
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold transition-opacity hover:opacity-80"
            style={{
              background: "linear-gradient(135deg,#6366F1,#8B5CF6)",
              color: "white",
            }}
          >
            Save Key
          </button>
        </div>
      </div>

      <div
        className="rounded-2xl p-4 flex items-center gap-3"
        style={{
          background: roleStyle.bg,
          border: `1px solid ${roleStyle.color}33`,
        }}
      >
        <User size={18} style={{ color: roleStyle.color }} />
        <div>
          <p className="text-white text-sm font-semibold">
            Role: {roleStyle.label}
          </p>
          <p className="text-slate-400 text-xs">
            {role === "user"
              ? "Full access to all features"
              : role === "doctor"
                ? "Patient reports and alerts only"
                : "Diet and meal data only"}
          </p>
        </div>
      </div>

      <button
        type="button"
        data-ocid="profile.primary_button"
        onClick={onLogout}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-semibold transition-opacity hover:opacity-80"
        style={{
          background: "rgba(239,68,68,0.12)",
          color: "#EF4444",
          border: "1px solid rgba(239,68,68,0.2)",
        }}
      >
        <LogOut size={16} />
        Log Out
      </button>

      {showAvatarShop && (
        <AvatarShop
          onClose={() => {
            setShowAvatarShop(false);
            setAvatarKey((k) => k + 1);
          }}
        />
      )}
      {showAvatarCreator && (
        <AvatarCreator
          onClose={() => setShowAvatarCreator(false)}
          onSave={handleAvatarSaved}
        />
      )}
    </div>
  );
}
