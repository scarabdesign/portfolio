import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: parseInt(process.env.VITE_PORT || '5173'),
    hmr: {
      overlay: false
    },
    allowedHosts: [
      'seanhankins.com',
      'www.seanhankins.com',
      'pointlesswaste.com',
      'www.pointlesswaste.com',
      'chess.pointlesswaste.com',
      'localhost',
      '192.168.0.155'
    ],
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  }
})
