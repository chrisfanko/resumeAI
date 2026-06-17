"use client";
import { useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function CoverLetter() {
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

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

  const handleGenerate = async () => {
    if (!file || !jobTitle || !companyName || !jobDescription.trim()) {
      setError("Please fill in all fields and upload your resume.");
      return;
    }

    setError(null);
    setLoading(true);
    setResult(null);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", file);
      formData.append("job_title", jobTitle);
      formData.append("company_name", companyName);
      formData.append("job_description", jobDescription);

      const response = await axios.post("/api/cover-letter", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result.cover_letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([result.cover_letter], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cover_letter_${result.company_name}.txt`;
    a.click();
    URL.revokeObjectURL(url);
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
          <Link href="/analyze" className="bg-purple-600 hover:bg-purple-700 transition px-4 py-2 rounded-lg font-medium">
            Analyze Resume
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-purple-500/20 border border-purple-500/30 rounded-full px-4 py-1 text-purple-300 text-sm mb-4">
            Powered by Llama 3
          </div>
          <h1 className="text-4xl font-extrabold mb-4">Cover Letter Generator</h1>
          <p className="text-white/60 text-lg">Upload your resume, fill in the job details and get a personalized professional cover letter in seconds.</p>
        </div>

        {!result ? (
          <div className="space-y-6">

            {/* Resume Upload */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="font-bold text-lg mb-4">1. Upload Your Resume</h2>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById("clFileInput").click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition
                  ${dragOver ? "border-purple-400 bg-purple-500/20" : "border-white/20 hover:border-purple-400 hover:bg-white/5"}`}
              >
                <div className="text-4xl mb-3">📄</div>
                {file ? (
                  <div>
                    <p className="text-purple-300 font-semibold">{file.name}</p>
                    <p className="text-white/40 text-sm mt-1">Click to change</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-white/70 font-medium">Drag & drop or click to upload</p>
                    <p className="text-white/30 text-xs mt-2">PDF or DOCX</p>
                  </div>
                )}
                <input id="clFileInput" type="file" accept=".pdf,.docx" onChange={handleFileChange} className="hidden" />
              </div>
            </div>

            {/* Job Details */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="font-bold text-lg mb-4">2. Job Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-white/60 text-sm mb-2 block">Job Title</label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Frontend Developer"
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-purple-400 transition"
                  />
                </div>
                <div>
                  <label className="text-white/60 text-sm mb-2 block">Company Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Google"
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-purple-400 transition"
                  />
                </div>
              </div>
              <div>
                <label className="text-white/60 text-sm mb-2 block">Job Description</label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the full job description here..."
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 resize-none focus:outline-none focus:border-purple-400 transition"
                  rows={6}
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-red-300 text-center">
                {error}
              </div>
            )}

            {/* Submit */}
            <div className="text-center">
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 disabled:opacity-50 transition px-12 py-4 rounded-xl font-semibold text-lg"
              >
                {loading ? "Generating... ⏳" : "Generate Cover Letter →"}
              </button>
            </div>

          </div>
        ) : (

          /* Result */
          <div className="space-y-6">

            {/* Header */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="font-bold text-xl">Your Cover Letter</h2>
                <p className="text-white/40 text-sm mt-1">
                  {result.job_title} at {result.company_name}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleCopy}
                  className="bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30 text-purple-300 px-4 py-2 rounded-lg text-sm font-medium transition"
                >
                  {copied ? "✅ Copied!" : "📋 Copy"}
                </button>
                <button
                  onClick={handleDownload}
                  className="bg-green-600/20 hover:bg-green-600/40 border border-green-500/30 text-green-300 px-4 py-2 rounded-lg text-sm font-medium transition"
                >
                  ⬇️ Download
                </button>
              </div>
            </div>

            {/* Cover Letter Content */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <div className="bg-white text-gray-800 rounded-xl p-8 font-serif leading-relaxed">
                <pre className="whitespace-pre-wrap font-serif text-gray-800 leading-relaxed text-sm md:text-base">
                  {result.cover_letter}
                </pre>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => setResult(null)}
                className="bg-purple-600 hover:bg-purple-700 transition px-8 py-3 rounded-xl font-semibold"
              >
                Generate Another
              </button>
              <Link
                href="/analyze"
                className="border border-white/20 hover:border-white/40 transition px-8 py-3 rounded-xl font-semibold"
              >
                Analyze Resume
              </Link>
              <Link
                href="/dashboard"
                className="border border-white/20 hover:border-white/40 transition px-8 py-3 rounded-xl font-semibold"
              >
                Dashboard
              </Link>
            </div>

          </div>
        )}
      </div>
    </main>
  );
}