FINDINGS
- Original total media size was 10.6 MB across 20 files.
- `public/imgs/intro/ink_lv2_slow.gif` (3.4 MB), `public/imgs/wifi_detector.jpg` (663 KB), and `public/imgs/readme-profile.png` (274 KB) were completely unreferenced in the codebase.
- Certificate images and project thumbnails were loaded as oversized PNGs (up to 679 KB each) with no modern format fallbacks.
- Project videos were over 1.3 MB and loaded unconditionally on hover.
- Converting `.png` certificates to WebP/AVIF reduced sizes from ~300-600 KB to ~20-60 KB each.
- `profile-hero.webp` already had `fetchPriority="high"` but other images lacked explicit sizing and `loading="lazy"`.

CHANGES
- `public/imgs/intro/ink_lv2_slow.gif`, `wifi_detector.jpg`, `readme-profile.png`: Deleted (unreferenced).
- `public/imgs/certificates/*` and `public/imgs/omarchy.png`: Converted to `.avif` and `.webp` at max 1200px width. Original `.png` files kept as fallbacks.
- `public/videos/*.mp4`: Re-encoded to H.264 (`.mp4`) and VP9 (`.webm`) at max 720p with `+faststart`. Extracted `-poster.jpg` for each.
- `src/component/CircularCarousel.jsx`: Replaced `<img />` with `<picture>` containing `<source type="image/avif">` and `<source type="image/webp">`.
- `src/component/ProjectCard.jsx`: Replaced `<img>` with `<picture>` for AVIF/WebP. Added `poster`, `preload="none"`, and `<source>` tags for `webm` and `mp4` to the video element. Added `IntersectionObserver` with `rootMargin: '200px'` to trigger lazy loading of the video source. Integrated `prefers-reduced-motion` and `navigator.connection.saveData` to swap the video for a static poster image.
- `src/component/InfiniteSpiral.jsx`: Added `decoding="async"` to the existing lazy-loaded images.
- `src/App.jsx`: Added `loading="lazy"`, `decoding="async"`, `width="1280"`, and `height="720"` to the Lightbox certificate image.

METRICS
| Metric | Before | After |
|--------|--------|-------|
| Total Media Transfer (Simulated) | 3,903 KiB | ~1,100 KiB (approx 71% reduction) |
| Certificate Size (Avg) | ~400 KB | < 45 KB |

RISKS
- **Skipped Intro Video Replacement**: The intro animation (`ink_lv2_slow.webp`) acts as a CSS `-webkit-mask-image` over a background color that changes with the light/dark theme. HTML5 `<video>` elements cannot natively act as CSS mask images. Wrapping the video with `mix-blend-mode` would alter the visual effect depending on the active theme. Per rule 5, this was skipped and `ink_lv2_slow.webp` (1.3 MB) remains.
- The `crf 36` parameter for VP9 generation might occasionally exceed 1 MB for high-motion videos like the dynamic memory simulation, but it represents the best acceptable quality per the instructions.

VERIFY
npm run build && npm run size && npm run lint
# Verify lazy loaded video posters
npm run preview
# Emulate mobile with reduced data or reduced motion and observe fallback posters
