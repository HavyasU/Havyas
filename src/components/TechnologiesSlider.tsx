import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

interface TechItem {
  code: string;
  title: string;
  description: string;
  img: string;
}

interface TechnologiesSliderProps {
  heading: string;
  description: string;
  items: TechItem[];
}

export const TechnologiesSlider: React.FC<TechnologiesSliderProps> = ({ heading, description, items }) => {
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
            {heading}
          </h2>
          <p className="text-slate-500 text-lg max-w-md">
            {description}
          </p>
        </div>
      </div>

      <div ref={sliderRef} className="flex gap-6 w-max px-6 lg:px-10">
          {items.map((tech, idx) => (
            <div
              key={idx}
              className="w-[320px] sm:w-[380px] h-[460px] shrink-0"
            >
              <div className="relative h-full flex flex-col bg-white border border-slate-200 shadow-sm rounded-3xl overflow-hidden group hover:border-[#1976ff] hover:shadow-lg transition-all duration-500 cursor-grab active:cursor-grabbing">
                {/* Image Section */}
                <div className="relative h-1/2 overflow-hidden">
                  <img
                    src={tech.img || 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&q=80'}
                    alt={tech.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
                </div>
                
                {/* Content Section */}
                <div className="relative z-10 p-8 flex-1 flex flex-col justify-end bg-white">
                  <span className="font-mono text-[#1976ff] font-bold text-sm mb-2 tracking-widest block">
                    {tech.code}
                  </span>
                  <h3 className="font-black text-2xl text-slate-900 leading-tight mb-3">
                    {tech.title}
                  </h3>
                  <p className="text-sm font-semibold text-slate-600 line-clamp-3 leading-relaxed">
                    {tech.description}
                  </p>

                  <div className="mt-6 relative w-full">
                    <div className="h-[2px] w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#1976ff] w-0 group-hover:w-full transition-all duration-700 ease-out" />
                    </div>
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
