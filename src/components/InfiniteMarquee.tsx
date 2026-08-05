import React from 'react';

interface InfiniteMarqueeProps {
  items: string[];
  title?: string;
}

export const InfiniteMarquee: React.FC<InfiniteMarqueeProps> = ({
  items,
  title = 'Trusted by industry leaders & authorities',
}) => {
  // Duplicate array 3 times for seamless looping
  const marqueeItems = [...items, ...items, ...items];

  return (
    <section className="py-14 bg-slate-900 border-y border-slate-800 relative overflow-hidden">
      {title && (
        <p className="text-center text-xs uppercase tracking-[0.3em] text-cyan-400 font-mono mb-8 font-semibold">
          {title}
        </p>
      )}

      {/* Fade overlay on left and right edges */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none" />

      <div className="overflow-hidden flex">
        <div className="animate-marquee flex items-center whitespace-nowrap">
          {marqueeItems.map((item, index) => (
            <span
              key={index}
              className="mx-10 font-bold text-lg md:text-xl lg:text-2xl text-slate-500 hover:text-cyan-400 transition-colors duration-300 cursor-default tracking-wide uppercase font-mono"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InfiniteMarquee;
