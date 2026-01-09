import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/stores': path.resolve(__dirname, './src/stores'),
      '@/ai': path.resolve(__dirname, './src/ai')
    }
  },
  server: {
    port: 3000,
    open: true,
    // Handle SPA routing - serve index.html for all routes
    // This is handled automatically by Vite's dev server
  },
  worker: {
    // Enable ES modules for workers (SharedWorker support)
    format: 'es'
  },
  build: {
    // Ensure workers are properly bundled
    rollupOptions: {
      output: {
        // Proper chunking for workers
        manualChunks: {
          xstate: ['xstate'],
          zustand: ['zustand']
        }
      }
    }
  }
})