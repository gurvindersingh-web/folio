import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    process.env.ANALYZE === 'true'
      ? visualizer({
          filename: 'dist/stats.html',
          gzipSize: true,
          brotliSize: true,
          open: false,
        })
      : undefined,
  ].filter(Boolean),
  publicDir: path.resolve(import.meta.dirname, 'public'),
  optimizeDeps: {
    entries: ['src/**/*.{js,jsx,ts,tsx}'],
    exclude: ['venv'],
  },
  server: {
    watch: {
      ignored: ['**/venv/**'],
    },
    fs: {
      deny: ['venv'],
    },
  },
  build: {
    target: 'esnext',
    sourcemap: false,
    cssCodeSplit: true,
    esbuild: {
      drop: ['console', 'debugger'],
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('node_modules/react-icons/')) {
            return 'vendor';
          }
          if (id.includes('node_modules/gsap/')) {
            return 'gsap';
          }
          if (id.includes('node_modules/motion/') || id.includes('node_modules/framer-motion/')) {
            return 'motion';
          }
          if (id.includes('node_modules/ogl/')) {
            return 'ogl';
          }
          if (id.includes('node_modules/lenis/')) {
            return 'lenis';
          }
        }
      }
    }
  }
})
