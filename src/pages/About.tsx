import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

import { useSiteContent } from '../hooks/useSiteContent';

// Static timeline and stats removed; fetching from Firestore
const processSteps = [
  { id: '01', title: 'Planning & Scoping', desc: 'Understanding client objectives, assessing site constraints, and designing a tailored surveying and data acquisition strategy.' },
  { id: '02', title: 'Field Data Acquisition', desc: 'Deploying high-precision instrumentation and experienced survey crews to capture spatial data on-site under strict safety protocols.' },
  { id: '03', title: 'Processing & QA/QC', desc: 'Processing raw data using advanced software platforms and performing rigorous QA/QC checks to verify accuracy and resolve discrepancies.' },
  { id: '04', title: 'Delivery & Support', desc: 'Compiling client deliverables in requested formats (BIM, GIS, CAD) and providing post-delivery support for seamless integration.' },
];

const industries = [
  { icon: '🏗️', title: 'Infrastructure & Transport' },
  { icon: '⚡', title: 'Energy & Oil/Gas' },
  { icon: '🚢', title: 'Maritime & Ports' },
  { icon: '🏙️', title: 'Urban Development' },
  { icon: '🏛️', title: 'Government & Municipal' },
  { icon: '✈️', title: 'Aviation' },
  { icon: '🏛️', title: 'Cultural Heritage' },
  { icon: '⛏️', title: 'Mining & Quarrying' },
];

export default function About() {
  const statsData = useSiteContent('stats', { items: [
    { val: '25+', label: 'Years of Excellence' },
    { val: '15000+', label: 'Projects Completed' },
    { val: '5000+', label: 'Satisfied Clients' },
    { val: '100+', label: 'Team Members' },
  ]});

  const vmData = useSiteContent('vision_mission', {
    vision: { title: 'Our Vision', text: 'To be the Middle East\'s most trusted geospatial partner, setting the benchmark for precision and innovation.', image: '' },
    mission: { title: 'Our Mission', text: 'To deliver surveying and engineering solutions that enable infrastructure development with uncompromising accuracy.', image: '' }
  });

  return (
    <div className="bg-white">
      {/* ═══ ABOUT HERO ═══ */}
      <section className="pt-32 pb-28 border-b border-slate-100 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image & Badge */}
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-sm border border-slate-200">
                <img src="https://images.unsplash.com/photo-1691149210746-c6bbb40f4bf6?w=800&q=80" alt="Surveying Equipment" className="w-full h-[540px] object-cover hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="absolute -bottom-6 -right-4 sm:right-6 bg-slate-100 rounded-xl p-5 w-48 border border-slate-200 shadow-lg flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#1976ff]/10 flex items-center justify-center shrink-0">
                  <div className="w-4 h-4 rounded-[4px] bg-[#1976ff] rotate-45"></div>
                </div>
                <div>
                  <div className="font-black text-xl text-slate-900 leading-none">ISO 9001</div>
                  <div className="text-slate-500 text-xs font-medium mt-1">Certified Quality</div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="pt-8 lg:pt-0">
              <span className="text-[#1976ff] font-bold text-xs uppercase tracking-widest mb-4 block flex items-center gap-4 before:w-8 before:h-[2px] before:bg-[#1976ff]">
                ABOUT AFSEC
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-[64px] font-black text-[#050f1c] leading-[1.05] tracking-tight mb-6">
                Surveying beyond boundaries since 2000<span className="text-red-500">.</span>
              </h1>
              <p className="text-slate-500 text-lg leading-relaxed mb-10 pr-4">
                Al Fayha Survey Engineering Consultancy (AFSEC) is a premier surveying and geospatial engineering firm serving the Middle East. We combine decades of field expertise with cutting-edge technology to deliver millimeter-accurate data for the region's most critical infrastructure projects.
              </p>

              {/* Vision & Mission */}
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="p-7 bg-[#f8fafc] border border-slate-200 rounded-[20px] relative overflow-hidden group">
                  {vmData.mission?.image && <img src={vmData.mission.image} className="absolute inset-0 w-full h-full object-cover opacity-10 group-hover:opacity-20 transition-opacity" alt="Mission" />}
                  <div className="relative z-10">
                    <h3 className="text-[19px] font-bold text-slate-900 mb-3">{vmData.mission?.title || 'Our Mission'}</h3>
                    <p className="text-slate-500 text-[15px] leading-relaxed">
                      {vmData.mission?.text}
                    </p>
                  </div>
                </div>
                <div className="p-7 bg-[#f8fafc] border border-slate-200 rounded-[20px] relative overflow-hidden group">
                  {vmData.vision?.image && <img src={vmData.vision.image} className="absolute inset-0 w-full h-full object-cover opacity-10 group-hover:opacity-20 transition-opacity" alt="Vision" />}
                  <div className="relative z-10">
                    <h3 className="text-[19px] font-bold text-slate-900 mb-3">{vmData.vision?.title || 'Our Vision'}</h3>
                    <p className="text-slate-500 text-[15px] leading-relaxed">
                      {vmData.vision?.text}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ ANALYTICS BAR ═══ */}
      <section className="py-20 bg-slate-50 border-b border-slate-100">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-200">
            {statsData.items.map((s: any, i: number) => (
              <div key={i} className="py-4 text-center group cursor-default">
                <div className="text-4xl md:text-5xl lg:text-[56px] font-bold text-slate-900 mb-3">
                  {s.metric || s.val}
                </div>
                <div className="text-slate-500 font-medium tracking-wide text-sm md:text-[15px]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ INDUSTRIES WE SERVE ═══ */}
      <section className="py-28 bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Industries We Serve</h2>
            <p className="text-slate-500 text-lg">Built for every sector.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {industries.map((ind, idx) => (
              <div key={idx} className="group p-8 bg-white border border-slate-200 rounded-2xl text-center cursor-pointer hover:border-cyan-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="text-4xl mb-4">{ind.icon}</div>
                <h3 className="font-bold text-slate-900 group-hover:text-cyan-500 transition-colors">{ind.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ OUR PROCESS (ZIGZAG TIMELINE) ═══ */}
      <section className="py-32 bg-[#f8fafc]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Our Process</h2>
            <p className="text-slate-500 text-lg">A seamless flow from field to finish.</p>
          </div>

          {/* Vertical Line */}
          <div className="absolute left-1/2 top-48 bottom-0 w-[2px] bg-cyan-200/60 -translate-x-1/2 hidden md:block"></div>

          <div className="space-y-16">
            {processSteps.map((step, idx) => {
              const isEven = idx % 2 !== 0;
              return (
                <div key={idx} className={`relative flex flex-col md:flex-row items-center gap-8 ${isEven ? 'md:flex-row-reverse' : ''}`}>
                  
                  {/* Card */}
                  <div className={`w-full md:w-[45%] ${isEven ? 'md:text-left' : 'md:text-left'}`}>
                    <div className="bg-white p-8 rounded-[24px] shadow-sm border border-slate-200">
                      <h3 className="text-xl font-bold text-[#050f1c] mb-3">{step.title}</h3>
                      <p className="text-slate-500 text-[15px] leading-relaxed">{step.desc}</p>
                    </div>
                  </div>

                  {/* Center Node */}
                  <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-[#050f1c] text-cyan-400 flex items-center justify-center relative shadow-[0_0_0_4px_#f8fafc]">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        {idx === 0 && <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />}
                        {idx === 1 && <><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>}
                        {idx === 2 && <><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></>}
                        {idx === 3 && <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />}
                      </svg>
                      {/* Badge Number */}
                      <div className="absolute -top-1 -right-2 w-7 h-7 bg-[#22d3ee] rounded-full text-white text-xs font-bold flex items-center justify-center border-2 border-[#050f1c]">
                        {step.id}
                      </div>
                    </div>
                  </div>
                  
                  {/* Empty Spacer */}
                  <div className="hidden md:block w-[45%]"></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-24 bg-slate-50 relative overflow-hidden border-t border-slate-100">
        <div className="absolute inset-0 blueprint-grid opacity-20 pointer-events-none mix-blend-multiply" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">Ready to work with us?</h2>
          <p className="text-slate-600 text-lg mb-10">Get in touch with our engineering team to discuss your next survey project.</p>
          <Link to="/contact" className="inline-flex items-center gap-2 bg-[#1976ff] text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-slate-900 transition-all shadow-lg shadow-blue-600/30">
            Contact Us <ArrowUpRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
