"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import Navbar from "../Navbar";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  FileText,
  FileUp,
  Loader2,
  LockKeyhole,
  ScanSearch,
  Sparkles,
  UploadCloud,
  X,
} from "lucide-react";

export default function Analyze() {
  const router = useRouter();
  const inputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");

  const chooseFile = (selectedFile) => {
    if (!selectedFile) return;

    const validExtensions = [".pdf", ".docx"];
    const isValid = validExtensions.some((extension) =>
      selectedFile.name.toLowerCase().endsWith(extension)
    );

    if (!isValid) {
      setError("Please choose a PDF or DOCX resume.");
      return;
    }

    setFile(selectedFile);
    setError("");
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragOver(false);
    chooseFile(event.dataTransfer.files?.[0]);
  };

  const handleSubmit = async () => {
    if (!file || !jobDescription.trim()) {
      setError("Add your resume and the job description to begin.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("job_description", jobDescription);

      const token = localStorage.getItem("token");

      const response = await axios.post("/api/analyze", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      localStorage.setItem("analysisResult", JSON.stringify(response.data));
      router.push("/results");
    } catch (requestError) {
      setError(
        requestError.response?.data?.detail ||
          "We could not analyze your resume. Confirm that you are signed in and the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="analysis-page">
      <Navbar />

      <section className="analysis-hero">
        <div className="analysis-orb analysis-orb-one" />
        <div className="analysis-orb analysis-orb-two" />

        <div className="container-center analysis-layout">
          <div className="analysis-form-area">
            <div className="analysis-eyebrow">
              <Sparkles size={14} />
              Resume analysis
            </div>

            <h1>See what your resume is missing.</h1>

            <p className="analysis-intro">
              Upload your resume and add a job description. We will compare
              them and show you practical improvements before you apply.
            </p>

            <div className="analysis-card">
              <div className="analysis-card-heading">
                <div className="analysis-number">01</div>
                <div>
                  <h2>Upload your resume</h2>
                  <p>PDF or DOCX, ready in seconds.</p>
                </div>
              </div>

              <div
                className={`resume-dropzone ${dragOver ? "is-dragging" : ""} ${
                  file ? "has-file" : ""
                }`}
                onClick={() => inputRef.current?.click()}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept=".pdf,.docx"
                  className="sr-only"
                  onChange={(event) => chooseFile(event.target.files?.[0])}
                />

                {file ? (
                  <div className="uploaded-file">
                    <div className="uploaded-file-icon">
                      <FileText size={23} />
                    </div>
                    <div className="uploaded-file-text">
                      <strong>{file.name}</strong>
                      <span>{(file.size / 1024 / 1024).toFixed(2)} MB uploaded</span>
                    </div>
                    <button
                      type="button"
                      className="remove-file-button"
                      aria-label="Remove uploaded resume"
                      onClick={(event) => {
                        event.stopPropagation();
                        setFile(null);
                      }}
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="upload-icon-wrap">
                      <UploadCloud size={27} />
                    </div>
                    <strong>Drop your resume here</strong>
                    <span>or click to browse your files</span>
                    <small>PDF or DOCX · Maximum 10 MB</small>
                  </>
                )}
              </div>
            </div>

            <div className="analysis-card">
              <div className="analysis-card-heading">
                <div className="analysis-number">02</div>
                <div>
                  <h2>Add the job description</h2>
                  <p>Paste the full description for the best analysis.</p>
                </div>
              </div>

              <textarea
                className="analysis-textarea"
                value={jobDescription}
                onChange={(event) => setJobDescription(event.target.value)}
                placeholder="Paste the job description here..."
              />

              <div className="textarea-footer">
                <span>{jobDescription.trim().split(/\s+/).filter(Boolean).length} words</span>
                <span>More detail gives you better results</span>
              </div>
            </div>

            {error && (
              <div className="analysis-error">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <button
              type="button"
              className="analyze-submit-button"
              disabled={loading}
              onClick={handleSubmit}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Analyzing your resume...
                </>
              ) : (
                <>
                  Analyze my resume <ArrowRight size={18} />
                </>
              )}
            </button>

            <div className="analysis-security-note">
              <LockKeyhole size={14} />
              Your document is used only for this analysis.
            </div>
          </div>

          <aside className="analysis-side-panel">
            <div className="analysis-photo-wrap">
              <Image
                src="/images/markus-winkler-7iSEHWsxPLw-unsplash.jpg"
                alt="Resume and laptop on a desk"
                width={900}
                height={650}
              />
              <div className="analysis-photo-overlay" />
            </div>

            <div className="side-panel-content">
              <div className="side-panel-label">
                <ScanSearch size={16} />
                What you will receive
              </div>

              <h2>Your application, made clearer.</h2>

              <div className="analysis-benefits">
                <div>
                  <CheckCircle2 size={19} />
                  <span>Resume-to-job match score</span>
                </div>
                <div>
                  <CheckCircle2 size={19} />
                  <span>Missing skills and keywords</span>
                </div>
                <div>
                  <CheckCircle2 size={19} />
                  <span>ATS and formatting feedback</span>
                </div>
                <div>
                  <CheckCircle2 size={19} />
                  <span>AI-powered improvement ideas</span>
                </div>
              </div>
            </div>

            <div className="analysis-mini-card">
              <div className="mini-score">87%</div>
              <div>
                <strong>Strong match</strong>
                <span>Example analysis result</span>
              </div>
              <FileUp size={20} />
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}