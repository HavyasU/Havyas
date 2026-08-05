import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ImageComparisonSlider from '../components/ImageComparisonSlider';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);
import InfiniteMarquee from '../components/InfiniteMarquee';
import AccordionFlexCards from '../components/AccordionFlexCards';
import TechnologiesSlider from '../components/TechnologiesSlider';
import TestimonialSlider from '../components/TestimonialSlider';
import { db } from '../lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { useSiteContent } from '../hooks/useSiteContent';

// Static data removed, fetching from Firestore now

const heroParticles = [
  { left: '5%', top: '15%', delay: '0s' },
  { left: '14%', top: '28%', delay: '0.4s' },
  { left: '22%', top: '42%', delay: '0.8s' },
  { left: '31%', top: '65%', delay: '1.2s' },
  { left: '40%', top: '20%', delay: '0.3s' },
  { left: '52%', top: '78%', delay: '0.7s' },
  { left: '63%', top: '35%', delay: '1.1s' },
  { left: '74%', top: '55%', delay: '0.2s' },
  { left: '85%', top: '25%', delay: '0.6s' },
  { left: '92%', top: '70%', delay: '1.0s' },
];

/* ── COMPONENT ────────────────────────────────────── */
export default function Home() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [projects, setProjects] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  
  // Dynamic Content
  const statsData = useSiteContent('stats', { items: [
    { val: '25+', label: 'Years of Excellence' },
    { val: '15000+', label: 'Projects Completed' },
    { val: '5000+', label: 'Satisfied Clients' },
    { val: '100+', label: 'Team Members' },
  ]});
  const clientLogosData = useSiteContent('client_logos', { items: [
    'MINISTRY OF INFRASTRUCTURE', 'MERIDIAN DEVELOPMENTS', 'GULF ENERGY', 'METRO AUTHORITY', 'CIVIL AVIATION', 'PORTS & MARINE'
  ]});
  const whyChooseData = useSiteContent('why_choose_us', { items: [
    { id: '1', number: '01', title: 'Engineering Accuracy', description: 'Sub-millimetre precision backed by rigorous quality control at every stage.', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80' },
    { id: '2', number: '02', title: 'Certified Experts', description: 'A century of combined field experience across surveying disciplines.', image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80' },
    { id: '3', number: '03', title: 'Advanced Technology', description: 'The latest LiDAR, UAV and GNSS instrumentation in the region.', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80' },
    { id: '4', number: '04', title: 'Government Approved', description: 'Fully accredited with municipalities and national authorities.', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80' },
    { id: '5', number: '05', title: 'International Standards', description: 'ISO-certified workflows aligned with global geospatial standards.', image: 'https://images.unsplash.com/photo-1691149210746-c6bbb40f4bf6?w=800&q=80' },
    { id: '6', number: '06', title: '3D Modelling & Digital Twins', description: 'Photorealistic digital twins and BIM-ready deliverables.', image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&q=80' },
  ]});

  useEffect(() => {
    const unsubP = onSnapshot(collection(db, 'projects'), (snap) => setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    const unsubT = onSnapshot(collection(db, 'testimonials'), (snap) => setTestimonials(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    const unsubS = onSnapshot(collection(db, 'services'), (snap) => setServices(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => { unsubP(); unsubT(); unsubS(); };
  }, []);

  const container = useRef<HTMLDivElement>(null);
  const heroImgRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // 1. Hero Animations
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    
    tl.fromTo(
      '.hero-line .block',
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.15, delay: 0.2 }
    );
    
    tl.fromTo(
      '.hero-desc',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 },
      '-=0.5'
    );
    
    tl.fromTo(
      '.hero-cta',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.1 },
      '-=0.8'
    );

    // Hero Parallax Scale
    if (heroImgRef.current) {
      gsap.to(heroImgRef.current, {
        scale: 1.2,
        ease: 'none',
        scrollTrigger: {
          trigger: container.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }

    // Projects Horizontal Scroll (Removed for Tabbed UI)

    // 2. ScrollTrigger Section Animations
    gsap.utils.toArray('.gsap-section').forEach((section: any) => {
      gsap.fromTo(
        section,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
          },
        }
      );
    });
  }, { scope: container });

  return (
    <div ref={container} className="bg-white overflow-x-hidden">
      {/* ═══ 1. HERO SECTION ═══ */}
      <section className="relative h-screen min-h-[720px] flex items-center overflow-hidden bg-[#050f1c]">
        {/* Background Image with Parallax */}
        <div
          ref={heroImgRef}
          className="absolute inset-0 transition-transform duration-1000 ease-out"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1610956667016-15debe929a3f?w=1600&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#050f1c]/85 via-[#050f1c]/65 to-[#050f1c]/95" />
        </div>

        {/* Blueprint Grid Overlay */}
        <div className="absolute inset-0 blueprint-grid opacity-30 pointer-events-none" />

        {/* Floating Cyan Particles */}
        {heroParticles.map((pt, idx) => (
          <span
            key={idx}
            className="absolute w-1.5 h-1.5 rounded-full bg-cyan-400/70 shadow-[0_0_8px_#22d3ee] animate-pulse pointer-events-none"
            style={{
              left: pt.left,
              top: pt.top,
              animationDelay: pt.delay,
            }}
          />
        ))}

        {/* Hero Main Content */}
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10 w-full">
          <p className="text-cyan-400 text-xs sm:text-sm uppercase tracking-[0.35em] font-mono font-bold mb-6">
            Al Fayha Survey Engineering Consultancy
          </p>

          <h1 className="font-black text-white leading-[0.92] tracking-tighter text-5xl sm:text-7xl lg:text-[104px] mb-8">
            <span className="mask-line hero-line">
              <span className="block translate-y-[100px] opacity-0">Engineering Precision</span>
            </span>
            <span className="mask-line hero-line">
              <span className="block translate-y-[100px] opacity-0">for Tomorrow's</span>
            </span>
            <span className="mask-line hero-line">
              <span className="block text-cyan-400 translate-y-[100px] opacity-0">
                Infrastructure.
              </span>
            </span>
          </h1>

          <p className="hero-desc opacity-0 text-slate-300 text-base sm:text-lg lg:text-xl max-w-2xl leading-relaxed mb-10">
            Advanced surveying, mapping, engineering consultation and digital geospatial solutions across commercial, industrial, infrastructure and government sectors.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/contact"
              className="hero-cta opacity-0 group inline-flex items-center gap-2 rounded-full bg-[#1976ff] hover:bg-cyan-400 hover:text-slate-950 text-white font-semibold px-8 py-4 transition-all duration-300 shadow-lg shadow-blue-600/30 hover:scale-105"
            >
              Contact{' '}
              <ArrowUpRight
                size={18}
                className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
              />
            </Link>
            <Link
              to="/services"
              className="hero-cta opacity-0 inline-flex items-center gap-2 rounded-full glass-dark text-white font-semibold px-8 py-4 hover:border-cyan-400/60 transition-colors duration-300"
            >
              Explore Services
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-slate-400/80 animate-bounce">
          <span className="text-[10px] uppercase tracking-[0.3em] font-mono">Scroll</span>
          <ArrowDown size={14} className="text-cyan-400" />
        </div>
      </section>

      {/* ═══ 2. TRUSTED BY INFINITE MARQUEE ═══ */}
      <InfiniteMarquee items={clientLogosData.items} />

      {/* ═══ 3. STATS BAR ═══ */}
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

      {/* ═══ 4. ABOUT AFSEC ═══ */}
      <section id="about" className="py-28 bg-white border-b border-slate-100">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative group">
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
              <img
                src="https://images.unsplash.com/photo-1691149210746-c6bbb40f4bf6?w=800&q=80"
                alt="AFSEC engineering project"
                className="w-full h-[540px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

          {/* Timeline & Details */}
          <div>
            <p className="text-cyan-500 text-xs uppercase tracking-[0.25em] font-bold mb-4 font-mono">
              About AFSEC
            </p>
            <h2 className="font-black text-4xl lg:text-6xl text-slate-900 tracking-tighter leading-[0.95] mb-6">
              Surveying beyond boundaries.
            </h2>
            <p className="text-slate-500 text-base leading-relaxed mb-8">
              For over two decades AFSEC has set the regional benchmark for precision surveying and geospatial engineering. We fuse field-proven expertise with the most advanced instrumentation to turn complex terrain into decision-ready intelligence.
            </p>



            <Link
              to="/contact"
              className="group mt-10 inline-flex items-center gap-2 rounded-full bg-slate-900 hover:bg-cyan-500 text-white font-semibold px-8 py-4 transition-colors duration-300"
            >
              Partner with us{' '}
              <ArrowUpRight
                size={18}
                className="group-hover:rotate-45 transition-transform duration-300"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ 5. WHY CHOOSE AFSEC (ACCORDION FLEX CARDS) ═══ */}
      <section id="why" className="py-28 bg-[#050f1c] gsap-section">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="max-w-2xl mb-14">
            <h2 className="font-black text-4xl lg:text-6xl text-white tracking-tighter leading-[0.95]">
              Precision without compromise.
            </h2>
          </div>

          <AccordionFlexCards cards={whyChooseData.items || []} />
        </div>
      </section>

      {/* ═══ 4. OUR SERVICES ═══ */}
      <section id="services" className="py-32 bg-white gsap-section">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div className="max-w-2xl">
              <h2 className="font-black text-4xl lg:text-6xl text-slate-900 tracking-tighter leading-[0.95]">
                Our Services
              </h2>
            </div>
            <Link to="/services" className="btn-outline shrink-0">
              View All Services <ArrowUpRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-[1400px] mx-auto px-6 lg:px-10">
          {services.slice(0, 8).map((svc, idx) => (
              <Link
                key={idx}
                to="/services"
                className="group relative block rounded-2xl overflow-hidden h-64 border border-slate-200 shadow-sm hover:shadow-xl transition-shadow duration-500"
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
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 7. TECHNOLOGIES SLIDER ═══ */}
      <TechnologiesSlider />

      {/* ═══ 8. PROCESS SECTION ═══ */}
      {/* ═══ 9. FEATURED PROJECTS SLIDER ═══ */}
      {/* ═══ 9. FEATURED PROJECTS (IMAGE COMPARISON SLIDER) ═══ */}
      <section id="projects" className="py-28 bg-slate-50 gsap-section">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 mb-12">
          
          <div className="flex flex-wrap gap-4 items-center mb-10">
            {['All', 'Road', 'Bridge', 'Commercial', 'Industrial', 'Oil & Gas', 'Infrastructure'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  activeCategory === cat 
                  ? 'bg-[#1976ff] text-white shadow-lg shadow-blue-500/30' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-[#1976ff] hover:text-[#1976ff]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="w-full mb-20">
            <ImageComparisonSlider 
              beforeImage="https://images.unsplash.com/photo-1541888087425-ce81df8219fa?w=1600&q=80"
              afterImage="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=80"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {projects.map((project, idx) => (
              <Link to="/projects" key={idx} className="group block relative h-[320px] rounded-[24px] overflow-hidden cursor-pointer shadow-lg">
                {/* Background Image */}
                <img 
                  src={project.img} 
                  alt={project.title} 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
                />
                
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
              </Link>
            ))}
          </div>

          <div className="flex justify-center">
            <Link to="/projects" className="btn-outline">
              View All Projects <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ 10. TESTIMONIALS ═══ */}
      <section className="py-28 bg-white border-t border-slate-100 gsap-section overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 text-center mb-10">
          <h2 className="font-black text-4xl md:text-5xl text-slate-900 mb-6 tracking-tight">
            Trusted by industry leaders.
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
            Don't just take our word for it. Hear from the engineers and directors who rely on our spatial data.
          </p>
        </div>
        
        <TestimonialSlider testimonials={testimonials} />
      </section>

      {/* ═══ 11. CTA BANNER ═══ */}
      <section className="py-24 bg-slate-50 relative overflow-hidden border-t border-slate-100 gsap-section">
        <div className="absolute inset-0 blueprint-grid opacity-20 pointer-events-none mix-blend-multiply" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-10 text-center">
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
            Ready to Start Your Project?
          </h2>
          <p className="text-slate-600 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Get in touch with our team of survey experts and engineers to discuss your project requirements and receive a comprehensive proposal.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-[#1976ff] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-900 transition-all shadow-lg shadow-blue-500/30"
            >
              Contact Us <ArrowUpRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
