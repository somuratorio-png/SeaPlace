import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    // Todo lo que el front pida a /api/... Vite se lo reenvía a Spring Boot (puerto 8080)
    // sacándole el prefijo: /api/animales -> http://localhost:8080/animales.
    // Así el navegador cree que habla con el mismo servidor y no hay problemas de CORS.
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
