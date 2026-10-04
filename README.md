# FOLIO — Personal Developer Portfolio

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:121212,100:2a2a2a&height=180&section=header&text=GURVINDER%20SINGH&fontSize=42&fontColor=d4cebd&fontAlignY=35&desc=Full-Stack%20Developer%20%7C%20Creative%20Engineer&descAlignY=58&descSize=18" width="100%"/>

<br>

<strong>A modern, high-performance developer portfolio built with React 19, Vite, GSAP, Motion, OGL, and Lenis.</strong>

<br><br>

<a href="https://gurvindersingh-web.github.io">
<img src="https://img.shields.io/badge/Live%20Portfolio-121212?style=for-the-badge&logo=googlechrome&logoColor=d4cebd"/>
</a>
<a href="https://github.com/gurvindersingh-web/folio">
<img src="https://img.shields.io/github/stars/gurvindersingh-web/folio?style=for-the-badge&logo=github&logoColor=d4cebd"/>
</a>
<a href="https://github.com/gurvindersingh-web/folio">
<img src="https://img.shields.io/github/last-commit/gurvindersingh-web/folio?style=for-the-badge&logo=git&logoColor=d4cebd"/>
</a>

<br><br>

<img src="https://skillicons.dev/icons?i=react,vite,js,ts,css,tailwind,git,docker&theme=dark" />

<br><br>

<a href="#features">Features</a>
  •   <a href="#tech-stack">Tech Stack</a>
  •   <a href="#architecture">Architecture</a>
  •   <a href="#getting-started">Getting Started</a>

</div>

---

## ABOUT

**Folio** is my personal developer portfolio — a continuously evolving platform for showcasing projects, technical skills, experiments, and professional work.

The interface combines **frontend engineering, motion design, WebGL experimentation, and performance-focused development** into a single interactive experience.

> **"Unfinished on purpose, in the open."**

The portfolio is treated as a living engineering project rather than a static resume.

### Design Principles

| Principle           | Description                               |
| ------------------- | ----------------------------------------- |
| **Performance**     | Fast loading and efficient rendering      |
| **Motion**          | Animation used to communicate interaction |
| **Typography**      | Strong hierarchy and readable content     |
| **Minimalism**      | Content-focused visual system             |
| **Responsiveness**  | Consistent experience across devices      |
| **Experimentation** | WebGL, shaders and interactive effects    |

---

## FEATURES

<table>
<tr>
<td width="50%">

<h3>Performance</h3>

<img src="https://img.shields.io/badge/React%2019-121212?style=flat-square&logo=react&logoColor=61DAFB"/>
<img src="https://img.shields.io/badge/Vite-121212?style=flat-square&logo=vite&logoColor=646CFF"/>

<br><br>

Built around React 19 and Vite with a focus on efficient rendering, optimized assets and minimal runtime overhead.

</td>

<td width="50%">

<h3>Visual System</h3>

<img src="https://img.shields.io/badge/CSS-121212?style=flat-square&logo=css3&logoColor=1572B6"/>
<img src="https://img.shields.io/badge/Tailwind-121212?style=flat-square&logo=tailwindcss&logoColor=06B6D4"/>

<br><br>

A custom dark visual system using high-contrast typography, structured layouts, noise textures and experimental UI elements.

</td>
</tr>

<tr>
<td>

<h3>Animation System</h3>

<img src="https://img.shields.io/badge/GSAP-121212?style=flat-square&logo=greensock&logoColor=88CE02"/>
<img src="https://img.shields.io/badge/Motion-121212?style=flat-square&logo=framer&logoColor=FFFFFF"/>

<br><br>

Scroll-driven animation, page transitions, parallax movement, micro-interactions and timeline-based motion.

</td>

<td>

<h3>Smooth Scrolling</h3>

<img src="https://img.shields.io/badge/Lenis-121212?style=flat-square&logo=webgl&logoColor=FFFFFF"/>

<br><br>

Lenis provides smooth scrolling and synchronized interaction with the animation system.

</td>
</tr>

<tr>
<td>

<h3>WebGL & 3D</h3>

<img src="https://img.shields.io/badge/WebGL-121212?style=flat-square&logo=webgl&logoColor=990000"/>
<img src="https://img.shields.io/badge/OGL-121212?style=flat-square&logo=opengl&logoColor=FFFFFF"/>

<br><br>

Lightweight GPU-powered visual effects, canvas rendering and interactive graphical elements.

</td>

<td>

<h3>Theme System</h3>

<img src="https://img.shields.io/badge/Dark%20%2F%20Light-121212?style=flat-square&logo=themeui&logoColor=d4cebd"/>

<br><br>

Persistent theme preferences, system-theme detection and theme-aware visual effects.

</td>
</tr>
</table>

---

## MOTION SYSTEM

Motion is an integral part of the interface rather than an additional visual layer.

```text
                    USER INPUT
                        │
                        ▼
              ┌─────────────────┐
              │ Interaction     │
              │ Detection       │
              └────────┬────────┘
                       │
             ┌─────────┴─────────┐
             ▼                   ▼
        Scroll Events        Pointer Events
             │                   │
             ▼                   ▼
        ┌─────────┐         ┌──────────┐
        │  GSAP   │         │ Motion   │
        └────┬────┘         └─────┬────┘
             │                    │
             └──────────┬─────────┘
                        ▼
                 Visual Feedback
                        │
             ┌──────────┴──────────┐
             ▼                     ▼
        DOM Animation          WebGL Effects
```

### Animation Stack

| Technology | Role                                |
| ---------- | ----------------------------------- |
| **GSAP**   | Timeline and scroll-based animation |
| **Motion** | Component and UI transitions        |
| **Lenis**  | Smooth scrolling                    |
| **OGL**    | WebGL rendering                     |
| **CSS**    | Micro-interactions and transitions  |

---

## TECH STACK

### Frontend

<p>
<img src="https://skillicons.dev/icons?i=react,vite,js,ts&theme=dark"/>
</p>

| Technology | Usage                         |
| ---------- | ----------------------------- |
| React 19   | UI architecture               |
| Vite       | Development and build tooling |
| JavaScript | Application logic             |
| TypeScript | Type-safe development         |

### Styling

<p>
<img src="https://skillicons.dev/icons?i=css,tailwind&theme=dark"/>
</p>

* CSS Variables
* CSS Grid
* Flexbox
* Responsive design
* Custom design tokens
* Tailwind CSS

### Animation & Graphics

<p>
<img src="https://skillicons.dev/icons?i=threejs,webgl&theme=dark"/>
</p>

* GSAP
* Motion
* Lenis
* OGL
* WebGL
* Canvas API

### Development Tools

<p>
<img src="https://skillicons.dev/icons?i=git,github,docker,kubernetes&theme=dark"/>
</p>

* Git
* GitHub
* Docker
* Kubernetes
* Oxlint
* npm

---

## ARCHITECTURE

```text
folio/
│
├── public/
│   ├── images/
│   ├── fonts/
│   └── assets/
│
├── src/
│   │
│   ├── components/
│   │   ├── ui/
│   │   ├── sections/
│   │   ├── navigation/
│   │   └── animations/
│   │
│   ├── hooks/
│   │
│   ├── lib/
│   │
│   ├── shaders/
│   │
│   ├── styles/
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── package.json
├── vite.config.js
└── README.md
```

The architecture separates:

```text
UI Components
      │
      ├──────────────┐
      ▼              ▼
Animation Layer   Visual Layer
      │              │
      ▼              ▼
    GSAP            OGL
      │              │
      └──────┬───────┘
             ▼
        Application
```

---

## SELECTED WORK

### Dynamic Memory Management Visualiser

A real-time interactive visualization of operating-system memory management concepts and allocation algorithms.

**Technology**

`React` · `Three.js` · `JavaScript` · `Algorithms` · `Operating Systems`

---

### Omarchy System Stats Widget

A lightweight Linux system monitoring widget inspired by Waybar-style desktop interfaces.

**Technology**

`Linux` · `System Monitoring` · `Desktop Customization` · `UI`

---

## RESPONSIVE DESIGN

The interface is designed around a responsive layout system:

```text
┌──────────────────────────────────┐
│             DESKTOP              │
│                                  │
│        Multi-column Layout       │
└──────────────────────────────────┘

              │

┌────────────────────────┐
│        TABLET          │
│                        │
│   Adaptive Grid        │
└────────────────────────┘

              │

┌─────────────────┐
│     MOBILE      │
│                 │
│  Single Column  │
└─────────────────┘
```

The same component architecture powers desktop, tablet and mobile layouts.

---

## PERFORMANCE

Performance is treated as a core product requirement.

```text
                    PERFORMANCE
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
   Code Splitting    Asset Loading    GPU Rendering
        │                │                │
        └────────────────┼────────────────┘
                         ▼
                  Efficient Runtime
                         │
                         ▼
                  Smooth Interaction
```

Key considerations include:

* Efficient React rendering
* Lazy-loaded visual effects
* GPU-accelerated animation
* Optimized assets
* Minimal unnecessary JavaScript
* Responsive rendering
* Smooth scrolling

---

## GETTING STARTED

### Prerequisites

<p>
<img src="https://skillicons.dev/icons?i=nodejs,npm,git&theme=dark"/>
</p>

* Node.js 18+
* npm or yarn
* Git

### Clone Repository

```bash
git clone https://github.com/gurvindersingh-web/folio.git
cd folio/my-folio
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

---

## PRODUCTION BUILD

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

## ROADMAP

<table>
<tr>
<th>Status</th>
<th>Feature</th>
</tr>

<tr>
<td>Completed</td>
<td>Core portfolio architecture</td>
</tr>

<tr>
<td>Completed</td>
<td>Responsive design</td>
</tr>

<tr>
<td>Completed</td>
<td>GSAP animation system</td>
</tr>

<tr>
<td>Completed</td>
<td>Lenis smooth scrolling</td>
</tr>

<tr>
<td>Completed</td>
<td>Dark / light theme system</td>
</tr>

<tr>
<td>Completed</td>
<td>WebGL experiments</td>
</tr>

<tr>
<td>In Progress</td>
<td>Advanced page transitions</td>
</tr>

<tr>
<td>Planned</td>
<td>Expanded 3D experiences</td>
</tr>

<tr>
<td>Planned</td>
<td>Interactive project case studies</td>
</tr>

<tr>
<td>Planned</td>
<td>Performance monitoring dashboard</td>
</tr>

</table>

---

## DEVELOPMENT PHILOSOPHY

```text
BUILD
  │
  ▼
EXPERIMENT
  │
  ▼
MEASURE
  │
  ▼
REFINE
  │
  ▼
SHIP
  │
  ▼
REPEAT
```

The portfolio is continuously refined through new experiments, projects, interactions and engineering improvements.

---

## CONTRIBUTING

This is primarily a personal portfolio project, but technical feedback and improvements are welcome.

To contribute:

```bash
git fork
git checkout -b feature/improvement
git commit -m "feat: improve portfolio"
git push origin feature/improvement
```

Open a pull request after pushing your changes.

---

## LICENSE

This project is maintained as a personal portfolio and experimental development project.

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:2a2a2a,100:121212&height=120&section=footer" width="100%"/>

<br>

<h3>GURVINDER SINGH</h3>

<p>
Full-Stack Developer · Creative Engineer · Builder
</p>

<br>

<a href="https://gurvindersingh-web.github.io">
<img src="https://img.shields.io/badge/Portfolio-121212?style=for-the-badge&logo=googlechrome&logoColor=d4cebd"/>
</a>

<a href="https://github.com/gurvindersingh-web">
<img src="https://img.shields.io/badge/GitHub-121212?style=for-the-badge&logo=github&logoColor=d4cebd"/>
</a>

<a href="https://www.linkedin.com/in/gurvinder-singh-422032311/">
<img src="https://img.shields.io/badge/LinkedIn-121212?style=for-the-badge&logo=linkedin&logoColor=0A66C2"/>
</a>

<a href="https://x.com/Gurvinder_web">
<img src="https://img.shields.io/badge/X-121212?style=for-the-badge&logo=x&logoColor=FFFFFF"/>
</a>

<br><br>

<img src="https://komarev.com/ghpvc/?username=gurvindersingh-web&style=flat-square&color=121212"/>

<br><br>

<sub>© 2026 Gurvinder Singh · Designed & built with intent.</sub>

</div>

