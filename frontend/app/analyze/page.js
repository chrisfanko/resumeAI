"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Navbar from "../Navbar";
import { Upload, FileText, Briefcase, ArrowRight, Loader2, AlertCircle } from "lucide-react";

export default function Analyze() {
  const router = useRouter();
  const [file, setFile]                   = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState(null);
  const [dragOver, setDragOver]           = useState(false);

  const handleFileChange = (e) => { const f = e.target.files[0]; if (f) setFile(f); };
  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) setFile(f); };

  const handleSubmit = async () => {
    if (!file || !jobDescription.trim()) { setError("Please upload a resume and paste a job description."); return; }
    setError(null); setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("job_description", jobDescription);
      const token = localStorage.getItem("token");
      const response = await axios.post("/api/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` }
      });
      localStorage.setItem("analysisResult", JSON.stringify(response.data));
      router.push("/results");
    } catch {
      setError("Something went wrong. Make sure you are logged in and the backend is running.");
    } finally { setLoading(false); }
  };

  return (
    <main className="page-shell">
      <Navbar />

      <div className="container-center py-12">
        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <span className="section-tag">Resume Analysis</span>
          <h1 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: "clamp(1.8rem, 3vw, 2.4rem)", letterSpacing: "-0.025em", color: "#111827", marginBottom: 8 }}>
            Analyze your resume
          </h1>
          <p style={{ fontFamily: "'Lato', sans-serif", color: "#64748b", fontSize: 15 }}>
            Upload your resume and paste a job description to get your full AI analysis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

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
              onClick={() => document.getElementById("fileInput").click()}
            >
              <Upload size={28} color={file ? "#16a34a" : "#94a3b8"} style={{ margin: "0 auto 12px" }} />
              {file ? (
                <>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 14, color: "#16a34a" }}>{file.name}</p>
                  <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 12, color: "#94a3b8", marginTop: 4 }}>Click to change file</p>
                </>
              ) : (
                <>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 14, color: "#374151" }}>Drag & drop your resume</p>
                  <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 12, color: "#94a3b8", marginTop: 4 }}>or click to browse — PDF or DOCX</p>
                </>
              )}
              <input id="fileInput" type="file" accept=".pdf,.docx" onChange={handleFileChange} className="hidden" />
            </div>
          </div>

          {/* Job Description */}
          <div className="card" style={{ padding: 24 }}>
            <div className="flex items-center gap-2 mb-4">
              <div style={{ width: 28, height: 28, background: "#f0fdf4", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Briefcase size={14} color="#16a34a" />
              </div>
              <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 14, color: "#111827" }}>Paste job description</h2>
            </div>
            <textarea
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              placeholder="Paste the full job description here…"
              className="textarea"
              style={{ minHeight: 220 }}
            />
          </div>
        </div>

        {error && (
          <div style={{ background: "#fee2e2", border: "1px solid #fecaca", borderRadius: 10, padding: "12px 16px", marginTop: 20, display: "flex", alignItems: "center", gap: 10 }}>
            <AlertCircle size={16} color="#991b1b" />
            <p style={{ fontFamily: "'Lato', sans-serif", color: "#991b1b", fontSize: 13 }}>{error}</p>
          </div>
        )}

        <div style={{ marginTop: 24, display: "flex", justifyContent: "center" }}>
          <button onClick={handleSubmit} disabled={loading} className="btn-primary" style={{ padding: "13px 36px", fontSize: 15 }}>
            {loading ? <><Loader2 size={16} className="animate-spin" /> Analyzing…</> : <>Analyze my resume <ArrowRight size={16} /></>}
          </button>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-10">
          {["Upload resume", "Paste job description", "AI analysis runs", "Get results"].map((s, i) => (
            <div key={i} className="card" style={{ padding: "14px 16px", textAlign: "center" }}>
              <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 18, color: "#bbf7d0", marginBottom: 4 }}>0{i + 1}</div>
              <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 12, color: "#64748b" }}>{s}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}