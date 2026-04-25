import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const devPort = Number(process.env.PW_DEV_PORT ?? process.env.VITE_PORT ?? 5173);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(projectRoot, "."),
    },
  },
  root: ".",
  publicDir: "public",
  server: {
    port: devPort,
    strictPort: true,
  },
});
