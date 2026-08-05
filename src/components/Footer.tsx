import { Link, useLocation } from 'react-router-dom';

const serviceLinks = ['Land Survey', 'Hydrographic', 'Aerial Mapping', '3D Laser Scanning', 'Utility Mapping', 'GIS Solutions'];
const companyLinks = [
  { name: 'About', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Projects', path: '/projects' },
  { name: 'Contact', path: '/contact' },
];

export default function Footer() {
  const location = useLocation();
  if (location.pathname.startsWith('/admin')) return null;

  return (
    <footer className="bg-slate-950 text-white pt-20 pb-10 border-t border-slate-900">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-16 border-b border-slate-800">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-block mb-5">
              <span className="text-3xl font-black text-white">AFSEC</span><span className="text-cyan-400 text-3xl font-black">.</span>
            </Link>
            <p className="text-xs text-cyan-400 font-bold uppercase tracking-[0.2em] mb-5">Al Fayha Survey Engineering Consultancy</p>
            <p className="text-slate-400 text-sm leading-relaxed">State-of-the-art surveying, mapping, and engineering consultation services for infrastructure development.</p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold text-white mb-6 text-sm uppercase tracking-widest">Services</h4>
            <ul className="space-y-3">
              {serviceLinks.map((name) => (
                <li key={name}>
                  <Link to="/services" className="text-slate-400 hover:text-white text-sm transition-colors">{name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-white mb-6 text-sm uppercase tracking-widest">Company</h4>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-slate-400 hover:text-white text-sm transition-colors">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-white mb-6 text-sm uppercase tracking-widest">Contact Info</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li>
                <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Phone</div>
                +971 4 123 4567
              </li>
              <li>
                <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Email</div>
                info@afsec.com
              </li>
              <li>
                <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Address</div>
                DIFC Gate Building<br />Dubai, UAE
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">&copy; {new Date().getFullYear()} AFSEC. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="text-slate-500 text-sm cursor-pointer hover:text-white transition-colors">Terms of Service</span>
            <span className="text-slate-500 text-sm cursor-pointer hover:text-white transition-colors">Privacy Policy</span>
            <Link to="/admin" className="text-slate-600 hover:text-slate-400 text-sm transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
