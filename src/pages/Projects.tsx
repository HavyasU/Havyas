import { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
const categories = ['All', 'Infrastructure', 'Hydrographic', 'Industrial', 'Aviation', 'Energy', 'Government'];

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'projects'), (snap) => {
      setAllProjects(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filtered = activeFilter === 'All'
    ? allProjects
    : allProjects.filter(p => p.category === activeFilter);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#1976ff] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="pt-32 pb-20 bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="section-label">Our Portfolio</span>
          <h1 className="section-heading mb-6">Engineering Projects</h1>
          <p className="text-xl text-slate-500 max-w-2xl leading-relaxed">
            Explore our portfolio of complex geospatial engineering engagements across the Middle East and GCC region.
          </p>
        </div>
      </section>

      {/* Filter */}
      <section className="py-10 border-b border-slate-100 sticky top-20 bg-white z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  activeFilter === cat
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((project, idx) => (
              <div key={idx} className="group block relative h-[320px] rounded-[24px] overflow-hidden cursor-pointer shadow-lg">
                {/* Background Image - Add img to the project objects in allProjects if missing, but since we don't have it, let's use a generic or placeholder based on category */}
                <div className={`absolute inset-0 w-full h-full ${project.color} bg-opacity-20`}>
                  <img 
                    src={project.img || 'https://images.unsplash.com/photo-1541888087425-ce81df8219fa?w=800&q=80'} 
                    alt={project.title} 
                    className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700 ease-out mix-blend-multiply" 
                  />
                </div>
                
                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1118] via-[#0a1118]/60 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end z-10">
                  <span className="text-cyan-400 text-[10px] font-bold uppercase tracking-widest mb-2 block">
                    {project.category}
                  </span>
                  
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-4 leading-tight group-hover:text-cyan-100 transition-colors">
                    {project.title}
                  </h3>
                  
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm text-white/90 text-[11px] font-mono font-semibold">
                      {project.location}
                    </span>
                    <span className="px-3 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm text-white/90 text-[11px] font-mono font-semibold">
                      {project.year}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#050f1c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-black text-white mb-4">Have a complex project?</h2>
          <p className="text-slate-400 text-lg mb-8">Let us help you deliver it with precision.</p>
          <Link to="/contact" className="inline-flex items-center gap-2 bg-[#1976ff] text-white px-8 py-4 rounded-full font-bold hover:bg-cyan-400 hover:text-slate-950 transition-all shadow-xl shadow-blue-600/30">
            Discuss Your Project <ArrowUpRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
