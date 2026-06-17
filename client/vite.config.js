import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

// https://vite.dev/config/
export default defineConfig({
  envPrefix: ['VITE_', 'REACT_APP_'],
  plugins: [react(), svgr()],
  server: {
    proxy: {
      '/api': 'http://localhost:3333'
    }
  }
})
