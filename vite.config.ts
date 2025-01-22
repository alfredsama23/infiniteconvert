import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'lucide-react'],
          utils: ['jspdf', 'jszip', 'pdfjs-dist'],
        },
      },
    },
  },
  server: {
    headers: {
      'Service-Worker-Allowed': '/'
    }
  }
});