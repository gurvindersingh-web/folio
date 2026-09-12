import re

with open("/home/thunder/Projects/portfolio/my-folio/src/App.jsx", "r") as f:
    content = f.read()

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

# Find the old DriftWall container and replace it
pattern = re.compile(r'          <div style=\{\{ display: \'flex\', width: \'100%\', height: \'800px\', marginTop: \'2rem\', borderRadius: \'12px\', overflow: \'hidden\' \}\}>.*?            </div>', re.DOTALL)

if pattern.search(content):
    new_content = pattern.sub(new_layout, content, count=1)
    with open("/home/thunder/Projects/portfolio/my-folio/src/App.jsx", "w") as f:
        f.write(new_content)
    print("Successfully replaced layout.")
else:
    print("Pattern not found. Checking current file contents...")
