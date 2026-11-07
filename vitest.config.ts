import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

// Standalone test config: skips the Vite app plugins (Cloudflare, Neon dev DB),
// so `bun run test` needs no env vars or network. Component tests can opt into a
// DOM with a `// @vitest-environment jsdom` comment at the top of the file.
export default defineConfig({
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    include: ['src/**/*.test.{ts,tsx}'],
    environment: 'node',
  },
})
