"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "../Navbar";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  FileDown,
  Lightbulb,
  ScanSearch,
  Sparkles,
  Target,
  UserRound,
  XCircle,
} from "lucide-react";

function getScoreStyle(score) {
  if (score >= 70) {
    return { color: "#16a34a", background: "#f0fdf4", label: "Strong match" };
  }

  if (score >= 40) {
    return { color: "#d97706", background: "#fffbeb", label: "Needs improvement" };
  }

  return { color: "#dc2626", background: "#fef2f2", label: "Weak match" };
}

function ScoreCard({ label, score, icon: Icon, delay = 0 }) {
  const safeScore = Number(score || 0);
  const style = getScoreStyle(safeScore);

  return (
    <article
      className="result-score-card"
      style={{ "--score-color": style.color, "--score-delay": `${delay}ms` }}
    >
      <div className="result-score-top">
        <div className="result-score-icon">
          <Icon size={18} />
        </div>
        <span>{label}</span>
      </div>

      <div className="result-score-value">
        {Math.round(safeScore)}<small>%</small>
      </div>

      <div className="result-progress-track">
        <div
          className="result-progress-fill"
          style={{ width: `${Math.max(0, Math.min(safeScore, 100))}%` }}
        />
      </div>

      <p style={{ color: style.color }}>{style.label}</p>
    </article>
  );
}

export default function Results() {
  const [data, setData] = useState(null);

  useEffect(() => {
    try {
      const savedResult = localStorage.getItem("analysisResult");
      if (savedResult) setData(JSON.parse(savedResult));
    } catch {
      localStorage.removeItem("analysisResult");
    }
  }, []);

  if (!data) {
    return (
      <main className="results-page">
        <Navbar />
        <section className="no-results-state">
          <div className="no-results-icon"><ScanSearch size={31} /></div>
          <h1>No analysis found yet.</h1>
          <p>Upload a resume and job description to get your personalized report.</p>
          <Link href="/analyze" className="results-primary-button">
            Analyze my resume <ArrowRight size={17} />
          </Link>
        </section>
      </main>
    );
  }

  const candidate = data.candidate || {};
  const scores = data.scores || {};
  const skills = data.skills || { matched: [], missing: [] };
  const formatChecks = data.format_checks || {};
  const suggestions = data.suggestions || "No suggestions were generated.";
  const matchScore = Number(scores.match_score || 0);
  const matchStyle = getScoreStyle(matchScore);

  const topPriorities = [
    ...(skills.missing || []).slice(0, 2).map((skill) => `Add or demonstrate "${skill}"`),
    "Tailor your experience to the responsibilities in this role.",
    "Use measurable results in your strongest experience bullets.",
  ].slice(0, 3);

  return (
    <main className="results-page">
      <Navbar />

      <section className="results-hero">
        <div className="results-hero-orb results-hero-orb-one" />
        <div className="results-hero-orb results-hero-orb-two" />

        <div className="container-center results-container">
          <div className="results-heading">
            <div>
              <div className="results-eyebrow">
                <Sparkles size={14} />
                Analysis complete
              </div>

              <h1>
                {candidate.name ? `${candidate.name}'s resume report` : "Your resume report"}
              </h1>

              <p>
                Here is what is working, what needs attention, and where to focus before applying.
              </p>
            </div>

            <div
              className="overall-result-badge"
              style={{
                "--badge-color": matchStyle.color,
                "--badge-background": matchStyle.background,
              }}
            >
              <Target size={17} />
              <div>
                <span>Overall match</span>
                <strong>{matchStyle.label}</strong>
              </div>
            </div>
          </div>

          <section className="results-overview-card">
            <div className="main-match-score">
              <div
                className="main-score-ring"
                style={{
                  background: `conic-gradient(${matchStyle.color} ${matchScore * 3.6}deg, #e8f2eb 0deg)`,
                }}
              >
                <div>
                  <strong>{Math.round(matchScore)}%</strong>
                  <span>match score</span>
                </div>
              </div>

              <div className="main-score-copy">
                <span>Resume-to-job alignment</span>
                <h2>{matchStyle.label}</h2>
                <p>
                  {matchScore >= 70
                    ? "Your experience already aligns well with this role. Focus on making the strongest evidence easier to spot."
                    : "There is a clear opportunity to tailor your resume more closely to this job description."}
                </p>
              </div>
            </div>

            <div className="results-overview-divider" />

            <div className="quick-result-stat">
              <strong>{skills.matched?.length || 0}</strong>
              <span>matching skills</span>
            </div>

            <div className="quick-result-stat warning-stat">
              <strong>{skills.missing?.length || 0}</strong>
              <span>skills to strengthen</span>
            </div>
          </section>

          <section className="result-score-grid">
            <ScoreCard label="Match score" score={scores.match_score} icon={Target} />
            <ScoreCard label="ATS score" score={scores.ats_score} icon={ScanSearch} delay={80} />
            <ScoreCard label="Keyword score" score={scores.keyword_score} icon={Award} delay={160} />
            <ScoreCard label="Format score" score={scores.format_score} icon={CheckCircle2} delay={240} />
          </section>

          <section className="results-content-grid">
            <div className="results-main-column">
              <article className="result-panel priorities-panel">
                <div className="result-panel-heading">
                  <div className="result-panel-icon priority-icon"><Lightbulb size={19} /></div>
                  <div>
                    <span>Start here</span>
                    <h2>Your top priorities</h2>
                  </div>
                </div>

                <div className="priority-list">
                  {topPriorities.map((priority, index) => (
                    <div className="priority-item" key={priority}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <p>{priority}</p>
                      <ChevronRight size={18} />
                    </div>
                  ))}
                </div>
              </article>

              <article className="result-panel skills-panel">
                <div className="result-panel-heading">
                  <div className="result-panel-icon skills-icon"><Award size={19} /></div>
                  <div>
                    <span>Skill alignment</span>
                    <h2>Skills that shape your match</h2>
                  </div>
                </div>

                <div className="skills-result-grid">
                  <div className="skills-group matched-skills-group">
                    <div className="skills-group-heading">
                      <CheckCircle2 size={17} />
                      <h3>Already matched</h3>
                      <span>{skills.matched?.length || 0}</span>
                    </div>

                    <div className="result-chip-list">
                      {skills.matched?.length ? (
                        skills.matched.map((skill) => (
                          <span className="result-chip result-chip-green" key={skill}>{skill}</span>
                        ))
                      ) : (
                        <p className="empty-chip-message">No matched skills were detected.</p>
                      )}
                    </div>
                  </div>

                  <div className="skills-group missing-skills-group">
                    <div className="skills-group-heading">
                      <CircleAlert size={17} />
                      <h3>Skills to strengthen</h3>
                      <span>{skills.missing?.length || 0}</span>
                    </div>

                    <div className="result-chip-list">
                      {skills.missing?.length ? (
                        skills.missing.map((skill) => (
                          <span className="result-chip result-chip-red" key={skill}>{skill}</span>
                        ))
                      ) : (
                        <p className="empty-chip-message">No missing skills were detected.</p>
                      )}
                    </div>
                  </div>
                </div>
              </article>

              <article className="result-panel suggestions-panel">
                <div className="result-panel-heading">
                  <div className="result-panel-icon suggestion-icon"><Sparkles size={19} /></div>
                  <div>
                    <span>AI guidance</span>
                    <h2>How to improve this application</h2>
                  </div>
                </div>

                <div className="suggestions-text">{suggestions}</div>
              </article>
            </div>

            <aside className="results-side-column">
              <article className="result-panel candidate-panel">
                <div className="result-panel-heading">
                  <div className="result-panel-icon user-icon"><UserRound size={19} /></div>
                  <div>
                    <span>Candidate profile</span>
                    <h2>Resume details</h2>
                  </div>
                </div>

                <div className="candidate-details">
                  <div><span>Name</span><strong>{candidate.name || "Not detected"}</strong></div>
                  <div><span>Email</span><strong>{candidate.email || "Not detected"}</strong></div>
                  <div><span>Phone</span><strong>{candidate.phone || "Not detected"}</strong></div>
                  <div>
                    <span>Experience</span>
                    <strong>
                      {candidate.years_experience
                        ? `${candidate.years_experience} years`
                        : "Not detected"}
                    </strong>
                  </div>
                </div>
              </article>

              <article className="result-panel checks-panel">
                <div className="result-panel-heading">
                  <div className="result-panel-icon format-icon"><FileDown size={19} /></div>
                  <div>
                    <span>ATS readiness</span>
                    <h2>Format checks</h2>
                  </div>
                </div>

                <div className="format-check-list">
                  {Object.entries(formatChecks).map(([key, value]) => (
                    <div className={`format-check ${value ? "passed-check" : "failed-check"}`} key={key}>
                      {value ? <CheckCircle2 size={17} /> : <XCircle size={17} />}
                      <span>{key.replace(/_/g, " ")}</span>
                    </div>
                  ))}
                </div>
              </article>

              <div className="results-actions">
                <Link href="/analyze" className="results-primary-button">
                  Analyze another <ArrowRight size={16} />
                </Link>
                <button type="button" className="results-outline-button" onClick={() => window.print()}>
                  <FileDown size={16} /> Save as PDF
                </button>
              </div>
            </aside>
          </section>
        </div>
      </section>
    </main>
  );
}