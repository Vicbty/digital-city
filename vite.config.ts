import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Deux pages : le jeu (index.html) et le dashboard (dashboard.html, servi sur /dashboard).
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        dashboard: 'dashboard.html',
      },
    },
  },
})
