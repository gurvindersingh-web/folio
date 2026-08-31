import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
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
          <a href="#">ABOUT</a>
          <a href="#">SKILLS</a>
          <a href="#">PROJECTS</a>
          <a href="#">ACHIVEMENTS</a>
          <a href="#">CONTACT</a>
        </nav>
        <div className="r-version">
          <span className="r-square">■</span> v1.0.0
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="r-hero">
        {/* Left Content Area */}
        <div className="r-left">
          <div className="r-eyebrow">
            <span className="r-plus">+</span> 
            <span className="r-char">ヵ</span> 
            <span className="r-dot">-</span> 
            SYSTEM DOSSIER 
            <span className="r-star">❖</span>
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
              <span>Java / TS</span>
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

        {/* Right Art Area */}
        <div className="r-right">
          <div className="r-halo"></div>
          <div className="r-art">
            {/* The profile picture, uncropped, fading in from left */}
            <img src="/imgs/ppf_1080p.png" alt="Profile" />
          </div>
          <div className="r-scroll-hint">
            <div className="r-scroll-text">SCROLL</div>
            <div className="r-scroll-line"></div>
          </div>
        </div>
        </section>

        {/* About Section */}
        <section className="r-about">
          <div className="r-about-eyebrow">
            <span className="r-about-eyebrow-text">WHAT I DO</span>
            <span className="r-about-eyebrow-icon">カ</span>
          </div>
          
          <div className="r-about-content">
            <p className="r-about-large">
              A passionate Full Stack Developer building robust web applications and seamless digital experiences. Specializing in modern JavaScript frameworks and scalable backend architectures.
            </p>
            <p className="r-about-small">
              I craft elegant solutions to complex problems, focusing on performance, clean code, and user-centric design. Always learning, always building.
            </p>
          </div>

          <div className="r-about-graphic">
            <div className="r-graphic-box-new">
              <div className="r-corner r-corner-tl">┌</div>
              <div className="r-corner r-corner-tr">┐</div>
              <div className="r-corner r-corner-bl">└</div>
              <div className="r-corner r-corner-br">┘</div>

              <div className="r-gb-top">00 // GURV-BASE</div>
              
              <div className="r-gb-left">ARCH LINUX</div>
              <div className="r-gb-kanji">基<br/>盤</div>

              <div className="r-gb-ascii">
                <pre>{`       ▚▚▚▚      ▚▚▚▚
    ▚▚▚▚▚▚▚▚    ▚▚▚▚▚▚▚▚
 
   ██████████████████████
   ██████████████████████
 
  ▚▚  ███        ███  ▚▚
  ▚▚  ███ ▚▚▚▚▚▚ ███  ▚▚
  ▚▚  ███ ▚▚▚▚▚▚ ███  ▚▚
  ▚▚  ███ ▚▚▚▚▚▚ ███  ▚▚
  ▚▚  ██████████████  ▚▚
  ▚▚  ██████████████  ▚▚
  ▚▚                  ▚▚
  ▚▚  ▚▚▚▚▚▚▚▚▚▚▚▚▚▚  ▚▚`}
                </pre>
              </div>

              <div className="r-gb-overlay-text">
                One source of truth. The<br/>
                repo is the machine, a<br/>
                live arch linux<br/>
                target.
              </div>

              <div className="r-gb-bottom">
                <div className="r-gb-barcode-real"></div>
                <div className="r-gb-ka">カ</div>
              </div>
            </div>
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