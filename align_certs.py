import re

with open("/home/thunder/Projects/portfolio/my-folio/src/App.jsx", "r") as f:
    content = f.read()

new_cert_items = """  const certificateItems = [
    // Row 1
    { image: "/imgs/certificates/screenshot-2026-09-12_18-02-51.png", title: "Cipher - Java Programming", href: "/imgs/certificates/screenshot-2026-09-12_18-02-51.png" }, // Col 0: Cipher
    { image: "/imgs/certificates/screenshot-2026-09-12_17-58-02.png", title: "Udemy - Complete Web Dev", href: "/imgs/certificates/screenshot-2026-09-12_17-58-02.png" }, // Col 1: Udemy
    { image: "/imgs/certificates/screenshot-2026-09-12_17-57-32.png", title: "GFG - DSA", href: "/imgs/certificates/screenshot-2026-09-12_17-57-32.png" }, // Col 2: GFG

    // Row 2
    { image: "/imgs/certificates/screenshot-2026-09-12_18-03-01.png", title: "Cipher - Low-Level System Design", href: "/imgs/certificates/screenshot-2026-09-12_18-03-01.png" }, // Col 0: Cipher
    { image: "/imgs/certificates/Pasted image.png", title: "Udemy - Node.js", href: "/imgs/certificates/Pasted image.png" }, // Col 1: Udemy
    { image: "/imgs/certificates/Pasted image (2).png", title: "GFG - Java", href: "/imgs/certificates/Pasted image (2).png" }, // Col 2: GFG

    // Row 3
    { image: "/imgs/certificates/screenshot-2026-09-12_18-02-51.png", title: "Cipher - Java Programming", href: "/imgs/certificates/screenshot-2026-09-12_18-02-51.png" }, // Col 0: Cipher (Repeated)
    { image: "/imgs/certificates/screenshot-2026-09-12_17-58-02.png", title: "Udemy - Complete Web Dev", href: "/imgs/certificates/screenshot-2026-09-12_17-58-02.png" }, // Col 1: Udemy (Repeated)
    { image: "/imgs/certificates/Pasted image (3).png", title: "GFG - C++", href: "/imgs/certificates/Pasted image (3).png" } // Col 2: GFG
  ];"""

cert_pattern = re.compile(r'  const certificateItems = \[.*?\];', re.DOTALL)
if cert_pattern.search(content):
    content = cert_pattern.sub(new_cert_items, content, count=1)
    with open("/home/thunder/Projects/portfolio/my-folio/src/App.jsx", "w") as f:
        f.write(content)
    print("Successfully updated certificate alignment!")
else:
    print("Could not find certificateItems array")
