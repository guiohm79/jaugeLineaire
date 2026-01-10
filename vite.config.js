import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/linear-gauge-card.js',
      formats: ['es'],
      fileName: (format, entryName) => 'linear-gauge-card.js',
    },
    outDir: 'dist',
    rollupOptions: {
      external: [], // Keep everything bundled for single-file portability
    },
  },
});
