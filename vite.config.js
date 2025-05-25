import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// import { viteCommonjs } from '@originjs/vite-plugin-commonjs';
import path from "path"
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
        // "@cornerstone/core": "cornerstone-core/dist/cornerstone-core.min.js",
      // "cornerstone-tools": "cornerstone-tools/dist/cornerstoneTools.min.js"
    },
  },
  optimizeDeps: {
    exclude: ['@cornerstonejs/dicom-image-loader'],
    include: ['dicom-parser'],
  },
  worker: {
    format: "es",
    rollupOptions: {
      external: ["@icr/polyseg-wasm"],
    },
  },
})

