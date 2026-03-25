import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {resolve} from "node:dns";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3005
  },
  build: {
    outDir: 'build/teacher',
    rollupOptions: {
      input: {
        main: 'index-teacher.html'
      }
    }
  }
})
