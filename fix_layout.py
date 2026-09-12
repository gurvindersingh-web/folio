import re

with open("/home/thunder/Projects/portfolio/my-folio/src/App.jsx", "r") as f:
    content = f.read()

new_layout = """          <div style={{ display: 'flex', flexDirection: 'row', gap: '4rem', marginTop: '2rem', flexWrap: 'wrap' }}>
            {/* Left and Center: Static Certificates Grid */}
            <div style={{ flex: '2 1 600px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '2rem', alignContent: 'start' }}>
              {certificateItems.slice(0, 7).map((cert, index) => (
                <AnimatedContent key={index} distance={30} direction="vertical" duration={0.6} threshold={0.2} delay={index * 0.1}>
                  <BorderGlow borderRadius={12} backgroundColor="#121212">
                    <div style={{ padding: '12px' }}>
                      <a href={cert.href} target="_blank" rel="noopener noreferrer">
                        <img src={cert.image} alt={cert.title} style={{ width: '100%', height: 'auto', borderRadius: '8px', display: 'block', border: '1px solid rgba(255,255,255,0.05)' }} loading="lazy" />
                      </a>
                    </div>
                  </BorderGlow>
                </AnimatedContent>
              ))}
            </div>

            {/* Right Side: DriftWall Component */}
            <div style={{ flex: '1 1 350px', height: '800px', position: 'relative', borderRadius: '12px', overflow: 'hidden' }}>
              <LazyErrorBoundary>
                <Suspense fallback={<div style={{ width: '100%', height: '100%' }}></div>}>
                  <DriftWall
                    items={certificateItems}
                    columns={3}
                    tileWidth={180}
                    tileHeight={120}
                    gap={15}
                    radius={12}
                    speed={30}
                    direction="up"
                    variance={0.4}
                    tilt={12}
                    turn={-10}
                    roll={0}
                    perspective={1000}
                    depth={100}
                    parallax={0.5}
                    lift={40}
                    fade={0.6}
                    dim={0.55} 
                    grayscale={false}
                    pauseOnHover={true}
                    overlayColor="#060010"
                  />
                </Suspense>
              </LazyErrorBoundary>
            </div>
          </div>"""

# Replace the current DriftWall container
pattern = re.compile(r'          <div style=\{\{ display: \'flex\', width: \'100%\', height: \'800px\', marginTop: \'2rem\', borderRadius: \'12px\', overflow: \'hidden\' \}\}>.*?            </div>\n          </div>', re.DOTALL)

if pattern.search(content):
    content = pattern.sub(new_layout, content, count=1)
    with open("/home/thunder/Projects/portfolio/my-folio/src/App.jsx", "w") as f:
        f.write(content)
    print("Successfully replaced layout!")
else:
    print("Could not find the existing layout!")
