const { chromium } = require('/home/clawd/.openclaw/skills/playwright-browser-automation/node_modules/playwright')

const target = 'https://aurel-liquid-hero.apps.mdxpreview.xyz/'

async function settle(frame) {
  await frame.locator('.hero-frame').waitFor({ state: 'visible' })
  await frame.waitForTimeout(2600)
  const video = frame.locator('.hero-video')
  await video.evaluate((node) => {
    node.currentTime = 2.5
    node.pause()
  })
  await frame.waitForTimeout(250)
}

async function run() {
  const browser = await chromium.launch({ headless: true })
  const errors = []

  try {
    const desktop = await browser.newPage({ viewport: { width: 1920, height: 1080 } })
    desktop.on('console', (message) => {
      if (message.type() === 'error') errors.push(`desktop console: ${message.text()}`)
    })
    desktop.on('pageerror', (error) => errors.push(`desktop page: ${error.message}`))
    await desktop.goto(target, { waitUntil: 'networkidle' })
    await settle(desktop)
    await desktop.screenshot({ path: '/home/clawd/aurel-gallery-hero.png' })
    await desktop.close()

    const board = await browser.newPage({ viewport: { width: 1920, height: 1080 } })
    board.on('console', (message) => {
      if (message.type() === 'error') errors.push(`board console: ${message.text()}`)
    })
    await board.setContent(`
      <!doctype html>
      <html>
        <head>
          <style>
            * { box-sizing: border-box; }
            body { margin: 0; width: 1920px; height: 1080px; overflow: hidden; background: #05070a; color: #fff; font-family: Arial, sans-serif; }
            .glow { position: absolute; inset: -25%; background: radial-gradient(circle at 50% 55%, rgba(131,150,180,.18), transparent 38%); filter: blur(70px); }
            .eyebrow { position: absolute; z-index: 4; top: 64px; left: 72px; color: rgba(255,255,255,.48); font-size: 16px; letter-spacing: .22em; text-transform: uppercase; }
            h1 { position: absolute; z-index: 4; top: 86px; left: 72px; width: 340px; margin: 0; font-family: Georgia, serif; font-weight: 400; font-size: 56px; line-height: .95; letter-spacing: -.04em; }
            .devices { position: absolute; z-index: 2; inset: 84px 120px 54px; display: flex; justify-content: center; align-items: flex-end; gap: 110px; }
            .device { width: 430px; height: 932px; padding: 10px; border: 1px solid rgba(255,255,255,.18); border-radius: 42px; background: #020305; box-shadow: 0 36px 110px rgba(0,0,0,.62), inset 0 1px 0 rgba(255,255,255,.12); overflow: hidden; }
            iframe { width: 410px; height: 912px; border: 0; border-radius: 32px; background: #020305; }
          </style>
        </head>
        <body>
          <div class="glow"></div>
          <div class="eyebrow">Responsive experience</div>
          <h1>One signal.<br />Every screen.</h1>
          <div class="devices">
            <div class="device"><iframe id="default" src="${target}"></iframe></div>
            <div class="device"><iframe id="menu" src="${target}"></iframe></div>
          </div>
        </body>
      </html>
    `, { waitUntil: 'load' })

    const defaultFrame = board.frames().find((frame) => frame.url() === target)
    const targetFrames = board.frames().filter((frame) => frame.url() === target)
    if (!defaultFrame || targetFrames.length !== 2) throw new Error('Responsive board frames did not load')
    await Promise.all(targetFrames.map(settle))
    await targetFrames[1].getByRole('button', { name: 'Toggle navigation' }).click()
    await targetFrames[1].getByRole('link', { name: 'Contact', exact: true }).waitFor({ state: 'visible' })
    await board.screenshot({ path: '/home/clawd/aurel-gallery-responsive.png' })
    await board.close()

    if (errors.length) throw new Error(errors.join(' | '))
    process.stdout.write(`${JSON.stringify({
      ok: true,
      screenshots: [
        '/home/clawd/aurel-gallery-hero.png',
        '/home/clawd/aurel-gallery-responsive.png'
      ]
    }, null, 2)}\n`)
  } finally {
    await browser.close()
  }
}

run().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
