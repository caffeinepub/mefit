import { Award, ChevronDown, ChevronUp, Search, Star, X } from "lucide-react";
import { useState } from "react";
import BookingModal from "./BookingModal";

export interface DoctorProfile {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  certifications: string[];
  about: string;
  rating: number;
  price: number;
  avatar: string;
  color: string;
}

const DEMO_DOCTORS: DoctorProfile[] = [
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
    about: "Mental wellness support for mothers during and after pregnancy.",
    rating: 4.5,
    price: 1000,
    avatar: "AK",
    color: "#F59E0B",
  },
];

const KEYWORD_MAP: { keywords: string[]; doctorId: string; reason: string }[] =
  [
    {
      keywords: [
        "pregnancy",
        "baby",
        "trimester",
        "maternal",
        "prenatal",
        "pregnant",
      ],
      doctorId: "d1",
      reason: "Best for pregnancy care",
    },
    {
      keywords: [
        "diet",
        "nutrition",
        "sugar",
        "diabetes",
        "food",
        "eating",
        "meal",
      ],
      doctorId: "d2",
      reason: "Best for nutrition & diet",
    },
    {
      keywords: ["fever", "cold", "general", "checkup", "sick", "flu"],
      doctorId: "d3",
      reason: "Best for general health",
    },
    {
      keywords: [
        "stress",
        "yoga",
        "relax",
        "anxiety",
        "sleep",
        "wellness",
        "breathing",
      ],
      doctorId: "d4",
      reason: "Best for wellness & yoga",
    },
    {
      keywords: [
        "mental",
        "depression",
        "mood",
        "panic",
        "psychiatric",
        "mind",
      ],
      doctorId: "d5",
      reason: "Best for mental health",
    },
  ];

function getMatchInfo(
  query: string,
): { doctorId: string; reason: string } | null {
  const q = query.toLowerCase();
  for (const { keywords, doctorId, reason } of KEYWORD_MAP) {
    if (keywords.some((k) => q.includes(k))) return { doctorId, reason };
  }
  return null;
}

interface Props {
  onClose: () => void;
}

export default function DoctorDirectory({ onClose }: Props) {
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [bookingDoctor, setBookingDoctor] = useState<DoctorProfile | null>(
    null,
  );

  const matchInfo = search.trim() ? getMatchInfo(search) : null;

  const filtered = search.trim()
    ? DEMO_DOCTORS.filter(
        (d) =>
          d.name.toLowerCase().includes(search.toLowerCase()) ||
          d.specialization.toLowerCase().includes(search.toLowerCase()) ||
          d.about.toLowerCase().includes(search.toLowerCase()),
      )
    : DEMO_DOCTORS;

  // If match found, sort matched doctor first
  const sorted = matchInfo
    ? [
        ...filtered.filter((d) => d.id === matchInfo.doctorId),
        ...filtered.filter((d) => d.id !== matchInfo.doctorId),
      ]
    : filtered;

  const cardStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
  };

  return (
    <>
      <div
        className="fixed inset-0 z-[90] flex flex-col"
        style={{ background: "#0A0F1E" }}
      >
        {/* Header */}
        <div
          className="px-4 pt-6 pb-4 flex items-center gap-3"
          style={{
            background:
              "linear-gradient(180deg, rgba(59,130,246,0.15) 0%, transparent 100%)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            data-ocid="doctor.close_button"
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.08)" }}
          >
            <X size={18} color="white" />
          </button>
          <div>
            <h2 className="text-white font-bold text-lg">Find a Doctor</h2>
            <p className="text-slate-400 text-xs">5 specialists available</p>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 py-3">
          <div
            className="flex items-center gap-2 rounded-2xl px-4 py-3"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <Search size={16} style={{ color: "#818CF8" }} />
            <input
              type="text"
              placeholder="Search by name, specialty, or describe your issue..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-ocid="doctor.search_input"
              className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none"
            />
          </div>
        </div>

        {/* Match Banner */}
        {matchInfo && (
          <div
            className="mx-4 mb-2 px-4 py-2 rounded-xl flex items-center gap-2"
            style={{
              background: "rgba(59,130,246,0.12)",
              border: "1px solid rgba(59,130,246,0.25)",
            }}
          >
            <span className="text-[10px] text-blue-300 font-semibold">
              🎯 Best match found based on your query
            </span>
          </div>
        )}

        {/* Doctor List */}
        <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-3">
          {sorted.length === 0 && (
            <div className="text-center py-16" data-ocid="doctor.empty_state">
              <p className="text-slate-500 text-sm">
                No doctors found for your search.
              </p>
            </div>
          )}
          {sorted.map((doc, i) => {
            const isMatch = matchInfo?.doctorId === doc.id;
            const isExpanded = expandedId === doc.id;
            return (
              <div
                key={doc.id}
                data-ocid={`doctor.item.${i + 1}`}
                className="rounded-2xl overflow-hidden"
                style={{
                  ...cardStyle,
                  border: isMatch
                    ? `1.5px solid ${doc.color}55`
                    : cardStyle.border,
                }}
              >
                {isMatch && (
                  <div
                    className="px-4 py-1.5 text-[10px] font-bold"
                    style={{ background: `${doc.color}22`, color: doc.color }}
                  >
                    ✦ {matchInfo.reason}
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${doc.color}, ${doc.color}99)`,
                      }}
                    >
                      {doc.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-white font-bold text-sm">
                          {doc.name}
                        </h3>
                      </div>
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full inline-block mt-0.5"
                        style={{
                          background: `${doc.color}22`,
                          color: doc.color,
                        }}
                      >
                        {doc.specialization}
                      </span>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex items-center gap-1">
                          <Star
                            size={10}
                            fill="#F59E0B"
                            style={{ color: "#F59E0B" }}
                          />
                          <span className="text-xs text-yellow-400 font-semibold">
                            {doc.rating}
                          </span>
                        </div>
                        <span className="text-slate-500 text-xs">
                          {doc.experience} yrs exp
                        </span>
                        <span className="text-slate-400 text-xs font-semibold">
                          ₹{doc.price}/session
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : doc.id)}
                      className="p-1"
                      style={{ color: "#475569" }}
                    >
                      {isExpanded ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="mt-3 space-y-3">
                      <p className="text-slate-300 text-xs leading-relaxed">
                        {doc.about}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {doc.certifications.map((cert) => (
                          <span
                            key={cert}
                            className="flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full"
                            style={{
                              background: "rgba(255,255,255,0.07)",
                              color: "#CBD5E1",
                            }}
                          >
                            <Award size={9} />
                            {cert}
                          </span>
                        ))}
                      </div>
                      <button
                        type="button"
                        data-ocid={`doctor.primary_button.${i + 1}`}
                        onClick={() => setBookingDoctor(doc)}
                        className="w-full py-3 rounded-xl text-white font-bold text-sm"
                        style={{
                          background: `linear-gradient(135deg, ${doc.color}, ${doc.color}aa)`,
                        }}
                      >
                        📅 Book Consultation
                      </button>
                    </div>
                  )}

                  {!isExpanded && (
                    <button
                      type="button"
                      data-ocid={`doctor.secondary_button.${i + 1}`}
                      onClick={() => setBookingDoctor(doc)}
                      className="mt-3 w-full py-2.5 rounded-xl text-white text-xs font-bold"
                      style={{
                        background: `linear-gradient(135deg, ${doc.color}44, ${doc.color}22)`,
                        border: `1px solid ${doc.color}33`,
                      }}
                    >
                      Book Consultation — ₹{doc.price}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {bookingDoctor && (
        <BookingModal
          doctor={bookingDoctor}
          onClose={() => setBookingDoctor(null)}
        />
      )}
    </>
  );
}
