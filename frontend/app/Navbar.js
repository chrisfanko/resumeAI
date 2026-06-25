"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FileText, Menu, X, LayoutDashboard, ScanText, GitCompare, Mail, PenLine } from "lucide-react";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName]     = useState("");
  const [menuOpen, setMenuOpen]     = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const name  = localStorage.getItem("user_name");
    if (token) { setIsLoggedIn(true); setUserName(name || "User"); }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_email");
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  const navLinks = [
    { href: "/analyze",        label: "Analyze",        icon: ScanText },
    { href: "/compare",        label: "Compare Jobs",   icon: GitCompare },
    { href: "/cover-letter",   label: "Cover Letter",   icon: Mail },
    { href: "/resume-builder", label: "Resume Builder", icon: PenLine },
    { href: "/dashboard",      label: "Dashboard",      icon: LayoutDashboard },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
          <div className="logo-mark">
            <FileText size={16} color="white" strokeWidth={2.5} />
          </div>
          <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: 17, color: "#111827", letterSpacing: "-0.02em" }}>
            ResumeAI
          </span>
        </Link>

        {/* Desktop nav */}
        {isLoggedIn && (
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href} className="btn-ghost text-sm">
                {label}
              </Link>
            ))}
          </div>
        )}

        {!isLoggedIn && (
          <div className="hidden md:flex items-center gap-1">
            <Link href="/about" className="btn-ghost text-sm">How it works</Link>
          </div>
        )}

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <span style={{ fontSize: 13, color: "#64748b" }}>Hi, {userName}</span>
              <button onClick={handleSignOut} className="btn-secondary" style={{ padding: "8px 18px" }}>Sign out</button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost">Sign in</Link>
              <Link href="/register" className="btn-primary" style={{ padding: "9px 20px" }}>Get started free</Link>
            </>
          )}
        </div>

        {/* Mobile burger */}
        <button className="md:hidden btn-ghost" onClick={() => setMenuOpen(!menuOpen)} style={{ padding: "8px" }}>
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-6 py-4 space-y-1">
          {isLoggedIn ? (
            <>
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href} className="flex items-center gap-2 py-2.5 text-sm text-slate-600 hover:text-green-700 font-medium transition">
                  <Icon size={15} /> {label}
                </Link>
              ))}
              <div className="divider" />
              <button onClick={handleSignOut} className="text-sm text-slate-500 py-2">Sign out</button>
            </>
          ) : (
            <>
              <Link href="/about" className="block py-2.5 text-sm text-slate-600">How it works</Link>
              <Link href="/login" className="block py-2.5 text-sm text-slate-600">Sign in</Link>
              <Link href="/register" className="btn-primary mt-2 w-full justify-center">Get started free</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}