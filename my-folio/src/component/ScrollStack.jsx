import { useLayoutEffect, useRef, useCallback } from 'react';
import './ScrollStack.css';

export const ScrollStackItem = ({ children, itemClassName = '' }) => (
  <div className={`scroll-stack-card ${itemClassName}`.trim()}>{children}</div>
);

const ScrollStack = ({
  children,
  className = '',
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = '20%',
  scaleEndPosition = '10%',
  baseScale = 0.85,
  rotationAmount = 0,
  blurAmount = 0,
  useWindowScroll = false,
  onStackComplete,
}) => {
  const scrollerRef = useRef(null);
  const rafRef = useRef(null);
  const cardsRef = useRef([]);
  const isVisibleRef = useRef(false);

  /* ── helpers ──────────────────────────────── */
  const pct = useCallback(
    (v, h) =>
      typeof v === 'string' && v.includes('%')
        ? (parseFloat(v) / 100) * h
        : parseFloat(v),
    [],
  );

  const offsetTop = useCallback(
    (el) => {
      if (useWindowScroll) {
        let top = 0;
        let node = el;
        while (node) {
          top += node.offsetTop || 0;
          node = node.offsetParent;
        }
        return top;
      }
      return el.offsetTop;
    },
    [useWindowScroll],
  );

  /* ── main update ─────────────────────────── */
  const update = useCallback(() => {
    const cards = cardsRef.current;
    if (!cards.length) return;

    const scrollTop = useWindowScroll
      ? window.scrollY
      : scrollerRef.current?.scrollTop ?? 0;
    const viewH = useWindowScroll
      ? window.innerHeight
      : scrollerRef.current?.clientHeight ?? 0;

    const stackPx = pct(stackPosition, viewH);
    const scaleEndPx = pct(scaleEndPosition, viewH);

    /* find the scroll-stack-end sentinel */
    const endEl = useWindowScroll
      ? document.querySelector('.scroll-stack-end')
      : scrollerRef.current?.querySelector('.scroll-stack-end');
    const endTop = endEl ? offsetTop(endEl) : Infinity;

    cards.forEach((card, i) => {
      if (!card) return;

      const cardTop = offsetTop(card);

      /* trigger range for scale */
      const triggerStart = cardTop - stackPx - itemStackDistance * i;
      const triggerEnd = cardTop - scaleEndPx;

      /* pin range */
      const pinStart = triggerStart;
      const pinEnd = endTop - viewH / 2;

      /* scale */
      const rawProgress = triggerEnd > triggerStart
        ? Math.min(Math.max((scrollTop - triggerStart) / (triggerEnd - triggerStart), 0), 1)
        : 0;
      const targetScale = baseScale + i * itemScale;
      const scale = 1 - rawProgress * (1 - targetScale);

      /* rotation */
      const rotation = rotationAmount ? i * rotationAmount * rawProgress : 0;

      /* blur */
      let blur = 0;
      if (blurAmount) {
        let topIdx = 0;
        for (let j = 0; j < cards.length; j++) {
          const jTop = offsetTop(cards[j]);
          const jStart = jTop - stackPx - itemStackDistance * j;
          if (scrollTop >= jStart) topIdx = j;
        }
        if (i < topIdx) blur = (topIdx - i) * blurAmount;
      }

      /* translateY */
      let ty = 0;
      const pinned = scrollTop >= pinStart && scrollTop <= pinEnd;
      if (pinned) {
        ty = scrollTop - cardTop + stackPx + itemStackDistance * i;
      } else if (scrollTop > pinEnd) {
        ty = pinEnd - cardTop + stackPx + itemStackDistance * i;
      }

      card.style.transform = `translate3d(0,${ty.toFixed(1)}px,0) scale(${scale.toFixed(4)}) rotate(${rotation.toFixed(2)}deg)`;
      card.style.filter = blur > 0 ? `blur(${blur.toFixed(1)}px)` : 'none';

      /* stack-complete callback */
      if (i === cards.length - 1 && onStackComplete) {
        if (pinned) onStackComplete();
      }
    });
  }, [
    useWindowScroll,
    pct,
    offsetTop,
    stackPosition,
    scaleEndPosition,
    itemStackDistance,
    baseScale,
    itemScale,
    rotationAmount,
    blurAmount,
    onStackComplete,
  ]);

  /* ── rAF loop (only when visible) ────────── */
  const tick = useCallback(() => {
    if (!isVisibleRef.current) return;
    update();
    rafRef.current = requestAnimationFrame(tick);
  }, [update]);

  /* ── setup ───────────────────────────────── */
  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const cards = Array.from(
      useWindowScroll
        ? scroller.querySelectorAll('.scroll-stack-card')
        : scroller.querySelectorAll('.scroll-stack-card'),
    );

    cardsRef.current = cards;

    cards.forEach((card, i) => {
      if (i < cards.length - 1) card.style.marginBottom = `${itemDistance}px`;
      card.style.willChange = 'transform, filter';
      card.style.transformOrigin = 'top center';
    });

    /* Intersection observer — only animate when on-screen */
    const io = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          rafRef.current = requestAnimationFrame(tick);
        } else if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
      },
      { threshold: 0 },
    );
    io.observe(scroller);

    /* initial paint */
    update();

    return () => {
      io.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      cardsRef.current = [];
    };
  }, [itemDistance, useWindowScroll, tick, update]);

  return (
    <div
      className={`scroll-stack-scroller ${useWindowScroll ? 'scroll-stack--window' : ''} ${className}`.trim()}
      ref={scrollerRef}
    >
      <div className="scroll-stack-inner">
        {children}
        <div className="scroll-stack-end" />
      </div>
    </div>
  );
};

export default ScrollStack;
