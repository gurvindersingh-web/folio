import re

with open("/home/thunder/Projects/portfolio/my-folio/src/App.jsx", "r") as f:
    content = f.read()

# Define the new achievements section with ONLY the DriftWall
new_achievements = """          <div style={{ display: 'flex', width: '100%', height: '800px', marginTop: '2rem', borderRadius: '12px', overflow: 'hidden' }}>
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
                  dim={0.2} 
                  grayscale={false}
                  pauseOnHover={false}
                  overlayColor="#060010"
                />
              </Suspense>
            </LazyErrorBoundary>
          </div>"""

# Find the start and end of the current div that wraps the timeline and DriftWall
# It starts right after <h3 className="r-projects-title">Recognition</h3>
#             </div>
#           </div>
# 
#           <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem', marginTop: '2rem' }}>

pattern = re.compile(r'          <div style=\{\{ display: \'flex\', flexWrap: \'wrap\', gap: \'4rem\', marginTop: \'2rem\' \}\}>.*?</LazyErrorBoundary>\n            </div>\n          </div>', re.DOTALL)

if pattern.search(content):
    new_content = pattern.sub(new_achievements, content, count=1)
    with open("/home/thunder/Projects/portfolio/my-folio/src/App.jsx", "w") as f:
        f.write(new_content)
    print("Successfully replaced.")
else:
    print("Pattern not found. Checking current file contents...")
