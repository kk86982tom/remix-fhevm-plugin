/**
 * Vite Configuration File
 * 
 * @author kk86982tom
 * @description Vite build configuration for FHEVM Remix Plugin
 * @version 1.0.0
 * 
 * This configuration ensures consistent development environment
 * with fixed port and optimized build settings.
 * 
 * Original configuration by kk86982tom
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Development server configuration
  server: {
    port: 5173,           // Fixed port number
    host: true,           // Allow external connections
    strictPort: true,     // Exit if port is already in use
    open: false,          // Don't auto-open browser
  },
  
  // Preview server configuration (for production preview)
  preview: {
    port: 5173,
    host: true,
    strictPort: true,
  },
  
  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ethers: ['ethers'],
        }
      }
    }
  },
  
  // Define global constants
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __AUTHOR__: JSON.stringify('kk86982tom'),
  },
  
  // Resolve configuration
  resolve: {
    alias: {
      '@': '/src',
    }
  }
})