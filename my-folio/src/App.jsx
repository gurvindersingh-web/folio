import { useState, useEffect } from 'react';
import './App.css';
import LogoLoop from "./component/LogoLoop.jsx"
import AnimatedContent from "./component/AnimatedContent.jsx"
import InfiniteSpiral from "./component/InfiniteSpiral.jsx"
import Carousel from "./component/Carousel.jsx"
import BorderGlow from "./component/BorderGlow.jsx"
import ProjectCard from "./component/ProjectCard.jsx"
import ScrollStack, { ScrollStackItem } from "./component/ScrollStack.jsx"
import { FiMonitor, FiServer, FiDatabase, FiTerminal } from 'react-icons/fi';
function App() {
  const [time, setTime] = useState("");
  const [scrollY, setScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const projects = [
    {
      title: "Dynamic Memory Management",
      description: "Visualise FIFO, LRU, and Optimal page replacement algorithms with stunning animations, TLB simulation, working set tracking, and Belady's anomaly detection.",
      stack: ["C", "C++", "OS Concepts", "Algorithms"],
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1600&auto=format&fit=crop",
      link: "https://github.com/gurvindersingh-web/Dynamic-Memory-Management"
    },
    {
      title: "Text RPG Battle Engine",
      description: "A complete turn-based RPG battle engine built in C++. Features dynamic stats, enemy AI, inventory management, and tactical combat mechanics.",
      stack: ["C++", "OOP", "Game Engine", "Terminal UI"],
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop",
      link: "https://github.com/gurvindersingh-web/Turn-base-text-RPG-battle-engine"
    },
    {
      title: "Spatiotemporal Climate AI",
      description: "A machine learning pipeline for detecting climate anomalies over space and time. Processes massive datasets to predict environmental outliers.",
      stack: ["Python", "TensorFlow", "Pandas", "Data Science"],
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1600&auto=format&fit=crop",
      link: "https://github.com/gurvindersingh-web/Spatiotemporal-climate-anomaly-detection-AI"
    },
    {
      title: "RMS Automation Tool",
      description: "Revamped automation architecture for RMS systems, improving efficiency and scripting reliability through extensive Python tooling.",
      stack: ["Python", "Automation", "Scripting", "Shell"],
      image: "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?q=80&w=1600&auto=format&fit=crop",
      link: "https://github.com/gurvindersingh-web/REVAMPING-RMS-AUTOMATION.git"
    },
    {
      title: "Future Endeavor",
      description: "My latest secret project currently in development. Blending cutting-edge web technologies with a highly polished user experience.",
      stack: ["React", "Node.js", "MongoDB", "Web3"],
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1600&auto=format&fit=crop",
      link: ""
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

  useEffect(() => {
    // Clock Timer
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);

    // Scroll Listener for Parallax
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearInterval(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="ryoku-layout">
      {/* Texture overlay */}
      <div className="r-noise"></div>

      {/* Header */}
      <header className="r-header">
        <div className="r-logo">
          <span className="r-logo-icon">カ</span> Gurvinder Singh
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
                <span className="r-char">ヵ</span>
                <span className="r-dot">-</span>
                FULL-STACK DEVELOPER            <span className="r-star">❖</span>
              </div>

              <h1 className="r-title">Gurvinder Singh</h1>

              <div className="r-subtitle">
                @ gurvindersingh-web · public beta
              </div>

              <div className="r-local-time">
                <span className="r-pulse">●</span> LOCAL {time || "11:20:47"}
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
                <button className="r-btn-primary">VIEW PROJECTS</button>
                <button className="r-btn-secondary">GITHUB</button>
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
              <img src="/imgs/ppf_1080p_fixed.png" alt="Profile" />
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
            <span className="r-about-eyebrow-icon">カ</span>
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
            <InfiniteSpiral
              items={[
                'https://cdn.simpleicons.org/react/c6c1b9',
                'https://cdn.simpleicons.org/typescript/c6c1b9',
                'https://cdn.simpleicons.org/archlinux/c6c1b9',
                'https://cdn.simpleicons.org/docker/c6c1b9',
                'https://cdn.simpleicons.org/github/c6c1b9',
                'https://cdn.simpleicons.org/spring/c6c1b9',
                'https://cdn.simpleicons.org/vite/c6c1b9',
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
              edgeBlur={8}
              pauseOnHover={false}
            />
          </div>
        </section>

        {/* Logo Loop & Skills Section */}
        <section id="skills" className="r-logo-loop-section" style={{ padding: '3rem 0', overflow: 'hidden' }}>
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
        </section>

        {/* Skills Section */}
        <section className="r-skills">
          <div className="r-about-eyebrow">
            <span className="r-about-eyebrow-text">MY SKILLS</span>
            <span className="r-about-eyebrow-icon">カ</span>
          </div>
          
          <div className="r-skills-carousel-container" style={{ flex: 1, maxWidth: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BorderGlow borderRadius={165} backgroundColor="#121212" className="carousel-border-glow">
              <Carousel 
                items={carouselItems}
                baseWidth={330}
                round={true}
                autoplay={true} 
                autoplayDelay={3000}
                loop={true}
                pauseOnHover={false}
              />
            </BorderGlow>
          </div>

          <div className="r-skills-content">
            <h2 className="r-section-heading">SKILLS</h2>
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
                </div>
              </BorderGlow>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="r-projects-container">
          <div className="r-section-header" style={{ marginBottom: '4rem', textAlign: 'center' }}>
            <div className="r-about-eyebrow" style={{ alignSelf: 'center', marginBottom: '1rem' }}>
              <span className="r-about-eyebrow-text">PROJECTS</span>
              <span className="r-about-eyebrow-icon">カ</span>
            </div>
            <h2 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
              Featured Works
            </h2>
            <p style={{ color: 'rgba(212, 206, 189, 0.6)', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem', lineHeight: '1.6' }}>
              A collection of my recent projects, showcasing dynamic memory management, AI anomaly detection, and interactive game engines. Scroll to explore.
            </p>
          </div>
          
          <div className="r-projects-list">
            <ScrollStack
              useWindowScroll={true}
              itemDistance={80}
              itemScale={0.02}
              itemStackDistance={20}
              stackPosition="15%"
              scaleEndPosition="5%"
              baseScale={0.9}
              blurAmount={1.5}
              className="r-projects-stack"
            >
              {projects.map((project, index) => (
                <ScrollStackItem key={index} itemClassName="r-project-stack-item">
                  <ProjectCard 
                    title={project.title}
                    description={project.description}
                    stack={project.stack}
                    image={project.image}
                    link={project.link}
                    reverse={index % 2 !== 0}
                  />
                </ScrollStackItem>
              ))}
            </ScrollStack>
          </div>
        </section>

      </main>
      {/* Side Text */}
      <div className="r-side-text">
        PORTFOLIO · BETA 18 · ARCH LINUX · SHOT ON BLACK
      </div>
    </div>
  );
}

export default App;