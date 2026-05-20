import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ECKey',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
    minify: false,
    sourcemap: true,
    rollupOptions: {
      external: [/@noble\/.*/, 'node:buffer', 'node:crypto', 'create-hash', 'secp256k1'],
      output: {
        exports: 'named',
        globals: {
          'node:buffer': 'buffer',
          'node:crypto': 'crypto',
          'create-hash': 'createHash',
          secp256k1: 'secp256k1',
        },
      },
    },
  },
  plugins: [dts({ tsconfigPath: './tsconfig.json' })],
});
