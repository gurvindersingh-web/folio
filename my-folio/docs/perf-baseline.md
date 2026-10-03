# Performance Baseline

> Captured: 2026-10-03T21:30 IST  
> Machine: Linux (Arch), Chromium 153.0.8010.52  
> Commit: current HEAD (pre-optimization)

---

## Step 1: Build Output (npm run build)

| Chunk | Raw KB | Gzip KB |
|-------|--------|---------|
| index.html | 3.85 | 1.33 |
| rolldown-runtime-hePW80VL.js | 0.71 | 0.42 |
| Carousel-Cv9gKuW_.js | 4.64 | 1.86 |
| LogoLoop-9c2Ggx_4.js | 5.15 | 2.20 |
| InfiniteSpiral-ZVxJJjBc.js | 5.59 | 2.54 |
| CircularCarousel-DeugRQzf.js | 16.39 | 6.47 |
| lenis-DokAhVMZ.js | 18.66 | 5.44 |
| index-ClpLCGxf.js | 61.26 | 17.02 |
| gsap-Cac-8YT_.js | 113.47 | 44.65 |
| motion-DzdSGAZi.js | 129.81 | 42.29 |
| vendor-Cao-P1W1.js | 221.44 | 72.75 |
| **JS Total** | **577.17** | **195.64** |
| InfiniteSpiral-CL5cSqsh.css | 0.85 | 0.41 |
| Carousel-PllZwImD.css | 2.25 | 0.79 |
| LogoLoop-BYLnQS6u.css | 2.81 | 0.84 |
| CircularCarousel-6xaziXVs.css | 3.37 | 1.05 |
| index-oOdpv5cR.css | 57.08 | 10.90 |
| **CSS Total** | **66.36** | **13.99** |

### Font Files in dist/

| File | Size (KB) |
|------|-----------|
| inter-latin-300-normal.woff2 | 23.91 |
| inter-latin-400-normal.woff2 | 23.66 |
| inter-latin-500-normal.woff2 | 24.27 |
| inter-latin-600-normal.woff2 | 24.45 |
| jetbrains-mono-latin-400-normal.woff2 | 21.16 |
| jetbrains-mono-latin-600-normal.woff2 | 21.86 |
| playfair-display-latin-400-normal.woff2 | 21.85 |
| playfair-display-latin-600-normal.woff2 | 23.22 |
| inter-latin-300-normal.woff | 31.01 |
| inter-latin-400-normal.woff | 30.69 |
| inter-latin-500-normal.woff | 31.28 |
| inter-latin-600-normal.woff | 31.26 |
| jetbrains-mono-latin-400-normal.woff | 27.49 |
| jetbrains-mono-latin-600-normal.woff | 28.18 |
| playfair-display-latin-400-normal.woff | 26.90 |
| playfair-display-latin-600-normal.woff | 28.35 |
| **woff2 Total** | **184.38** |
| **woff Total** | **235.16** |
| **All Fonts Total** | **409.77** |

---

## Step 2: Size Limit (npm run size)

```
Size limit: 150 kB
Size:       131 kB gzipped   ✅ PASS
```

Measured chunks: `dist/assets/vendor-*.js`, `dist/assets/index-*.js`, `dist/assets/rolldown-runtime-*.js`, `dist/assets/motion-*.js`

---

## Step 3: Lint Warnings (npm run lint)

| # | File:Line | Rule | Description |
|---|-----------|------|-------------|
| 1 | src/theme.jsx:14 | react/only-export-components | `getStoredTheme` is not a component |
| 2 | src/theme.jsx:24 | react/only-export-components | `getInitialTheme` is not a component |
| 3 | src/theme.jsx:30 | react/only-export-components | `applyTheme` is not a component |
| 4 | src/theme.jsx:82 | react/only-export-components | `useTheme` is not a component |
| 5 | src/component/SmoothScroll.jsx:27 | react/only-export-components | `scrollToAnchor` is not a component |
| 6 | src/component/Carousel.jsx:155 | react/set-state-in-effect | `setPosition` inside useEffect |
| 7 | src/component/Carousel.jsx:161 | react/set-state-in-effect | `setPosition` inside useEffect |
| 8 | src/component/CircularCarousel.jsx:263 | react/refs | `readyRef.current` written during render |
| 9 | src/component/CircularCarousel.jsx:313 | react/refs | `settingsRef.current` written during render |
| 10 | src/component/CircularCarousel.jsx:316 | react/refs | `onChangeRef.current` written during render |
| 11 | src/component/CircularCarousel.jsx:330 | react/set-state-in-effect | `setReady` inside useEffect |

**Summary:** 11 warnings, 0 errors. Linter: oxlint v1.79.0.

---

## Step 4: Large Files in public/ (>100 KB)

| File | Bytes | KB |
|------|-------|----|
| public/imgs/intro/ink_lv2_slow.gif | 3,406,219 | 3,326 |
| public/imgs/intro/ink_lv2_slow.webp | 1,326,372 | 1,295 |
| public/videos/screenrecording-2026-09-04_22-01-08.mp4 | 1,305,992 | 1,275 |
| public/imgs/certificates/Pasted image.png | 695,051 | 679 |
| public/imgs/wifi_detector.jpg | 678,627 | 663 |
| public/videos/screenrecording-2026-09-11_21-59-54.mp4 | 578,022 | 565 |
| public/videos/omarchy.mp4 | 465,279 | 455 |
| public/imgs/certificates/Pasted image (3).png | 416,194 | 407 |
| public/imgs/certificates/screenshot-2026-09-12_17-57-32.png | 396,597 | 388 |
| public/imgs/certificates/Pasted image (2).png | 358,803 | 351 |
| public/imgs/omarchy.png | 353,106 | 345 |
| public/imgs/ppf_1080p_fixed-Picsart-AiImageEnhancer.webp | 340,234 | 333 |
| public/imgs/readme-profile.png | 280,180 | 274 |
| public/imgs/certificates/screenshot-2026-09-12_17-58-02.png | 141,089 | 138 |
| public/imgs/certificates/screenshot-2026-09-12_18-02-51.png | 136,052 | 133 |
| public/imgs/certificates/screenshot-2026-09-12_18-03-01.png | 117,381 | 115 |
| **Total media in public/** | **11,125,340** | **10,865** |

---

## Step 5: Asset Reference Map

| File | Referenced In | Fold Position |
|------|--------------|---------------|
| imgs/intro/ink_lv2_slow.gif | **UNREFERENCED** | — |
| imgs/intro/ink_lv2_slow.webp | src/component/InkIntro.jsx:5, InkIntro.css:39-40, index.html:43 (preloaded) | ABOVE_FOLD |
| videos/screenrecording-2026-09-04_22-01-08.mp4 | src/App.jsx:126 (Dynamic Memory project) | BELOW_FOLD |
| imgs/certificates/Pasted image.png | src/App.jsx:177 (certificate) | BELOW_FOLD |
| imgs/wifi_detector.jpg | **UNREFERENCED** | — |
| videos/screenrecording-2026-09-11_21-59-54.mp4 | src/App.jsx:113 (Star Wars project) | BELOW_FOLD |
| videos/omarchy.mp4 | src/App.jsx:139 (Omarchy project) | BELOW_FOLD |
| imgs/certificates/Pasted image (3).png | src/App.jsx:182 (certificate) | BELOW_FOLD |
| imgs/certificates/screenshot-2026-09-12_17-57-32.png | src/App.jsx:176 (certificate) | BELOW_FOLD |
| imgs/certificates/Pasted image (2).png | src/App.jsx:181 (certificate) | BELOW_FOLD |
| imgs/omarchy.png | src/App.jsx:138 (project thumbnail) | BELOW_FOLD |
| imgs/ppf_1080p_fixed-Picsart-AiImageEnhancer.webp | index.html:32,40 (og:image, twitter:image only) | META_ONLY |
| imgs/readme-profile.png | **UNREFERENCED** | — |
| imgs/certificates/screenshot-2026-09-12_17-58-02.png | src/App.jsx:180 (certificate) | BELOW_FOLD |
| imgs/certificates/screenshot-2026-09-12_18-02-51.png | src/App.jsx:178 (certificate) | BELOW_FOLD |
| imgs/certificates/screenshot-2026-09-12_18-03-01.png | src/App.jsx:179 (certificate) | BELOW_FOLD |

### Unreferenced Files (candidates for deletion)

| File | Bytes |
|------|-------|
| public/imgs/intro/ink_lv2_slow.gif | 3,406,219 |
| public/imgs/wifi_detector.jpg | 678,627 |
| public/imgs/readme-profile.png | 280,180 |
| **Total reclaimable** | **4,365,026** |

---

## Step 6: Lighthouse Results

### Mobile (simulated throttling — default Lighthouse mobile preset)

| Metric | Value |
|--------|-------|
| Performance Score | **57** |
| LCP | **9,766 ms** (9.8 s) ❌ |
| FCP | **3,057 ms** (3.1 s) |
| TBT | **433 ms** (430 ms) ❌ |
| CLS | **0.014** ✅ |
| Speed Index | **4,050 ms** (4.0 s) |
| Total Transfer | **3,996,643 bytes** (3,903 KiB) |
| Network Requests | **38** |

### Desktop (Lighthouse desktop preset)

| Metric | Value |
|--------|-------|
| Performance Score | **91** |
| LCP | **1,807 ms** (1.8 s) ✅ |
| FCP | **630 ms** (0.6 s) ✅ |
| TBT | **0 ms** ✅ |
| CLS | **0.007** ✅ |
| Speed Index | **1,318 ms** (1.3 s) ✅ |
| Total Transfer | **3,996,643 bytes** (3,903 KiB) |
| Network Requests | **38** |

### Largest Network Payloads

| Resource | Transfer Bytes |
|----------|---------------|
| imgs/intro/ink_lv2_slow.webp | 1,326,644 |
| imgs/certificates/Pasted image.png | 695,320 |
| imgs/certificates/Pasted image (3).png | 416,463 |
| imgs/certificates/screenshot-2026-09-12_17-57-32.png | 396,866 |
| imgs/certificates/Pasted image (2).png | 359,072 |
| imgs/certificates/screenshot-2026-09-12_17-58-02.png | 141,358 |
| imgs/certificates/screenshot-2026-09-12_18-02-51.png | 136,321 |
| imgs/certificates/screenshot-2026-09-12_18-03-01.png | 117,650 |
| assets/vendor-Cao-P1W1.js | 72,346 |
| assets/gsap-Cac-8YT_.js | 44,689 |

### Long Tasks (Mobile, >50 ms)

| Script | Duration (ms) |
|--------|--------------|
| vendor-Cao-P1W1.js | 249 |
| index.html (inline) | 214 |
| vendor-Cao-P1W1.js | 117 |
| vendor-Cao-P1W1.js | 116 |
| vendor-Cao-P1W1.js | 106 |
| vendor-Cao-P1W1.js | 75 |
| Unattributable | 64 |
| Unattributable | 62 |
| index-ClpLCGxf.js | 60 |
| vendor-Cao-P1W1.js | 57 |
| index-ClpLCGxf.js | 53 |
| **Total: 11 long tasks** | **1,173** |

### Unused JS (reported by Lighthouse)

| Chunk | Wasted Bytes |
|-------|-------------|
| motion-DzdSGAZi.js | 21,965 |
| gsap-Cac-8YT_.js | 21,889 |
| vendor-Cao-P1W1.js | 21,720 |
| **Total** | **65,574** |

### Diagnostics Summary

| Metric | Value |
|--------|-------|
| Total tasks | 1,912 |
| Tasks >10 ms | 27 |
| Tasks >25 ms | 5 |
| Tasks >50 ms | 4 |
| Tasks >100 ms | 1 |
| Tasks >500 ms | 0 |
| Total task time | 1,514 ms |
| Scripts loaded | 12 |
| Stylesheets loaded | 5 |
| Fonts loaded | 7 |

---

## Step 7: Performance Trace

> **Note:** Chrome Performance trace with scrolling requires a display/GUI session.  
> Lighthouse task data used as proxy for long-task and FPS analysis.

### Long Tasks (from Lighthouse, mobile simulated)

| Count | Owning Script | Max Duration |
|-------|--------------|-------------|
| 6 | vendor-Cao-P1W1.js (react, react-dom, react-icons) | 249 ms |
| 2 | index-ClpLCGxf.js (app code) | 60 ms |
| 1 | index.html (inline script) | 214 ms |
| 2 | Unattributable | 64 ms |
| **11 total** | | |

### Commands for Manual Trace (GUI required)

```bash
# Start preview
npm run build && npm run preview

# Open Chrome DevTools → Performance tab
# Settings: 4x CPU slowdown, Slow 4G network
# Record: page load + 10s scroll top to bottom
# Export trace as JSON for future comparison
```

---

## Summary: Key Bottlenecks

| Category | Issue | Impact |
|----------|-------|--------|
| **Media** | 10.6 MB total media, 3 unreferenced files (4.3 MB), ink webp 1.3 MB above fold | LCP, transfer |
| **JS Bundle** | 195.6 KB gzip JS total, vendor 72.7 KB, motion 42.3 KB | TBT, FCP |
| **Fonts** | 409.8 KB total (woff2+woff), 16 files, 8 weights × 2 formats | Transfer, CLS |
| **Lint** | 11 warnings: 5 fast-refresh, 3 set-state-in-effect, 3 refs-during-render | DX, correctness |
| **LCP** | 9.8 s mobile (target: ≤2.5 s) — driven by ink_lv2_slow.webp (1.3 MB preloaded) | Core Web Vital |
| **TBT** | 433 ms mobile (target: ≤200 ms) — vendor.js dominates | Core Web Vital |

---

## Reproduction Commands

```bash
cd /home/thunder/Projects/portfolio/my-folio

# Step 1
npm run build

# Step 2
npm run size

# Step 3
npm run lint

# Step 4
find public -type f -size +100k -exec ls -l {} + | sort -k5 -n -r

# Step 5
find public -type f -size +100k | while read f; do
  basename=$(basename "$f")
  echo "=== $f ==="
  grep -rn "$basename" src/ index.html 2>/dev/null || echo "NOT REFERENCED"
done

# Step 6
npm run build && npm run preview &
CHROME_PATH=$(which chromium) npx lighthouse http://localhost:4173 \
  --chrome-flags="--headless=new --no-sandbox --disable-gpu" \
  --only-categories=performance --output=json --output-path=/tmp/lh-mobile.json

# Desktop
CHROME_PATH=$(which chromium) npx lighthouse http://localhost:4173 \
  --chrome-flags="--headless=new --no-sandbox --disable-gpu" \
  --only-categories=performance --output=json --output-path=/tmp/lh-desktop.json \
  --preset=desktop

# Step 7 (requires GUI)
# Chrome DevTools → Performance → Record with 4x CPU, Slow 4G
```
