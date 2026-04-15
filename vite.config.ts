import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  appType: "spa",
  server: {
    port: 3000,
  },
  plugins: [react()],
  build: {
    outDir: "build",
    rollupOptions: {
      input: "index.html",
    },
  },
});
