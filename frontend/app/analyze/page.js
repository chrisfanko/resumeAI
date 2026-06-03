"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";

export default function Analyze() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) setFile(selected);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };

  const handleSubmit = async () => {
    if (!file || !jobDescription.trim()) {
      setError("Please upload a resume and paste a job description.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("job_description", jobDescription);

      const token = localStorage.getItem("token");
      const response = await axios.post(
        "/api/analyze",
        formData,
        { headers:
           {
             "Content-Type": "multipart/form-data",
             Authorization : `Bearer ${token}`,
                  
         } }
      );

      // Save results to localStorage and redirect
      localStorage.setItem("analysisResult", JSON.stringify(response.data));
      router.push("/results");
    } catch (err) {
      setError("Something went wrong. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-sm font-bold">AI</div>
          <span className="font-bold text-lg">ResumeAI</span>
        </Link>
        <div className="flex gap-4 items-center">
          <Link href="/dashboard" className="text-white/70 hover:text-white transition px-4 py-2">Dashboard</Link>
          <Link href="/about" className="text-white/70 hover:text-white transition px-4 py-2">How It Works</Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold mb-4">Analyze Your Resume</h1>
          <p className="text-white/60 text-lg">Upload your resume and paste the job description to get your full AI analysis.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Left — File Upload */}
          <div className="flex flex-col gap-4">
            <h2 className="font-semibold text-lg">1. Upload Your Resume</h2>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById("fileInput").click()}
              className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition
                ${dragOver ? "border-purple-400 bg-purple-500/20" : "border-white/20 hover:border-purple-400 hover:bg-white/5"}`}
            >
              <div className="text-5xl mb-4">📄</div>
              {file ? (
                <div>
                  <p className="text-purple-300 font-semibold">{file.name}</p>
                  <p className="text-white/40 text-sm mt-1">Click to change file</p>
                </div>
              ) : (
                <div>
                  <p className="text-white/70 font-medium">Drag & drop your resume here</p>
                  <p className="text-white/40 text-sm mt-1">or click to browse</p>
                  <p className="text-white/30 text-xs mt-3">Supports PDF and DOCX</p>
                </div>
              )}
              <input
                id="fileInput"
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Right — Job Description */}
          <div className="flex flex-col gap-4">
            <h2 className="font-semibold text-lg">2. Paste Job Description</h2>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job description here..."
              className="flex-1 min-h-64 bg-white/5 border border-white/20 rounded-2xl p-4 text-white placeholder-white/30 resize-none focus:outline-none focus:border-purple-400 transition"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-red-300 text-center">
            {error}
          </div>
        )}

        {/* Submit */}
        <div className="mt-8 text-center">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 disabled:opacity-50 transition px-12 py-4 rounded-xl font-semibold text-lg"
          >
            {loading ? "Analyzing... ⏳" : "Analyze My Resume →"}
          </button>
        </div>

        {/* Steps indicator */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { step: "01", label: "Upload Resume" },
            { step: "02", label: "Paste Job Description" },
            { step: "03", label: "AI Analysis Runs" },
            { step: "04", label: "Get Results" },
          ].map((s, i) => (
            <div key={i} className="bg-white/5 rounded-xl p-4">
              <div className="text-purple-400 font-bold text-lg">{s.step}</div>
              <div className="text-white/60 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
