import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'vendor';
          }
          if (id.includes('node_modules/gsap/') || id.includes('node_modules/motion/') || id.includes('node_modules/ogl/')) {
            return 'animation';
          }
          if (id.includes('node_modules/lenis/')) {
            return 'lenis';
          }
        }
      }
    }
  }
})
