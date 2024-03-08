import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true
  },
  plugins: [react()],
  optimizeDeps: {
    include: ['@bluranme/core']
  },
  build: {
    commonjsOptions: {
      include: [/@bluranme\/core/, /node_modules/]
    }
  }
})
