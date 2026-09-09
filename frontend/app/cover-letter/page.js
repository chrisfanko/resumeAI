"use client";

import { useRef, useState } from "react";
import axios from "axios";
import Navbar from "../Navbar";
import {
  AlertCircle,
  BriefcaseBusiness,
  Check,
  Copy,
  Download,
  FileText,
  Loader2,
  Mail,
  Sparkles,
  UploadCloud,
  WandSparkles,
  X,
} from "lucide-react";

export default function CoverLetter() {
  const fileInput = useRef(null);
  const [file, setFile] = useState(null);
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const selectFile = (selectedFile) => {
    if (!selectedFile) return;

    if (!/\.(pdf|docx)$/i.test(selectedFile.name)) {
      setError("Please upload a PDF or DOCX resume.");
      return;
    }

    setFile(selectedFile);
    setError("");
  };

  const generateLetter = async () => {
    if (!file || !jobTitle.trim() || !companyName.trim() || !jobDescription.trim()) {
      setError("Add your resume, job title, company name, and job description.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("job_title", jobTitle);
      formData.append("company_name", companyName);
      formData.append("job_description", jobDescription);

      const response = await axios.post("/api/cover-letter", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setCoverLetter(response.data.cover_letter);
    } catch (requestError) {
      setError(
        requestError.response?.data?.detail ||
          "We could not generate your cover letter. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const copyLetter = async () => {
    await navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const downloadLetter = () => {
    const blob = new Blob([coverLetter], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${companyName || "cover-letter"}-cover-letter.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="letter-page">
      <Navbar />

      <section className="letter-shell">
        <div className="container-center">
          <header className="letter-header">
            <div className="letter-eyebrow"><Sparkles size={14} /> AI cover letter</div>
            <h1>Write a letter worth reading.</h1>
            <p>
              Give us your resume and the role. ResumeAI will create a tailored,
              professional first draft you can make your own.
            </p>
          </header>

          <div className="letter-layout">
            <section className="letter-form-panel">
              <div className="letter-section-heading">
                <div><FileText size={18} /></div>
                <div>
                  <span>Step 01</span>
                  <h2>Your resume</h2>
                </div>
              </div>

              <div
                className={`letter-upload ${dragOver ? "is-dragging" : ""} ${file ? "has-file" : ""}`}
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
                  className="sr-only"
                  type="file"
                  accept=".pdf,.docx"
                  onChange={(event) => selectFile(event.target.files?.[0])}
                />

                {file ? (
                  <div className="letter-file-selected">
                    <div><FileText size={20} /></div>
                    <strong>{file.name}</strong>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setFile(null);
                      }}
                      aria-label="Remove uploaded resume"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="letter-upload-icon"><UploadCloud size={25} /></div>
                    <strong>Upload your resume</strong>
                    <span>PDF or DOCX · Click or drag it here</span>
                  </>
                )}
              </div>

              <div className="letter-section-heading letter-details-heading">
                <div><BriefcaseBusiness size={18} /></div>
                <div>
                  <span>Step 02</span>
                  <h2>Tell us about the role</h2>
                </div>
              </div>

              <div className="letter-input-grid">
                <label>
                  <span>Job title</span>
                  <input
                    value={jobTitle}
                    onChange={(event) => setJobTitle(event.target.value)}
                    placeholder="e.g. Frontend Developer"
                  />
                </label>

                <label>
                  <span>Company name</span>
                  <input
                    value={companyName}
                    onChange={(event) => setCompanyName(event.target.value)}
                    placeholder="e.g. Acme Studio"
                  />
                </label>

                <label className="letter-full-width">
                  <span>Job description</span>
                  <textarea
                    value={jobDescription}
                    onChange={(event) => setJobDescription(event.target.value)}
                    placeholder="Paste the complete job description here..."
                  />
                  <small>
                    {jobDescription.trim().split(/\s+/).filter(Boolean).length} words
                  </small>
                </label>
              </div>

              {error && (
                <div className="letter-error">
                  <AlertCircle size={17} />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="button"
                className="letter-generate-button"
                disabled={loading}
                onClick={generateLetter}
              >
                {loading ? (
                  <><Loader2 size={17} className="animate-spin" /> Writing your letter…</>
                ) : (
                  <><WandSparkles size={17} /> Generate cover letter</>
                )}
              </button>
            </section>

            <aside className="letter-preview-panel">
              <div className="letter-preview-top">
                <div>
                  <span>Live output</span>
                  <h2>Cover letter preview</h2>
                </div>
                <Mail size={19} />
              </div>

              {!coverLetter ? (
                <div className="letter-empty-preview">
                  <div><Mail size={31} /></div>
                  <h3>Your tailored letter will appear here.</h3>
                  <p>
                    It will use your resume, the job requirements, and company
                    name to create a strong, relevant starting point.
                  </p>
                  <ul>
                    <li>Professional and personal tone</li>
                    <li>Relevant experience highlighted</li>
                    <li>Clear call to action</li>
                  </ul>
                </div>
              ) : (
                <div className="letter-generated">
                  <div className="letter-actions">
                    <span>Generated draft</span>
                    <div>
                      <button type="button" onClick={copyLetter}>
                        {copied ? <Check size={15} /> : <Copy size={15} />}
                        {copied ? "Copied" : "Copy"}
                      </button>
                      <button type="button" onClick={downloadLetter}>
                        <Download size={15} /> Download
                      </button>
                    </div>
                  </div>
                  <pre>{coverLetter}</pre>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}