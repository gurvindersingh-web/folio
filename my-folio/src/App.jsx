import React, { useState, useEffect, useCallback, useRef, memo, Suspense, lazy, Component } from 'react';
import './App.css';
import AnimatedContent from './component/AnimatedContent.jsx';
import ClickSpark from './component/ClickSpark.jsx';
import SmoothScroll from './component/SmoothScroll.jsx';
import Navbar from './component/Navbar.jsx';
import { scrollToAnchor } from './utils/scroll.js';
import InkIntro from './component/InkIntro.jsx';
import TechText from './component/TechText.jsx';
import CurvedInput from './component/CurvedInput.jsx';
import CircularText from './component/CircularText.jsx';
import GradualBlur from './component/GradualBlur.jsx';
import { FiMonitor, FiServer, FiDatabase, FiTerminal, FiArrowUpRight, FiMenu, FiX, FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from './themeContext.jsx';
import {
  SiReact, SiTypescript, SiArchlinux, SiDocker, SiGithub, SiSpring, SiNodedotjs, SiExpress, SiMongodb, SiPostgresql, SiGit, SiLinux, SiJavascript, SiHtml5, SiCss, SiPython, SiPrisma, SiSupabase, SiStripe, SiNextdotjs, SiSpringboot, SiN8N, SiHyprland
} from 'react-icons/si';

/* ───────────── Lazy loaders (shared by lazy() and idle prefetch) ───────────── */
const loaders = {
  BorderGlow: () => import('./component/BorderGlow.jsx'),
  ProjectCard: () => import('./component/ProjectCard.jsx'),
  LogoLoop: () => import('./component/LogoLoop.jsx'),
  InfiniteSpiral: () => import('./component/InfiniteSpiral.jsx'),
  Carousel: () => import('./component/Carousel.jsx'),
  FlexCarousel: () => import('./component/FlexCarousel.jsx'),
};
const BorderGlow = lazy(loaders.BorderGlow);
const ProjectCard = lazy(loaders.ProjectCard);
const LogoLoop = lazy(loaders.LogoLoop);
const InfiniteSpiral = lazy(loaders.InfiniteSpiral);
const Carousel = lazy(loaders.Carousel);
const FlexCarousel = lazy(loaders.FlexCarousel);

if (typeof window !== 'undefined') {
  const prefetch = () => Object.values(loaders).forEach((load) => load().catch(() => {}));
  if ('requestIdleCallback' in window) window.requestIdleCallback(prefetch, { timeout: 1500 });
  else window.setTimeout(prefetch, 1000);
}

// Error boundary for lazy-loaded components
class LazyErrorBoundary extends Component {
  state = { hasError: false };
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

/* ───────────── Static data (module scope → stable references, no per-render allocation) ───────────── */
const EMAIL = 'gurvindersingh.828384@gmail.com';
const GITHUB_URL = 'https://github.com/gurvindersingh-web';
const LINKEDIN_URL = 'https://www.linkedin.com/in/gurvinder-singh-422032311/';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PROJECTS = [
  {
    title: 'Star Wars Text-Based RPG Battle Engine',
    description: 'Built a console-based, turn-based RPG battle engine in Java set in the Star Wars universe, with Attack/Defend/Heal actions and a 15% critical-hit system. Implemented dynamic enemy scaling and a level-up system, culminating in a final boss battle. Rendered battles with ASCII art visuals.',
    impact: 'Demonstrates OOP design patterns, state machines, and game-loop architecture in a playable console experience.',
    stack: ['Java', 'Maven', 'JDK 21', 'OOP'],
    image: '/imgs/starwars_rpg.webp',
    video: '/videos/screenrecording-2026-09-11_21-59-54.mp4',
    link: 'https://github.com/gurvindersingh-web/Turn-base-text-RPG-battle-engine',
    year: 'Aug 2026',
    role: 'Core Developer',
    engine: 'JVM / Maven',
    status: 'Public',
  },
  {
    title: 'Dynamic Memory Management Visualiser',
    description: 'A futuristic web-based visualizer for OS memory management algorithms. Features real-time simulation of page replacement algorithms, segmentation, virtual memory, dynamic partitioning, and thrashing.',
    impact: 'Turns abstract OS concepts into interactive 3D simulations — used as a study aid by CS students.',
    stack: ['React', 'Vite', 'GSAP', 'Framer Motion', 'Three.js', 'Tailwind CSS'],
    image: '/imgs/dynamic_memory.webp',
    video: '/videos/screenrecording-2026-09-04_22-01-08.mp4',
    link: 'https://github.com/gurvindersingh-web/Dynamic-Memory-Management',
    year: 'Apr 2026',
    role: 'Full-Stack',
    engine: 'Three.js',
    status: 'Public',
  },
  {
    title: 'Omarchy System Stats Widget',
    description: 'A responsive Waybar-style system stats widget for Linux desktop environments built as an open-source plugin for the Omarchy rice. Displays real-time CPU, memory, disk, and network metrics with a minimal, glanceable interface.',
    impact: 'Contributed to the Omarchy open-source ecosystem — live plugin used by the community.',
    stack: ['Bash', 'Python', 'CSS', 'Linux', 'Waybar'],
    image: '/imgs/omarchy.png',
    video: '/videos/omarchy.mp4',
    link: GITHUB_URL,
    year: 'Aug 2026',
    role: 'Contributor',
    engine: 'Waybar / Hyprland',
    status: 'Public',
  },
];

const CAROUSEL_ITEMS = [
  { id: 1, title: 'Frontend', description: 'Building responsive, modern web applications with React 19 and JavaScript.', icon: <FiMonitor className="carousel-icon" /> },
  { id: 2, title: 'Backend', description: 'Designing scalable APIs and services with Node.js and Spring Frameworks.', icon: <FiServer className="carousel-icon" /> },
  { id: 3, title: 'Database', description: 'Modeling and managing data with PostgreSQL and MongoDB.', icon: <FiDatabase className="carousel-icon" /> },
  { id: 4, title: 'DevOps', description: 'Containerizing with Docker and orchestrating with Kubernetes on Linux environments.', icon: <FiTerminal className="carousel-icon" /> },
];

const CERTIFICATES = [
  { issuer: 'CIPHER', image: '/imgs/certificates/screenshot-2026-09-12_17-57-32.png', title: 'Java Programming' },
  { issuer: 'CIPHER', image: '/imgs/certificates/Pasted image.png', title: 'Low-Level System Design' },
  { issuer: 'UDEMY', image: '/imgs/certificates/screenshot-2026-09-12_18-02-51.png', title: 'Full Stack Development' },
  { issuer: 'UDEMY', image: '/imgs/certificates/screenshot-2026-09-12_18-03-01.png', title: 'Node.js' },
  { issuer: 'GFG', image: '/imgs/certificates/screenshot-2026-09-12_17-58-02.png', title: 'Java Spring Boot' },
  { issuer: 'GFG', image: '/imgs/certificates/Pasted image (2).png', title: 'Linear Data Structures' },
  { issuer: 'GFG', image: '/imgs/certificates/Pasted image (3).png', title: 'Introduction to C Programming' },
];

// File names contain spaces/parentheses → encode so every browser/CDN resolves them.
const CERT_CAROUSEL_ITEMS = CERTIFICATES.map((cert) => ({
  src: encodeURI(cert.image),
  title: cert.title,
  subtitle: cert.issuer,
  alt: cert.title,
}));

const ICON_COLOR = 'var(--color-icon)';
const SPIRAL_ICONS = [SiReact, SiTypescript, SiArchlinux, SiDocker, SiGithub, SiSpring, null, SiNodedotjs, SiExpress, SiMongodb, SiPostgresql, SiGit, SiLinux, SiJavascript, SiHtml5, SiCss, SiPython];
const SPIRAL_ITEMS = SPIRAL_ICONS.map((Icon) => ({
  node: Icon ? <Icon size={100} color={ICON_COLOR} /> : <span className="r-watermark-icon">水</span>,
}));

const LOGO_LIST = [
  [SiGithub, 'GitHub'], [SiDocker, 'Docker'], [SiPrisma, 'Prisma'], [SiSupabase, 'Supabase'],
  [SiStripe, 'Stripe'], [SiReact, 'React'], [SiNextdotjs, 'Next.js'], [SiTypescript, 'TypeScript'],
];
const LOGO_ITEMS = LOGO_LIST.map(([Icon, name]) => ({ node: <Icon size={48} color={ICON_COLOR} />, alt: name, title: name }));

const SKILL_GROUPS = [
  { title: 'LANGUAGES', pulse: 'r-pulse', items: [[SiJavascript, 'JavaScript', '#F7DF1E'], [SiTypescript, 'TypeScript', '#3178C6'], [SiPython, 'Python', '#3776AB'], [SiSpring, 'Java', '#ED8B00'], [SiHtml5, 'HTML', '#E34F26'], [SiCss, 'CSS', '#1572B6']] },
  { title: 'FRAMEWORKS', pulse: 'r-pulse-red', items: [[SiReact, 'React.js', '#61DAFB'], [SiNextdotjs, 'Next.js', '#FFFFFF'], [SiNodedotjs, 'Node.js', '#339933'], [SiExpress, 'Express.js', '#FFFFFF'], [SiSpringboot, 'Spring Boot', '#6DB33F']] },
  { title: 'BACKEND & DATA', pulse: 'r-pulse', items: [[SiPostgresql, 'PostgreSQL', '#4169E1'], [SiMongodb, 'MongoDB', '#47A248'], [SiPrisma, 'Prisma ORM', '#FFFFFF'], [SiSupabase, 'Supabase', '#3ECF8E'], [SiStripe, 'Stripe', '#635BFF']] },
  { title: 'TOOLS & CLOUD', pulse: 'r-pulse-blue', items: [[SiGit, 'Git/GitHub', '#F05032'], [SiDocker, 'Docker', '#2496ED'], [SiLinux, 'Linux', '#FCC624'], [SiArchlinux, 'Arch Linux', '#1793D1'], [SiHyprland, 'Hyprland', '#00A8F3'], [SiN8N, 'CI/CD & n8n', '#FF6666']] },
];

const ICON_GAP = { marginRight: '8px' };
const BLANK_FILL = <div style={{ width: '100%', height: '100%' }} />;

/* ───────────── Helpers / hooks ───────────── */
const useBodyScrollLock = (isLocked) => {
  useEffect(() => {
    if (isLocked) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isLocked]);
};

const handleAnchorClick = (e) => {
  const id = e.currentTarget.getAttribute('href')?.slice(1);
  if (!id) return;
  e.preventDefault();
  scrollToAnchor(id);
};

const handleConnectSubmit = (raw) => {
  const email = (raw || '').trim();
  if (!EMAIL_RE.test(email)) {
    alert('Please enter a valid email address.');
    return;
  }
  const subject = encodeURIComponent('New Connection Request from Portfolio');
  const body = encodeURIComponent(`Hi Gurvinder,\n\nI'd like to connect. My email is: ${email}\n\nBest,\n`);
  window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
};

const openGithub = () => window.open(GITHUB_URL, '_blank', 'noopener,noreferrer');
const goToProjects = () => scrollToAnchor('projects');


/* ───────────── Small components ───────────── */
const formatTime = () => new Date().toLocaleTimeString('en-US', { hourCycle: 'h23' });

const Clock = () => {
  const [time, setTime] = useState(formatTime);

  useEffect(() => {
    const timer = setInterval(() => setTime(formatTime()), 1000);
    return () => clearInterval(timer);
  }, []);

  return <>{time}</>;
};


const Hero = memo(function Hero() {
  return (
    <section id="home" className="r-hero">
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
          <div className="r-subtitle">@ gurvindersingh-web · public beta</div>
          <div className="r-local-time">
            <span className="r-pulse">●</span> LOCAL <Clock />
          </div>
        </AnimatedContent>

        <AnimatedContent eager distance={30} direction="horizontal" duration={0.8} delay={0.5}>
          <div className="r-specs">
            {[
              ['FRONTEND', 'React 19'],
              ['BACKEND', 'Spring Boot'],
              ['LANGUAGE', 'Java/JS/TS'],
              ['PLATFORM', 'Arch Linux'],
              ['FOCUS', 'Security'],
            ].map(([label, value]) => (
              <div className="r-spec-row" key={label}>
                <span>{label}</span>
                <span className="r-dots"></span>
                <span>{value}</span>
              </div>
            ))}
          </div>
        </AnimatedContent>

        <AnimatedContent eager distance={30} direction="horizontal" duration={0.8} delay={0.6}>
          <div className="r-vitals">
            {[
              [`${PROJECTS.length}+`, 'PROJECTS'],
              ['12+', 'SKILLS'],
              [String(CERTIFICATES.length), 'CERTS'],
              ['1', 'DEV'],
            ].map(([num, label]) => (
              <div className="r-vital-box" key={label}>
                <div className="r-vital-num">{num}</div>
                <div className="r-vital-lbl">{label}</div>
              </div>
            ))}
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
            <div className="r-ramp-text">INK RAMP · 4.6:1 → 12:1</div>
          </div>
        </AnimatedContent>

        <AnimatedContent eager distance={30} direction="horizontal" duration={0.8} delay={0.8}>
          <div className="r-actions">
            <button type="button" className="r-btn-primary" onClick={goToProjects}>VIEW PROJECTS</button>
            <button type="button" className="r-btn-secondary" onClick={openGithub}>GITHUB</button>
          </div>
          <div className="r-contact-row">
            <a href={`mailto:${EMAIL}`} className="r-contact-link"><span>EMAIL</span></a>
            <span className="r-contact-sep">·</span>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="r-contact-link"><span>LINKEDIN</span></a>
            <span className="r-contact-sep">·</span>
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="r-contact-link"><span>RESUME</span></a>
          </div>
        </AnimatedContent>

        <AnimatedContent eager distance={30} direction="horizontal" duration={0.8} delay={0.9}>
          <div className="r-stars">★ Available for work · Full-Stack Developer · Linux · Web Sec</div>
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

      <AnimatedContent eager distance={50} direction="horizontal" reverse={true} duration={1.2} delay={0.6} scale={1.05} className="r-right">
        <div className="r-halo"></div>
        <div className="r-art">
          <img src="/imgs/profile-hero.webp" alt="Gurvinder Singh" width="1200" height="597" fetchPriority="high" decoding="async" />
        </div>
        <div className="r-scroll-hint">
          <CircularText text="FULL-STACK DEVELOPER •" spinDuration={20} className="r-circular-scroll" />
        </div>
      </AnimatedContent>
    </section>
  );
});

const About = memo(function About() {
  return (
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
          <Suspense fallback={BLANK_FILL}>
            <InfiniteSpiral
              items={SPIRAL_ITEMS}
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
  );
});

const LogoLoopSection = memo(function LogoLoopSection() {
  return (
    <section id="skills" className="r-logo-loop-section" style={{ padding: '3rem 0', overflow: 'hidden' }}>
      <LazyErrorBoundary>
        <Suspense fallback={<div style={{ height: '48px', width: '100%' }}></div>}>
          <LogoLoop logos={LOGO_ITEMS} speed={40} direction="left" gap={80} logoHeight={48} />
        </Suspense>
      </LazyErrorBoundary>
    </section>
  );
});

const Skills = memo(function Skills() {
  return (
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
          <LazyErrorBoundary>
            <Suspense fallback={<div style={{ width: '100%', maxWidth: 700, height: 'auto', aspectRatio: 1, borderRadius: '50%' }}></div>}>
              <BorderGlow borderRadius={350} className="carousel-border-glow" autoAnimate={true}>
                <Carousel items={CAROUSEL_ITEMS} baseWidth={700} round={true} autoplay={true} autoplayDelay={3000} loop={true} pauseOnHover={false} />
              </BorderGlow>
            </Suspense>
          </LazyErrorBoundary>
        </div>
      </div>

      <div className="r-skills-content" style={{ width: '100%', maxWidth: 'none', marginLeft: 0 }}>
        <h2 className="r-section-heading">SKILLS</h2>
        <h3 className="r-arsenal-title type-heading">Technical Arsenal</h3>
        <div className="r-skills-grid">
          <LazyErrorBoundary fallback={BLANK_FILL}>
            <Suspense fallback={null}>
              {SKILL_GROUPS.map(({ title, pulse, items }) => (
                <BorderGlow key={title} className="r-skill-category" borderRadius={12}>
                  <h3><span className={pulse}></span>{title}</h3>
                  <div className="r-skill-list r-skill-logos">
                    {items.map(([Icon, name, color]) => (
                      <span key={name}><Icon size={20} color={color} style={ICON_GAP} /> {name}</span>
                    ))}
                  </div>
                </BorderGlow>
              ))}
            </Suspense>
          </LazyErrorBoundary>
        </div>
      </div>
    </section>
  );
});

const Projects = memo(function Projects() {
  return (
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
        {PROJECTS.map((project, index) => (
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
        <a className="project-card__link project-card__link--primary" href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
          GitHub
          <FiArrowUpRight size={14} />
        </a>
      </div>
    </section>
  );
});

const Achievements = memo(function Achievements({ onSelect }) {
  return (
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
            <Suspense fallback={BLANK_FILL}>
              <FlexCarousel
                items={CERT_CAROUSEL_ITEMS}
                preset="arch"
                intro="rise"
                fit="natural"
                cardHeight={0.7}
                gap={64}
                radius={8}
                bend={0}
                reach={0.15}
                dispersion={0}
                focusOnClick={true}
                autoplay={true}
                interval={2}
                captions={true}
                captureWheel={true}
                onSelect={onSelect}
              />
            </Suspense>
          </LazyErrorBoundary>
        </div>
      </div>
    </section>
  );
});

const InstallPanel = memo(function InstallPanel() {
  return (
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
              <a href={`mailto:${EMAIL}`} className="r-btn-secondary">EMAIL</a>
            </div>
          </div>
          <div className="r-install-path-divider"></div>
          <div className="r-install-path">
            <span className="r-install-path-label">BUILDING SOMETHING?</span>
            <div className="r-install-path-actions">
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="r-btn-primary">GITHUB</a>
              <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="r-btn-secondary">LINKEDIN</a>
            </div>
          </div>
        </div>
      </div>
      <div className="r-install-rule"></div>
    </section>
  );
});

const WORDMARK_STYLE = { width: '100%', height: '100%', display: 'block' };
const WORDMARK_BOX_STYLE = { width: '100%', height: 'clamp(8rem, 22vw, 22rem)', position: 'relative', margin: '2rem auto clamp(4rem, 8vw, 8rem)', zIndex: 0, maxWidth: '1580px', overflow: 'hidden' };
const EMAIL_PILL_STYLE = { maxWidth: '500px' };

const Footer = memo(function Footer({ theme }) {
  const isLight = theme === 'light';
  return (
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
              <a href="#about" onClick={handleAnchorClick}>About</a>
              <a href="#skills" onClick={handleAnchorClick}>Skills</a>
              <a href="#projects" onClick={handleAnchorClick}>Projects</a>
              <a href="#contact" onClick={handleAnchorClick}>Contact</a>
            </div>
            <div className="r-footer-column">
              <span className="r-footer-heading">CONNECT</span>
              <a href={`mailto:${EMAIL}`}>Email</a>
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href="https://x.com/Gurvinder_web" target="_blank" rel="noopener noreferrer">X / Twitter</a>
            </div>
            <div className="r-footer-column">
              <span className="r-footer-heading">ELSEWHERE</span>
              <a href="#projects" onClick={handleAnchorClick}>Case studies</a>
              <a href={`${GITHUB_URL}?tab=repositories`} target="_blank" rel="noopener noreferrer">Open source</a>
              <a href="#about" onClick={handleAnchorClick}>Now</a>
            </div>
          </div>

          <div className="r-footer-subscribe">
            <span className="r-footer-subscribe__label">CONNECT</span>
            <CurvedInput
              className="email-pill"
              theme={isLight ? 'light' : 'dark'}
              buttonColor="#d4cebd"
              buttonTextColor="#302e2b"
              borderColor="transparent"
              backgroundColor="transparent"
              textColor="var(--color-text)"
              placeholderColor="var(--color-muted)"
              shadowColor="transparent"
              iconColor="#000000"
              width="100%"
              style={EMAIL_PILL_STYLE}
              height={85}
              bend={30}
              fontSize={18}
              buttonText="Connect"
              placeholder="Enter your email address"
              onSubmit={handleConnectSubmit}
            />
          </div>
        </div>
      </div>

      <div className="r-footer-wordmark-container" aria-hidden="true" style={WORDMARK_BOX_STYLE}>
        <TechText
          text="GURVINDER SINGH"
          fontFamily="'Playfair Display', serif"
          fontSize={400}
          color={isLight ? '#6a5b2e' : '#d4cebd'}
          accentColor={isLight ? '#332b16' : '#ffffff'}
          reach={300}
          speed={1}
          className="r-footer-wordmark-tech"
          style={WORDMARK_STYLE}
        />
      </div>

      <div className="r-footer-bottom">
        <span>© 2026 Gurvinder Singh</span>
        <span>"Creativity is the greatest rebellion in existence." — Osho</span>
        <a href="#home" onClick={handleAnchorClick}>Back to top ↑</a>
      </div>
    </footer>
  );
});

const Lightbox = memo(function Lightbox({ cert, onClose }) {
  const closeRef = useRef(null);

  useBodyScrollLock(true);

  useEffect(() => {
    const opener = document.activeElement;
    closeRef.current?.focus();
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      if (opener instanceof HTMLElement) opener.focus({ preventScroll: true });
    };
  }, [onClose]);

  return (
    <div className="r-lightbox-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={`${cert.issuer} certificate: ${cert.title}`}>
      <div className="r-lightbox-content" onClick={(e) => e.stopPropagation()}>
        <button ref={closeRef} type="button" className="r-lightbox-close" onClick={onClose} aria-label="Close lightbox">&times;</button>
        <img src={cert.image} alt={`${cert.issuer} Certificate: ${cert.title}`} className="r-lightbox-img" decoding="async" width="1280" height="720" />
        <div className="r-lightbox-caption">
          <span className="r-lightbox-tag">{cert.issuer}</span>
          <span className="r-lightbox-title">{cert.title}</span>
        </div>
      </div>
    </div>
  );
});

/* ───────────── App ───────────── */
function App() {
  const { theme } = useTheme();
  const [showInkIntro, setShowInkIntro] = useState(true);
  const [lightboxCert, setLightboxCert] = useState(null);
  const [showTopBlur, setShowTopBlur] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const aboutSection = document.getElementById('about');
      if (aboutSection) {
        const rect = aboutSection.getBoundingClientRect();
        setShowTopBlur(rect.top < 0);
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      window.__portfolioScrollTrigger?.refresh?.();
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const handleIntroComplete = useCallback(() => setShowInkIntro(false), []);
  const closeLightbox = useCallback(() => setLightboxCert(null), []);
  const handleCertSelect = useCallback((_, item) => {
    setLightboxCert({ image: item.src, issuer: item.subtitle, title: item.title });
  }, []);

  return (
    <>
      {showInkIntro && (
        <Suspense fallback={null}>
          <InkIntro onComplete={handleIntroComplete} />
        </Suspense>
      )}
      <SmoothScroll>
        <ClickSpark sparkColor="var(--color-accent)" sparkSize={8} sparkRadius={18} sparkCount={9} duration={420}>
          <div className="ryoku-layout" data-theme={theme}>
            {/* Texture overlay */}
            <div className="r-noise" aria-hidden="true"></div>
            {showTopBlur && (
              <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 999 }}>
                <GradualBlur preset="footer" target="parent" animated={true} />
              </div>
            )}
            <Navbar />
            <main>
              <Hero />
              <About />
              <LogoLoopSection />
              <Skills />
              <Projects />
              <Achievements onSelect={handleCertSelect} />
            </main>

            <InstallPanel />
            <Footer theme={theme} />

            {/* Side Text */}
            <div className="r-side-text" aria-hidden="true">
              PORTFOLIO · BETA 18 · ARCH LINUX · SHOT ON BLACK
            </div>

            {lightboxCert && <Lightbox cert={lightboxCert} onClose={closeLightbox} />}
          </div>
        </ClickSpark>
      </SmoothScroll>
    </>
  );
}

export default App;