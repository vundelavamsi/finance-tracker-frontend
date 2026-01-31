import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        // target: 'http://localhost:8000',
        target: 'https://finance-tracker-backend-2n5w.onrender.com',
        changeOrigin: true,
      },
    },
  },
})
