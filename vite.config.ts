import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@src": path.resolve(__dirname, "./src"),
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: process.env.APP_ENV === "sandbox" ? { hmr: { clientPort: 443 } } : {},
  worker: {
    format: "es",
  },
});
