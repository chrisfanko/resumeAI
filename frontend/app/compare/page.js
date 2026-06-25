"use client";
import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import Navbar from "../Navbar";
import { Upload, Plus, Trash2, ArrowRight, Loader2, AlertCircle, Trophy, CheckCircle, XCircle } from "lucide-react";

function ScorePill({ score }) {
  const cls = score >= 70 ? "score-green" : score >= 40 ? "score-yellow" : "score-red";
  return <span className={cls} style={{ padding: "3px 10px", borderRadius: 100, fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 12 }}>{score}%</span>;
}

function RecoBadge({ rec }) {
  const map = {
    "Strong Match":   { bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" },
    "Moderate Match": { bg: "#fef9c3", color: "#854d0e", border: "#fef08a" },
    "Weak Match":     { bg: "#fee2e2", color: "#991b1b", border: "#fecaca" },
  };
  const s = map[rec] || map["Weak Match"];
  return <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, padding: "3px 10px", borderRadius: 100, fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 11 }}>{rec}</span>;
}

export default function Compare() {
  const [file, setFile]       = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [jobs, setJobs]       = useState([{ title: "", description: "" }, { title: "", description: "" }]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [results, setResults] = useState(null);

  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) setFile(f); };
  const updateJob  = (i, field, val) => { const j = [...jobs]; j[i][field] = val; setJobs(j); };
  const addJob     = () => { if (jobs.length < 3) setJobs([...jobs, { title: "", description: "" }]); };
  const removeJob  = (i) => { if (jobs.length > 2) setJobs(jobs.filter((_, idx) => idx !== i)); };

  const handleCompare = async () => {
    if (!file) { setError("Please upload your resume."); return; }
    if (jobs.filter(j => j.description.trim()).length < 2) { setError("Please fill in at least 2 job descriptions."); return; }
    setError(null); setLoading(true); setResults(null);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", file);
      formData.append("job_descriptions", JSON.stringify(jobs));
      const res = await axios.post("/api/compare", formData, { headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` } });
      setResults(res.data);
    } catch (err) { setError(err.response?.data?.detail || "Something went wrong."); }
    finally { setLoading(false); }
  };

  return (
    <main className="page-shell">
      <Navbar />
      <div className="container-center py-10">

        <div style={{ marginBottom: 32 }}>
          <span className="section-tag">Job Comparison</span>
          <h1 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: "clamp(1.6rem, 2.5vw, 2rem)", letterSpacing: "-0.025em", color: "#111827" }}>Compare jobs</h1>
          <p style={{ fontFamily: "'Lato', sans-serif", color: "#64748b", fontSize: 14, marginTop: 4 }}>See which job is your best match — side by side.</p>
        </div>

        {!results ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Upload */}
            <div className="card" style={{ padding: 24 }}>
              <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 14, color: "#111827", marginBottom: 14 }}>Upload your resume</h2>
              <div className={`upload-zone ${dragOver ? "drag-over" : ""}`}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById("cmpFile").click()}
              >
                <Upload size={24} color={file ? "#16a34a" : "#94a3b8"} style={{ margin: "0 auto 10px" }} />
                {file
                  ? <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 14, color: "#16a34a" }}>{file.name}</p>
                  : <><p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 14, color: "#374151" }}>Drag & drop or click to upload</p><p style={{ fontFamily: "'Lato', sans-serif", fontSize: 12, color: "#94a3b8", marginTop: 4 }}>PDF or DOCX</p></>}
                <input id="cmpFile" type="file" accept=".pdf,.docx" onChange={e => { const f = e.target.files[0]; if (f) setFile(f); }} className="hidden" />
              </div>
            </div>

            {/* Jobs */}
            <div className="card" style={{ padding: 24 }}>
              <div className="flex items-center justify-between mb-4">
                <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 14, color: "#111827" }}>Job descriptions</h2>
                {jobs.length < 3 && (
                  <button onClick={addJob} className="btn-secondary" style={{ padding: "7px 14px", fontSize: 13 }}>
                    <Plus size={14} /> Add job
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {jobs.map((job, i) => (
                  <div key={i} style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: 16 }}>
                    <div className="flex items-center justify-between mb-3">
                      <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 12, color: "#16a34a", textTransform: "uppercase", letterSpacing: "0.05em" }}>Job {i + 1}</span>
                      {jobs.length > 2 && <button onClick={() => removeJob(i)} style={{ color: "#dc2626", cursor: "pointer", background: "none", border: "none" }}><Trash2 size={14} /></button>}
                    </div>
                    <input type="text" value={job.title} onChange={e => updateJob(i, "title", e.target.value)} placeholder="Job title" className="input" style={{ marginBottom: 10 }} />
                    <textarea value={job.description} onChange={e => updateJob(i, "description", e.target.value)} placeholder="Paste job description…" className="textarea" rows={8} />
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <div style={{ background: "#fee2e2", border: "1px solid #fecaca", borderRadius: 10, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
                <AlertCircle size={15} color="#991b1b" />
                <p style={{ fontFamily: "'Lato', sans-serif", color: "#991b1b", fontSize: 13 }}>{error}</p>
              </div>
            )}

            <div style={{ textAlign: "center" }}>
              <button onClick={handleCompare} disabled={loading} className="btn-primary" style={{ padding: "13px 36px", fontSize: 15 }}>
                {loading ? <><Loader2 size={15} className="animate-spin" /> Comparing…</> : <>Compare jobs <ArrowRight size={15} /></>}
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Best match */}
            <div className="card" style={{ padding: 28, textAlign: "center", background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
              <Trophy size={32} color="#16a34a" style={{ margin: "0 auto 12px" }} />
              <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 20, color: "#111827", marginBottom: 6 }}>Best match</h2>
              <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 18, color: "#16a34a" }}>{results.best_match}</p>
              <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 13, color: "#64748b", marginTop: 6 }}>Based on semantic similarity and keyword analysis</p>
            </div>

            {/* Table */}
            <div className="card" style={{ overflow: "hidden" }}>
              <div style={{ padding: "14px 20px", borderBottom: "1px solid #e2e8f0" }}>
                <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 15, color: "#111827" }}>Comparison results</h2>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                      {["Rank", "Job Title", "Match", "ATS", "Matched Skills", "Missing Skills", "Status"].map(h => (
                        <th key={h} style={{ textAlign: "left", padding: "10px 16px", fontFamily: "'Inter', sans-serif", fontSize: 11, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {results.results.map((r, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid #f1f5f9", background: i === 0 ? "#f0fdf4" : "white" }}>
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 14, color: i === 0 ? "#16a34a" : i === 1 ? "#94a3b8" : "#d97706" }}>
                            {i === 0 ? "#1" : i === 1 ? "#2" : "#3"}
                          </span>
                        </td>
                        <td style={{ padding: "12px 16px", fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 13, color: "#111827" }}>{r.job_title || `Job ${i + 1}`}</td>
                        <td style={{ padding: "12px 16px" }}><ScorePill score={r.match_score} /></td>
                        <td style={{ padding: "12px 16px" }}><ScorePill score={r.ats_score} /></td>
                        <td style={{ padding: "12px 16px" }}>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                            {r.matched_skills.slice(0, 3).map((s, j) => <span key={j} className="chip-green"><CheckCircle size={9} />{s}</span>)}
                            {r.matched_skills.length > 3 && <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 11, color: "#94a3b8" }}>+{r.matched_skills.length - 3}</span>}
                          </div>
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                            {r.missing_skills.slice(0, 3).map((s, j) => <span key={j} className="chip-red"><XCircle size={9} />{s}</span>)}
                            {r.missing_skills.length > 3 && <span style={{ fontFamily: "'Lato', sans-serif", fontSize: 11, color: "#94a3b8" }}>+{r.missing_skills.length - 3}</span>}
                          </div>
                        </td>
                        <td style={{ padding: "12px 16px" }}><RecoBadge rec={r.recommendation} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              <button onClick={() => setResults(null)} className="btn-primary">Compare again</button>
              <Link href="/analyze" className="btn-secondary">Single analysis</Link>
              <Link href="/dashboard" className="btn-secondary">Dashboard</Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}