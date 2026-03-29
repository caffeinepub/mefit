import { Trophy, X } from "lucide-react";
import { useState } from "react";

interface LeaderEntry {
  rank: number;
  name: string;
  steps: number;
  dietScore: number;
  activityScore: number;
  avatar: string;
  color: string;
  isCurrentUser?: boolean;
}

const LEADERS: LeaderEntry[] = [
  {
    rank: 1,
    name: "Priya S.",
    steps: 12400,
    dietScore: 95,
    activityScore: 88,
    avatar: "PS",
    color: "#F59E0B",
  },
  {
    rank: 2,
    name: "Aisha K.",
    steps: 11200,
    dietScore: 88,
    activityScore: 92,
    avatar: "AK",
    color: "#94A3B8",
  },
  {
    rank: 3,
    name: "You",
    steps: 9800,
    dietScore: 82,
    activityScore: 79,
    avatar: "ME",
    color: "#CD7F32",
    isCurrentUser: true,
  },
  {
    rank: 4,
    name: "Sunita R.",
    steps: 8900,
    dietScore: 78,
    activityScore: 71,
    avatar: "SR",
    color: "#3B82F6",
  },
  {
    rank: 5,
    name: "Liu M.",
    steps: 7600,
    dietScore: 72,
    activityScore: 68,
    avatar: "LM",
    color: "#8B5CF6",
  },
];

const MEDAL = ["🥇", "🥈", "🥉"];

type ScoreKey = "steps" | "dietScore" | "activityScore";

interface LeaderboardProps {
  onClose?: () => void;
  inline?: boolean;
}

export default function Leaderboard({
  onClose,
  inline = false,
}: LeaderboardProps) {
  const [tab, setTab] = useState<ScoreKey>("steps");

  const sorted = [...LEADERS].sort((a, b) => b[tab] - a[tab]);

  const cardStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
  };

  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });

  const content = (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Trophy size={18} style={{ color: "#F59E0B" }} />
            <h3 className="text-white font-bold">Weekly Leaderboard</h3>
          </div>
          <p className="text-slate-400 text-xs mt-0.5">
            {fmt(weekStart)} – {fmt(weekEnd)}
          </p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            data-ocid="leaderboard.close_button"
          >
            <X size={20} style={{ color: "#475569" }} />
          </button>
        )}
      </div>

      {/* Tabs */}
      <div
        className="flex rounded-2xl p-1 gap-1"
        style={{ background: "rgba(255,255,255,0.04)" }}
      >
        {(["steps", "dietScore", "activityScore"] as ScoreKey[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            data-ocid="leaderboard.tab"
            className="flex-1 py-2 rounded-xl text-xs font-bold transition-all"
            style={{
              background:
                tab === t
                  ? "linear-gradient(135deg, #3B82F6, #8B5CF6)"
                  : "transparent",
              color: tab === t ? "white" : "#94A3B8",
            }}
          >
            {t === "steps"
              ? "👟 Steps"
              : t === "dietScore"
                ? "🥗 Diet"
                : "⚡ Activity"}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="space-y-2" data-ocid="leaderboard.list">
        {sorted.map((entry, i) => (
          <div
            key={entry.rank}
            data-ocid={`leaderboard.item.${i + 1}`}
            className="flex items-center gap-3 rounded-2xl p-3"
            style={{
              background: entry.isCurrentUser
                ? "rgba(59,130,246,0.12)"
                : "rgba(255,255,255,0.03)",
              border: entry.isCurrentUser
                ? "1.5px solid rgba(59,130,246,0.4)"
                : "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <span className="text-xl w-8 text-center">
              {i < 3 ? (
                MEDAL[i]
              ) : (
                <span className="text-slate-400 text-sm font-bold">
                  {i + 1}
                </span>
              )}
            </span>
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{
                background: `linear-gradient(135deg, ${entry.color}, ${entry.color}88)`,
              }}
            >
              {entry.avatar}
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-semibold">
                {entry.name}
                {entry.isCurrentUser && (
                  <span className="ml-1 text-[10px] text-blue-400 font-normal">
                    (you)
                  </span>
                )}
              </p>
              <div
                className="mt-1 h-1.5 rounded-full overflow-hidden"
                style={{ background: "rgba(255,255,255,0.08)" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(entry[tab] / sorted[0][tab]) * 100}%`,
                    background: `linear-gradient(90deg, ${entry.color}, ${entry.color}88)`,
                  }}
                />
              </div>
            </div>
            <span
              className="text-white font-bold text-sm"
              style={{ color: entry.color }}
            >
              {tab === "steps"
                ? entry.steps.toLocaleString()
                : `${entry[tab]}%`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  if (inline)
    return (
      <div style={cardStyle} className="p-4">
        {content}
      </div>
    );

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center p-0"
      style={{ background: "rgba(0,0,0,0.8)" }}
      role="presentation"
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose?.()}
    >
      <div
        className="w-full max-w-lg rounded-t-3xl p-6"
        style={{
          background: "#0D1B2A",
          border: "1px solid rgba(255,255,255,0.1)",
          maxHeight: "80vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        data-ocid="leaderboard.modal"
      >
        {content}
      </div>
    </div>
  );
}
