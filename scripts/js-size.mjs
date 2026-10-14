// Reports the JavaScript a page loads from the static build: node scripts/js-size.mjs [route]
import { readFileSync, statSync } from 'node:fs'
import { gzipSync } from 'node:zlib'

const route = process.argv[2] ?? '/'
const html = readFileSync(`out${route}index.html`, 'utf8')
const scripts = [...html.matchAll(/<script[^>]+src="([^"]+\.js)[^"]*"/g)].map((m) => m[1])
let raw = 0
let gzip = 0
for (const src of scripts) {
  const file = `out${src.split('?')[0]}`
  raw += statSync(file).size
  gzip += gzipSync(readFileSync(file)).length
}
console.log(
  `${route}: ${scripts.length} scripts, ${(raw / 1024).toFixed(0)} KB raw, ${(gzip / 1024).toFixed(0)} KB gzip`,
)
