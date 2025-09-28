import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  
  // CRITICAL FIX: Add the proxy configuration
  server: {
    proxy: {
      // If the browser requests URLs starting with '/api',
      // Vite will forward them to the Spring Boot server.
      '/api': {
        target: 'http://localhost:8080', // Your backend's address
        changeOrigin: true, // Necessary for virtual hosting
        secure: false, // For development on localhost (HTTP)
      },
    },
  },
});