import { defineConfig } from 'vite'

export default defineConfig({
  // If deploying to https://username.github.io/portfolio/
  // base: '/portfolio/',
  
  // If deploying to https://username.github.io/ (custom domain or username.github.io repo)
  base: '/',
  
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
  }
})
