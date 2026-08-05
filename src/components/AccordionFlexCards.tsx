import React, { useState } from 'react';

export interface AccordionCardItem {
  id: string;
  number: string;
  title: string;
  description: string;
  image: string;
}

interface AccordionFlexCardsProps {
  cards: AccordionCardItem[];
}

export const AccordionFlexCards: React.FC<AccordionFlexCardsProps> = ({ cards }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-auto lg:h-[460px] w-full">
      {cards.map((card, index) => {
        const isActive = activeIndex === index;

        return (
          <div
            key={card.id}
            onMouseEnter={() => setActiveIndex(index)}
            onClick={() => setActiveIndex(index)}
            className="relative rounded-2xl overflow-hidden cursor-pointer group transition-all duration-500 ease-out border border-slate-800"
            style={{
              flex: isActive ? '3.2 1 0%' : '1 1 0%',
              minHeight: '200px',
            }}
          >
            {/* Background Image with Zoom */}
            <img
              src={card.image}
              alt={card.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* Gradient Overlay */}
            <div
              className={`absolute inset-0 transition-opacity duration-500 ${
                isActive
                  ? 'bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-900/30'
                  : 'bg-slate-950/75 group-hover:bg-slate-950/65'
              }`}
            />

            {/* Cyan Border Glow on Active/Hover */}
            <div
              className={`absolute inset-0 border-2 rounded-2xl transition-colors duration-500 pointer-events-none ${
                isActive ? 'border-cyan-500/60' : 'border-transparent group-hover:border-cyan-500/30'
              }`}
            />

            {/* Content */}
            <div className="relative h-full flex flex-col justify-end p-6 md:p-8 z-10">
              <span className="font-mono text-cyan-400 text-xs font-bold mb-2 tracking-widest block">
                {card.number}
              </span>
              <h3 className="font-black text-white text-xl lg:text-2xl tracking-tight">
                {card.title}
              </h3>
              <p
                className={`text-slate-300 text-sm mt-3 leading-relaxed transition-all duration-500 ${
                  isActive
                    ? 'opacity-100 max-h-24 transform translate-y-0'
                    : 'opacity-0 lg:opacity-0 max-h-0 lg:max-h-0 transform translate-y-2 overflow-hidden'
                }`}
              >
                {card.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AccordionFlexCards;
