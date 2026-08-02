// ============================================
// Navbar — Responsive, dark/light theme, section links matching original styles
// ============================================
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sun, Moon, Menu, X } from "lucide-react"; // Fallback if FA is loading

const navLinks = [
  { href: "#education", label: "Education" },
  { href: "#skills", label: "Skills" },
  { href: "#services", label: "Services" },
  { href: "#projects", label: "Projects" },
];

export default function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const pathname = usePathname();

  // Hide Navbar in Admin pages
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  /* eslint-disable react-hooks/rules-of-hooks */
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const initialTheme = savedTheme || "dark";
    setTheme(initialTheme);
    document.documentElement.setAttribute("data-theme", initialTheme);
    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);
  /* eslint-enable react-hooks/rules-of-hooks */

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const isHomePage = pathname === "/";

  const getLinkHref = (hash: string) => {
    return isHomePage ? hash : `/${hash}`;
  };

  return (
    <>
      <nav className="navbar">
        <div className="container nav-container">
          {/* Logo */}
          <Link href="/" className="logo">
            Havyas U<span>.</span>
          </Link>

          {/* Centered Desktop Links */}
          <ul className="nav-links desktop-only">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={getLinkHref(link.href)}>{link.label}</Link>
              </li>
            ))}
          </ul>

          {/* Action elements on Right */}
          <div className="nav-actions">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="theme-toggle"
              aria-label="Toggle theme"
            >
              <i
                className={`fa-solid ${theme === "dark" ? "fa-sun" : "fa-moon"}`}
              ></i>
            </button>

            {/* CTA Button */}
            <Link
              href={getLinkHref("#contact")}
              className="cta-btn desktop-only"
            >
              START A PROJECT <span className="arrow">↗</span>
            </Link>

            {/* Mobile Menu Btn */}
            <div
              className="mobile-menu-btn"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
              <i
                className={`fa-solid ${isMobileOpen ? "fa-xmark" : "fa-bars"}`}
              ></i>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Nav Overlay */}
      <div className={`mobile-nav-overlay ${isMobileOpen ? "active" : ""}`}>
        <div className="mobile-nav-links">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={getLinkHref(link.href)}
              className="mobile-link"
              onClick={() => setIsMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={getLinkHref("#contact")}
            className="cta-btn mt-4 inline-flex items-center justify-center text-center"
            onClick={() => setIsMobileOpen(false)}
          >
            START A PROJECT <span className="arrow">↗</span>
          </Link>
        </div>
      </div>
    </>
  );
}
