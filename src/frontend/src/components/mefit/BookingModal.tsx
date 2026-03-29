import { CheckCircle, CreditCard, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { DoctorProfile } from "./DoctorDirectory";

interface Props {
  doctor: DoctorProfile;
  onClose: () => void;
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const TIMES = ["10:00", "12:00", "14:00", "16:00", "18:00"];

type PayMethod = "upi" | "card" | "netbanking";

export default function BookingModal({ doctor, onClose }: Props) {
  const [step, setStep] = useState(1);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [payMethod, setPayMethod] = useState<PayMethod | null>(null);
  const [upiId, setUpiId] = useState("");
  const [cardNum, setCardNum] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [bank, setBank] = useState("");
  const [pointsToUse, setPointsToUse] = useState(0);

  const rawPoints = Number.parseInt(
    localStorage.getItem("mefit_rewards_points") ?? "0",
    10,
  );
  const maxPoints = Math.min(rawPoints, Math.floor(doctor.price / 10) * 100);
  const discount = Math.floor(pointsToUse / 100) * 10;
  const finalPrice = Math.max(0, doctor.price - discount);

  function confirmBooking() {
    try {
      const raw = localStorage.getItem("mefit_bookings");
      const bookings = raw ? JSON.parse(raw) : [];
      const booking = {
        id: String(Date.now()),
        doctorId: doctor.id,
        doctorName: doctor.name,
        specialization: doctor.specialization,
        day: selectedDay,
        time: selectedTime,
        price: finalPrice,
        originalPrice: doctor.price,
        pointsUsed: pointsToUse,
        paymentMethod: payMethod,
        status: "pending",
        patientName: "Sarah Johnson",
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem(
        "mefit_bookings",
        JSON.stringify([booking, ...bookings]),
      );
      // Deduct points
      const newPoints = rawPoints - pointsToUse;
      localStorage.setItem("mefit_rewards_points", String(newPoints));
    } catch {
      // ignore
    }
    setStep(4);
    toast.success(`Booking confirmed with ${doctor.name}!`);
  }

  const glass = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px",
  };

  return (
    <div
      className="fixed inset-0 z-[150] flex items-end justify-center p-0"
      style={{ background: "rgba(0,0,0,0.8)" }}
      role="presentation"
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <div
        className="w-full max-w-lg rounded-t-3xl p-6"
        style={{
          background: "#0D1B2A",
          border: "1px solid rgba(255,255,255,0.1)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        data-ocid="booking.dialog"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white font-bold">Book Consultation</h3>
            <p className="text-slate-400 text-xs">
              {doctor.name} · {doctor.specialization}
            </p>
          </div>
          {step < 4 && (
            <button
              type="button"
              onClick={onClose}
              data-ocid="booking.close_button"
            >
              <X size={20} style={{ color: "#475569" }} />
            </button>
          )}
        </div>

        {/* Step indicators */}
        {step < 4 && (
          <div className="flex gap-2 mb-5">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className="flex-1 h-1 rounded-full transition-all"
                style={{
                  background:
                    s <= step ? doctor.color : "rgba(255,255,255,0.1)",
                }}
              />
            ))}
          </div>
        )}

        {/* Step 1: Time Slot */}
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-slate-300 text-sm font-semibold">Select Day</p>
            <div className="grid grid-cols-5 gap-2">
              {DAYS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setSelectedDay(d)}
                  data-ocid="booking.toggle"
                  className="py-2 rounded-xl text-xs font-bold"
                  style={{
                    background:
                      selectedDay === d
                        ? doctor.color
                        : "rgba(255,255,255,0.06)",
                    color: selectedDay === d ? "white" : "#94A3B8",
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
            <p className="text-slate-300 text-sm font-semibold">Select Time</p>
            <div className="grid grid-cols-5 gap-2">
              {TIMES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedTime(t)}
                  data-ocid="booking.toggle"
                  className="py-2 rounded-xl text-[11px] font-bold"
                  style={{
                    background:
                      selectedTime === t
                        ? doctor.color
                        : "rgba(255,255,255,0.06)",
                    color: selectedTime === t ? "white" : "#94A3B8",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
            <button
              type="button"
              data-ocid="booking.primary_button"
              onClick={() => selectedDay && selectedTime && setStep(2)}
              disabled={!selectedDay || !selectedTime}
              className="w-full py-3 rounded-xl text-white font-bold text-sm disabled:opacity-40"
              style={{
                background: `linear-gradient(135deg, ${doctor.color}, #8B5CF6)`,
              }}
            >
              Next: Review Summary
            </button>
          </div>
        )}

        {/* Step 2: Summary + Points */}
        {step === 2 && (
          <div className="space-y-4">
            <div style={glass} className="p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Doctor</span>
                <span className="text-white font-semibold">{doctor.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Slot</span>
                <span className="text-white">
                  {selectedDay} at {selectedTime}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Original Price</span>
                <span className="text-white">₹{doctor.price}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-400">Points Discount</span>
                  <span className="text-green-400">-₹{discount}</span>
                </div>
              )}
              <div className="flex justify-between font-bold">
                <span className="text-white">Total</span>
                <span style={{ color: doctor.color }}>₹{finalPrice}</span>
              </div>
            </div>

            <div style={glass} className="p-4">
              <p className="text-slate-300 text-xs mb-2">
                🏆 Reward Points Balance:{" "}
                <strong className="text-yellow-400">{rawPoints} pts</strong>
              </p>
              <input
                type="number"
                placeholder="Enter points to use (100 pts = ₹10 off)"
                value={pointsToUse || ""}
                onChange={(e) =>
                  setPointsToUse(
                    Math.min(maxPoints, Math.max(0, Number(e.target.value))),
                  )
                }
                data-ocid="booking.input"
                className="w-full rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 outline-none"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              />
              {pointsToUse > 0 && (
                <p className="text-green-400 text-xs mt-1">
                  ✓ Save ₹{discount} with {pointsToUse} points
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-3 rounded-xl text-slate-400 text-sm"
                style={{ background: "rgba(255,255,255,0.06)" }}
              >
                Back
              </button>
              <button
                type="button"
                data-ocid="booking.primary_button"
                onClick={() => setStep(3)}
                className="flex-1 py-3 rounded-xl text-white font-bold text-sm"
                style={{
                  background: `linear-gradient(135deg, ${doctor.color}, #8B5CF6)`,
                }}
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Payment */}
        {step === 3 && (
          <div className="space-y-4">
            <p className="text-white font-semibold text-sm mb-2">
              Choose Payment Method
            </p>
            <div className="grid grid-cols-3 gap-3">
              {(["upi", "card", "netbanking"] as PayMethod[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setPayMethod(m)}
                  data-ocid="booking.toggle"
                  className="py-4 rounded-2xl flex flex-col items-center gap-2 text-xs font-bold"
                  style={{
                    background:
                      payMethod === m
                        ? `${doctor.color}33`
                        : "rgba(255,255,255,0.04)",
                    border:
                      payMethod === m
                        ? `1.5px solid ${doctor.color}`
                        : "1px solid rgba(255,255,255,0.08)",
                    color: payMethod === m ? "white" : "#94A3B8",
                  }}
                >
                  {m === "upi" ? "📱" : m === "card" ? "💳" : "🏦"}
                  {m === "upi" ? "UPI" : m === "card" ? "Card" : "Net Banking"}
                </button>
              ))}
            </div>

            {payMethod === "upi" && (
              <input
                type="text"
                placeholder="Enter UPI ID (e.g. name@upi)"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                data-ocid="booking.input"
                className="w-full rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              />
            )}

            {payMethod === "card" && (
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Card Number"
                  value={cardNum}
                  onChange={(e) => setCardNum(e.target.value)}
                  className="w-full rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none"
                    style={{
                      background: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="w-full rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none"
                    style={{
                      background: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  />
                </div>
              </div>
            )}

            {payMethod === "netbanking" && (
              <select
                value={bank}
                onChange={(e) => setBank(e.target.value)}
                data-ocid="booking.select"
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: bank ? "white" : "#64748B",
                }}
              >
                <option value="" style={{ background: "#0D1B2A" }}>
                  Select Bank
                </option>
                {["SBI", "HDFC", "ICICI", "Axis", "Kotak", "PNB"].map((b) => (
                  <option
                    key={b}
                    value={b}
                    style={{ background: "#0D1B2A", color: "white" }}
                  >
                    {b}
                  </option>
                ))}
              </select>
            )}

            <div
              className="rounded-xl px-4 py-2 flex justify-between items-center"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <span className="text-slate-400 text-sm">Amount to Pay</span>
              <span className="text-white font-bold text-lg">
                ₹{finalPrice}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-3 rounded-xl text-slate-400 text-sm"
                style={{ background: "rgba(255,255,255,0.06)" }}
              >
                Back
              </button>
              <button
                type="button"
                data-ocid="booking.submit_button"
                onClick={confirmBooking}
                disabled={!payMethod}
                className="flex-1 py-3 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-40"
                style={{
                  background: `linear-gradient(135deg, ${doctor.color}, #8B5CF6)`,
                }}
              >
                <CreditCard size={16} />
                Pay ₹{finalPrice}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <div
            className="text-center py-6 space-y-5"
            data-ocid="booking.success_state"
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto"
              style={{
                background: "rgba(16,185,129,0.15)",
                border: "2px solid #10B981",
              }}
            >
              <CheckCircle size={40} style={{ color: "#10B981" }} />
            </div>
            <div>
              <h3 className="text-white font-bold text-xl mb-1">
                Booking Confirmed!
              </h3>
              <p className="text-slate-400 text-sm">
                Your consultation has been booked successfully.
              </p>
            </div>
            <div
              className="rounded-2xl p-4 text-left space-y-2"
              style={{
                background: "rgba(16,185,129,0.08)",
                border: "1px solid rgba(16,185,129,0.2)",
              }}
            >
              <p className="text-green-300 text-xs">👨‍⚕️ {doctor.name}</p>
              <p className="text-green-300 text-xs">
                📅 {selectedDay} at {selectedTime}
              </p>
              <p className="text-green-300 text-xs">
                💰 ₹{finalPrice} paid via {payMethod}
              </p>
            </div>
            <button
              type="button"
              data-ocid="booking.confirm_button"
              onClick={onClose}
              className="w-full py-3 rounded-2xl text-white font-bold"
              style={{
                background: "linear-gradient(135deg, #10B981, #059669)",
              }}
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
