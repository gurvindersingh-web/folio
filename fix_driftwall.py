import re

with open("/home/thunder/Projects/portfolio/my-folio/src/App.jsx", "r") as f:
    content = f.read()

# 1. Update the certificateItems array to precisely control the 3 columns in DriftWall
new_cert_items = """  const certificateItems = [
    // Row 1
    { image: "/imgs/certificates/screenshot-2026-09-12_18-02-51.png", title: "Cipher Java" }, // Col 0 (Left)
    { image: "/imgs/certificates/screenshot-2026-09-12_17-57-32.png", title: "GFG DSA" }, // Col 1 (Center)
    { image: "/imgs/certificates/screenshot-2026-09-12_18-03-01.png", title: "Cipher System Design" }, // Col 2 (Right)

    // Row 2
    { image: "/imgs/certificates/Pasted image (2).png", title: "GFG Java" }, // Col 0 (Left)
    { image: "/imgs/certificates/Pasted image (3).png", title: "GFG C++" }, // Col 1 (Center)
    { image: "/imgs/certificates/Pasted image (3).png", title: "GFG C++" }, // Col 2 (Right) - Reused

    // Row 3
    { image: "/imgs/certificates/screenshot-2026-09-12_17-58-02.png", title: "Udemy Web Dev" }, // Col 0 (Left)
    { image: "/imgs/certificates/Pasted image.png", title: "Udemy Node.js" }, // Col 1 (Center)
    { image: "/imgs/certificates/Pasted image.png", title: "Udemy Node.js" } // Col 2 (Right) - Reused
  ];"""

cert_pattern = re.compile(r'  const certificateItems = \[.*?\];', re.DOTALL)
if cert_pattern.search(content):
    content = cert_pattern.sub(new_cert_items, content, count=1)
else:
    print("Failed to find certificateItems array")

# 2. Revert the layout back to just DriftWall (Full width)
new_layout = """          <div style={{ display: 'flex', width: '100%', height: '800px', marginTop: '2rem', borderRadius: '12px', overflow: 'hidden' }}>
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
          </div>"""

layout_pattern = re.compile(r'          <div style=\{\{ display: \'flex\', flexDirection: \'row\'.*?            </div>\n          </div>', re.DOTALL)
if layout_pattern.search(content):
    content = layout_pattern.sub(new_layout, content, count=1)
else:
    print("Failed to find the layout container")

with open("/home/thunder/Projects/portfolio/my-folio/src/App.jsx", "w") as f:
    f.write(content)
