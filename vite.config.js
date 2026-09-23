import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // This handles code-splitting natively without breaking on newer Rollup engines
        manualChunks: undefined
      }
    }
  }
})
