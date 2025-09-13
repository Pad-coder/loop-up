import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000, // optional, just for local dev
  },
  build: {
    outDir: "dist", // Netlify needs this
  },
  // This is important when deploying to Netlify
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
