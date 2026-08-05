import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [ringPosition, setRingPosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only run on desktop devices
    if (window.innerWidth < 768) return;

    let animationFrameId: number;

    const onMouseMove = (e: MouseEvent) => {
      setIsVisible(true);
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    const updateRingPosition = () => {
      setRingPosition((prev) => ({
        x: prev.x + (position.x - prev.x) * 0.15,
        y: prev.y + (position.y - prev.y) * 0.15,
      }));
      animationFrameId = requestAnimationFrame(updateRingPosition);
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    animationFrameId = requestAnimationFrame(updateRingPosition);

    // Dynamic hover handler for interactive elements
    const handleElementHover = () => {
      const interactiveElements = document.querySelectorAll(
        'a, button, input, select, textarea, [data-interactive="true"], .card, .group'
      );

      interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', () => setIsHovered(true));
        el.addEventListener('mouseleave', () => setIsHovered(false));
      });
    };

    handleElementHover();
    const observer = new MutationObserver(handleElementHover);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, [position.x, position.y]);

  if (!isVisible) return null;

  const ringSize = isHovered ? 56 : 36;
  const ringOffset = ringSize / 2;

  return (
    <>
      <div
        className="cursor-dot"
        style={{
          transform: `translate(${position.x - 4}px, ${position.y - 4}px) scale(${isHovered ? 1.5 : 1})`,
        }}
      />
      <div
        className="cursor-ring"
        style={{
          transform: `translate(${ringPosition.x - ringOffset}px, ${ringPosition.y - ringOffset}px)`,
          width: `${ringSize}px`,
          height: `${ringSize}px`,
          borderColor: isHovered ? '#0ea5e9' : 'rgba(14, 165, 233, 0.5)',
          backgroundColor: isHovered ? 'rgba(14, 165, 233, 0.08)' : 'transparent',
        }}
      />
    </>
  );
};

export default CustomCursor;
