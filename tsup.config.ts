import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  dts: true,
  entry: ['src/cli.ts', 'src/lib.ts'],
  format: ['cjs'],
  sourcemap: true,
  target: 'esnext',
  outDir: 'dist',
});
