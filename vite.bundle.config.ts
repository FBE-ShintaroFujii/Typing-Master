import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// Used only for local offline distribution build (npm run build:bundle)
// NOT used by Bolt.new or Netlify
export default defineConfig({
  base: './',
  plugins: [react(), viteSingleFile()],
})
