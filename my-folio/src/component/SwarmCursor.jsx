import { useEffect, useRef } from 'react';

const SwarmCursor = ({
  color = '#d3cebd',
  accentColor = '#d3cebd',
  count = 5,
  size = 5,
  opacity = 1,
  speed = 1,
  merge = 1.65,
  spread = 125,
  wander = 0,
  glow = 0,
  separation = 1.2,
  trail = 1.75,
  scatterOnClick = true,
  enabled = true,
  className = '',
  children
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const mouseRef = useRef({ 
    x: 0, 
    y: 0, 
    targetX: 0, 
    targetY: 0, 
    isActive: false,
    clickScattering: 0
  });
  const particlesRef = useRef([]);
  const requestRef = useRef();

  useEffect(() => {
    if (!enabled) {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let width = 0;
    let height = 0;
    let container = containerRef.current;
    if (!container) return;

    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width;
      canvas.height = height;
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      if (!mouseRef.current.isActive) {
        mouseRef.current.x = width / 2;
        mouseRef.current.y = height / 2;
        mouseRef.current.targetX = width / 2;
        mouseRef.current.targetY = height / 2;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current.targetX = e.clientX - rect.left;
      mouseRef.current.targetY = e.clientY - rect.top;
      mouseRef.current.isActive = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.isActive = false;
    };

    const handleClick = () => {
      if (scatterOnClick) {
        mouseRef.current.clickScattering = 1.0;
      }
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('click', handleClick);

    // Pre-parse colors to avoid doing it in the loop
    const parseHex = (hexCode) => {
      const h = hexCode.replace('#', '');
      return {
        r: parseInt(h.substring(0, 2), 16),
        g: parseInt(h.substring(2, 4), 16),
        b: parseInt(h.substring(4, 6), 16)
      };
    };
    
    const colorRGB = parseHex(color);
    const accentRGB = parseHex(accentColor);

    // Initialize particles
    particlesRef.current = Array.from({ length: count }).map((_, i) => ({
      x: width / 2 + (Math.random() - 0.5) * spread,
      y: height / 2 + (Math.random() - 0.5) * spread,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      baseSize: size * (0.8 + Math.random() * 0.4),
      colorRGB: i % 2 === 0 ? colorRGB : accentRGB,
      wanderAngle: Math.random() * Math.PI * 2
    }));

    const update = () => {
      // Premium Fade Trail: 
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = `rgba(0, 0, 0, ${1 - trail})`;
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';

      const particles = particlesRef.current;
      const m = mouseRef.current;
      
      // Lerp mouse
      m.x += (m.targetX - m.x) * 0.15;
      m.y += (m.targetY - m.y) * 0.15;

      if (m.clickScattering > 0) {
        m.clickScattering -= 0.03;
        if (m.clickScattering < 0) m.clickScattering = 0;
      }

      const spreadSq = spread * spread;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        let sepX = 0, sepY = 0;
        let alignX = 0, alignY = 0;
        let cohX = 0, cohY = 0;
        let neighborCount = 0;

        for (let j = 0; j < particles.length; j++) {
          if (i === j) continue;
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distSq = dx * dx + dy * dy;
          
          if (distSq > 0 && distSq < spreadSq) {
            const dist = Math.sqrt(distSq);
            
            // Separation
            const sepRadius = spread * separation;
            if (dist < sepRadius) {
              const repelForce = (1 - dist / sepRadius) * separation * 2;
              sepX += (dx / dist) * repelForce;
              sepY += (dy / dist) * repelForce;
            }

            // Alignment
            alignX += p2.vx;
            alignY += p2.vy;

            // Cohesion
            cohX += p2.x;
            cohY += p2.y;
            
            neighborCount++;
          }
        }

        if (neighborCount > 0) {
          alignX = (alignX / neighborCount) * 0.05;
          alignY = (alignY / neighborCount) * 0.05;
          cohX = (cohX / neighborCount - p.x) * merge * 0.01;
          cohY = (cohY / neighborCount - p.y) * merge * 0.01;
        }

        // Mouse Attraction
        const mx = m.x - p.x;
        const my = m.y - p.y;
        const mDistSq = mx * mx + my * my;
        
        let mouseX = 0, mouseY = 0;
        if (mDistSq > 0) {
          const mDist = Math.sqrt(mDistSq);
          const mouseForce = m.isActive ? 0.02 * speed : 0.005 * speed;

          if (m.clickScattering > 0) {
            mouseX = -(mx / mDist) * m.clickScattering * 15;
            mouseY = -(my / mDist) * m.clickScattering * 15;
          } else {
            mouseX = mx * mouseForce;
            mouseY = my * mouseForce;
          }
        }

        // Wander force
        p.wanderAngle += (Math.random() - 0.5) * 0.5;
        const wanderX = Math.cos(p.wanderAngle) * wander * speed;
        const wanderY = Math.sin(p.wanderAngle) * wander * speed;

        // Apply forces
        p.vx += sepX + alignX + cohX + mouseX + wanderX;
        p.vy += sepY + alignY + cohY + mouseY + wanderY;

        // Speed limit / damping
        const currentSpeedSq = p.vx * p.vx + p.vy * p.vy;
        const maxSpeed = speed * 4; 
        if (currentSpeedSq > maxSpeed * maxSpeed) {
          const currentSpeed = Math.sqrt(currentSpeedSq);
          p.vx = (p.vx / currentSpeed) * maxSpeed;
          p.vy = (p.vy / currentSpeed) * maxSpeed;
        }
        
        // Base friction
        p.vx *= 0.88;
        p.vy *= 0.88;

        // Position update
        p.x += p.vx;
        p.y += p.vy;

        // --- DRAWING ---
        ctx.globalAlpha = opacity;
        
        const glowRadius = p.baseSize * (1 + glow * 3);
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowRadius);
        
        const { r, g, b } = p.colorRGB;
        grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 1)`);
        grad.addColorStop(0.2, `rgba(${r}, ${g}, ${b}, 0.8)`);
        grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      requestRef.current = requestAnimationFrame(update);
    };

    update();

    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('click', handleClick);
      cancelAnimationFrame(requestRef.current);
    };
  }, [
    color, accentColor, count, size, opacity, speed, 
    merge, spread, wander, glow, separation, trail, 
    scatterOnClick, enabled
  ]);

  if (!enabled) return null;

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100%' }}>
      <canvas
        ref={canvasRef}
        className={`swarm-cursor ${className}`}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0,
          mixBlendMode: 'screen'
        }}
      />
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
};

export default SwarmCursor;
