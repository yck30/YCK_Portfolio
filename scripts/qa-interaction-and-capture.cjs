const { chromium } = require('/home/clawd/.openclaw/skills/playwright-browser-automation/node_modules/playwright')

const url = process.env.PREVIEW_BASE_URL
if (!url) throw new Error('PREVIEW_BASE_URL is required')

async function run() {
  const browser = await chromium.launch({ headless: true })
  const errors = []

  try {
    const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } })
    desktop.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text())
    })
    desktop.on('pageerror', (error) => errors.push(error.message))
    await desktop.goto(url, { waitUntil: 'networkidle' })
    await desktop.waitForTimeout(2400)

    const videoState = await desktop.locator('.hero-video').evaluate((video) => ({
      readyState: video.readyState,
      paused: video.paused,
      currentTime: video.currentTime,
    }))
    if (videoState.readyState < 3 || videoState.paused || videoState.currentTime <= 0) {
      throw new Error(`Video playback check failed: ${JSON.stringify(videoState)}`)
    }

    await desktop.screenshot({ path: '/home/clawd/aurel-hero-final.png', fullPage: false })
    await desktop.close()

    const mobile = await browser.newPage({ viewport: { width: 393, height: 873 }, isMobile: true, hasTouch: true })
    await mobile.goto(url, { waitUntil: 'networkidle' })
    await mobile.getByRole('button', { name: 'Toggle navigation' }).click()
    if (!(await mobile.getByRole('link', { name: 'Contact', exact: true }).isVisible())) {
      throw new Error('Mobile navigation did not open')
    }

    await mobile.getByLabel('Your name').fill('Marcelo')
    await mobile.getByLabel('Your email').fill('marcelo@example.com')
    await mobile.getByRole('button', { name: 'Send project request' }).click()
    await mobile.getByText('Request received', { exact: false }).waitFor({ state: 'visible' })
    await mobile.close()

    if (errors.length) throw new Error(`Browser errors: ${errors.join(' | ')}`)
    process.stdout.write(`${JSON.stringify({ ok: true, videoState, mobileMenu: 'pass', formSubmit: 'pass', screenshot: '/home/clawd/aurel-hero-final.png' }, null, 2)}\n`)
  } finally {
    await browser.close()
  }
}

run().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
