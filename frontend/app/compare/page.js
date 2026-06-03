"use client";
import { useState } from "react";
import axios from "axios";
import Link from "next/link";

function ScoreBadge({ score }) {
  const color =
    score >= 70
      ? "bg-green-500/20 text-green-300 border-green-500/30"
      : score >= 40
      ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      : "bg-red-500/20 text-red-300 border-red-500/30";
  return (
    <span className={`px-3 py-1 rounded-lg text-sm font-bold border ${color}`}>
      {score}%
    </span>
  );
}

function RecommendationBadge({ recommendation }) {
  const color =
    recommendation === "Strong Match"
      ? "bg-green-500/20 text-green-300 border-green-500/30"
      : recommendation === "Moderate Match"
      ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      : "bg-red-500/20 text-red-300 border-red-500/30";
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${color}`}>
      {recommendation}
    </span>
  );
}

export default function Compare() {
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [jobs, setJobs] = useState([
    { title: "", description: "" },
    { title: "", description: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

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

  const addJob = () => {
    if (jobs.length < 3) setJobs([...jobs, { title: "", description: "" }]);
  };

  const removeJob = (index) => {
    if (jobs.length > 2) setJobs(jobs.filter((_, i) => i !== index));
  };

  const updateJob = (index, field, value) => {
    const updated = [...jobs];
    updated[index][field] = value;
    setJobs(updated);
  };

  const handleCompare = async () => {
    if (!file) {
      setError("Please upload your resume.");
      return;
    }

    const filledJobs = jobs.filter((j) => j.description.trim());
    if (filledJobs.length < 2) {
      setError("Please fill in at least 2 job descriptions.");
      return;
    }

    setError(null);
    setLoading(true);
    setResults(null);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", file);
      formData.append("job_descriptions", JSON.stringify(jobs));

      const response = await axios.post("/api/compare", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong. Try again.");
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
          <Link href="/analyze" className="bg-purple-600 hover:bg-purple-700 transition px-4 py-2 rounded-lg font-medium">
            Single Analysis
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold mb-4">Compare Jobs</h1>
          <p className="text-white/60 text-lg">Upload your resume and compare it against multiple job descriptions to find your best match.</p>
        </div>

        {!results ? (
          <div className="space-y-8">

            {/* Resume Upload */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="font-bold text-xl mb-4">1. Upload Your Resume</h2>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById("compareFileInput").click()}
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
                <input id="compareFileInput" type="file" accept=".pdf,.docx" onChange={handleFileChange} className="hidden" />
              </div>
            </div>

            {/* Job Descriptions */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-xl">2. Add Job Descriptions</h2>
                {jobs.length < 3 && (
                  <button
                    onClick={addJob}
                    className="bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30 text-purple-300 px-4 py-2 rounded-lg text-sm font-medium transition"
                  >
                    + Add Job
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job, index) => (
                  <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-purple-400 font-bold text-sm">Job {index + 1}</span>
                      {jobs.length > 2 && (
                        <button
                          onClick={() => removeJob(index)}
                          className="text-red-400 hover:text-red-300 text-xs transition"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={job.title}
                      onChange={(e) => updateJob(index, "title", e.target.value)}
                      placeholder="Job title (e.g. Frontend Developer)"
                      className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/30 text-sm focus:outline-none focus:border-purple-400 transition mb-3"
                    />
                    <textarea
                      value={job.description}
                      onChange={(e) => updateJob(index, "description", e.target.value)}
                      placeholder="Paste job description here..."
                      className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/30 text-sm resize-none focus:outline-none focus:border-purple-400 transition"
                      rows={8}
                    />
                  </div>
                ))}
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
                onClick={handleCompare}
                disabled={loading}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 disabled:opacity-50 transition px-12 py-4 rounded-xl font-semibold text-lg"
              >
                {loading ? "Comparing... ⏳" : "Compare Jobs →"}
              </button>
            </div>

          </div>
        ) : (

          /* Results */
          <div className="space-y-8">

            {/* Summary */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
              <div className="text-4xl mb-3">🏆</div>
              <h2 className="text-2xl font-extrabold mb-2">Best Match</h2>
              <p className="text-purple-300 text-xl font-bold">{results.best_match}</p>
              <p className="text-white/40 text-sm mt-2">Based on semantic similarity and keyword analysis</p>
            </div>

            {/* Comparison Table */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/10">
                <h2 className="font-bold text-xl">Comparison Results</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left px-6 py-3 text-white/40 text-sm font-medium">Rank</th>
                      <th className="text-left px-6 py-3 text-white/40 text-sm font-medium">Job Title</th>
                      <th className="text-left px-6 py-3 text-white/40 text-sm font-medium">Match Score</th>
                      <th className="text-left px-6 py-3 text-white/40 text-sm font-medium">ATS Score</th>
                      <th className="text-left px-6 py-3 text-white/40 text-sm font-medium">Matched Skills</th>
                      <th className="text-left px-6 py-3 text-white/40 text-sm font-medium">Missing Skills</th>
                      <th className="text-left px-6 py-3 text-white/40 text-sm font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {results.results.map((result, i) => (
                      <tr key={i} className={`hover:bg-white/5 transition ${i === 0 ? "bg-purple-500/10" : ""}`}>
                        <td className="px-6 py-4">
                          <span className={`text-xl ${i === 0 ? "text-yellow-400" : i === 1 ? "text-white/40" : "text-orange-400"}`}>
                            {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold">{result.job_title || `Job ${i + 1}`}</p>
                        </td>
                        <td className="px-6 py-4">
                          <ScoreBadge score={result.match_score} />
                        </td>
                        <td className="px-6 py-4">
                          <ScoreBadge score={result.ats_score} />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {result.matched_skills.slice(0, 3).map((s, j) => (
                              <span key={j} className="px-2 py-0.5 rounded-full text-xs bg-green-500/10 text-green-400 border border-green-500/20">
                                ✓ {s}
                              </span>
                            ))}
                            {result.matched_skills.length > 3 && (
                              <span className="px-2 py-0.5 rounded-full text-xs bg-white/10 text-white/40">
                                +{result.matched_skills.length - 3} more
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {result.missing_skills.slice(0, 3).map((s, j) => (
                              <span key={j} className="px-2 py-0.5 rounded-full text-xs bg-red-500/10 text-red-400 border border-red-500/20">
                                ✗ {s}
                              </span>
                            ))}
                            {result.missing_skills.length > 3 && (
                              <span className="px-2 py-0.5 rounded-full text-xs bg-white/10 text-white/40">
                                +{result.missing_skills.length - 3} more
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <RecommendationBadge recommendation={result.recommendation} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => setResults(null)}
                className="bg-purple-600 hover:bg-purple-700 transition px-8 py-3 rounded-xl font-semibold"
              >
                Compare Again
              </button>
              <Link
                href="/analyze"
                className="border border-white/20 hover:border-white/40 transition px-8 py-3 rounded-xl font-semibold"
              >
                Single Analysis
              </Link>
              <Link
                href="/dashboard"
                className="border border-white/20 hover:border-white/40 transition px-8 py-3 rounded-xl font-semibold"
              >
                Go to Dashboard
              </Link>
            </div>

          </div>
        )}
      </div>
    </main>
  );
}