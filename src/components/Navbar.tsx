import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  if (location.pathname.startsWith('/admin')) return null;

  const isHome = location.pathname === '/';



  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[9000] transition-all duration-500 py-3 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-[1400px] mx-auto px-6 lg:px-10 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className={`font-black text-2xl tracking-tight flex items-center transition-colors duration-500 ${!scrolled && isHome ? 'text-white' : 'text-slate-900'}`}>
          AFSEC<span className="text-[#1976ff]">.</span>
        </Link>

        {/* Desktop Nav Items */}
        <div className="hidden lg:flex items-center gap-9">
          <Link
            to="/about"
            className={`text-sm font-semibold transition-colors duration-300 cursor-pointer ${!scrolled && isHome ? 'text-white/80 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
          >
            About
          </Link>
          <Link
            to="/services"
            className={`text-sm font-semibold transition-colors duration-300 cursor-pointer ${!scrolled && isHome ? 'text-white/80 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Services
          </Link>
          <Link
            to="/projects"
            className={`text-sm font-semibold transition-colors duration-300 cursor-pointer ${!scrolled && isHome ? 'text-white/80 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Projects
          </Link>
          <Link
            to="/contact"
            className={`text-sm font-semibold transition-colors duration-300 cursor-pointer ${!scrolled && isHome ? 'text-white/80 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Contact
          </Link>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <Link
            to="/contact"
            className="hidden sm:inline-flex items-center rounded-full bg-[#1976ff] hover:bg-slate-900 text-white text-sm font-semibold px-6 py-2.5 transition-all duration-300 shadow-md shadow-blue-500/30"
          >
            Contact
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden p-2 transition-colors duration-300 ${!scrolled && isHome ? 'text-white' : 'text-slate-900'}`}
            aria-label="Open menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-6 py-6 space-y-4">
          <Link
            to="/about"
            onClick={() => setIsOpen(false)}
            className="block text-slate-600 hover:text-slate-900 text-base font-semibold py-2"
          >
            About
          </Link>
          <Link
            to="/services"
            onClick={() => setIsOpen(false)}
            className="block text-slate-600 hover:text-slate-900 text-base font-semibold py-2"
          >
            Services
          </Link>
          <Link
            to="/projects"
            onClick={() => setIsOpen(false)}
            className="block text-slate-600 hover:text-slate-900 text-base font-semibold py-2"
          >
            Projects
          </Link>
          <Link
            to="/contact"
            onClick={() => setIsOpen(false)}
            className="block text-slate-600 hover:text-slate-900 text-base font-semibold py-2"
          >
            Contact
          </Link>

          <Link
            to="/contact"
            onClick={() => setIsOpen(false)}
            className="block w-full bg-[#1976ff] text-white text-center py-3.5 rounded-full font-bold shadow-lg shadow-blue-600/30 mt-4"
          >
            Contact Us
          </Link>
        </div>
      )}
    </header>
  );
}
