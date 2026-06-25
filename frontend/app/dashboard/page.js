"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import Navbar from "../Navbar";
import { FileText, Target, Trophy, Upload, Loader2, Inbox, ExternalLink, CheckCircle, XCircle } from "lucide-react";

function ScorePill({ score }) {
  const cls = score >= 70 ? "score-green" : score >= 40 ? "score-yellow" : "score-red";
  return (
    <span className={cls} style={{ padding: "3px 10px", borderRadius: 100, fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 12 }}>
      {score}%
    </span>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const [analyses, setAnalyses] = useState([]);
  const [userName, setUserName] = useState("");
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const name  = localStorage.getItem("user_name");
    if (!token) { router.push("/login"); return; }
    setUserName(name || "User");
    fetchHistory(token);
  }, []);

  const fetchHistory = async (token) => {
    try {
      const res = await axios.get("/api/users/history", { headers: { Authorization: `Bearer ${token}` } });
      setAnalyses(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  const avgMatch  = analyses.length ? (analyses.reduce((s, a) => s + a.match_score, 0) / analyses.length).toFixed(1) : 0;
  const bestMatch = analyses.length ? Math.max(...analyses.map(a => a.match_score)).toFixed(1) : 0;

  const stats = [
    { label: "Total analyses", value: analyses.length, icon: FileText, color: "#16a34a", bg: "#f0fdf4" },
    { label: "Average match",  value: `${avgMatch}%`,  icon: Target,   color: "#d97706", bg: "#fef9c3" },
    { label: "Best match",     value: `${bestMatch}%`, icon: Trophy,   color: "#7c3aed", bg: "#f5f3ff" },
    { label: "Resumes analyzed", value: analyses.length, icon: Upload,  color: "#0891b2", bg: "#ecfeff" },
  ];

  return (
    <main className="page-shell">
      <Navbar />
      <div className="container-center py-10">

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <span className="section-tag">Dashboard</span>
          <h1 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: "clamp(1.6rem, 2.5vw, 2rem)", letterSpacing: "-0.025em", color: "#111827" }}>
            Welcome back, {userName}
          </h1>
          <p style={{ fontFamily: "'Lato', sans-serif", color: "#64748b", fontSize: 14, marginTop: 4 }}>Track and review all your resume analyses</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="card" style={{ padding: "20px 22px" }}>
                <div style={{ width: 36, height: 36, background: s.bg, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                  <Icon size={18} color={s.color} />
                </div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 22, color: "#111827" }}>{s.value}</div>
                <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{s.label}</div>
              </div>
            );
          })}
        </div>

        {/* History */}
        <div className="card" style={{ overflow: "hidden" }}>
          <div style={{ padding: "16px 24px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 15, color: "#111827" }}>Analysis history</h2>
            <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 12, color: "#94a3b8" }}>{analyses.length} records</span>
          </div>

          {loading ? (
            <div style={{ padding: "60px 24px", textAlign: "center" }}>
              <Loader2 size={28} color="#16a34a" className="animate-spin" style={{ margin: "0 auto 12px" }} />
              <p style={{ fontFamily: "'Lato', sans-serif", color: "#94a3b8", fontSize: 14 }}>Loading your history…</p>
            </div>
          ) : analyses.length === 0 ? (
            <div style={{ padding: "60px 24px", textAlign: "center" }}>
              <Inbox size={40} color="#cbd5e1" style={{ margin: "0 auto 12px" }} />
              <p style={{ fontFamily: "'Lato', sans-serif", color: "#94a3b8", fontSize: 14, marginBottom: 16 }}>No analyses yet</p>
              <Link href="/analyze" className="btn-primary">Run your first analysis</Link>
            </div>
          ) : (
            <div>
              {analyses.map((a) => (
                <div key={a.id} style={{ padding: "16px 24px", borderBottom: "1px solid #f1f5f9", transition: "background 0.15s" }} className="hover:bg-slate-50">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div style={{ width: 38, height: 38, background: "#f0fdf4", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <FileText size={16} color="#16a34a" />
                      </div>
                      <div>
                        <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 14, color: "#111827" }}>{a.filename}</p>
                        <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{formatDate(a.created_at)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div style={{ textAlign: "center" }}>
                        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", marginBottom: 3 }}>Match</p>
                        <ScorePill score={a.match_score} />
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", marginBottom: 3 }}>ATS</p>
                        <ScorePill score={a.ats_score} />
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", marginBottom: 3 }}>Skills</p>
                        <span style={{ background: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe", padding: "3px 10px", borderRadius: 100, fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 12 }}>
                          {a.matched_skills.length} matched
                        </span>
                      </div>
                      <Link href="/results" style={{ background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0", padding: "6px 14px", borderRadius: 7, fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 12, textDecoration: "none", display: "flex", alignItems: "center", gap: 5, transition: "background 0.15s" }}>
                        View <ExternalLink size={11} />
                      </Link>
                    </div>
                  </div>

                  {/* Skill chips */}
                  <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {a.matched_skills.map((s, i) => (
                      <span key={i} className="chip-green">
                        <CheckCircle size={10} /> {s}
                      </span>
                    ))}
                    {a.missing_skills.map((s, i) => (
                      <span key={i} className="chip-red">
                        <XCircle size={10} /> {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}