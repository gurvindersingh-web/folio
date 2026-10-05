import React, { useState, useEffect, useCallback, Suspense, lazy, Component } from 'react';
import './App.css';
import AnimatedContent from "./component/AnimatedContent.jsx"
const BorderGlow = lazy(() => import("./component/BorderGlow.jsx"));
const ProjectCard = lazy(() => import("./component/ProjectCard.jsx"));
import ClickSpark from './component/ClickSpark.jsx';
import SmoothScroll from './component/SmoothScroll.jsx';
import { scrollToAnchor } from './utils/scroll.js';
import InkIntro from './component/InkIntro.jsx';
import TechText from './component/TechText.jsx';
import CurvedInput from './component/CurvedInput.jsx';
import CircularText from './component/CircularText.jsx';
import { FiMonitor, FiServer, FiDatabase, FiTerminal, FiArrowUpRight, FiMenu, FiX, FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from './themeContext.jsx';
import {
  SiReact, SiTypescript, SiArchlinux, SiDocker, SiGithub, SiSpring, SiNodedotjs, SiExpress, SiMongodb, SiPostgresql, SiGit, SiLinux, SiJavascript, SiHtml5, SiCss, SiPython, SiPrisma, SiSupabase, SiStripe, SiNextdotjs, SiSpringboot, SiN8N, SiHyprland
} from 'react-icons/si';
// comment4
// Error boundary for lazy-loaded components
class LazyErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div style={{ width: '100%', height: '100%' }} />;
    }
    return this.props.children;
  }
}

const LogoLoop = lazy(() => import("./component/LogoLoop.jsx"));
const InfiniteSpiral = lazy(() => import("./component/InfiniteSpiral.jsx"));
const Carousel = lazy(() => import("./component/Carousel.jsx"));
const FlexCarousel = lazy(() => import("./component/FlexCarousel.jsx"));

if (typeof window !== 'undefined') {
  const prefetch = () => {
    void import("./component/LogoLoop.jsx");
    void import("./component/InfiniteSpiral.jsx");
    void import("./component/Carousel.jsx");
    void import("./component/FlexCarousel.jsx");
  };
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(prefetch, { timeout: 1500 });
  } else {
    window.setTimeout(prefetch, 1000);
  }
}
const NAV_ITEMS = [
  { href: '#home', id: 'home', label: 'HOME' },
  { href: '#about', id: 'about', label: 'ABOUT' },
  { href: '#skills', id: 'skills', label: 'SKILLS' },
  { href: '#projects', id: 'projects', label: 'PROJECTS' },
  { href: '#achievements', id: 'achievements', label: 'ACHIEVEMENTS' },
  { href: '#contact', id: 'contact', label: 'CONTACT' },
];
// comment2
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

const ThemeToggle = ({ mobile = false }) => {
  const { theme, toggleTheme } = useTheme();
  const nextTheme = theme === 'dark' ? 'light' : 'dark';

  return (
    <button
      type="button"
      className={`r-theme-toggle${mobile ? ' r-theme-toggle--mobile' : ''}`}
      onClick={toggleTheme}
      aria-label={`Switch to ${nextTheme} theme`}
      aria-pressed={theme === 'light'}
      title={`Switch to ${nextTheme} theme`}
    >
      <FiSun aria-hidden="true" />
      <FiMoon aria-hidden="true" />
      <span className="sr-only">{`Switch to ${nextTheme} theme`}</span>
    </button>
  );
};



function App() {
  const { theme } = useTheme();

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      window.__portfolioScrollTrigger?.refresh?.();
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const projects = [
    {
      title: "Star Wars Text-Based RPG Battle Engine",
      description: "Built a console-based, turn-based RPG battle engine in Java set in the Star Wars universe, with Attack/Defend/Heal actions and a 15% critical-hit system. Implemented dynamic enemy scaling and a level-up system, culminating in a final boss battle. Rendered battles with ASCII art visuals.",
      impact: "Demonstrates OOP design patterns, state machines, and game-loop architecture in a playable console experience.",
      stack: ["Java", "Maven", "JDK 21", "OOP"],
      image: "/imgs/starwars_rpg.webp",
      video: "/videos/screenrecording-2026-09-11_21-59-54.mp4",
      link: "https://github.com/gurvindersingh-web/Turn-base-text-RPG-battle-engine",
      year: "Aug 2026",
      role: "Core Developer",
      engine: "JVM / Maven",
      status: "Public"
    },
    {
      title: "Dynamic Memory Management Visualiser",
      description: "A futuristic web-based visualizer for OS memory management algorithms. Features real-time simulation of page replacement algorithms, segmentation, virtual memory, dynamic partitioning, and thrashing.",
      impact: "Turns abstract OS concepts into interactive 3D simulations — used as a study aid by CS students.",
      stack: ["React", "Vite", "GSAP", "Framer Motion", "Three.js", "Tailwind CSS"],
      image: "/imgs/dynamic_memory.webp",
      video: "/videos/screenrecording-2026-09-04_22-01-08.mp4",
      link: "https://github.com/gurvindersingh-web/Dynamic-Memory-Management",
      year: "Apr 2026",
      role: "Full-Stack",
      engine: "Three.js",
      status: "Public"
    },
    {
      title: "Omarchy System Stats Widget",
      description: "A responsive Waybar-style system stats widget for Linux desktop environments built as an open-source plugin for the Omarchy rice. Displays real-time CPU, memory, disk, and network metrics with a minimal, glanceable interface.",
      impact: "Contributed to the Omarchy open-source ecosystem — live plugin used by the community.",
      stack: ["Bash", "Python", "CSS", "Linux", "Waybar"],
      image: "/imgs/omarchy.png",
      video: "/videos/omarchy.mp4",
      link: "https://github.com/gurvindersingh-web",
      year: "Aug 2026",
      role: "Contributor",
      engine: "Waybar / Hyprland",
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

  const certificateItems = [
    { issuer: "CIPHER", wallPosition: "anchor-left", image: "/imgs/certificates/screenshot-2026-09-12_17-57-32.png", title: "Java Programming", href: "/imgs/certificates/screenshot-2026-09-12_17-57-32.png" },
    { issuer: "CIPHER", wallPosition: "anchor-right", image: "/imgs/certificates/Pasted image.png", title: "Low-Level System Design", href: "/imgs/certificates/Pasted image.png" },
    { issuer: "UDEMY", wallPosition: "middle", image: "/imgs/certificates/screenshot-2026-09-12_18-02-51.png", title: "Full Stack Development", href: "/imgs/certificates/screenshot-2026-09-12_18-02-51.png" },
    { issuer: "UDEMY", wallPosition: "middle", image: "/imgs/certificates/screenshot-2026-09-12_18-03-01.png", title: "Node.js", href: "/imgs/certificates/screenshot-2026-09-12_18-03-01.png" },
    { issuer: "GFG", wallPosition: "bottom", image: "/imgs/certificates/screenshot-2026-09-12_17-58-02.png", title: "Java Spring Boot", href: "/imgs/certificates/screenshot-2026-09-12_17-58-02.png" },
    { issuer: "GFG", wallPosition: "anchor-left", image: "/imgs/certificates/Pasted image (2).png", title: "Linear Data Structures", href: "/imgs/certificates/Pasted image (2).png" },
    { issuer: "GFG", wallPosition: "anchor-right", image: "/imgs/certificates/Pasted image (3).png", title: "Introduction to C Programming", href: "/imgs/certificates/Pasted image (3).png" }
  ];

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showInkIntro, setShowInkIntro] = useState(true);
  const [lightboxCert, setLightboxCert] = useState(null);
  const [activeSection, setActiveSection] = useState('');

  const toggleMobileNav = useCallback(() => {
    setMobileNavOpen(prev => !prev);
  }, []);

  const closeMobileNav = useCallback(() => {
    setMobileNavOpen(false);
  }, []);

  // Close mobile nav on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (lightboxCert) setLightboxCert(null);
        else if (mobileNavOpen) setMobileNavOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileNavOpen, lightboxCert]);

  useEffect(() => {
    if (mobileNavOpen) {
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = previousOverflow;
      };
    } else {
      document.body.style.overflow = '';
    }
    return undefined;
  }, [mobileNavOpen]);

  useEffect(() => {
    let ticking = false;

    const updateActiveSection = () => {
      ticking = false;
      const headerEl = document.querySelector('.r-header');
      const line = (headerEl?.getBoundingClientRect().bottom ?? 88) + 5;
      let current = '';
      for (const { id } of NAV_ITEMS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) {
          current = id;
        }
      }
      
      // If we've scrolled to the bottom of the page, activate the last section
      const isAtBottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 20;
      if (isAtBottom && NAV_ITEMS.length > 0) {
        current = NAV_ITEMS[NAV_ITEMS.length - 1].id;
      }

      setActiveSection((previous) => previous === current ? previous : current);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateActiveSection);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    updateActiveSection();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <>
    {showInkIntro && (
      <Suspense fallback={null}>
        <InkIntro onComplete={() => setShowInkIntro(false)} />
      </Suspense>
    )}
    <SmoothScroll>
    <ClickSpark sparkColor="var(--color-accent)" sparkSize={8} sparkRadius={18} sparkCount={9} duration={420}>
    <div className="ryoku-layout" data-theme={theme}>
      {/* Texture overlay */}
      <div className="r-noise" aria-hidden="true"></div>

      {/* Header */}
      <header className="r-header">
        <AnimatedContent className="r-header-logo-slot" eager distance={20} direction="vertical" reverse={true} duration={0.8} delay={0}>
          <div className="r-logo">
            <span className="r-logo-icon">水</span> Gurvinder Singh
          </div>
        </AnimatedContent>
        <AnimatedContent className="r-header-nav-slot" eager distance={20} direction="vertical" reverse={true} duration={0.8} delay={0.1}>
          <nav className="r-nav" aria-label="Main navigation">
            {NAV_ITEMS.map(({ href, id, label }) => (
              <a
                key={id}
                href={href}
                className={activeSection === id ? 'is-active' : undefined}
                aria-current={activeSection === id ? 'location' : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToAnchor(id);
                }}
              >
                {label}
              </a>
            ))}
          </nav>
        </AnimatedContent>
        <div className="r-header-actions-slot">
          <AnimatedContent eager distance={20} direction="vertical" reverse={true} duration={0.8} delay={0.2}>
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="r-version" style={{ textDecoration: 'none', color: 'inherit' }}>
              <span className="r-pulse" style={{ margin: 0 }}></span> OPEN FOR WORK
            </a>
          </AnimatedContent>
          <ThemeToggle />
          {/* Mobile hamburger */}
          <button
            className="r-mobile-toggle"
            onClick={toggleMobileNav}
            aria-expanded={mobileNavOpen}
            aria-controls="mobile-nav"
            aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileNavOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile nav overlay */}
      <nav
        id="mobile-nav"
        className={`r-mobile-nav ${mobileNavOpen ? 'r-mobile-nav--open' : ''}`}
        aria-label="Mobile navigation"
      >
        {NAV_ITEMS.map(({ href, id, label }) => (
          <a
            key={id}
            href={href}
            onClick={(e) => {
              e.preventDefault();
              closeMobileNav();
              scrollToAnchor(id);
            }}
            className={activeSection === id ? 'is-active' : undefined}
            aria-current={activeSection === id ? 'location' : undefined}
          >
            {label}
          </a>
        ))}
        <ThemeToggle mobile />
      </nav>

      <main>
        {/* Hero Section */}
        <section id="home" className="r-hero">
          {/* Left Content Area */}
          <div className="r-left">
            <AnimatedContent eager distance={30} direction="horizontal" duration={0.8} delay={0.2}>
              <div className="r-eyebrow">
                <span className="r-plus">+</span>
                <span className="r-char">水</span>
                <span className="r-dot">-</span>
                FULL-STACK DEVELOPER            <span className="r-star">❖</span>
              </div>
            </AnimatedContent>

            <AnimatedContent eager distance={30} direction="horizontal" duration={0.8} delay={0.3}>
              <h1 className="r-title">Gurvinder Singh</h1>
              <br />
              <div className="r-role">FULL-STACK DEVELOPER·</div>
            </AnimatedContent>

            <AnimatedContent eager distance={30} direction="horizontal" duration={0.8} delay={0.4}>
              <div className="r-subtitle">
                @ gurvindersingh-web · public beta
              </div>
              <div className="r-local-time">
                <span className="r-pulse">●</span> LOCAL <Clock />
              </div>
            </AnimatedContent>

            <AnimatedContent eager distance={30} direction="horizontal" duration={0.8} delay={0.5}>
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
            </AnimatedContent>

            <AnimatedContent eager distance={30} direction="horizontal" duration={0.8} delay={0.6}>
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
            </AnimatedContent>

            <AnimatedContent eager distance={30} direction="horizontal" duration={0.8} delay={0.7}>
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
            </AnimatedContent>

            <AnimatedContent eager distance={30} direction="horizontal" duration={0.8} delay={0.8}>
              <div className="r-actions">
                <button 
                  className="r-btn-primary" 
                  onClick={() => scrollToAnchor('projects')}
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
              <div className="r-contact-row">
                <a href="mailto:gurvindersingh.828384@gmail.com" className="r-contact-link">
                  <span>EMAIL</span>
                </a>
                <span className="r-contact-sep">·</span>
                <a href="https://www.linkedin.com/in/gurvinder-singh-422032311/" target="_blank" rel="noopener noreferrer" className="r-contact-link">
                  <span>LINKEDIN</span>
                </a>
                <span className="r-contact-sep">·</span>
                <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="r-contact-link">
                  <span>RESUME</span>
                </a>
              </div>
            </AnimatedContent>

            <AnimatedContent eager distance={30} direction="horizontal" duration={0.8} delay={0.9}>
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
            </AnimatedContent>
          </div>

          {/* Right Art Area */}
          <AnimatedContent eager
            distance={50} 
            direction="horizontal" 
            reverse={true} 
            duration={1.2} 
            delay={0.6}
            scale={1.05}
            className="r-right"
          >
            <div className="r-halo"></div>
            <div className="r-art">
              {/* The profile picture, uncropped, fading in from left */}
              <picture>
                <source srcSet="/imgs/profile-hero.webp" type="image/webp" />
                <img src="/imgs/profile-hero.webp" alt="Profile" width="1200" height="597" fetchPriority="high" decoding="async" />
              </picture>
            </div>
            <div className="r-scroll-hint">
              <CircularText 
                text="FULL-STACK DEVELOPER •" 
                spinDuration={20} 
                className="r-circular-scroll"
              />
            </div>
          </AnimatedContent>
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
            <LazyErrorBoundary>
            <Suspense fallback={<div style={{ width: '100%', height: '100%' }}></div>}>
              <InfiniteSpiral
                items={[
                  { node: <SiReact size={100} color="var(--color-icon)" /> },
                  { node: <SiTypescript size={100} color="var(--color-icon)" /> },
                  { node: <SiArchlinux size={100} color="var(--color-icon)" /> },
                  { node: <SiDocker size={100} color="var(--color-icon)" /> },
                  { node: <SiGithub size={100} color="var(--color-icon)" /> },
                  { node: <SiSpring size={100} color="var(--color-icon)" /> },
                  { node: <span className="r-watermark-icon">水</span> },
                  { node: <SiNodedotjs size={100} color="var(--color-icon)" /> },
                  { node: <SiExpress size={100} color="var(--color-icon)" /> },
                  { node: <SiMongodb size={100} color="var(--color-icon)" /> },
                  { node: <SiPostgresql size={100} color="var(--color-icon)" /> },
                  { node: <SiGit size={100} color="var(--color-icon)" /> },
                  { node: <SiLinux size={100} color="var(--color-icon)" /> },
                  { node: <SiJavascript size={100} color="var(--color-icon)" /> },
                  { node: <SiHtml5 size={100} color="var(--color-icon)" /> },
                  { node: <SiCss size={100} color="var(--color-icon)" /> },
                  { node: <SiPython size={100} color="var(--color-icon)" /> }
                ]}
                speed={0.3}
                direction="up"
                animationMode="auto"
                imageFit="contain"
                grayscale={0}
                radius={340}
                cardWidth={120}
                cardHeight={120}
                verticalSpacing={100}
                perspective={1500}
                cardsPerTurn={8}
                rotation={-10}
                cardTilt={15}
                cardRadius={12}
                centerScale={1.35}
                edgeFade={0.6}
                edgeBlur={10}
                maxFps={60}
                pauseOnHover={false}
              />
            </Suspense>
            </LazyErrorBoundary>
          </div>
        </section>

        {/* Logo Loop & Skills Section */}
        <section id="skills" className="r-logo-loop-section" style={{ padding: '3rem 0', overflow: 'hidden' }}>
          <LazyErrorBoundary>
          <Suspense fallback={<div style={{ height: '48px', width: '100%' }}></div>}>
            <LogoLoop
              logos={[
                { node: <SiGithub size={48} color="var(--color-icon)" />, alt: 'GitHub', title: 'GitHub' },
                { node: <SiDocker size={48} color="var(--color-icon)" />, alt: 'Docker', title: 'Docker' },
                { node: <SiPrisma size={48} color="var(--color-icon)" />, alt: 'Prisma', title: 'Prisma' },
                { node: <SiSupabase size={48} color="var(--color-icon)" />, alt: 'Supabase', title: 'Supabase' },
                { node: <SiStripe size={48} color="var(--color-icon)" />, alt: 'Stripe', title: 'Stripe' },
                { node: <SiReact size={48} color="var(--color-icon)" />, alt: 'React', title: 'React' },
                { node: <SiNextdotjs size={48} color="var(--color-icon)" />, alt: 'Next.js', title: 'Next.js' },
                { node: <SiTypescript size={48} color="var(--color-icon)" />, alt: 'TypeScript', title: 'TypeScript' }
              ]}
              speed={40}
              direction="left"
              gap={80}
              logoHeight={48}
            />
          </Suspense>
          </LazyErrorBoundary>
        </section>

        {/* Skills Section */}
        <section className="r-skills" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '6rem' }}>
          
          {/* Top Row: Description + Carousel */}
          <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '4rem' }}>
            
            <div style={{ display: 'flex', gap: '4vw', alignItems: 'center', flexWrap: 'wrap' }}>
              <div className="r-about-eyebrow">
                <span className="r-about-eyebrow-text">TECHNICAL FOCUS</span>
                <span className="r-about-eyebrow-icon">水</span>
              </div>
              
              <div className="r-skills-intro" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '750px' }}>
                <h2 className="r-skills-intro-heading type-title">
                  From complex systems<br />to fluid interfaces.
                </h2>
                <p className="r-skills-intro-copy type-body-lg">
                  As a Full-Stack Developer, I specialize in bridging the gap between scalable backend architectures and engaging, high-performance frontend experiences. My engineering journey spans low-level systems and high-level interfaces—from developing object-oriented Java engines and open-source Linux system utilities, to crafting interactive, data-driven 3D web visualizations using React, GSAP, and Three.js. Whether I'm designing game logic or modeling complex OS algorithms, I build software that is structurally sound and visually striking.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                  <div className="r-beta-badge type-label">
                    <span style={{ display: 'inline-block', width: '6px', height: '6px', backgroundColor: 'var(--color-accent-contrast)', borderRadius: '50%' }}></span>
                    BETA - v0.48.0-beta.18
                  </div>
                  <span className="r-beta-note type-label">tracked live from GitHub</span>
                </div>
              </div>
            </div>

            <div className="r-status-image-container" style={{ position: 'relative', width: '100%', maxWidth: '800px', height: 'auto', aspectRatio: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BorderGlow borderRadius={350} className="carousel-border-glow" autoAnimate={true}>
                <LazyErrorBoundary>
                <Suspense fallback={<div style={{ width: '100%', maxWidth: 700, height: 'auto', aspectRatio: 1, borderRadius: '50%' }}></div>}>
                  <Carousel
                    items={carouselItems}
                    baseWidth={700}
                    round={true}
                    autoplay={true}
                    autoplayDelay={3000}
                    loop={true}
                    pauseOnHover={false}
                  />
                </Suspense>
                </LazyErrorBoundary>
              </BorderGlow>
            </div>
          </div>

          <div className="r-skills-content" style={{ width: '100%', maxWidth: 'none', marginLeft: 0 }}>
            <h2 className="r-section-heading">SKILLS</h2>
            <h3 className="r-arsenal-title type-heading">
              Technical Arsenal
            </h3>
            <div className="r-skills-grid">
              <BorderGlow className="r-skill-category" borderRadius={12}>
                <h3><span className="r-pulse"></span>LANGUAGES</h3>
                <div className="r-skill-list r-skill-logos">
                  <span><SiJavascript size={20} style={{ marginRight: '8px' }} /> JavaScript</span>
                  <span><SiTypescript size={20} style={{ marginRight: '8px' }} /> TypeScript</span>
                  <span><SiPython size={20} style={{ marginRight: '8px' }} /> Python</span>
                  <span><SiSpring size={20} style={{ marginRight: '8px' }} /> Java</span>
                  <span><SiHtml5 size={20} style={{ marginRight: '8px' }} /> HTML</span>
                  <span><SiCss size={20} style={{ marginRight: '8px' }} /> CSS</span>
                </div>
              </BorderGlow>
              <BorderGlow className="r-skill-category" borderRadius={12}>
                <h3><span className="r-pulse-red"></span>FRAMEWORKS</h3>
                <div className="r-skill-list r-skill-logos">
                  <span><SiReact size={20} style={{ marginRight: '8px' }} /> React.js</span>
                  <span><SiNextdotjs size={20} style={{ marginRight: '8px' }} /> Next.js</span>
                  <span><SiNodedotjs size={20} style={{ marginRight: '8px' }} /> Node.js</span>
                  <span><SiExpress size={20} style={{ marginRight: '8px' }} /> Express.js</span>
                  <span><SiSpringboot size={20} style={{ marginRight: '8px' }} /> Spring Boot</span>
                </div>
              </BorderGlow>
              <BorderGlow className="r-skill-category" borderRadius={12}>
                <h3><span className="r-pulse"></span>BACKEND & DATA</h3>
                <div className="r-skill-list r-skill-logos">
                  <span><SiPostgresql size={20} style={{ marginRight: '8px' }} /> PostgreSQL</span>
                  <span><SiMongodb size={20} style={{ marginRight: '8px' }} /> MongoDB</span>
                  <span><SiPrisma size={20} style={{ marginRight: '8px' }} /> Prisma ORM</span>
                  <span><SiSupabase size={20} style={{ marginRight: '8px' }} /> Supabase</span>
                  <span><SiStripe size={20} style={{ marginRight: '8px' }} /> Stripe</span>
                </div>
              </BorderGlow>
              <BorderGlow className="r-skill-category" borderRadius={12}>
                <h3><span className="r-pulse-blue"></span>TOOLS & CLOUD</h3>
                <div className="r-skill-list r-skill-logos">
                  <span><SiGit size={20} style={{ marginRight: '8px' }} /> Git/GitHub</span>
                  <span><SiDocker size={20} style={{ marginRight: '8px' }} /> Docker</span>
                  <span><SiLinux size={20} style={{ marginRight: '8px' }} /> Linux</span>
                  <span><SiArchlinux size={20} style={{ marginRight: '8px' }} /> Arch Linux</span>
                  <span><SiHyprland size={20} style={{ marginRight: '8px' }} /> Hyprland</span>
                  <span><SiN8N size={20} style={{ marginRight: '8px' }} /> CI/CD & n8n</span>
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
                <LazyErrorBoundary>
                  <Suspense fallback={<div style={{ width: '100%', minHeight: '400px' }}></div>}>
                    <ProjectCard {...project} index={index + 1} reverse={index % 2 === 1} />
                  </Suspense>
                </LazyErrorBoundary>
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

        {/* Achievements Section */}
        <section id="achievements" className="r-projects-container" style={{ paddingTop: '8rem', position: 'relative' }}>

          <div style={{ position: 'relative', zIndex: 10, width: '100%' }}>
            <div className="r-projects-header">
            <div className="r-about-eyebrow">
              <span className="r-about-eyebrow-text">ACHIEVEMENTS</span>
              <span className="r-about-eyebrow-icon">水</span>
            </div>
            <div className="r-projects-intro">
              <h2 className="r-section-heading">MILESTONES</h2>
              <h3 className="r-projects-title">Recognition</h3>
              <p className="r-projects-lede">
                A collection of certifications, awards, and continuous learning milestones. This section reflects my dedication to mastering new technologies, system design, and open-source contributions.
              </p>
            </div>
          </div>

          <div className="r-achievements-carousel" style={{ width: 'calc(100% - 10px)', height: '1200px', position: 'relative', marginTop: '4rem', marginLeft: '5px', marginRight: '5px' }}>
            <LazyErrorBoundary>
            <Suspense fallback={<div style={{ width: '100%', height: '100%' }}></div>}>
              <FlexCarousel
                items={certificateItems.map((cert) => ({
                  src: cert.image,
                  title: cert.title,
                  subtitle: cert.issuer,
                  alt: cert.title,
                }))}
                preset="arch"
                intro="rise"
                fit="natural"
                cardHeight={0.7}
                gap={64}
                radius={8}
                bend={0.08}
                reach={0.15}
                dispersion={0.1}
                focusOnClick={true}
                autoplay={true}
                interval={2}
                captions={true}
                captureWheel={true}
                onSelect={(_, item) => setLightboxCert({ image: item.src, issuer: item.subtitle, title: item.title })}
              />
            </Suspense>
            </LazyErrorBoundary>
          </div>
          

          </div>
        </section>



      </main>

      <section className="r-install-panel" aria-labelledby="install-heading">
        <div className="r-install-art" aria-hidden="true">
          <img src="/imgs/bone/torii.webp" alt="" width="1600" height="893" loading="lazy" decoding="async" />
        </div>
        <div className="r-install-content">
          <div className="r-install-kicker"><span>水</span><span>·</span><span>CONNECT</span></div>
          <h2 id="install-heading">Two ways in.</h2>
          <div className="r-install-paths">
            <div className="r-install-path">
              <span className="r-install-path-label">HIRING?</span>
              <div className="r-install-path-actions">
                <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="r-btn-primary">RESUME</a>
                <a href="mailto:gurvindersingh.828384@gmail.com" className="r-btn-secondary">EMAIL</a>
              </div>
            </div>
            <div className="r-install-path-divider"></div>
            <div className="r-install-path">
              <span className="r-install-path-label">BUILDING SOMETHING?</span>
              <div className="r-install-path-actions">
                <a href="https://github.com/gurvindersingh-web" target="_blank" rel="noopener noreferrer" className="r-btn-primary">GITHUB</a>
                <a href="https://www.linkedin.com/in/gurvinder-singh-422032311/" target="_blank" rel="noopener noreferrer" className="r-btn-secondary">LINKEDIN</a>
              </div>
            </div>
          </div>
        </div>
        <div className="r-install-rule"></div>
      </section>

      <footer className="r-site-footer" id="contact">
        <div className="r-footer-main">
          <div className="r-footer-brand">
            <span className="r-footer-mark">水</span>
            <p className="r-footer-tagline">
              Building thoughtful digital<br />
              experiences, one system at a time.
            </p>
            <div className="r-footer-status">
              <span className="r-footer-status-dot"></span>
              AVAILABLE FOR SELECTED WORK
            </div>
          </div>

          <div className="r-footer-right">
            <div className="r-footer-links">
              <div className="r-footer-column">
                <span className="r-footer-heading">EXPLORE</span>
                <a href="#about">About</a>
                <a href="#skills">Skills</a>
                <a href="#projects">Projects</a>
                <a href="#contact">Contact</a>
              </div>
              <div className="r-footer-column">
                <span className="r-footer-heading">CONNECT</span>
                <a href="mailto:gurvindersingh.828384@gmail.com">Email</a>
                <a href="https://github.com/gurvindersingh-web" target="_blank" rel="noopener noreferrer">GitHub</a>
                <a href="https://www.linkedin.com/in/gurvinder-singh-422032311/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                <a href="https://x.com/Gurvinder_web" target="_blank" rel="noopener noreferrer">X / Twitter</a>
              </div>
              <div className="r-footer-column">
                <span className="r-footer-heading">ELSEWHERE</span>
                <a href="#projects">Case studies</a>
                <a href="https://github.com/gurvindersingh-web?tab=repositories" target="_blank" rel="noopener noreferrer">Open source</a>
                <a href="#about">Now</a>
              </div>
            </div>

            <div className="r-footer-subscribe">
              <span className="r-footer-subscribe__label">CONNECT</span>
              <CurvedInput
                className="email-pill"
                theme={theme === 'dark' ? 'dark' : 'light'}
                buttonColor="#d4cebd"
                buttonTextColor="#302e2b"
                borderColor="transparent"
                backgroundColor="transparent"
                textColor="var(--color-text)"
                placeholderColor="var(--color-muted)"
                shadowColor="transparent"
                width="100%"
                style={{ maxWidth: '412px' }}
                height={65}
                bend={0.20}
                fontSize={16}
                buttonText="Connect"
                placeholder="Enter your email address"
                onSubmit={(email) => {
                  if (email && email.includes('@')) {
                    const subject = encodeURIComponent('New Connection Request from Portfolio');
                    const body = encodeURIComponent(`Hi Gurvinder,\n\nI'd like to connect. My email is: ${email}\n\nBest,\n`);
                    window.location.href = `mailto:gurvindersingh.828384@gmail.com?subject=${subject}&body=${body}`;
                  } else {
                    alert('Please enter a valid email address.');
                  }
                }}
              />
            </div>
          </div>
        </div>

        <div className="r-footer-wordmark-container" aria-hidden="true" style={{ width: '100%', height: 'clamp(8rem, 22vw, 22rem)', position: 'relative', margin: '2rem auto clamp(4rem, 8vw, 8rem)', zIndex: 0, maxWidth: '1580px', overflow: 'hidden' }}>
          <TechText 
            text="GURVINDER SINGH"
            fontFamily="'Playfair Display', serif"
            fontSize={400}
            color={theme === 'light' ? '#6a5b2e' : '#d4cebd'} 
            accentColor={theme === 'light' ? '#332b16' : '#ffffff'} 
            reach={300}
            speed={1}
            className="r-footer-wordmark-tech"
            style={{ width: '100%', height: '100%', display: 'block' }}
          />
        </div>

        <div className="r-footer-bottom">
          <span>© 2026 Gurvinder Singh</span>
          <span>"Creativity is the greatest rebellion in existence." — Osho</span>
          <a href="#about">Back to top ↑</a>
        </div>
      </footer>

      {/* Side Text */}
      <div className="r-side-text" aria-hidden="true">
        PORTFOLIO · BETA 18 · ARCH LINUX · SHOT ON BLACK
      </div>

      {/* Certificate Lightbox */}
      {lightboxCert && (
        <div className="r-lightbox-overlay" onClick={() => setLightboxCert(null)} role="dialog" aria-modal="true" aria-label={`${lightboxCert.issuer} certificate: ${lightboxCert.title}`}>
          <div className="r-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="r-lightbox-close" onClick={() => setLightboxCert(null)} aria-label="Close lightbox">&times;</button>
            <img src={lightboxCert.image} alt={`${lightboxCert.issuer} Certificate: ${lightboxCert.title}`} className="r-lightbox-img" loading="lazy" decoding="async" width="1280" height="720" />
            <div className="r-lightbox-caption">
              <span className="r-lightbox-tag">{lightboxCert.issuer}</span>
              <span className="r-lightbox-title">{lightboxCert.title}</span>
            </div>
          </div>
        </div>
      )}

    </div>
    </ClickSpark>
    </SmoothScroll>
    </>
  );
}

export default App;
