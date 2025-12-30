import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/linear-gauge-card.js',
      formats: ['es'],
      fileName: 'linear-gauge-card',
    },
    outDir: 'dist',
    rollupOptions: {
      external: [], // Keep everything bundled for single-file portability
    },
  },
});
