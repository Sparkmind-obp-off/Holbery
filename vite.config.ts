import { defineConfig } from 'vite'
import pages from '@hono/vite-cloudflare-pages'
import { execFileSync } from 'node:child_process'
// Build-time only; no Node APIs enter the Worker runtime.
const releaseCommit = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim()
export default defineConfig({
  plugins: [pages({ entry: './src/index.ts' })],
  define: { __RELEASE_COMMIT__: JSON.stringify(releaseCommit) },
  build: { outDir: 'dist' }
})
