import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // GitHub Pages talpina svetainę adresu /inesyz-website/, todėl build'ui GitHube
  // reikia šio kelio; kompiuteryje viskas lieka kaip buvę (http://localhost:5173)
  base: process.env.GITHUB_ACTIONS ? '/inesyz-website/' : '/',
})
