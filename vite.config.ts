import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: "app",
  publicDir: "public",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "app/src"),
    },
  },
  server: {
    port: Number(process.env.PW_DEV_PORT) || 5173,
  },
});
