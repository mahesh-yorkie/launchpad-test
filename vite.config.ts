import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: path.resolve(__dirname, "app"),
  publicDir: path.resolve(__dirname, "app/public"),
  resolve: {
    alias: { "@": path.resolve(__dirname, "app/src") },
  },
  plugins: [react()],
  server: { port: Number.parseInt(process.env.PW_DEV_PORT ?? "5173", 10), strictPort: true },
  preview: { port: 4173 },
});
