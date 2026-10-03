with open("src/component/CircularCarousel.jsx", "r") as f:
    code = f.read()
code = code.replace("style={photoStyle}\n          />\n          {back", "style={photoStyle}\n          />\n          </picture>\n          {back")
with open("src/component/CircularCarousel.jsx", "w") as f:
    f.write(code)
