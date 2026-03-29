import { AlertCircle, HeartPulse, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface SOSAlert {
  id: string;
  patientName: string;
  message: string;
  timestamp: string;
  resolved: boolean;
}

interface SOSContact {
  id: string;
  name: string;
  phone: string;
  isPrimary: boolean;
}

function loadSOSContacts(): SOSContact[] {
  try {
    const raw = localStorage.getItem("mefit_sos_contacts");
    return raw ? (JSON.parse(raw) as SOSContact[]) : [];
  } catch {
    return [];
  }
}

export default function SOSButton({
  patientName = "Sarah",
}: { patientName?: string }) {
  const [sosOpen, setSosOpen] = useState(false);
  const [symptomOpen, setSymptomOpen] = useState(false);
  const [sosMessage, setSosMessage] = useState("");
  const [symptomMessage, setSymptomMessage] = useState("");
  const contacts = loadSOSContacts();

  function sendAlert(message: string, type: "sos" | "symptom") {
    try {
      const raw = localStorage.getItem("mefit_sos_alerts");
      const existing: SOSAlert[] = raw ? (JSON.parse(raw) as SOSAlert[]) : [];
      const newAlert: SOSAlert = {
        id: String(Date.now()),
        patientName,
        message:
          message ||
          (type === "sos" ? "SOS - Needs immediate help" : "Symptom reported"),
        timestamp: new Date().toISOString(),
        resolved: false,
      };
      localStorage.setItem(
        "mefit_sos_alerts",
        JSON.stringify([newAlert, ...existing]),
      );
    } catch {
      // ignore
    }
    if (type === "sos") {
      toast.success("🚨 Your doctor has been notified!", { duration: 4000 });
      setSosOpen(false);
      setSosMessage("");
    } else {
      toast.success("✅ Symptom reported to your doctor", { duration: 3000 });
      setSymptomOpen(false);
      setSymptomMessage("");
    }
  }

  return (
    <>
      <style>{`
        @keyframes sos-ring-1 {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(2.6); opacity: 0; }
        }
        @keyframes sos-ring-2 {
          0% { transform: scale(1); opacity: 0.35; }
          100% { transform: scale(2.1); opacity: 0; }
        }
        @keyframes sos-ring-3 {
          0% { transform: scale(1); opacity: 0.2; }
          100% { transform: scale(1.7); opacity: 0; }
        }
        .sos-ring { position: absolute; inset: 0; border-radius: 50%; background: rgba(239,68,68,0.5); }
        .sos-ring-1 { animation: sos-ring-1 2s ease-out infinite; }
        .sos-ring-2 { animation: sos-ring-2 2s ease-out infinite 0.4s; }
        .sos-ring-3 { animation: sos-ring-3 2s ease-out infinite 0.8s; }
      `}</style>

      {/* Symptom Button */}
      <button
        type="button"
        data-ocid="symptom.button"
        onClick={() => setSymptomOpen(true)}
        className="fixed z-50 flex items-center gap-1.5 px-3 py-2 rounded-full text-white text-xs font-bold shadow-lg"
        style={{
          bottom: "152px",
          right: "20px",
          background: "linear-gradient(135deg, #3B82F6, #6366F1)",
          boxShadow: "0 4px 16px rgba(59,130,246,0.45)",
        }}
      >
        <HeartPulse size={14} />
        Symptom
      </button>

      {/* SOS Button with ripple rings */}
      <div
        className="fixed z-50"
        style={{ bottom: "84px", right: "20px", width: "56px", height: "56px" }}
      >
        <div className="sos-ring sos-ring-1" />
        <div className="sos-ring sos-ring-2" />
        <div className="sos-ring sos-ring-3" />
        <button
          type="button"
          data-ocid="sos.button"
          onClick={() => setSosOpen(true)}
          className="relative z-10 w-full h-full rounded-full text-white font-black text-sm shadow-xl flex flex-col items-center justify-center gap-0.5"
          style={{
            background: "linear-gradient(135deg, #EF4444, #DC2626)",
            boxShadow: "0 4px 20px rgba(239,68,68,0.5)",
          }}
        >
          <AlertCircle size={16} />
          <span className="text-[9px] font-black tracking-wider">SOS</span>
        </button>
      </div>

      {/* SOS Modal */}
      {sosOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)" }}
          role="presentation"
          onClick={() => setSosOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setSosOpen(false)}
        >
          <dialog
            open
            className="w-full max-w-sm rounded-3xl p-6 m-0"
            style={{
              background: "#0D1B2A",
              border: "1px solid rgba(239,68,68,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            data-ocid="sos.dialog"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(239,68,68,0.2)" }}
                >
                  <AlertCircle size={18} style={{ color: "#EF4444" }} />
                </div>
                <h3 className="font-bold text-white">Emergency Help</h3>
              </div>
              <button
                type="button"
                onClick={() => setSosOpen(false)}
                data-ocid="sos.close_button"
              >
                <X size={20} style={{ color: "#475569" }} />
              </button>
            </div>
            <p className="text-sm text-slate-400 mb-3">
              Your doctor will be alerted immediately. What's happening?
            </p>
            {contacts.length > 0 && (
              <div
                className="mb-3 rounded-xl p-3 space-y-1.5"
                style={{
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.15)",
                }}
              >
                <p className="text-xs font-semibold text-red-400 mb-2">
                  Alerting:
                </p>
                {contacts.slice(0, 3).map((c) => (
                  <div key={c.id} className="flex items-center gap-2">
                    <span className="text-red-400 text-xs">•</span>
                    <span className="text-slate-300 text-xs">{c.name}</span>
                    {c.isPrimary && (
                      <span className="text-yellow-400 text-[9px] font-bold">
                        ★ Primary
                      </span>
                    )}
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <span className="text-red-400 text-xs">•</span>
                  <span className="text-slate-300 text-xs">
                    Your assigned doctor
                  </span>
                </div>
              </div>
            )}
            <textarea
              className="w-full rounded-xl px-3 py-2 text-sm resize-none text-white placeholder-slate-500 outline-none"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
              rows={3}
              placeholder="Describe your emergency (optional)..."
              value={sosMessage}
              onChange={(e) => setSosMessage(e.target.value)}
              data-ocid="sos.textarea"
            />
            <div className="flex gap-2 mt-3">
              <button
                type="button"
                onClick={() => sendAlert(sosMessage, "sos")}
                data-ocid="sos.submit_button"
                className="flex-1 py-3 rounded-xl text-white font-bold text-sm"
                style={{
                  background: "linear-gradient(135deg, #EF4444, #DC2626)",
                }}
              >
                🚨 Send Alert Now
              </button>
              <button
                type="button"
                onClick={() => setSosOpen(false)}
                data-ocid="sos.cancel_button"
                className="px-4 py-3 rounded-xl text-sm font-medium"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  color: "#94A3B8",
                }}
              >
                Cancel
              </button>
            </div>
          </dialog>
        </div>
      )}

      {/* Symptom Modal */}
      {symptomOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)" }}
          role="presentation"
          onClick={() => setSymptomOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setSymptomOpen(false)}
        >
          <dialog
            open
            className="w-full max-w-sm rounded-3xl p-6 m-0"
            style={{
              background: "#0D1B2A",
              border: "1px solid rgba(59,130,246,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            data-ocid="symptom.dialog"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(59,130,246,0.2)" }}
                >
                  <HeartPulse size={18} style={{ color: "#3B82F6" }} />
                </div>
                <h3 className="font-bold text-white">Report Symptom</h3>
              </div>
              <button
                type="button"
                onClick={() => setSymptomOpen(false)}
                data-ocid="symptom.close_button"
              >
                <X size={20} style={{ color: "#475569" }} />
              </button>
            </div>
            <p className="text-sm text-slate-400 mb-4">
              Describe any symptoms you're experiencing.
            </p>
            <textarea
              className="w-full rounded-xl px-3 py-2 text-sm resize-none text-white placeholder-slate-500 outline-none"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
              rows={3}
              placeholder="e.g., Mild headache, back pain, nausea..."
              value={symptomMessage}
              onChange={(e) => setSymptomMessage(e.target.value)}
              data-ocid="symptom.textarea"
            />
            <div className="flex gap-2 mt-3">
              <button
                type="button"
                onClick={() => sendAlert(symptomMessage, "symptom")}
                data-ocid="symptom.submit_button"
                className="flex-1 py-3 rounded-xl text-white font-bold text-sm"
                style={{
                  background: "linear-gradient(135deg, #3B82F6, #6366F1)",
                }}
              >
                Report to Doctor
              </button>
              <button
                type="button"
                onClick={() => setSymptomOpen(false)}
                data-ocid="symptom.cancel_button"
                className="px-4 py-3 rounded-xl text-sm font-medium"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  color: "#94A3B8",
                }}
              >
                Cancel
              </button>
            </div>
          </dialog>
        </div>
      )}
    </>
  );
}
