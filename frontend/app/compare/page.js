"use client";

import { useRef, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Navbar from "../Navbar";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  FileText,
  Loader2,
  Plus,
  Sparkles,
  Target,
  Trash2,
  Trophy,
  UploadCloud,
  X,
  XCircle,
} from "lucide-react";

const newJob = () => ({ title: "", description: "" });

function scoreTone(score) {
  if (score >= 70) return "green";
  if (score >= 40) return "amber";
  return "red";
}

export default function Compare() {
  const fileInput = useRef(null);
  const [file, setFile] = useState(null);
  const [jobs, setJobs] = useState([newJob(), newJob()]);
  const [dragOver, setDragOver] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const setJob = (index, field, value) => {
    setJobs((current) =>
      current.map((job, jobIndex) =>
        jobIndex === index ? { ...job, [field]: value } : job
      )
    );
  };

  const selectFile = (selectedFile) => {
    if (!selectedFile) return;

    if (!/\.(pdf|docx)$/i.test(selectedFile.name)) {
      setError("Please upload a PDF or DOCX resume.");
      return;
    }

    setFile(selectedFile);
    setError("");
  };

  const compareJobs = async () => {
    const validJobs = jobs.filter((job) => job.description.trim());

    if (!file) {
      setError("Upload your resume before comparing jobs.");
      return;
    }

    if (validJobs.length < 2) {
      setError("Add at least two complete job descriptions.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("job_descriptions", JSON.stringify(validJobs));

      const response = await axios.post("/api/compare", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setResults(response.data);
    } catch (requestError) {
      setError(
        requestError.response?.data?.detail ||
          "We could not compare these jobs. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="compare-page">
      <Navbar />

      <section className="compare-shell">
        <div className="container-center">
          <header className="compare-header">
            <div>
              <div className="compare-eyebrow">
                <Sparkles size={14} />
                Job comparison
              </div>
              <h1>Find the role that fits you best.</h1>
              <p>
                Compare your resume with two or three job descriptions and
                focus your energy on the strongest opportunity.
              </p>
            </div>

            {!results && (
              <div className="compare-header-note">
                <Target size={18} />
                <span>Compare up to 3 jobs</span>
              </div>
            )}
          </header>

          {!results ? (
            <div className="compare-form-layout">
              <aside className="compare-sidebar">
                <div className="compare-step-label">Step 01</div>
                <h2>Add your resume once.</h2>
                <p>We will compare the same resume against every role.</p>

                <div
                  className={`compare-upload ${dragOver ? "is-dragging" : ""} ${
                    file ? "has-file" : ""
                  }`}
                  onClick={() => fileInput.current?.click()}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(event) => {
                    event.preventDefault();
                    setDragOver(false);
                    selectFile(event.dataTransfer.files?.[0]);
                  }}
                >
                  <input
                    ref={fileInput}
                    type="file"
                    accept=".pdf,.docx"
                    className="sr-only"
                    onChange={(event) => selectFile(event.target.files?.[0])}
                  />

                  {file ? (
                    <div className="compare-file-selected">
                      <div><FileText size={20} /></div>
                      <span>{file.name}</span>
                      <button
                        type="button"
                        aria-label="Remove resume"
                        onClick={(event) => {
                          event.stopPropagation();
                          setFile(null);
                        }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="compare-upload-icon"><UploadCloud size={24} /></div>
                      <strong>Upload resume</strong>
                      <span>PDF or DOCX</span>
                    </>
                  )}
                </div>

                <div className="compare-side-tip">
                  <CheckCircle2 size={16} />
                  <p>Use full job descriptions for the most useful skill comparison.</p>
                </div>
              </aside>

              <section className="compare-jobs-panel">
                <div className="compare-panel-heading">
                  <div>
                    <span>Step 02</span>
                    <h2>Add the jobs you are considering</h2>
                  </div>

                  {jobs.length < 3 && (
                    <button
                      type="button"
                      className="compare-add-job"
                      onClick={() => setJobs((current) => [...current, newJob()])}
                    >
                      <Plus size={16} /> Add job
                    </button>
                  )}
                </div>

                <div className="compare-jobs-grid">
                  {jobs.map((job, index) => (
                    <article className="compare-job-card" key={index}>
                      <div className="compare-job-card-top">
                        <span>Job {String(index + 1).padStart(2, "0")}</span>
                        {jobs.length > 2 && (
                          <button
                            type="button"
                            aria-label={`Remove job ${index + 1}`}
                            onClick={() =>
                              setJobs((current) =>
                                current.filter((_, jobIndex) => jobIndex !== index)
                              )
                            }
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>

                      <label>
                        <span>Job title</span>
                        <input
                          value={job.title}
                          onChange={(event) => setJob(index, "title", event.target.value)}
                          placeholder="e.g. Product Designer"
                        />
                      </label>

                      <label>
                        <span>Job description</span>
                        <textarea
                          value={job.description}
                          onChange={(event) =>
                            setJob(index, "description", event.target.value)
                          }
                          placeholder="Paste the full job description here..."
                        />
                      </label>

                      <p>{job.description.trim().split(/\s+/).filter(Boolean).length} words</p>
                    </article>
                  ))}
                </div>

                {error && (
                  <div className="compare-error">
                    <AlertCircle size={17} />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="button"
                  className="compare-submit"
                  onClick={compareJobs}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 size={17} className="animate-spin" />
                      Comparing opportunities…
                    </>
                  ) : (
                    <>
                      Compare jobs <ArrowRight size={17} />
                    </>
                  )}
                </button>
              </section>
            </div>
          ) : (
            <div className="compare-results">
              <section className="compare-winner">
                <div className="compare-winner-icon"><Trophy size={24} /></div>
                <div>
                  <span>Best opportunity</span>
                  <h2>{results.best_match || "Top match"}</h2>
                  <p>
                    This role has the strongest resume alignment based on skills,
                    keywords, and overall semantic similarity.
                  </p>
                </div>
                <div className="compare-winner-score">
                  <strong>{Math.round(results.results?.[0]?.match_score || 0)}%</strong>
                  <span>match score</span>
                </div>
              </section>

              <section className="compare-results-heading">
                <div>
                  <span>Ranked results</span>
                  <h2>Where your resume has the most potential</h2>
                </div>
                <p>{results.total_jobs || 0} jobs compared</p>
              </section>

              <div className="compare-result-grid">
                {(results.results || []).map((job, index) => (
                  <article
                    key={`${job.job_title}-${index}`}
                    className={`compare-result-card ${index === 0 ? "is-winner" : ""}`}
                  >
                    <div className="compare-rank">
                      <span>#{job.rank || index + 1}</span>
                      {index === 0 && <Trophy size={16} />}
                    </div>

                    <h3>{job.job_title || `Job ${index + 1}`}</h3>

                    <div className="compare-score-row">
                      <div>
                        <span>Match</span>
                        <strong className={scoreTone(job.match_score)}>
                          {Math.round(job.match_score || 0)}%
                        </strong>
                      </div>
                      <div>
                        <span>ATS</span>
                        <strong className={scoreTone(job.ats_score)}>
                          {Math.round(job.ats_score || 0)}%
                        </strong>
                      </div>
                    </div>

                    <div className="compare-bar-track">
                      <div
                        className={`compare-bar-fill ${scoreTone(job.match_score)}`}
                        style={{ width: `${Math.max(0, Math.min(job.match_score || 0, 100))}%` }}
                      />
                    </div>

                    <div className="compare-skill-section">
                      <span><CheckCircle2 size={14} /> Matched skills</span>
                      <div>
                        {job.matched_skills?.length ? (
                          job.matched_skills.slice(0, 6).map((skill) => (
                            <em className="compare-chip matched" key={skill}>{skill}</em>
                          ))
                        ) : (
                          <p>No clear matches detected.</p>
                        )}
                      </div>
                    </div>

                    <div className="compare-skill-section">
                      <span><XCircle size={14} /> Skills to strengthen</span>
                      <div>
                        {job.missing_skills?.length ? (
                          job.missing_skills.slice(0, 6).map((skill) => (
                            <em className="compare-chip missing" key={skill}>{skill}</em>
                          ))
                        ) : (
                          <p>No major skill gaps detected.</p>
                        )}
                      </div>
                    </div>

                    <div className={`compare-recommendation ${scoreTone(job.match_score)}`}>
                      {job.recommendation}
                    </div>
                  </article>
                ))}
              </div>

              <div className="compare-result-actions">
                <button type="button" onClick={() => setResults(null)}>
                  Compare different jobs
                </button>
                <Link href="/analyze">
                  Run a detailed analysis <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}