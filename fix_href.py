import re

with open("/home/thunder/Projects/portfolio/my-folio/src/App.jsx", "r") as f:
    content = f.read()

# Add href to each certificate
new_cert_items = """  const certificateItems = [
    // Row 1
    { image: "/imgs/certificates/screenshot-2026-09-12_18-02-51.png", title: "Cipher Java", href: "/imgs/certificates/screenshot-2026-09-12_18-02-51.png" }, 
    { image: "/imgs/certificates/screenshot-2026-09-12_17-57-32.png", title: "GFG DSA", href: "/imgs/certificates/screenshot-2026-09-12_17-57-32.png" }, 
    { image: "/imgs/certificates/screenshot-2026-09-12_18-03-01.png", title: "Cipher System Design", href: "/imgs/certificates/screenshot-2026-09-12_18-03-01.png" }, 

    // Row 2
    { image: "/imgs/certificates/Pasted image (2).png", title: "GFG Java", href: "/imgs/certificates/Pasted image (2).png" }, 
    { image: "/imgs/certificates/Pasted image (3).png", title: "GFG C++", href: "/imgs/certificates/Pasted image (3).png" }, 
    { image: "/imgs/certificates/Pasted image (3).png", title: "GFG C++", href: "/imgs/certificates/Pasted image (3).png" }, 

    // Row 3
    { image: "/imgs/certificates/screenshot-2026-09-12_17-58-02.png", title: "Udemy Web Dev", href: "/imgs/certificates/screenshot-2026-09-12_17-58-02.png" }, 
    { image: "/imgs/certificates/Pasted image.png", title: "Udemy Node.js", href: "/imgs/certificates/Pasted image.png" }, 
    { image: "/imgs/certificates/Pasted image.png", title: "Udemy Node.js", href: "/imgs/certificates/Pasted image.png" } 
  ];"""

cert_pattern = re.compile(r'  const certificateItems = \[.*?\];', re.DOTALL)
if cert_pattern.search(content):
    content = cert_pattern.sub(new_cert_items, content, count=1)
    with open("/home/thunder/Projects/portfolio/my-folio/src/App.jsx", "w") as f:
        f.write(content)
    print("Successfully added hrefs")
else:
    print("Failed to find certificateItems array")
