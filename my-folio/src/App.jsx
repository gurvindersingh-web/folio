import React, { useState, useEffect, Suspense, lazy } from 'react';
import './App.css';
import AnimatedContent from "./component/AnimatedContent.jsx"
import BorderGlow from "./component/BorderGlow.jsx"
import ProjectCard from "./component/ProjectCard.jsx"
import ClickSpark from './component/ClickSpark.jsx';
import SmoothScroll from './component/SmoothScroll.jsx';
import { FiMonitor, FiServer, FiDatabase, FiTerminal, FiArrowUpRight } from 'react-icons/fi';
const LogoLoop = lazy(() => import("./component/LogoLoop.jsx"));
const InfiniteSpiral = lazy(() => import("./component/InfiniteSpiral.jsx"));
const Carousel = lazy(() => import("./component/Carousel.jsx"));
const Clock = () => {
  const [time, setTime] = useState("");
  
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return <>{time || "11:20:47"}</>;
};



function App() {
  const projects = [
    {
      title: "Dynamic Memory Management Visualiser",
      description: "A futuristic web-based visualizer for OS memory management algorithms. Features real-time simulation of FIFO and LRU, with live statistics and an immersive 3D stage.",
      stack: ["React", "Vite", "GSAP", "Framer Motion", "Three.js", "Tailwind CSS"],
      image: "/imgs/dynamic_memory.png",
      video: "/videos/screenrecording-2026-09-04_22-01-08.mp4",
      link: "https://github.com/gurvindersingh-web/Dynamic-Memory-Management",
      year: "2025",
      role: "Full-Stack",
      engine: "Three.js",
      status: "Public"
    }
  ];

  const carouselItems = [
    {
      title: 'Frontend',
      description: 'Building responsive, modern web applications with React 19 and JavaScript.',
      id: 1,
      icon: <FiMonitor className="carousel-icon" />
    },
    {
      title: 'Backend',
      description: 'Designing scalable APIs and services with Node.js and Spring Frameworks.',
      id: 2,
      icon: <FiServer className="carousel-icon" />
    },
    {
      title: 'Database',
      description: 'Modeling and managing data with PostgreSQL and MongoDB.',
      id: 3,
      icon: <FiDatabase className="carousel-icon" />
    },
    {
      title: 'DevOps',
      description: 'Containerizing with Docker and orchestrating with Kubernetes on Linux environments.',
      id: 4,
      icon: <FiTerminal className="carousel-icon" />
    }
  ];

  return (
    <SmoothScroll>
    <ClickSpark sparkColor="#d4cebd" sparkSize={8} sparkRadius={18} sparkCount={9} duration={420}>
    <div className="ryoku-layout">
      {/* Texture overlay */}
      <div className="r-noise"></div>

      {/* Header */}
      <header className="r-header">
        <div className="r-logo">
          <span className="r-logo-icon">水</span> Gurvinder Singh
        </div>
        <nav className="r-nav">
          <a href="#about">ABOUT</a>
          <a href="#skills">SKILLS</a>
          <a href="#projects">PROJECTS</a>
          <a href="#achievements">ACHIEVEMENTS</a>
          <a href="#contact">CONTACT</a>
        </nav>
        <div className="r-version">
          <span className="r-square">■</span> v1.0.0
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="r-hero">
          {/* Left Content Area */}
          <AnimatedContent
            distance={100}
            direction="horizontal"
            reverse={false}
            duration={1.2}
            ease="power3.out"
            initialOpacity={0}
            animateOpacity
            scale={0.95}
            threshold={0.1}
            delay={0.1}
          >
            <div className="r-left">
              <div className="r-eyebrow">
                <span className="r-plus">+</span>
                <span className="r-char">水</span>
                <span className="r-dot">-</span>
                FULL-STACK DEVELOPER            <span className="r-star">❖</span>
              </div>

              <h1 className="r-title">Gurvinder Singh</h1>

              <div className="r-subtitle">
                @ gurvindersingh-web · public beta
              </div>

              <div className="r-local-time">
                <span className="r-pulse">●</span> LOCAL <Clock />
              </div>

              <div className="r-specs">
                <div className="r-spec-row">
                  <span>FRONTEND</span>
                  <span className="r-dots"></span>
                  <span>React 19</span>
                </div>
                <div className="r-spec-row">
                  <span>BACKEND</span>
                  <span className="r-dots"></span>
                  <span>Spring Boot</span>
                </div>
                <div className="r-spec-row">
                  <span>LANGUAGE</span>
                  <span className="r-dots"></span>
                  <span>Java/JS/TS</span>
                </div>
                <div className="r-spec-row">
                  <span>PLATFORM</span>
                  <span className="r-dots"></span>
                  <span>Arch Linux</span>
                </div>
                <div className="r-spec-row">
                  <span>FOCUS</span>
                  <span className="r-dots"></span>
                  <span>Security</span>
                </div>
              </div>

              <div className="r-vitals">
                <div className="r-vital-box">
                  <div className="r-vital-num">3+</div>
                  <div className="r-vital-lbl">PROJECTS</div>
                </div>
                <div className="r-vital-box">
                  <div className="r-vital-num">12+</div>
                  <div className="r-vital-lbl">SKILLS</div>
                </div>
                <div className="r-vital-box">
                  <div className="r-vital-num">5</div>
                  <div className="r-vital-lbl">CERTS</div>
                </div>
                <div className="r-vital-box">
                  <div className="r-vital-num">1</div>
                  <div className="r-vital-lbl">DEV</div>
                </div>
              </div>

              <div className="r-ramp">
                <div className="r-ramp-colors">
                  <div className="r-c1"></div>
                  <div className="r-c2"></div>
                  <div className="r-c3"></div>
                  <div className="r-c4"></div>
                  <div className="r-c5"></div>
                </div>
                <div className="r-ramp-text">
                  INK RAMP · 4.6:1 → 12:1
                </div>
              </div>

              <div className="r-actions">
                <button 
                  className="r-btn-primary" 
                  onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  VIEW PROJECTS
                </button>
                <button 
                  className="r-btn-secondary"
                  onClick={() => window.open('https://github.com/gurvindersingh-web', '_blank')}
                >
                  GITHUB
                </button>
              </div>

              <div className="r-stars">
                ★ Available for work · Full-Stack Developer · Linux · Web Sec
              </div>

              <div className="r-footer-row">
                <div className="r-barcode-container">
                  <span className="r-barcode-star">✜</span>
                  <div className="r-barcode-wrap">
                    <div className="r-barcode"></div>
                    <div className="r-barcode-text">GURV-BETA-18</div>
                  </div>
                </div>
                <div className="r-edition">
                  <div className="r-ed-lbl">EDITION</div>
                  <div className="r-ed-num">No. 0018</div>
                  <div className="r-ed-ver">v0.49.2-beta.19</div>
                </div>
              </div>
            </div>
          </AnimatedContent>

          {/* Right Art Area */}
          <div className="r-right">
            <div className="r-halo"></div>
            <div className="r-art">
              {/* The profile picture, uncropped, fading in from left */}
              <picture>
                <source srcSet="/imgs/ppf_1080p_fixed.webp" type="image/webp" />
                <img src="/imgs/ppf_1080p_fixed.png" alt="Profile" width="2010" height="1000" fetchPriority="high" decoding="async" />
              </picture>
            </div>
            <div className="r-scroll-hint">
              <div className="r-scroll-text">SCROLL</div>
              <div className="r-scroll-line"></div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="r-about">
          <div className="r-about-eyebrow">
            <span className="r-about-eyebrow-text">WHAT I DO</span>
            <span className="r-about-eyebrow-icon">水</span>
          </div>

          <div className="r-about-content">
            <h2 className="r-section-heading">ABOUT</h2>
            <p className="r-about-large">
              A passionate Full Stack Developer building robust web applications and seamless digital experiences. Specializing in modern JavaScript frameworks and scalable backend architectures.
            </p>
            <p className="r-about-small">
              I craft elegant solutions to complex problems, focusing on performance, clean code, and user-centric design. Always learning, always building.
            </p>
          </div>

          <div className="r-about-graphic">
            <Suspense fallback={<div style={{ width: '100%', height: '100%' }}></div>}>
              <InfiniteSpiral
                items={[
                  'https://cdn.simpleicons.org/react/c6c1b9',
                  'https://cdn.simpleicons.org/typescript/c6c1b9',
                  'https://cdn.simpleicons.org/archlinux/c6c1b9',
                  'https://cdn.simpleicons.org/docker/c6c1b9',
                  'https://cdn.simpleicons.org/github/c6c1b9',
                  'https://cdn.simpleicons.org/spring/c6c1b9',
                  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><text x="50%" y="50%" font-family="Playfair Display, serif" font-size="18" font-weight="600" fill="%23c6c1b9" text-anchor="middle" dominant-baseline="central">水</text></svg>',
                  'https://cdn.simpleicons.org/nodedotjs/c6c1b9',
                  'https://cdn.simpleicons.org/express/c6c1b9',
                  'https://cdn.simpleicons.org/mongodb/c6c1b9',
                  'https://cdn.simpleicons.org/postgresql/c6c1b9',
                  'https://cdn.simpleicons.org/git/c6c1b9',
                  'https://cdn.simpleicons.org/linux/c6c1b9',
                  'https://cdn.simpleicons.org/javascript/c6c1b9',
                  'https://cdn.simpleicons.org/html5/c6c1b9',
                  'https://cdn.simpleicons.org/css/c6c1b9',
                  'https://cdn.simpleicons.org/python/c6c1b9'
                ]}
                speed={0.3}
                direction="up"
                animationMode="auto"
                imageFit="contain"
                grayscale={0}
                radius={180}
                cardWidth={70}
                cardHeight={70}
                verticalSpacing={45}
                perspective={1500}
                cardsPerTurn={8}
                rotation={-10}
                cardTilt={15}
                cardRadius={12}
                centerScale={1.35}
                edgeFade={0.6}
                edgeBlur={0}
                maxFps={60}
                pauseOnHover={false}
              />
            </Suspense>
          </div>
        </section>

        {/* Logo Loop & Skills Section */}
        <section id="skills" className="r-logo-loop-section" style={{ padding: '3rem 0', overflow: 'hidden' }}>
          <Suspense fallback={<div style={{ height: '48px', width: '100%' }}></div>}>
            <LogoLoop
              logos={[
                { src: 'https://cdn.simpleicons.org/vercel/c6c1b9', alt: 'Vercel', title: 'Vercel' },
                { src: 'https://cdn.simpleicons.org/github/c6c1b9', alt: 'GitHub', title: 'GitHub' },
                { src: 'https://cdn.simpleicons.org/docker/c6c1b9', alt: 'Docker', title: 'Docker' },
                { src: 'https://cdn.simpleicons.org/prisma/c6c1b9', alt: 'Prisma', title: 'Prisma' },
                { src: 'https://cdn.simpleicons.org/supabase/c6c1b9', alt: 'Supabase', title: 'Supabase' },
                { src: 'https://cdn.simpleicons.org/stripe/c6c1b9', alt: 'Stripe', title: 'Stripe' },
                { src: 'https://cdn.simpleicons.org/react/c6c1b9', alt: 'React', title: 'React' },
                { src: 'https://cdn.simpleicons.org/nextdotjs/c6c1b9', alt: 'Next.js', title: 'Next.js' },
                { src: 'https://cdn.simpleicons.org/typescript/c6c1b9', alt: 'TypeScript', title: 'TypeScript' }
              ]}
              speed={40}
              direction="left"
              gap={80}
              logoHeight={48}
            />
          </Suspense>
        </section>

        {/* Skills Section */}
        <section className="r-skills" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '6rem' }}>
          
          {/* Top Row: Description + Carousel */}
          <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
            
            <div style={{ display: 'flex', gap: '4vw', alignItems: 'center' }}>
              <div className="r-about-eyebrow">
                <span className="r-about-eyebrow-text">HONEST STATUS</span>
                <span className="r-about-eyebrow-icon">水</span>
              </div>
              
              <div className="r-skills-intro" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '550px' }}>
                <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '3.8rem', fontWeight: 400, lineHeight: 1.1, color: '#d4cebd', letterSpacing: '-0.02em', margin: 0 }}>
                  This is a public beta.<br />It shows its cracks.
                </h1>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.1rem', lineHeight: 1.6, color: '#666459', margin: 0 }}>
                  Unfinished on purpose, in the open. You are seeing<br/>
                  Ryoku while it is still being built, not a frozen release.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '1rem' }}>
                  <div style={{ backgroundColor: '#d4cebd', color: '#121212', padding: '0.4rem 0.8rem', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'JetBrains Mono, monospace' }}>
                    <span style={{ display: 'inline-block', width: '6px', height: '6px', backgroundColor: '#121212', borderRadius: '50%' }}></span>
                    BETA - v0.48.0-beta.18
                  </div>
                  <span style={{ fontSize: '0.8rem', color: '#666459', fontFamily: 'JetBrains Mono, monospace' }}>tracked live from GitHub</span>
                </div>
              </div>
            </div>

            <div className="r-status-image-container" style={{ position: 'relative', width: '500px', height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BorderGlow borderRadius={210} backgroundColor="#121212" className="carousel-border-glow" autoAnimate={true}>
                <Suspense fallback={<div style={{ width: 420, height: 420, borderRadius: '50%' }}></div>}>
                  <Carousel
                    items={carouselItems}
                    baseWidth={420}
                    round={true}
                    autoplay={true}
                    autoplayDelay={3000}
                    loop={true}
                    pauseOnHover={false}
                  />
                </Suspense>
              </BorderGlow>
            </div>
          </div>

          <div className="r-skills-content" style={{ width: '100%', maxWidth: 'none', marginLeft: 0 }}>
            <h2 className="r-section-heading">SKILLS</h2>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '3.5rem', fontWeight: 400, marginBottom: '3rem', letterSpacing: '-0.02em', color: '#d4cebd', marginTop: '1rem' }}>
              Technical Arsenal
            </h3>
            <div className="r-skills-grid">
              <BorderGlow className="r-skill-category" backgroundColor="#121212" borderRadius={12}>
                <h3><span className="r-pulse"></span>FRONTEND</h3>
                <div className="r-skill-list r-skill-logos">
                  <span><img src="https://cdn.simpleicons.org/react" alt="React" width="20" height="20"/> React 19</span>
                  <span><img src="https://cdn.simpleicons.org/javascript" alt="JavaScript" width="20" height="20"/> JavaScript</span>
                  <span><img src="https://cdn.simpleicons.org/typescript" alt="TypeScript" width="20" height="20"/> TypeScript</span>
                  <span><img src="https://cdn.simpleicons.org/tailwindcss" alt="Tailwind CSS" width="20" height="20"/> Tailwind CSS</span>
                  <span><img src="https://cdn.simpleicons.org/qt" alt="Quickshell" width="20" height="20"/> Quickshell</span>
                </div>
              </BorderGlow>
              <BorderGlow className="r-skill-category" backgroundColor="#121212" borderRadius={12}>
                <h3><span className="r-pulse-red"></span>BACKEND</h3>
                <div className="r-skill-list r-skill-logos">
                  <span><img src="https://cdn.simpleicons.org/springboot" alt="Spring Boot" width="20" height="20"/> Spring Boot</span>
                  <span><img src="https://cdn.simpleicons.org/nodedotjs" alt="Node.js" width="20" height="20"/> Node.js</span>
                  <span><img src="https://cdn.simpleicons.org/spring" alt="Spring Frameworks" width="20" height="20"/> Spring Frameworks</span>
                  <span><img src="https://cdn.simpleicons.org/postgresql" alt="PostgreSQL" width="20" height="20"/> PostgreSQL</span>
                  <span><img src="https://cdn.simpleicons.org/mongodb" alt="MongoDB" width="20" height="20"/> MongoDB</span>
                </div>
              </BorderGlow>
              <BorderGlow className="r-skill-category" backgroundColor="#121212" borderRadius={12}>
                <h3><span className="r-pulse-blue"></span>PLATFORMS & TOOLS</h3>
                <div className="r-skill-list r-skill-logos">
                  <span><img src="https://cdn.simpleicons.org/archlinux" alt="Arch Linux" width="20" height="20"/> Arch Linux</span>
                  <span><img src="https://cdn.simpleicons.org/git" alt="Git" width="20" height="20"/> Git</span>
                  <span><img src="https://cdn.simpleicons.org/docker" alt="Docker" width="20" height="20"/> Docker</span>
                  <span><img src="https://cdn.simpleicons.org/kubernetes" alt="Kubernetes" width="20" height="20"/> Kubernetes</span>
                  <span><img src="https://cdn.simpleicons.org/cloudflare" alt="Cloudflare" width="20" height="20"/> Cloudflare</span>
                  <span><img src="https://cdn.simpleicons.org/n8n" alt="n8n" width="20" height="20"/> n8n</span>
                </div>
              </BorderGlow>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="r-projects-container">
          <div className="r-projects-header">
            <div className="r-about-eyebrow">
              <span className="r-about-eyebrow-text">PROJECTS</span>
              <span className="r-about-eyebrow-icon">水</span>
            </div>
            <div className="r-projects-intro">
              <h2 className="r-section-heading">SELECTED WORK</h2>
              <h3 className="r-projects-title">Featured Works</h3>
              <p className="r-projects-lede">
                Case studies from the lab: systems visualization, interaction, and the tools I use to make complex ideas feel immediate.
              </p>
            </div>
          </div>

          <div className="r-projects-list">
            {projects.map((project, index) => (
              <AnimatedContent
                key={project.title}
                distance={56}
                direction="vertical"
                duration={1.05}
                ease="power3.out"
                initialOpacity={0}
                animateOpacity
                scale={0.985}
                threshold={0.12}
                delay={0.05}
              >
                <ProjectCard {...project} index={index + 1} reverse={index % 2 === 1} />
              </AnimatedContent>
            ))}
          </div>

          <div className="r-projects-footer">
            <div className="r-projects-footer-copy">
              <span className="r-projects-footer-kicker">ARCHIVE</span>
              <p>More experiments, notes, and incomplete work live in public repositories.</p>
            </div>
            <a
              className="project-card__link project-card__link--primary"
              href="https://github.com/gurvindersingh-web"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
              <FiArrowUpRight size={14} />
            </a>
          </div>
        </section>

      </main>
      {/* Side Text */}
      <div className="r-side-text">
        PORTFOLIO · BETA 18 · ARCH LINUX · SHOT ON BLACK
      </div>

    </div>
    </ClickSpark>
    </SmoothScroll>
  );
}

export default App;
