import { Camera, Droplets, Flame, Scale, Upload } from "lucide-react";
import { useCallback, useRef, useState } from "react";

type PhotoSlot = "front" | "side" | "back";

function QuickGlanceBar() {
  const streak = (() => {
    try {
      const raw = localStorage.getItem("mefit_streak");
      return raw
        ? ((JSON.parse(raw) as { todaySteps?: number }).todaySteps ?? 4200)
        : 4200;
    } catch {
      return 4200;
    }
  })();

  const pills = [
    {
      icon: <Flame size={14} className="text-orange-400" />,
      label: "Steps",
      value: streak.toLocaleString(),
      bg: "rgba(249,115,22,0.1)",
    },
    {
      icon: <Droplets size={14} className="text-blue-400" />,
      label: "Water",
      value: "6/8 glasses",
      bg: "rgba(59,130,246,0.1)",
    },
    {
      icon: <Flame size={14} className="text-red-400" />,
      label: "Calories",
      value: "1,842 kcal",
      bg: "rgba(239,68,68,0.1)",
    },
    {
      icon: <Scale size={14} className="text-green-500" />,
      label: "Weight Δ",
      value: "-0.5 kg",
      bg: "rgba(16,185,129,0.1)",
    },
  ];

  return (
    <div
      className="flex gap-2 overflow-x-auto pb-1"
      style={{ scrollbarWidth: "none" }}
    >
      {pills.map(({ icon, label, value, bg }) => (
        <div
          key={label}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full flex-shrink-0 border border-white/50"
          style={{ background: bg, backdropFilter: "blur(8px)" }}
        >
          {icon}
          <span className="text-xs font-semibold text-gray-700">
            {label}: {value}
          </span>
        </div>
      ))}
    </div>
  );
}

function PhotoSlot({ slot, label }: { slot: PhotoSlot; label: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [photo, setPhoto] = useState<string | null>(() =>
    localStorage.getItem(`mefit_photos_${slot}`),
  );

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      setPhoto(url);
      localStorage.setItem(`mefit_photos_${slot}`, url);
    };
    reader.readAsDataURL(file);
  }

  function triggerUpload() {
    if (!photo) inputRef.current?.click();
  }

  return (
    <button
      type="button"
      className="flex-1 min-w-0 rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 relative cursor-pointer hover:border-blue-300 transition-colors"
      style={{ aspectRatio: "3/4" }}
      onClick={triggerUpload}
      data-ocid="photos.upload_button"
    >
      {photo ? (
        <>
          <img src={photo} alt={label} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-2 left-0 right-0 text-center">
            <p className="text-white text-xs font-bold">{label}</p>
          </div>
          <button
            type="button"
            data-ocid="photos.secondary_button"
            onClick={(e) => {
              e.stopPropagation();
              inputRef.current?.click();
            }}
            className="absolute top-2 right-2 bg-white/80 rounded-full p-1"
          >
            <Camera size={12} className="text-gray-600" />
          </button>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full gap-2 p-4">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
            <Upload size={16} className="text-blue-400" />
          </div>
          <p className="text-xs font-semibold text-gray-600 text-center">
            {label}
          </p>
          <p className="text-[9px] text-gray-400 text-center">Tap to upload</p>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </button>
  );
}

function BeforeAfterSlider() {
  const [splitPct, setSplitPct] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const handleMove = useCallback((clientX: number) => {
    if (!dragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = Math.min(
      100,
      Math.max(0, ((clientX - rect.left) / rect.width) * 100),
    );
    setSplitPct(pct);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative rounded-2xl overflow-hidden select-none cursor-col-resize"
      style={{ height: "180px" }}
      onMouseDown={() => {
        dragging.current = true;
      }}
      onMouseMove={(e) => handleMove(e.clientX)}
      onMouseUp={() => {
        dragging.current = false;
      }}
      onMouseLeave={() => {
        dragging.current = false;
      }}
      onTouchStart={() => {
        dragging.current = true;
      }}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
      onTouchEnd={() => {
        dragging.current = false;
      }}
    >
      {/* Before (left) */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(135deg, #1E293B, #334155)" }}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest">
              Before
            </p>
            <p className="text-white/20 text-4xl font-black">B</p>
          </div>
        </div>
      </div>
      {/* After (right, clipped) */}
      <div
        className="absolute inset-0"
        style={{
          clipPath: `inset(0 0 0 ${splitPct}%)`,
          background: "linear-gradient(135deg, #DBEAFE, #D1FAE5)",
        }}
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-blue-400/60 text-xs font-bold uppercase tracking-widest">
              After
            </p>
            <p className="text-blue-200/40 text-4xl font-black">A</p>
          </div>
        </div>
      </div>
      {/* Divider */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg"
        style={{ left: `${splitPct}%`, transform: "translateX(-50%)" }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center">
          <span className="text-gray-400 text-xs font-bold">⟺</span>
        </div>
      </div>
      <p className="absolute bottom-2 right-2 text-[9px] text-white/50">
        Drag to compare
      </p>
    </div>
  );
}

export default function PhotoJourneyScreen() {
  return (
    <div className="flex flex-col gap-5 pb-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Photo Journey</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Track your transformation
          </p>
        </div>
        <span
          className="text-xs font-bold px-3 py-1.5 rounded-full text-white"
          style={{ background: "linear-gradient(90deg, #F97316, #EF4444)" }}
        >
          Visual
        </span>
      </div>

      {/* Quick Glance */}
      <QuickGlanceBar />

      {/* Photo Vault */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-bold text-gray-800">Weekly Photo Vault</h2>
            <p className="text-xs text-gray-400">
              📅 Sunday uploads recommended
            </p>
          </div>
          <Camera size={16} className="text-blue-400" />
        </div>
        <div className="flex gap-2">
          <PhotoSlot slot="front" label="Front" />
          <PhotoSlot slot="side" label="Side" />
          <PhotoSlot slot="back" label="Back" />
        </div>
      </div>

      {/* Before/After */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 p-4">
        <h2 className="font-bold text-gray-800 mb-1">Before &amp; After</h2>
        <p className="text-xs text-gray-400 mb-3">
          Drag the divider to compare your progress
        </p>
        <BeforeAfterSlider />
      </div>
    </div>
  );
}
