"use client";
import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import Navbar from "../Navbar";
import { Upload, Briefcase, Building2, FileText, ArrowRight, Loader2, AlertCircle, Copy, Check, Download } from "lucide-react";

export default function CoverLetter() {
  const [file, setFile]               = useState(null);
  const [dragOver, setDragOver]       = useState(false);
  const [jobTitle, setJobTitle]       = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);
  const [result, setResult]           = useState(null);
  const [copied, setCopied]           = useState(false);

  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) setFile(f); };

  const handleGenerate = async () => {
    if (!file || !jobTitle || !companyName || !jobDescription.trim()) {
      setError("Please fill in all fields and upload your resume."); return;
    }
    setError(null); setLoading(true); setResult(null);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", file);
      formData.append("job_title", jobTitle);
      formData.append("company_name", companyName);
      formData.append("job_description", jobDescription);
      const res = await axios.post("/api/cover-letter", formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` }
      });
      setResult(res.data);
    } catch (err) { setError(err.response?.data?.detail || "Something went wrong. Try again."); }
    finally { setLoading(false); }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result.cover_letter);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([result.cover_letter], { type: "text/plain" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = `cover_letter_${result.company_name}.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="page-shell">
      <Navbar />
      <div className="container-center py-10">

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <span className="section-tag">AI-Powered</span>
          <h1 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: "clamp(1.6rem, 2.5vw, 2rem)", letterSpacing: "-0.025em", color: "#111827" }}>
            Cover letter generator
          </h1>
          <p style={{ fontFamily: "'Lato', sans-serif", color: "#64748b", fontSize: 14, marginTop: 4 }}>
            Upload your resume, add the job details — get a personalized cover letter in seconds.
          </p>
        </div>

        {!result ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Upload */}
            <div className="card" style={{ padding: 24 }}>
              <div className="flex items-center gap-2 mb-4">
                <div style={{ width: 28, height: 28, background: "#f0fdf4", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <FileText size={14} color="#16a34a" />
                </div>
                <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 14, color: "#111827" }}>Upload your resume</h2>
              </div>
              <div
                className={`upload-zone ${dragOver ? "drag-over" : ""}`}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById("clFile").click()}
              >
                <Upload size={24} color={file ? "#16a34a" : "#94a3b8"} style={{ margin: "0 auto 10px" }} />
                {file
                  ? <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 14, color: "#16a34a" }}>{file.name}</p>
                  : <><p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 14, color: "#374151" }}>Drag & drop or click to upload</p><p style={{ fontFamily: "'Lato', sans-serif", fontSize: 12, color: "#94a3b8", marginTop: 4 }}>PDF or DOCX</p></>}
                <input id="clFile" type="file" accept=".pdf,.docx" onChange={e => { const f = e.target.files[0]; if (f) setFile(f); }} className="hidden" />
              </div>
            </div>

            {/* Job details */}
            <div className="card" style={{ padding: 24 }}>
              <div className="flex items-center gap-2 mb-4">
                <div style={{ width: 28, height: 28, background: "#f0fdf4", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Briefcase size={14} color="#16a34a" />
                </div>
                <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 14, color: "#111827" }}>Job details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 13, color: "#374151", display: "block", marginBottom: 6 }}>Job title</label>
                  <div style={{ position: "relative" }}>
                    <Briefcase size={14} color="#94a3b8" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                    <input type="text" value={jobTitle} onChange={e => setJobTitle(e.target.value)} placeholder="e.g. Frontend Developer" className="input" style={{ paddingLeft: 34 }} />
                  </div>
                </div>
                <div>
                  <label style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 13, color: "#374151", display: "block", marginBottom: 6 }}>Company name</label>
                  <div style={{ position: "relative" }}>
                    <Building2 size={14} color="#94a3b8" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                    <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="e.g. Google" className="input" style={{ paddingLeft: 34 }} />
                  </div>
                </div>
              </div>

              <div>
                <label style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 13, color: "#374151", display: "block", marginBottom: 6 }}>Job description</label>
                <textarea value={jobDescription} onChange={e => setJobDescription(e.target.value)} placeholder="Paste the full job description here…" className="textarea" rows={6} />
              </div>
            </div>

            {error && (
              <div style={{ background: "#fee2e2", border: "1px solid #fecaca", borderRadius: 10, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
                <AlertCircle size={15} color="#991b1b" />
                <p style={{ fontFamily: "'Lato', sans-serif", color: "#991b1b", fontSize: 13 }}>{error}</p>
              </div>
            )}

            <div style={{ textAlign: "center" }}>
              <button onClick={handleGenerate} disabled={loading} className="btn-primary" style={{ padding: "13px 36px", fontSize: 15 }}>
                {loading ? <><Loader2 size={15} className="animate-spin" /> Generating…</> : <>Generate cover letter <ArrowRight size={15} /></>}
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Result header */}
            <div className="card" style={{ padding: "18px 24px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
              <div>
                <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 16, color: "#111827" }}>Your cover letter</h2>
                <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 13, color: "#64748b", marginTop: 2 }}>
                  {result.job_title} at {result.company_name}
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={handleCopy} className="btn-secondary" style={{ padding: "8px 16px", fontSize: 13 }}>
                  {copied ? <><Check size={13} color="#16a34a" /> Copied</> : <><Copy size={13} /> Copy</>}
                </button>
                <button onClick={handleDownload} className="btn-primary" style={{ padding: "8px 16px", fontSize: 13 }}>
                  <Download size={13} /> Download
                </button>
              </div>
            </div>

            {/* Letter */}
            <div className="card" style={{ padding: 32 }}>
              <div style={{ background: "white", borderRadius: 10, border: "1px solid #e2e8f0", padding: "36px 40px" }}>
                <pre style={{ fontFamily: "'Lato', sans-serif", fontSize: 14, color: "#111827", whiteSpace: "pre-wrap", lineHeight: 1.8 }}>
                  {result.cover_letter}
                </pre>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              <button onClick={() => setResult(null)} className="btn-primary">Generate another</button>
              <Link href="/analyze" className="btn-secondary">Analyze resume</Link>
              <Link href="/dashboard" className="btn-secondary">Dashboard</Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}