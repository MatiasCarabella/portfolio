import { defineConfig } from 'vite'

export default defineConfig({
  // Base path for GitHub Pages deployment
  base: '/portfolio/',
  
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
  }
})
