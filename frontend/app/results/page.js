"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "../Navbar";
import { CheckCircle, XCircle, Lightbulb, User, ScanText, Award } from "lucide-react";

function ScoreRing({ score, label }) {
  const color = score >= 70 ? "#16a34a" : score >= 40 ? "#d97706" : "#dc2626";
  const bg    = score >= 70 ? "#f0fdf4"  : score >= 40 ? "#fef9c3"  : "#fee2e2";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <div style={{ width: 100, height: 100, borderRadius: "50%", border: `5px solid ${color}`, background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 22, color }}>{score}%</span>
      </div>
      <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 12, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span>
    </div>
  );
}

export default function Results() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("analysisResult");
    if (stored) setData(JSON.parse(stored));
  }, []);

  if (!data) return (
    <main className="page-shell">
      <Navbar />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: 16 }}>
        <ScanText size={40} color="#94a3b8" />
        <p style={{ fontFamily: "'Lato', sans-serif", color: "#64748b", fontSize: 15 }}>No analysis found.</p>
        <Link href="/analyze" className="btn-primary">Analyze a resume</Link>
      </div>
    </main>
  );

  const { candidate, scores, skills, format_checks, suggestions } = data;
  const overallLabel = scores.match_score >= 70 ? "Strong Match" : scores.match_score >= 40 ? "Moderate Match" : "Weak Match";
  const overallColor = scores.match_score >= 70 ? "#16a34a" : scores.match_score >= 40 ? "#d97706" : "#dc2626";
  const overallBg    = scores.match_score >= 70 ? "#f0fdf4"  : scores.match_score >= 40 ? "#fef9c3"  : "#fee2e2";

  return (
    <main className="page-shell">
      <Navbar />
      <div className="container-center py-10">

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <span className="section-tag">Analysis Results</span>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: "clamp(1.6rem, 2.5vw, 2rem)", letterSpacing: "-0.025em", color: "#111827" }}>
                {candidate?.name ? `Results for ${candidate.name}` : "Analysis Results"}
              </h1>
            </div>
            <span style={{ background: overallBg, color: overallColor, border: `1px solid ${overallColor}30`, padding: "6px 16px", borderRadius: 100, fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 13 }}>
              {overallLabel}
            </span>
          </div>
        </div>

        {/* Score Rings */}
        <div className="card" style={{ padding: "32px 24px", marginBottom: 20 }}>
          <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 15, color: "#111827", marginBottom: 28, textAlign: "center" }}>Your scores</h2>
          <div className="flex flex-wrap justify-center gap-10">
            <ScoreRing score={scores.match_score}   label="Match Score" />
            <ScoreRing score={scores.ats_score}     label="ATS Score" />
            <ScoreRing score={scores.keyword_score} label="Keyword Score" />
            <ScoreRing score={scores.format_score}  label="Format Score" />
          </div>
        </div>

        {/* Candidate info */}
        <div className="card" style={{ padding: 24, marginBottom: 20 }}>
          <div className="flex items-center gap-2 mb-4">
            <User size={16} color="#16a34a" />
            <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 15, color: "#111827" }}>Candidate info</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Name",       value: candidate?.name           || "Not found" },
              { label: "Email",      value: candidate?.email          || "Not found" },
              { label: "Phone",      value: candidate?.phone          || "Not found" },
              { label: "Experience", value: candidate?.years_experience ? `${candidate.years_experience} yrs` : "Not detected" },
            ].map((item, i) => (
              <div key={i} style={{ background: "#f8fafc", borderRadius: 8, padding: "12px 14px" }}>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>{item.label}</p>
                <p style={{ fontFamily: "'Lato', sans-serif", fontWeight: 700, fontSize: 13, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="card" style={{ padding: 24, marginBottom: 20 }}>
          <div className="flex items-center gap-2 mb-4">
            <Award size={16} color="#16a34a" />
            <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 15, color: "#111827" }}>Skills analysis</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle size={14} color="#16a34a" />
                <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 13, color: "#15803d" }}>Matched skills ({skills.matched.length})</h3>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {skills.matched.length > 0
                  ? skills.matched.map((s, i) => <span key={i} className="chip-green">{s}</span>)
                  : <p style={{ fontFamily: "'Lato', sans-serif", color: "#94a3b8", fontSize: 13 }}>No matching skills found</p>}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <XCircle size={14} color="#dc2626" />
                <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 13, color: "#991b1b" }}>Missing skills ({skills.missing.length})</h3>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {skills.missing.length > 0
                  ? skills.missing.map((s, i) => <span key={i} className="chip-red">{s}</span>)
                  : <p style={{ fontFamily: "'Lato', sans-serif", color: "#94a3b8", fontSize: 13 }}>No missing skills detected</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Format Checks */}
        <div className="card" style={{ padding: 24, marginBottom: 20 }}>
          <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 15, color: "#111827", marginBottom: 16 }}>Format checks</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(format_checks).map(([key, value], i) => (
              <div key={i} style={{ borderRadius: 8, padding: "12px 14px", border: `1px solid ${value ? "#bbf7d0" : "#fecaca"}`, background: value ? "#f0fdf4" : "#fee2e2", display: "flex", alignItems: "center", gap: 8 }}>
                {value ? <CheckCircle size={14} color="#16a34a" /> : <XCircle size={14} color="#dc2626" />}
                <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 12, color: value ? "#15803d" : "#991b1b", fontWeight: 700, textTransform: "capitalize" }}>{key.replace(/_/g, " ")}</p>
              </div>
            ))}
          </div>
        </div>

        {/* AI Suggestions */}
        <div className="card" style={{ padding: 24, marginBottom: 28 }}>
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb size={16} color="#16a34a" />
            <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 15, color: "#111827" }}>AI suggestions</h2>
          </div>
          <div style={{ background: "#f8fafc", borderRadius: 10, padding: "20px 24px", border: "1px solid #e2e8f0" }}>
            <pre style={{ fontFamily: "'Lato', sans-serif", fontSize: 14, color: "#374151", whiteSpace: "pre-wrap", lineHeight: 1.7 }}>{suggestions}</pre>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/analyze" className="btn-primary">Analyze another resume</Link>
          <button onClick={() => window.print()} className="btn-secondary">Save as PDF</button>
          <Link href="/dashboard" className="btn-secondary">View dashboard</Link>
        </div>
      </div>
    </main>
  );
}