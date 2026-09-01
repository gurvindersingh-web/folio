import { useEffect, useRef } from 'react';
import './ScrollStack.css';

export const ScrollStackItem = ({ children, itemClassName = '' }) => (
  <div className={`scroll-stack-card ${itemClassName}`.trim()}>
    <div className="scroll-stack-card-inner">
      {children}
    </div>
  </div>
);

const ScrollStack = ({
  children,
  className = '',
  itemDistance = 80,
  itemScale = 0.05,
  itemStackDistance = 20, // px distance between stacked cards
  stackPosition = 15, // vh offset for sticky
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const cards = Array.from(container.querySelectorAll('.scroll-stack-card'));
    const inners = Array.from(container.querySelectorAll('.scroll-stack-card-inner'));

    // 1. Setup CSS Variables for Sticky logic
    cards.forEach((card, i) => {
      // Calculate top position for each card so they stack with a small offset
      const topOffset = `calc(${stackPosition}vh + ${i * itemStackDistance}px)`;
      card.style.position = 'sticky';
      card.style.top = topOffset;
      card.style.zIndex = i + 1;

      // Add spacing below all cards except the last one
      if (i < cards.length - 1) {
        card.style.marginBottom = `${itemDistance}px`;
      } else {
        // Give the last card some bottom margin so you can scroll past the stack
        card.style.marginBottom = '20vh'; 
      }
    });

    // 2. Setup Scroll Listener for Scale/Blur effect
    let rafId;
    const handleScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      
      rafId = requestAnimationFrame(() => {
        const viewportHeight = window.innerHeight;
        // Approximate the pixel value of our vh-based stackPosition
        const stackPosPx = (stackPosition / 100) * viewportHeight;

        cards.forEach((card, i) => {
          const inner = inners[i];
          if (!inner) return;

          const rect = card.getBoundingClientRect();
          // The exact pixel top where this card becomes sticky
          const targetTop = stackPosPx + (i * itemStackDistance);

          // If the card is currently pinned at its sticky position (or slightly past it)
          if (rect.top <= targetTop + 1) {
            let scale = 1;
            let blur = 0;

            // Look at the next card to calculate how much we should scale down
            if (i < cards.length - 1) {
              const nextCard = cards[i + 1];
              const nextRect = nextCard.getBoundingClientRect();
              const nextTargetTop = stackPosPx + ((i + 1) * itemStackDistance);
              
              // Distance between this card's pinning position and the next card
              const distance = nextRect.top - targetTop;
              
              // We start scaling down when the next card gets close (e.g., within window height)
              const maxDistance = viewportHeight; 
              
              if (distance < maxDistance && distance > 0) {
                const progress = 1 - (distance / maxDistance); // 0 to 1 as next card approaches
                const eased = Math.min(Math.max(progress, 0), 1);
                
                scale = 1 - (eased * itemScale);
                blur = eased * 2; // up to 2px blur
              } else if (distance <= 0) {
                // Next card is fully on top
                scale = 1 - itemScale;
                blur = 2;
              }
            }

            inner.style.transform = `scale(${scale})`;
            inner.style.filter = `blur(${blur}px)`;
            
            // To prevent scale from causing the bottom of the card to peek, transform origin is top
            inner.style.transformOrigin = 'top center';
          } else {
            // Card is scrolling freely (not yet pinned)
            inner.style.transform = 'scale(1)';
            inner.style.filter = 'blur(0px)';
          }
        });
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [itemDistance, itemScale, itemStackDistance, stackPosition]);

  return (
    <div className={`scroll-stack-scroller ${className}`.trim()} ref={containerRef}>
      {children}
    </div>
  );
};

export default ScrollStack;
