import { Camera, GitCompare, TrendingDown, TrendingUp } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface BodyPhoto {
  week: number;
  date: string;
  dataUrl: string;
}

const DEMO_WEIGHTS = [
  { week: 1, weight: 68.5 },
  { week: 2, weight: 68.0 },
  { week: 3, weight: 67.8 },
  { week: 4, weight: 67.2 },
  { week: 5, weight: 66.9 },
  { week: 6, weight: 66.5 },
];

function loadPhotos(): BodyPhoto[] {
  try {
    const raw = localStorage.getItem("mefit_body_photos");
    return raw ? (JSON.parse(raw) as BodyPhoto[]) : [];
  } catch {
    return [];
  }
}

export default function BodyProgress() {
  const [photos, setPhotos] = useState<BodyPhoto[]>(loadPhotos);
  const [compareMode, setCompareMode] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const newWeek = photos.length + 1;
      const newPhoto: BodyPhoto = {
        week: newWeek,
        date: new Date().toLocaleDateString("en-IN"),
        dataUrl,
      };
      const updated = [...photos, newPhoto];
      setPhotos(updated);
      localStorage.setItem("mefit_body_photos", JSON.stringify(updated));
      toast.success(`Week ${newWeek} photo saved!`);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  const first = photos[0];
  const latest = photos[photos.length - 1];
  const weightChange =
    DEMO_WEIGHTS[DEMO_WEIGHTS.length - 1].weight - DEMO_WEIGHTS[0].weight;

  const cardStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
  };

  // Simple sparkline
  const w = 200;
  const h = 60;
  const minW = Math.min(...DEMO_WEIGHTS.map((d) => d.weight));
  const maxW = Math.max(...DEMO_WEIGHTS.map((d) => d.weight));
  const pts = DEMO_WEIGHTS.map((d, i) => {
    const x = (i / (DEMO_WEIGHTS.length - 1)) * w;
    const y = h - ((d.weight - minW) / (maxW - minW || 1)) * (h - 10) - 5;
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="space-y-4">
      {/* Header */}
      <div style={cardStyle} className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-white font-bold text-sm">Body Progress</h3>
            <p className="text-slate-400 text-xs">
              Photos tracked: {photos.length}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setCompareMode((v) => !v)}
              data-ocid="progress.toggle"
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{
                background: compareMode
                  ? "rgba(139,92,246,0.2)"
                  : "rgba(255,255,255,0.06)",
                color: compareMode ? "#8B5CF6" : "#94A3B8",
                border: compareMode ? "1px solid rgba(139,92,246,0.3)" : "none",
              }}
            >
              <GitCompare size={12} />
              Compare
            </button>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              data-ocid="progress.upload_button"
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-white"
              style={{
                background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
              }}
            >
              <Camera size={12} />
              Upload Week {photos.length + 1}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div
            className="rounded-xl p-3"
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            <p className="text-slate-400 text-xs">Weight Change</p>
            <div className="flex items-center gap-1 mt-1">
              {weightChange < 0 ? (
                <TrendingDown size={16} style={{ color: "#10B981" }} />
              ) : (
                <TrendingUp size={16} style={{ color: "#F97316" }} />
              )}
              <span
                className="font-bold text-sm"
                style={{ color: weightChange < 0 ? "#10B981" : "#F97316" }}
              >
                {weightChange > 0 ? "+" : ""}
                {weightChange.toFixed(1)} kg
              </span>
            </div>
          </div>
          <div
            className="rounded-xl p-3"
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            <p className="text-slate-400 text-xs">Current Weight</p>
            <p className="text-white font-bold text-sm mt-1">
              {DEMO_WEIGHTS[DEMO_WEIGHTS.length - 1].weight} kg
            </p>
          </div>
        </div>
      </div>

      {/* Compare View */}
      {compareMode && first && latest && photos.length >= 2 ? (
        <div style={cardStyle} className="p-4">
          <p className="text-white font-semibold text-sm mb-3">
            Before vs After
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center">
              <img
                src={first.dataUrl}
                alt="Week 1"
                className="rounded-2xl w-full object-cover"
                style={{ height: "180px" }}
              />
              <p className="text-slate-400 text-xs mt-1">
                Week 1 · {first.date}
              </p>
            </div>
            <div className="text-center">
              <img
                src={latest.dataUrl}
                alt={`Week ${latest.week}`}
                className="rounded-2xl w-full object-cover"
                style={{ height: "180px" }}
              />
              <p className="text-slate-400 text-xs mt-1">
                Week {latest.week} · {latest.date}
              </p>
            </div>
          </div>
        </div>
      ) : compareMode && photos.length < 2 ? (
        <div
          style={cardStyle}
          className="p-8 text-center"
          data-ocid="progress.empty_state"
        >
          <p className="text-slate-500 text-sm">
            Upload at least 2 photos to compare.
          </p>
        </div>
      ) : null}

      {/* Photo grid */}
      {!compareMode && (
        <div style={cardStyle} className="p-4">
          <p className="text-white font-semibold text-sm mb-3">Weekly Photos</p>
          {photos.length === 0 ? (
            <div className="text-center py-8" data-ocid="progress.empty_state">
              <Camera
                size={36}
                style={{ color: "#475569" }}
                className="mx-auto mb-2"
              />
              <p className="text-slate-500 text-sm">No photos uploaded yet.</p>
              <p className="text-slate-600 text-xs mt-1">
                Upload your first weekly photo to track progress!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {photos.map((p) => (
                <div
                  key={p.week}
                  className="text-center"
                  data-ocid={`progress.item.${p.week}`}
                >
                  <img
                    src={p.dataUrl}
                    alt={`Week ${p.week}`}
                    className="rounded-2xl w-full object-cover"
                    style={{ height: "140px" }}
                  />
                  <p className="text-slate-400 text-xs mt-1">
                    Week {p.week} · {p.date}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Weight Trend */}
      <div style={cardStyle} className="p-4">
        <p className="text-white font-semibold text-sm mb-3">
          Weight Trend (6 Weeks)
        </p>
        <svg
          width="100%"
          viewBox={`0 0 ${w} ${h}`}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Weight trend over 6 weeks"
        >
          <title>Weight Trend</title>
          <polyline
            points={pts}
            fill="none"
            stroke="url(#wGrad)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <defs>
            <linearGradient id="wGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>
          {DEMO_WEIGHTS.map((d, i) => {
            const x = (i / (DEMO_WEIGHTS.length - 1)) * w;
            const y =
              h - ((d.weight - minW) / (maxW - minW || 1)) * (h - 10) - 5;
            return <circle key={d.week} cx={x} cy={y} r="3" fill="#3B82F6" />;
          })}
        </svg>
        <div className="flex justify-between mt-1">
          <span className="text-slate-500 text-[10px]">Week 1</span>
          <span className="text-slate-500 text-[10px]">Week 6</span>
        </div>
      </div>
    </div>
  );
}
