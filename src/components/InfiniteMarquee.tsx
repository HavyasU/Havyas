import React from 'react';

interface InfiniteMarqueeProps {
  items: { name: string; logo?: string }[];
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
          {marqueeItems.map((item, index) => {
            const name = typeof item === 'string' ? item : item.name;
            const logo = typeof item === 'object' ? item.logo : null;
            
            return (
              <div
                key={index}
                className="mx-8 md:mx-16 flex flex-col items-center justify-center gap-3 cursor-default group"
              >
                {logo ? (
                  <img src={logo} alt={name} className="h-16 md:h-20 w-auto object-contain grayscale group-hover:grayscale-0 transition-all duration-300 opacity-70 group-hover:opacity-100" />
                ) : (
                  <div className="h-16 md:h-20 flex items-center justify-center">
                    <span className="text-xl md:text-3xl font-black text-slate-700 tracking-wider group-hover:text-cyan-400 transition-colors">{name}</span>
                  </div>
                )}
                {logo && <span className="text-[10px] md:text-xs font-semibold text-slate-600 uppercase tracking-widest">{name}</span>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default InfiniteMarquee;
