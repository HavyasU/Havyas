import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const techCards = [
  {
    code: 'T01',
    title: 'UAV / Drone Fleet',
    subtitle: 'cm-grade aerial photogrammetry & LiDAR',
    desc: 'High-end VTOL fixed-wing and multirotor UAV platforms equipped with RTK/PPK GNSS receivers for large-scale topographic mapping.',
    img: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&q=80',
  },
  {
    code: 'T02',
    title: '3D Terrestrial LiDAR',
    subtitle: '1M+ points per second',
    desc: 'Ultra-high-speed laser scanners capturing dense 3D point clouds with sub-millimetric resolution for industrial plants and heritage buildings.',
    img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
  },
  {
    code: 'T03',
    title: 'Mobile Mapping Systems',
    subtitle: 'High-speed corridor survey',
    desc: 'Vehicle-mounted dual LiDAR sensors and 360° spherical camera rigs for rapid highway, rail, and municipal asset inventory.',
    img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
  },
  {
    code: 'T04',
    title: 'Multi-Frequency GNSS RTK',
    subtitle: 'Triple-constellation tracking',
    desc: 'GPS, GLONASS, Galileo, and Beidou CORS network integrated receivers enabling instant centimeter-level baseline field positioning.',
    img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80',
  },
  {
    code: 'T05',
    title: 'Underground GPR',
    subtitle: 'Dual-frequency sub-surface radar',
    desc: 'Ground penetrating radar systems for non-destructive utility locating, void detection, and underground infrastructure mapping.',
    img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80',
  },
  {
    code: 'T06',
    title: 'Multibeam Bathymetry',
    subtitle: 'High-resolution seabed mapping',
    desc: 'Acoustic multibeam echosounders and motion sensors for deep-water marine surveys, port dredging inspection, and underwater navigation.',
    img: 'https://images.unsplash.com/photo-1513553404607-988bf2703777?w=800&q=80',
  },
];

export const TechnologiesSlider: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    // Calculate how far to move horizontally
    const getScrollAmount = () => {
      const sliderWidth = slider.scrollWidth;
      return -(sliderWidth - window.innerWidth + 40); // 40px padding buffer
    };

    gsap.to(slider, {
      x: getScrollAmount,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: () => `+=${slider.scrollWidth}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
      }
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="technologies" className="py-28 bg-slate-50 border-t border-slate-100 gsap-section overflow-hidden h-screen flex flex-col justify-center">
      <div className="max-w-[1400px] w-full mx-auto px-6 lg:px-10 mb-14 shrink-0">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <h2 className="font-black text-4xl lg:text-6xl text-slate-900 tracking-tighter leading-[0.95]">
            Instruments of precision.
          </h2>
          <p className="text-slate-500 text-lg max-w-md">
            Our multi-million dollar fleet of surveying instrumentation represents the absolute state-of-the-art in geospatial data acquisition.
          </p>
        </div>
      </div>

      <div ref={sliderRef} className="flex gap-6 w-max px-6 lg:px-10">
          {techCards.map((tech) => (
            <div
              key={tech.code}
              className="w-[320px] sm:w-[380px] h-[460px] shrink-0"
            >
              <div className="relative h-full flex flex-col justify-end p-8 bg-white border border-slate-200 shadow-sm rounded-3xl overflow-hidden group hover:border-[#1976ff] hover:shadow-lg transition-all duration-500 cursor-grab active:cursor-grabbing">
                {/* Background Image (Lightened) */}
                <img
                  src={tech.img}
                  alt={tech.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent" />
                
                <div className="relative z-10 mb-2">
                  <span className="font-mono text-[#1976ff] font-bold text-sm mb-2 tracking-widest block">
                    {tech.code}
                  </span>
                  <h3 className="font-black text-slate-900 text-2xl lg:text-3xl tracking-tight mb-2">
                    {tech.title}
                  </h3>
                  <p className="text-[#1976ff] text-xs font-mono mb-4">{tech.subtitle}</p>
                  <p className="text-slate-600 text-sm leading-relaxed font-medium">
                    {tech.desc}
                  </p>
                </div>

                <div className="mt-4 relative z-10">
                  <div className="h-[2px] w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#1976ff] w-0 group-hover:w-full transition-all duration-700 ease-out" />
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
};

export default TechnologiesSlider;
