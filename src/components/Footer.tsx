// ============================================
// Footer — Simple, elegant links matching original styles
// ============================================
'use client';

import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  // Hide Footer on Admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="footer">
      <div className="container footer-content">
        
        {/* Social Links */}
        <div className="social-links">
          <a
            href="https://www.linkedin.com/in/havyas-u-1220b3230/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <i className="fa-brands fa-linkedin-in"></i>
          </a>
          <a
            href="https://github.com/HavyasU"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <i className="fa-brands fa-github"></i>
          </a>
        </div>

        {/* Copy */}
        <p>&copy; {new Date().getFullYear()} Havyas U. All rights reserved.</p>

        {/* Info */}
        <p className="contact-info">
          <span>havyasu2005@gmail.com</span>
          <span> • </span>
          <span>+91 7483989780</span>
        </p>

      </div>
    </footer>
  );
}
