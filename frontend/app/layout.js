import "./globals.css";

export const metadata = {
  title: "ResumeAI — AI Resume Analyzer",
  description: "Analyze your resume with AI. Get match scores, skill gaps, ATS scores and personalized suggestions.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}