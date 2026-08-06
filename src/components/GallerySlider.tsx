
interface GallerySliderProps {
  images: { image: string }[];
}

export default function GallerySlider({ images }: GallerySliderProps) {
  if (!images || images.length === 0) return null;

  // Duplicate images to ensure smooth infinite scrolling
  const scrollImages = [...images, ...images, ...images];

  return (
    <section className="py-20 bg-slate-50 border-t border-slate-100 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 mb-10 text-center">
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
          Featured Work
        </h2>
        <p className="text-slate-500 mt-4 max-w-2xl mx-auto">
          A glimpse into some of our successful operations and fieldwork.
        </p>
      </div>

      <div className="relative w-full flex overflow-hidden group">
        <div className="flex animate-marquee group-hover:[animation-play-state:paused] whitespace-nowrap">
          {scrollImages.map((img, idx) => (
            <div key={idx} className="w-[300px] h-[250px] md:w-[400px] md:h-[300px] mx-4 shrink-0 overflow-hidden rounded-2xl shadow-md border border-slate-200">
              <img 
                src={img.image} 
                alt="Gallery" 
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500 cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
