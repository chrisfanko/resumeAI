"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

function ScoreCircle({ score, label, color }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`w-28 h-28 rounded-full border-4 ${color} flex items-center justify-center`}>
        <span className="text-2xl font-extrabold">{score}%</span>
      </div>
      <span className="text-white/60 text-sm font-medium">{label}</span>
    </div>
  );
}

function SkillBadge({ skill, type }) {
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
      type === "matched"
        ? "bg-green-500/20 text-green-300 border border-green-500/30"
        : "bg-red-500/20 text-red-300 border border-red-500/30"
    }`}>
      {type === "matched" ? "✓ " : "✗ "}{skill}
    </span>
  );
}

export default function Results() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("analysisResult");
    if (stored) setData(JSON.parse(stored));
  }, []);

  if (!data) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/60 text-lg mb-4">No analysis found.</p>
          <Link href="/analyze" className="bg-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition">
            Analyze a Resume →
          </Link>
        </div>
      </main>
    );
  }

  const { candidate, scores, skills, format_checks, suggestions } = data;

  const getScoreColor = (score) => {
    if (score >= 70) return "border-green-400 text-green-400";
    if (score >= 40) return "border-yellow-400 text-yellow-400";
    return "border-red-400 text-red-400";
  };

  const getScoreLabel = (score) => {
    if (score >= 70) return { text: "Strong Match", color: "text-green-400" };
    if (score >= 40) return { text: "Moderate Match", color: "text-yellow-400" };
    return { text: "Weak Match", color: "text-red-400" };
  };

  const overallLabel = getScoreLabel(scores.match_score);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-sm font-bold">AI</div>
          <span className="font-bold text-lg">ResumeAI</span>
        </Link>
        <Link href="/analyze" className="bg-purple-600 hover:bg-purple-700 transition px-4 py-2 rounded-lg font-medium text-sm">
          New Analysis
        </Link>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold mb-2">Analysis Results</h1>
          {candidate?.name && (
            <p className="text-white/50">Results for <span className="text-purple-300 font-semibold">{candidate.name}</span></p>
          )}
          <div className={`mt-3 text-lg font-bold ${overallLabel.color}`}>
            {overallLabel.text}
          </div>
        </div>

        {/* Score Cards */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
          <h2 className="font-bold text-xl mb-8 text-center">Your Scores</h2>
          <div className="flex flex-wrap justify-center gap-12">
            <ScoreCircle score={scores.match_score} label="Match Score" color={getScoreColor(scores.match_score)} />
            <ScoreCircle score={scores.ats_score} label="ATS Score" color={getScoreColor(scores.ats_score)} />
            <ScoreCircle score={scores.keyword_score} label="Keyword Score" color={getScoreColor(scores.keyword_score)} />
            <ScoreCircle score={scores.format_score} label="Format Score" color={getScoreColor(scores.format_score)} />
          </div>
        </div>

        {/* Candidate Info */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
          <h2 className="font-bold text-xl mb-4">Candidate Info</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Name", value: candidate?.name || "Not found" },
              { label: "Email", value: candidate?.email || "Not found" },
              { label: "Phone", value: candidate?.phone || "Not found" },
              { label: "Experience", value: candidate?.years_experience ? `${candidate.years_experience} years` : "Not detected" },
            ].map((item, i) => (
              <div key={i} className="bg-white/5 rounded-xl p-4">
                <p className="text-white/40 text-xs mb-1">{item.label}</p>
                <p className="text-white font-medium text-sm truncate">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
          <h2 className="font-bold text-xl mb-6">Skills Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-green-400 font-semibold mb-3">
                ✅ Matched Skills ({skills.matched.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.matched.length > 0
                  ? skills.matched.map((s, i) => <SkillBadge key={i} skill={s} type="matched" />)
                  : <p className="text-white/30 text-sm">No matching skills found</p>
                }
              </div>
            </div>
            <div>
              <h3 className="text-red-400 font-semibold mb-3">
                ❌ Missing Skills ({skills.missing.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.missing.length > 0
                  ? skills.missing.map((s, i) => <SkillBadge key={i} skill={s} type="missing" />)
                  : <p className="text-white/30 text-sm">No missing skills detected</p>
                }
              </div>
            </div>
          </div>
        </div>

        {/* Format Checks */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
          <h2 className="font-bold text-xl mb-4">Format Checks</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(format_checks).map(([key, value], i) => (
              <div key={i} className={`rounded-xl p-4 border ${value ? "border-green-500/30 bg-green-500/10" : "border-red-500/30 bg-red-500/10"}`}>
                <div className="text-xl mb-1">{value ? "✅" : "❌"}</div>
                <p className="text-white/70 text-xs capitalize">{key.replace(/_/g, " ")}</p>
              </div>
            ))}
          </div>
        </div>

        {/* AI Suggestions */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
          <h2 className="font-bold text-xl mb-4">🤖 AI Suggestions</h2>
          <div className="bg-black/30 rounded-xl p-6">
            <pre className="text-white/80 text-sm whitespace-pre-wrap font-sans leading-relaxed">
              {suggestions}
            </pre>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/analyze" className="bg-purple-600 hover:bg-purple-700 transition px-8 py-3 rounded-xl font-semibold">
            Analyze Another Resume
          </Link>
          <button
            onClick={() => window.print()}
            className="border border-white/20 hover:border-white/40 transition px-8 py-3 rounded-xl font-semibold"
          >
            Print / Save as PDF
          </button>
        </div>

      </div>
    </main>
  );
}