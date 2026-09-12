import re

with open("/home/thunder/Projects/portfolio/my-folio/src/App.jsx", "r") as f:
    content = f.read()

# 1. Add import DriftWall
if "const DriftWall" not in content:
    content = content.replace(
        'const Carousel = lazy(() => import("./component/Carousel.jsx"));',
        'const Carousel = lazy(() => import("./component/Carousel.jsx"));\nconst DriftWall = lazy(() => import("./component/DriftWall.jsx"));'
    )

# 2. Add certificateItems
cert_items = """
  const certificateItems = [
    { image: "/imgs/certificates/Pasted image (2).png", title: "Certificate 1" },
    { image: "/imgs/certificates/Pasted image (3).png", title: "Certificate 2" },
    { image: "/imgs/certificates/Pasted image.png", title: "Certificate 3" },
    { image: "/imgs/certificates/screenshot-2026-09-12_17-57-32.png", title: "Certificate 4" },
    { image: "/imgs/certificates/screenshot-2026-09-12_17-58-02.png", title: "Certificate 5" },
    { image: "/imgs/certificates/screenshot-2026-09-12_18-02-51.png", title: "Certificate 6" },
    { image: "/imgs/certificates/screenshot-2026-09-12_18-03-01.png", title: "Certificate 7" }
  ];
"""
if "const certificateItems" not in content:
    content = content.replace(
        'const [mobileNavOpen, setMobileNavOpen] = useState(false);',
        cert_items + '\n  const [mobileNavOpen, setMobileNavOpen] = useState(false);'
    )

# 3. New Achievements Layout
new_layout = """          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '2rem', width: '100%', marginTop: '2rem' }}>
            {/* Left Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', flex: '0 0 300px' }}>
              <AnimatedContent distance={30} direction="horizontal" duration={0.8} threshold={0.2}>
                <BorderGlow backgroundColor="#121212" borderRadius={12}>
                  <div style={{ padding: '10px' }}>
                    <img src={certificateItems[0].image} alt="Certificate" style={{ width: '100%', borderRadius: '8px', display: 'block' }} loading="lazy" />
                  </div>
                </BorderGlow>
              </AnimatedContent>
              <AnimatedContent distance={30} direction="horizontal" duration={0.8} threshold={0.2} delay={0.1}>
                <BorderGlow backgroundColor="#121212" borderRadius={12}>
                  <div style={{ padding: '10px' }}>
                    <img src={certificateItems[1].image} alt="Certificate" style={{ width: '100%', borderRadius: '8px', display: 'block' }} loading="lazy" />
                  </div>
                </BorderGlow>
              </AnimatedContent>
            </div>

            {/* Center Column - DriftWall */}
            <div style={{ flex: '1 1 auto', height: '800px', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
              <LazyErrorBoundary>
                <Suspense fallback={<div style={{ width: '100%', height: '100%' }}></div>}>
                  <DriftWall
                    items={certificateItems}
                    columns={3}
                    tileWidth={200}
                    tileHeight={132}
                    gap={18}
                    radius={14}
                    speed={42}
                    direction="up"
                    variance={0.45}
                    tilt={16}
                    turn={-14}
                    roll={0}
                    perspective={1200}
                    depth={120}
                    parallax={0.6}
                    lift={64}
                    fade={0.6}
                    dim={0.55} 
                    grayscale={false}
                    pauseOnHover={false}
                    overlayColor="#060010"
                  />
                </Suspense>
              </LazyErrorBoundary>
            </div>

            {/* Right Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', flex: '0 0 300px' }}>
              <AnimatedContent distance={30} direction="horizontal" reverse={true} duration={0.8} threshold={0.2}>
                <BorderGlow backgroundColor="#121212" borderRadius={12}>
                  <div style={{ padding: '10px' }}>
                    <img src={certificateItems[2].image} alt="Certificate" style={{ width: '100%', borderRadius: '8px', display: 'block' }} loading="lazy" />
                  </div>
                </BorderGlow>
              </AnimatedContent>
              <AnimatedContent distance={30} direction="horizontal" reverse={true} duration={0.8} threshold={0.2} delay={0.1}>
                <BorderGlow backgroundColor="#121212" borderRadius={12}>
                  <div style={{ padding: '10px' }}>
                    <img src={certificateItems[3].image} alt="Certificate" style={{ width: '100%', borderRadius: '8px', display: 'block' }} loading="lazy" />
                  </div>
                </BorderGlow>
              </AnimatedContent>
            </div>
          </div>"""

# Replace the specific div.r-timeline inside Achievements Section
# We'll use a precise string replace
old_timeline_str = """          <div className="r-timeline">
            <AnimatedContent distance={40} direction="vertical" duration={0.8} threshold={0.2}>
              <BorderGlow className="r-timeline-item" backgroundColor="#121212" borderRadius={12}>
                <div className="r-timeline-meta">2026</div>
                <div className="r-timeline-content">
                  <h4>Top Developer Award</h4>
                  <p>Awarded for excellence in system design and open-source contributions.</p>
                </div>
              </BorderGlow>
            </AnimatedContent>
            
            <AnimatedContent distance={40} direction="vertical" duration={0.8} threshold={0.2} delay={0.1}>
              <BorderGlow className="r-timeline-item" backgroundColor="#121212" borderRadius={12}>
                <div className="r-timeline-meta">2025</div>
                <div className="r-timeline-content">
                  <h4>Hackathon Winner</h4>
                  <p>First place in the national web performance and accessibility challenge.</p>
                </div>
              </BorderGlow>
            </AnimatedContent>
          </div>"""

if old_timeline_str in content:
    content = content.replace(old_timeline_str, new_layout)
    print("Successfully replaced layout!")
else:
    print("Could not find the old timeline string!")

with open("/home/thunder/Projects/portfolio/my-folio/src/App.jsx", "w") as f:
    f.write(content)
