import { Camera, GitCompare, TrendingDown, TrendingUp } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { addHealthLog, getHealthLogs } from "../../utils/userDataStore";

type PhotoLabel = "Before" | "After" | "Weekly";

interface BodyPhoto {
  id: string;
  week: number;
  label: PhotoLabel;
  date: string;
  dataUrl: string;
}

function loadPhotos(): BodyPhoto[] {
  try {
    const raw = localStorage.getItem("mefit_body_photos_v2");
    return raw ? (JSON.parse(raw) as BodyPhoto[]) : [];
  } catch {
    return [];
  }
}

function savePhotos(photos: BodyPhoto[]) {
  localStorage.setItem("mefit_body_photos_v2", JSON.stringify(photos));
}

export default function BodyProgress() {
  const [photos, setPhotos] = useState<BodyPhoto[]>(loadPhotos);
  const [compareMode, setCompareMode] = useState(false);
  const [pendingLabel, setPendingLabel] = useState<PhotoLabel>("Weekly");
  const fileRef = useRef<HTMLInputElement>(null);

  const healthLogs = getHealthLogs();
  const latestWeight = healthLogs.find((h) => h.weight)?.weight;

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const weeklyPhotos = photos.filter((p) => p.label === "Weekly");
      const newWeek = weeklyPhotos.length + 1;
      const newPhoto: BodyPhoto = {
        id: String(Date.now()),
        week: newWeek,
        label: pendingLabel,
        date: new Date().toLocaleDateString("en-IN"),
        dataUrl,
      };
      const updated = [...photos, newPhoto];
      setPhotos(updated);
      savePhotos(updated);
      toast.success(`${pendingLabel} photo saved!`);

      // If user uploaded a photo, also add a health log entry so report can count it
      addHealthLog({ notes: `Progress photo uploaded (${pendingLabel})` });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  const beforePhoto = photos.find((p) => p.label === "Before");
  const afterPhoto = photos.find((p) => p.label === "After");

  const cardStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
  };

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
              Upload
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

        {/* Label selector */}
        <div className="flex flex-col gap-2">
          <p className="text-slate-400 text-xs font-semibold">Photo label:</p>
          <div className="flex gap-2">
            {(["Before", "After", "Weekly"] as PhotoLabel[]).map((lbl) => (
              <button
                key={lbl}
                type="button"
                onClick={() => setPendingLabel(lbl)}
                className="flex-1 py-1.5 rounded-full text-xs font-semibold transition-all"
                style={{
                  background:
                    pendingLabel === lbl
                      ? lbl === "Before"
                        ? "linear-gradient(135deg, #3B82F6, #6366F1)"
                        : lbl === "After"
                          ? "linear-gradient(135deg, #10B981, #059669)"
                          : "linear-gradient(135deg, #8B5CF6, #EC4899)"
                      : "rgba(255,255,255,0.06)",
                  color: pendingLabel === lbl ? "#fff" : "#94A3B8",
                  border:
                    pendingLabel === lbl
                      ? "none"
                      : "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {lbl}
              </button>
            ))}
          </div>
        </div>

        {/* Stats — only if real data exists */}
        {latestWeight && (
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div
              className="rounded-xl p-3"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <p className="text-slate-400 text-xs">Current Weight</p>
              <p className="text-white font-bold text-sm mt-1">
                {latestWeight} kg
              </p>
            </div>
            <div
              className="rounded-xl p-3"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <p className="text-slate-400 text-xs">Photos</p>
              <p className="text-white font-bold text-sm mt-1">
                {photos.length} uploaded
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Before/After comparison */}
      {compareMode && beforePhoto && afterPhoto ? (
        <div style={cardStyle} className="p-4">
          <p className="text-white font-semibold text-sm mb-3">
            Before vs After
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center">
              <img
                src={beforePhoto.dataUrl}
                alt="Before"
                className="rounded-2xl w-full object-cover"
                style={{ height: "180px" }}
              />
              <p className="text-blue-400 text-xs font-bold mt-1">BEFORE</p>
              <p className="text-slate-500 text-[10px]">{beforePhoto.date}</p>
            </div>
            <div className="text-center">
              <img
                src={afterPhoto.dataUrl}
                alt="After"
                className="rounded-2xl w-full object-cover"
                style={{ height: "180px" }}
              />
              <p className="text-green-400 text-xs font-bold mt-1">AFTER</p>
              <p className="text-slate-500 text-[10px]">{afterPhoto.date}</p>
            </div>
          </div>
        </div>
      ) : compareMode && (!beforePhoto || !afterPhoto) ? (
        <div
          style={cardStyle}
          className="p-8 text-center"
          data-ocid="progress.empty_state"
        >
          <p className="text-slate-500 text-sm">
            {!beforePhoto && !afterPhoto
              ? "Upload a 'Before' and 'After' photo to compare."
              : !beforePhoto
                ? "Upload a 'Before' photo to compare."
                : "Upload an 'After' photo to compare."}
          </p>
        </div>
      ) : null}

      {/* Weekly photos grid */}
      {!compareMode && (
        <div style={cardStyle} className="p-4">
          <p className="text-white font-semibold text-sm mb-3">
            Progress Photos
          </p>
          {photos.length === 0 ? (
            <div className="text-center py-8" data-ocid="progress.empty_state">
              <Camera
                size={36}
                style={{ color: "#475569" }}
                className="mx-auto mb-2"
              />
              <p className="text-slate-500 text-sm">No photos uploaded yet.</p>
              <p className="text-slate-600 text-xs mt-1">
                Upload your first photo — choose "Before", "After", or "Weekly"
                label.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {photos.map((p, i) => (
                <div
                  key={p.id}
                  className="text-center"
                  data-ocid={`progress.item.${i + 1}`}
                >
                  <img
                    src={p.dataUrl}
                    alt={p.label}
                    className="rounded-2xl w-full object-cover"
                    style={{ height: "140px" }}
                  />
                  <p
                    className="text-xs font-bold mt-1"
                    style={{
                      color:
                        p.label === "Before"
                          ? "#3B82F6"
                          : p.label === "After"
                            ? "#10B981"
                            : "#8B5CF6",
                    }}
                  >
                    {p.label.toUpperCase()}
                  </p>
                  <p className="text-slate-500 text-[10px]">{p.date}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Weight history — only if health logs have weight entries */}
      {healthLogs.filter((h) => h.weight).length > 1 && (
        <div style={cardStyle} className="p-4">
          <p className="text-white font-semibold text-sm mb-3">
            Weight History
          </p>
          <div className="space-y-2">
            {healthLogs
              .filter((h) => h.weight)
              .slice(0, 5)
              .map((h, i) => (
                <div key={h.id} className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs">
                    {new Date(h.timestamp).toLocaleDateString("en-IN")}
                  </span>
                  <div className="flex items-center gap-1">
                    {i > 0 &&
                      healthLogs.filter((x) => x.weight)[i - 1]?.weight &&
                      ((h.weight ?? 0) <
                      (healthLogs.filter((x) => x.weight)[i - 1]?.weight ??
                        0) ? (
                        <TrendingDown size={12} style={{ color: "#10B981" }} />
                      ) : (
                        <TrendingUp size={12} style={{ color: "#F97316" }} />
                      ))}
                    <span className="text-white text-sm font-bold">
                      {h.weight} kg
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
