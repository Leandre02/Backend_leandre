import { defineConfig } from 'vitest/config';
import path from 'path';
import dotenv from 'dotenv';

// Charge le .env.test pour les tests
dotenv.config({
  path: path.resolve(__dirname, '.env.test'),
});

const config = defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['config.ts', './tests/support/setup.ts'],
    isolate: true,
  },
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, './src'),
    },
  },
});

export default config;
