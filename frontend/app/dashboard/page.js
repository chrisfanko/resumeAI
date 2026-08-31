"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import Navbar from "../Navbar";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  FileText,
  Inbox,
  Loader2,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
} from "lucide-react";

function scoreTone(score) {
  if (score >= 70) return "green";
  if (score >= 40) return "amber";
  return "red";
}

function ScoreBadge({ score }) {
  return (
    <span className={`dashboard-score-badge ${scoreTone(Number(score || 0))}`}>
      {Math.round(Number(score || 0))}%
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

    setUserName(name || "there");

    axios
      .get("/api/users/history", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setAnalyses(response.data || []))
      .catch(() => setAnalyses([]))
      .finally(() => setLoading(false));
  }, [router]);

  const stats = useMemo(() => {
    const total = analyses.length;
    const average = total
      ? analyses.reduce((sum, analysis) => sum + Number(analysis.match_score || 0), 0) / total
      : 0;
    const best = total
      ? Math.max(...analyses.map((analysis) => Number(analysis.match_score || 0)))
      : 0;
    const strong = analyses.filter((analysis) => Number(analysis.match_score || 0) >= 70).length;

    return [
      { label: "Analyses completed", value: total, icon: FileText, tone: "green" },
      { label: "Average match score", value: `${Math.round(average)}%`, icon: Target, tone: "amber" },
      { label: "Best opportunity", value: `${Math.round(best)}%`, icon: Trophy, tone: "purple" },
      { label: "Strong matches", value: strong, icon: TrendingUp, tone: "blue" },
    ];
  }, [analyses]);

  const formatDate = (date) => {
    if (!date) return "Recently";
    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <main className="dashboard-page">
      <Navbar />

      <section className="dashboard-shell">
        <div className="container-center">
          <header className="dashboard-header">
            <div>
              <div className="dashboard-eyebrow">
                <Sparkles size={14} />
                Your career workspace
              </div>
              <h1>Welcome back, {userName}.</h1>
              <p>Track your resume performance and keep improving every application.</p>
            </div>

            <Link href="/analyze" className="dashboard-primary-action">
              <FileText size={17} />
              Analyze a resume
            </Link>
          </header>

          <section className="dashboard-stat-grid">
            {stats.map(({ label, value, icon: Icon, tone }) => (
              <article className={`dashboard-stat-card tone-${tone}`} key={label}>
                <div className="dashboard-stat-icon"><Icon size={19} /></div>
                <strong>{value}</strong>
                <span>{label}</span>
              </article>
            ))}
          </section>

          <section className="dashboard-insight-card">
            <div className="dashboard-insight-copy">
              <div className="dashboard-insight-icon"><BarChart3 size={19} /></div>
              <div>
                <span>Your progress</span>
                <h2>
                  {analyses.length
                    ? "Every tailored application gives you a stronger chance."
                    : "Your first analysis is where the progress starts."}
                </h2>
                <p>
                  {analyses.length
                    ? `You have completed ${analyses.length} analysis${analyses.length === 1 ? "" : "es"}. Review skill gaps before sending your next application.`
                    : "Upload your resume and a job description to see your match score, ATS feedback, and suggestions."}
                </p>
              </div>
            </div>

            <Link href="/analyze" className="dashboard-text-action">
              Start analysis <ArrowRight size={16} />
            </Link>
          </section>

          <section className="dashboard-history-section">
            <div className="dashboard-section-heading">
              <div>
                <span>Resume history</span>
                <h2>Your recent analyses</h2>
              </div>
              {!loading && <p>{analyses.length} total record{analyses.length === 1 ? "" : "s"}</p>}
            </div>

            {loading ? (
              <div className="dashboard-loading">
                <Loader2 size={28} className="animate-spin" />
                <span>Loading your analysis history…</span>
              </div>
            ) : analyses.length === 0 ? (
              <div className="dashboard-empty-state">
                <div><Inbox size={31} /></div>
                <h3>No analyses yet.</h3>
                <p>Your completed resume reports will appear here.</p>
                <Link href="/analyze" className="dashboard-primary-action">
                  Analyze my first resume <ArrowRight size={16} />
                </Link>
              </div>
            ) : (
              <div className="dashboard-history-list">
                {analyses.map((analysis) => (
                  <article className="dashboard-history-item" key={analysis.id}>
                    <div className="dashboard-file-icon"><FileText size={18} /></div>

                    <div className="dashboard-history-main">
                      <div className="dashboard-file-heading">
                        <div>
                          <h3>{analysis.filename || "Resume analysis"}</h3>
                          <p>
                            {analysis.candidate_name || "Resume"} · {formatDate(analysis.created_at)}
                          </p>
                        </div>
                        <span className={`dashboard-match-label ${scoreTone(Number(analysis.match_score || 0))}`}>
                          {Number(analysis.match_score || 0) >= 70
                            ? "Strong match"
                            : Number(analysis.match_score || 0) >= 40
                              ? "Moderate match"
                              : "Needs work"}
                        </span>
                      </div>

                      <div className="dashboard-history-metrics">
                        <div>
                          <span>Match score</span>
                          <ScoreBadge score={analysis.match_score} />
                        </div>
                        <div>
                          <span>ATS score</span>
                          <ScoreBadge score={analysis.ats_score} />
                        </div>
                        <div className="dashboard-skills-summary">
                          <span>Matched skills</span>
                          <strong>{analysis.matched_skills?.length || 0}</strong>
                        </div>
                        <Link href="/results" className="dashboard-view-link">
                          View report <ArrowRight size={14} />
                        </Link>
                      </div>

                      {(analysis.matched_skills?.length > 0 || analysis.missing_skills?.length > 0) && (
                        <div className="dashboard-history-chips">
                          {analysis.matched_skills?.slice(0, 4).map((skill) => (
                            <span className="dashboard-chip matched-chip" key={`match-${skill}`}>
                              <CheckCircle2 size={11} /> {skill}
                            </span>
                          ))}
                          {analysis.missing_skills?.slice(0, 3).map((skill) => (
                            <span className="dashboard-chip missing-chip" key={`missing-${skill}`}>
                              + {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}