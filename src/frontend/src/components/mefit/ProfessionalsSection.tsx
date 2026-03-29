import { Award, Search, Star, X } from "lucide-react";
import { useState } from "react";
import BookingModal from "./BookingModal";
import type { DoctorProfile } from "./DoctorDirectory";

const ALL_PROFESSIONALS: DoctorProfile[] = [
  {
    id: "d1",
    name: "Dr. Anjali Sharma",
    specialization: "Gynecologist",
    experience: 12,
    certifications: ["MBBS", "MD OB-GYN"],
    about: "Specializes in high-risk pregnancy and maternal health.",
    rating: 4.9,
    price: 1200,
    avatar: "AS",
    color: "#3B82F6",
  },
  {
    id: "d2",
    name: "Dr. Rahul Mehta",
    specialization: "Nutritionist",
    experience: 8,
    certifications: ["MSc Nutrition", "RD"],
    about: "Expert in pregnancy diet and gestational diabetes management.",
    rating: 4.7,
    price: 800,
    avatar: "RM",
    color: "#10B981",
  },
  {
    id: "d3",
    name: "Dr. Priya Nair",
    specialization: "General Physician",
    experience: 15,
    certifications: ["MBBS", "FCGP"],
    about: "Comprehensive care for women and maternal health.",
    rating: 4.8,
    price: 600,
    avatar: "PN",
    color: "#8B5CF6",
  },
  {
    id: "d4",
    name: "Meera Iyer",
    specialization: "Yoga & Wellness Expert",
    experience: 10,
    certifications: ["RYT-500", "Pre/Post-natal Yoga"],
    about: "Specialized prenatal yoga and stress management techniques.",
    rating: 4.6,
    price: 500,
    avatar: "MI",
    color: "#EC4899",
  },
  {
    id: "d5",
    name: "Dr. Arjun Kapoor",
    specialization: "Psychiatrist",
    experience: 9,
    certifications: ["MBBS", "MD Psychiatry"],
    about: "Mental health support during and after pregnancy.",
    rating: 4.5,
    price: 900,
    avatar: "AK",
    color: "#F59E0B",
  },
  {
    id: "y1",
    name: "Ananya Krishnan",
    specialization: "Yoga Expert",
    experience: 7,
    certifications: ["RYT-200", "Meditation Coach"],
    about:
      "Specializes in prenatal yoga, breathing techniques, and mindfulness for expecting mothers.",
    rating: 4.8,
    price: 400,
    avatar: "AK",
    color: "#8B5CF6",
  },
  {
    id: "y2",
    name: "Raj Patel",
    specialization: "Yoga Expert",
    experience: 5,
    certifications: ["RYT-300", "Prenatal Yoga"],
    about:
      "Expert in prenatal and postpartum yoga with a focus on gentle movement and recovery.",
    rating: 4.7,
    price: 350,
    avatar: "RP",
    color: "#10B981",
  },
];

type FilterType = "all" | "doctor" | "nutritionist" | "yoga";

function categoryOf(specialization: string): FilterType {
  const s = specialization.toLowerCase();
  if (s.includes("yoga") || s.includes("wellness")) return "yoga";
  if (s.includes("nutrition")) return "nutritionist";
  return "doctor";
}

interface Props {
  onClose: () => void;
}

export default function ProfessionalsSection({ onClose }: Props) {
  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");
  const [booking, setBooking] = useState<DoctorProfile | null>(null);

  const displayed = ALL_PROFESSIONALS.filter((d) => {
    if (filter !== "all" && categoryOf(d.specialization) !== filter)
      return false;
    if (
      search &&
      !d.name.toLowerCase().includes(search.toLowerCase()) &&
      !d.specialization.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  const tabs: { id: FilterType; label: string }[] = [
    { id: "all", label: "All" },
    { id: "doctor", label: "Doctors" },
    { id: "nutritionist", label: "Nutritionists" },
    { id: "yoga", label: "Yoga" },
  ];

  return (
    <>
      <div
        className="fixed inset-0 z-[150] flex flex-col"
        style={{ background: "#0A0F1E" }}
      >
        <div
          className="flex items-center justify-between px-5 pt-12 pb-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div>
            <h2 className="text-white font-bold text-xl">Meet Our Experts</h2>
            <p className="text-slate-500 text-xs mt-0.5">
              {ALL_PROFESSIONALS.length} professionals available
            </p>
          </div>
          <button
            type="button"
            data-ocid="professionals.close_button"
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <X size={16} color="white" />
          </button>
        </div>

        <div className="px-4 py-3">
          <div
            className="flex items-center gap-2 rounded-2xl px-4 py-2.5"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <Search size={14} color="rgba(255,255,255,0.3)" />
            <input
              type="text"
              placeholder="Search by name or specialization..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-ocid="professionals.search_input"
              className="flex-1 bg-transparent text-white text-sm outline-none placeholder-white/30"
            />
          </div>
        </div>

        <div
          className="flex gap-2 px-4 pb-3 overflow-x-auto"
          style={{ scrollbarWidth: "none" }}
        >
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              data-ocid="professionals.tab"
              onClick={() => setFilter(t.id)}
              className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all"
              style={{
                background:
                  filter === t.id
                    ? "linear-gradient(90deg, #3B82F6, #8B5CF6)"
                    : "rgba(255,255,255,0.06)",
                color: filter === t.id ? "white" : "rgba(255,255,255,0.5)",
                border:
                  filter === t.id ? "none" : "1px solid rgba(255,255,255,0.1)",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-3">
          {displayed.map((doc, idx) => (
            <div
              key={doc.id}
              data-ocid={`professionals.item.${idx + 1}`}
              className="rounded-2xl p-4"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${doc.color}, ${doc.color}88)`,
                  }}
                >
                  {doc.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-white font-bold text-sm">{doc.name}</p>
                      <p className="text-slate-400 text-xs">
                        {doc.specialization}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Star size={11} color="#F59E0B" fill="#F59E0B" />
                      <span className="text-yellow-400 text-xs font-bold">
                        {doc.rating}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {doc.certifications.map((c) => (
                      <span
                        key={c}
                        className="text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1"
                        style={{
                          background: `${doc.color}22`,
                          color: doc.color,
                        }}
                      >
                        <Award size={8} />
                        {c}
                      </span>
                    ))}
                  </div>
                  <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                    {doc.about}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <div>
                      <p className="text-white font-bold text-sm">
                        \u20B9{doc.price}
                      </p>
                      <p className="text-slate-500 text-[10px]">
                        {doc.experience}yr exp
                      </p>
                    </div>
                    <button
                      type="button"
                      data-ocid="professionals.primary_button"
                      onClick={() => setBooking(doc)}
                      className="px-4 py-2 rounded-xl text-white text-xs font-bold transition-all"
                      style={{
                        background: `linear-gradient(90deg, ${doc.color}, #8B5CF6)`,
                      }}
                    >
                      Consult
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {displayed.length === 0 && (
            <div
              className="text-center py-12"
              data-ocid="professionals.empty_state"
            >
              <p className="text-slate-500 text-sm">No professionals found</p>
            </div>
          )}
        </div>
      </div>
      {booking && (
        <BookingModal doctor={booking} onClose={() => setBooking(null)} />
      )}
    </>
  );
}
