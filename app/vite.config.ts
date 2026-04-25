import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    // Dedicated port to avoid clashing with other Vite apps on 5173 (Playwright + dev).
    port: Number(process.env.VITE_DEV_PORT) || 5180,
    strictPort: true,
    host: '0.0.0.0',
  },
})
