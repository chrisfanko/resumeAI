"use client";

import Link from "next/link";
import Image from "next/image";
import Navbar from "../Navbar";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  FileSearch,
  Lightbulb,
  ShieldCheck,
  Sparkles,
  Target,
  UploadCloud,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Upload your resume",
    text: "Start with the resume you already have. PDF and DOCX files are supported.",
    icon: UploadCloud,
  },
  {
    number: "02",
    title: "Add the target role",
    text: "Paste a job description so ResumeAI knows what the employer values.",
    icon: Target,
  },
  {
    number: "03",
    title: "Review clear guidance",
    text: "See match scores, missing skills, ATS checks, and improvement ideas.",
    icon: Lightbulb,
  },
];

const principles = [
  {
    title: "Practical feedback",
    text: "Clear recommendations you can use in your next application.",
    icon: CheckCircle2,
  },
  {
    title: "Better alignment",
    text: "Understand how your experience connects to a specific role.",
    icon: Target,
  },
  {
    title: "Built for job seekers",
    text: "Useful tools without unnecessary complexity or jargon.",
    icon: ShieldCheck,
  },
];

export default function About() {
  return (
    <main className="about-page">
      <Navbar />

      <section className="about-hero">
        <div className="about-orb about-orb-one" />
        <div className="about-orb about-orb-two" />

        <div className="container-center about-hero-layout">
          <div className="about-hero-copy">
            <div className="about-eyebrow">
              <Sparkles size={14} />
              How ResumeAI works
            </div>

            <h1>
              A clearer way to
              <span> prepare for your next role.</span>
            </h1>

            <p>
              ResumeAI helps job seekers turn a generic resume into an
              application that is focused, relevant, and easier for recruiters
              and ATS systems to understand.
            </p>

            <Link href="/analyze" className="about-primary-action">
              Analyze my resume <ArrowRight size={17} />
            </Link>
          </div>

          <div className="about-hero-image">
            <Image
              src="/images/markus-winkler-7iSEHWsxPLw-unsplash.jpg"
              alt="A resume next to a laptop"
              width={900}
              height={700}
              priority
            />
            <div className="about-image-card">
              <FileSearch size={19} />
              <div>
                <span>Resume review</span>
                <strong>Built around your target role</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-process-section">
        <div className="container-center">
          <div className="about-section-heading centered-about-heading">
            <div className="about-eyebrow">A simple process</div>
            <h2>Three steps to a stronger application.</h2>
            <p>Focus less on guessing and more on communicating your value.</p>
          </div>

          <div className="about-steps-grid">
            {steps.map(({ number, title, text, icon: Icon }) => (
              <article className="about-step-card" key={number}>
                <div className="about-step-top">
                  <span>{number}</span>
                  <div><Icon size={21} /></div>
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-story-section">
        <div className="container-center about-story-layout">
          <div className="about-story-image">
            <Image
              src="/images/glenn-carstens-peters-npxXWgQ33ZQ-unsplash.jpg"
              alt="Job seekers working together"
              width={800}
              height={680}
            />
          </div>

          <div className="about-story-copy">
            <div className="about-eyebrow">Designed for clarity</div>
            <h2>Your experience is valuable. Your resume should make that obvious.</h2>
            <p>
              The job search can feel like a black box. ResumeAI gives you a
              clearer picture of how your resume matches a role, which details
              need more emphasis, and where there is room to improve.
            </p>

            <div className="about-highlight-list">
              <div>
                <BarChart3 size={18} />
                <p><strong>Match scores</strong> show your current alignment.</p>
              </div>
              <div>
                <FileSearch size={18} />
                <p><strong>Skill-gap insights</strong> reveal what to strengthen.</p>
              </div>
              <div>
                <Lightbulb size={18} />
                <p><strong>AI suggestions</strong> help you make useful changes.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-principles-section">
        <div className="container-center">
          <div className="about-section-heading">
            <div className="about-eyebrow">What guides us</div>
            <h2>Career support that stays useful.</h2>
          </div>

          <div className="about-principles-grid">
            {principles.map(({ title, text, icon: Icon }) => (
              <article key={title}>
                <div><Icon size={20} /></div>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-cta-section">
        <div className="container-center about-cta-content">
          <div>
            <div className="about-eyebrow about-light-eyebrow">Ready when you are</div>
            <h2>See what your resume could do better.</h2>
            <p>Upload it, add a role, and get focused feedback in minutes.</p>
          </div>

          <Link href="/analyze" className="about-light-action">
            Start free analysis <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </main>
  );
}