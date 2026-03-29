import { AlertTriangle, CheckCircle, Info } from "lucide-react";
import { useEffect, useState } from "react";

interface Insight {
  icon: string;
  title: string;
  recommendation: string;
  severity: "info" | "warning" | "critical";
}

const PREGNANCY_INSIGHTS: Insight[] = [
  {
    icon: "🩸",
    title: "Iron Deficiency Detected",
    recommendation:
      "Hemoglobin 10.2 g/dL (normal: 11–14). Increase iron-rich foods: spinach, lentils, fortified cereals. Supplement as advised by your doctor.",
    severity: "critical",
  },
  {
    icon: "🧬",
    title: "Folic Acid Below Target",
    recommendation:
      "Serum folate 4.1 ng/mL. Recommended ≥ 5.4 ng/mL during pregnancy. Continue prescribed folic acid supplements.",
    severity: "warning",
  },
  {
    icon: "💪",
    title: "Protein Intake Below Recommended",
    recommendation:
      "Based on your weight and trimester, aim for 75–85g protein/day. Add eggs, paneer, dal, and lentils to your meals.",
    severity: "warning",
  },
  {
    icon: "🍬",
    title: "Blood Sugar Within Safe Range",
    recommendation:
      "Fasting glucose 88 mg/dL — within normal range. Maintain your current low-sugar diet. Regular monitoring recommended.",
    severity: "info",
  },
  {
    icon: "✅",
    title: "Vitamin D Adequate",
    recommendation:
      "Vitamin D 38 ng/mL — good levels! Continue daily sunlight exposure and current supplementation.",
    severity: "info",
  },
];

const SEVERITY_STYLES = {
  critical: {
    bg: "rgba(239,68,68,0.06)",
    border: "rgba(239,68,68,0.3)",
    left: "#EF4444",
    badgeBg: "#EF4444",
    Icon: AlertTriangle,
  },
  warning: {
    bg: "rgba(245,158,11,0.06)",
    border: "rgba(245,158,11,0.3)",
    left: "#F59E0B",
    badgeBg: "#F59E0B",
    Icon: AlertTriangle,
  },
  info: {
    bg: "rgba(59,130,246,0.06)",
    border: "rgba(59,130,246,0.25)",
    left: "#3B82F6",
    badgeBg: "#3B82F6",
    Icon: Info,
  },
};

interface AIReportInsightsProps {
  reportDate: string;
  reportType?: string;
}

export default function AIReportInsights({
  reportDate,
  reportType = "Pregnancy Blood Panel",
}: AIReportInsightsProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="rounded-3xl p-5 mt-4"
      style={{
        background: "rgba(255,255,255,0.7)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.5)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
      }}
      data-ocid="report.panel"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
              style={{ background: "linear-gradient(90deg, #6366F1, #3B82F6)" }}
            >
              AI Insights
            </span>
          </div>
          <h3 className="font-bold text-gray-800">{reportType}</h3>
          <p className="text-xs text-gray-400">Report date: {reportDate}</p>
        </div>
        <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
      </div>

      <div className="flex flex-col gap-3">
        {PREGNANCY_INSIGHTS.map((insight, i) => {
          const styles = SEVERITY_STYLES[insight.severity];
          const SeverityIcon = styles.Icon;
          return (
            <div
              key={insight.title}
              className="rounded-2xl p-3.5 transition-all"
              style={{
                background: styles.bg,
                border: `1px solid ${styles.border}`,
                borderLeft: `3px solid ${styles.left}`,
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(12px)",
                transition: `opacity 0.4s ease ${i * 0.1}s, transform 0.4s ease ${i * 0.1}s`,
              }}
            >
              <div className="flex items-start gap-2.5">
                <span className="text-lg flex-shrink-0">{insight.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-semibold text-gray-800 text-sm">
                      {insight.title}
                    </p>
                    <span
                      className="flex-shrink-0 flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white"
                      style={{ background: styles.badgeBg }}
                    >
                      <SeverityIcon size={8} />
                      {insight.severity.charAt(0).toUpperCase() +
                        insight.severity.slice(1)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {insight.recommendation}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-center text-[10px] text-gray-400 mt-4">
        ⚕ Generated by AI — Not medical advice. Consult your healthcare
        provider.
      </p>
    </div>
  );
}
