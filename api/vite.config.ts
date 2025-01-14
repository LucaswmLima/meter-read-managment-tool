import { defineConfig } from 'vite';
import { configDefaults, defineConfig as defineVitestConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
    include: ['src/**/*.test.ts','*/*.test.ts'], // Ajuste o caminho conforme necessário
  },
});