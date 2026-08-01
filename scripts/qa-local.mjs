import { spawnSync } from 'node:child_process'

const url = process.env.PREVIEW_BASE_URL
if (!url) throw new Error('PREVIEW_BASE_URL is required')

const preflight = '/home/clawd/.openclaw/workspace/scripts/qa-browser-preflight.mjs'
const layout = '/home/clawd/.openclaw/skills/playwright-browser-automation/qa_check_layout.js'

function run(label, command, args, env = process.env) {
  const result = spawnSync(command, args, { encoding: 'utf8', env })
  process.stdout.write(`\n${label}\n${result.stdout}`)
  process.stderr.write(result.stderr)
  if (result.status !== 0) process.exit(result.status ?? 1)
}

run('PREFLIGHT', 'node', [preflight, '--url', url])

const desktopChecks = [
  { type: 'selector_visible', selector: '.hero-video', name: 'hero video visible' },
  { type: 'selector_visible', selector: '#hero-title', name: 'hero title visible' },
  { type: 'selector_visible', selector: '#contact', name: 'contact visible' },
  { type: 'bbox_within_viewport', selector: '.intro', tolerance: 8 },
  { type: 'bbox_within_viewport', selector: '.contact', tolerance: 8 },
  { type: 'no_overlap', first: '.intro', second: '.contact' },
  { type: 'no_overflow', selector: 'html', axis: 'x', tolerance: 0 },
  { type: 'css', selector: '.hero-frame', property: 'min-height', includes: 'px' }
]

run(
  'DESKTOP_LAYOUT',
  'node',
  [layout, '--url', url, '--width', '1440', '--height', '900', '--waitMs', '2200', '--checksEnv', 'CHECKS_JSON', '--resultJson', '/home/clawd/aurel-layout-desktop.json', '--strict'],
  { ...process.env, CHECKS_JSON: JSON.stringify(desktopChecks) },
)

const mobileChecks = [
  { type: 'selector_visible', selector: '.menu-button', name: 'mobile menu visible' },
  { type: 'selector_visible', selector: '#hero-title', name: 'mobile title visible' },
  { type: 'selector_visible', selector: '#contact', name: 'mobile contact visible' },
  { type: 'bbox_within_viewport', selector: '.intro', tolerance: 8 },
  { type: 'no_overlap', first: '.intro', second: '.contact' },
  { type: 'no_overflow', selector: 'html', axis: 'x', tolerance: 0 },
  { type: 'css', selector: 'input', property: 'font-size', includes: '18px' }
]

run(
  'MOBILE_LAYOUT',
  'node',
  [layout, '--url', url, '--width', '393', '--height', '873', '--waitMs', '2200', '--checksEnv', 'CHECKS_JSON', '--resultJson', '/home/clawd/aurel-layout-mobile.json', '--strict'],
  { ...process.env, CHECKS_JSON: JSON.stringify(mobileChecks) },
)
