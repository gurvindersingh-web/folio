import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: path.resolve(import.meta.dirname, 'public'),
  optimizeDeps: {
    exclude: ['venv']
  },
  server: {
    watch: {
      ignored: ['**/venv/**']
    }
  }
})

