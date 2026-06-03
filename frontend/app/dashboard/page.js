"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

function ScoreBadge({ score }) {
  const color =
    score >= 70
      ? "bg-green-500/20 text-green-300 border-green-500/30"
      : score >= 40
      ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      : "bg-red-500/20 text-red-300 border-red-500/30";
  return (
    <span className={`px-2 py-1 rounded-lg text-xs font-bold border ${color}`}>
      {score}%
    </span>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const [analyses, setAnalyses] = useState([]);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("user_name");

    if (!token) {
      router.push("/login");
      return;
    }

    setUserName(name || "User");
    fetchHistory(token);
  }, []);

  const fetchHistory = async (token) => {
    try {
      const response = await axios.get("/api/users/history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnalyses(response.data);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_email");
    router.push("/login");
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const avgMatch = analyses.length
    ? (analyses.reduce((sum, a) => sum + a.match_score, 0) / analyses.length).toFixed(1)
    : 0;

  const bestMatch = analyses.length
    ? Math.max(...analyses.map((a) => a.match_score)).toFixed(1)
    : 0;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-sm font-bold">AI</div>
          <span className="font-bold text-lg">ResumeAI</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/analyze" className="bg-purple-600 hover:bg-purple-700 transition px-4 py-2 rounded-lg font-medium text-sm">
            + New Analysis
          </Link>
          <button onClick={handleSignOut} className="text-white/50 hover:text-white transition text-sm">
            Sign Out
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold mb-2">
            Welcome back, <span className="text-purple-400">{userName}</span> 👋
          </h1>
          <p className="text-white/50">Track and review all your resume analyses</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Total Analyses", value: analyses.length, icon: "📄" },
            { label: "Average Match", value: `${avgMatch}%`, icon: "🎯" },
            { label: "Best Match", value: `${bestMatch}%`, icon: "🏆" },
            { label: "Resumes Uploaded", value: analyses.length, icon: "📤" },
          ].map((stat, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-extrabold text-purple-300">{stat.value}</div>
              <div className="text-white/40 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Analysis History */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center">
            <h2 className="font-bold text-xl">Analysis History</h2>
            <span className="text-white/40 text-sm">{analyses.length} analyses</span>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="text-4xl mb-4">⏳</div>
              <p className="text-white/40">Loading your history...</p>
            </div>
          ) : analyses.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">📭</div>
              <p className="text-white/40 mb-6">No analyses yet</p>
              <Link href="/analyze" className="bg-purple-600 hover:bg-purple-700 transition px-6 py-3 rounded-xl font-semibold">
                Run Your First Analysis
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {analyses.map((analysis) => (
                <div key={analysis.id} className="px-6 py-5 hover:bg-white/5 transition">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-purple-500/20 border border-purple-500/30 rounded-xl flex items-center justify-center text-lg">
                        📄
                      </div>
                      <div>
                        <p className="font-semibold text-white">{analysis.filename}</p>
                        <p className="text-white/40 text-xs mt-1">{formatDate(analysis.created_at)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-center">
                        <p className="text-white/30 text-xs mb-1">Match</p>
                        <ScoreBadge score={analysis.match_score} />
                      </div>
                      <div className="text-center">
                        <p className="text-white/30 text-xs mb-1">ATS</p>
                        <ScoreBadge score={analysis.ats_score} />
                      </div>
                      <div className="text-center">
                        <p className="text-white/30 text-xs mb-1">Skills</p>
                        <span className="px-2 py-1 rounded-lg text-xs font-bold border bg-blue-500/20 text-blue-300 border-blue-500/30">
                          {analysis.matched_skills.length} matched
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href="/results"
                        className="bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30 transition px-4 py-2 rounded-lg text-sm font-medium text-purple-300"
                      >
                        View
                      </Link>
                    </div>

                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {analysis.matched_skills.map((s, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-full text-xs bg-green-500/10 text-green-400 border border-green-500/20">
                        ✓ {s}
                      </span>
                    ))}
                    {analysis.missing_skills.map((s, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-full text-xs bg-red-500/10 text-red-400 border border-red-500/20">
                        ✗ {s}
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