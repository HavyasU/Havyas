import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
export default function Services() {
  const [allServices, setAllServices] = useState<any[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'services'), (snap) => {
      setAllServices(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="pt-32 pb-16 border-b border-slate-100 bg-slate-50">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight mb-4">
            Our Services
          </h1>
          <p className="text-slate-500 text-lg max-w-xl">
            Comprehensive survey services engineered for accuracy across every sector and terrain.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-20 pb-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {allServices.map((svc, idx) => (
              <div
                key={idx}
                className="group relative rounded-2xl overflow-hidden h-64 border border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer"
              >
                <img
                  src={svc.img}
                  alt={svc.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-cyan-400/60 rounded-2xl transition-colors duration-500 pointer-events-none" />

                <div className="relative h-full flex flex-col justify-end p-6">
                  <h3 className="font-bold text-white text-lg leading-tight pr-6">
                    {svc.title}
                  </h3>
                  <ArrowUpRight
                    size={20}
                    className="absolute top-6 right-6 text-white/50 group-hover:text-cyan-400 group-hover:rotate-45 transition-all duration-300"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-slate-50 relative overflow-hidden border-t border-slate-100">
        <div className="absolute inset-0 blueprint-grid opacity-20 pointer-events-none mix-blend-multiply" />
        <div className="max-w-4xl mx-auto px-6 lg:px-10 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">
            Need a custom survey solution?
          </h2>
          <p className="text-slate-600 text-lg mb-8">
            Our engineering team can scope tailored solutions for complex, non-standard requirements.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-[#1976ff] hover:bg-slate-900 text-white px-8 py-4 rounded-full font-bold transition-all shadow-lg shadow-blue-600/30"
          >
            Contact Us <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
