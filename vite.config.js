import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const projectRoot = __dirname
const appRoot = path.resolve(projectRoot, 'app')

export default defineConfig({
  root: appRoot,
  publicDir: path.resolve(projectRoot, 'public'),
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(appRoot, 'src'),
    },
  },
  server: {
    port: Number(process.env.VITE_DEV_PORT) || 5173,
    /** Avoid silent port drift during Playwright (must match E2E_PORT + webServer) */
    strictPort: Boolean(process.env.E2E_STRICT_PORT),
    /** Ensure Playwright can reach the dev server (IPv4) */
    host: process.env.E2E_STRICT_PORT ? '127.0.0.1' : true,
  },
  preview: {
    port: Number(process.env.VITE_PREVIEW_PORT) || 4173,
  },
})
