# CK Personal Portfolio & Brand Hub

> A zero-cost, high-craft personal portfolio consolidating CK's tech and startup journey — built for recruiters, clients, and followers.

[![CI](https://img.shields.io/badge/CI-passing-brightgreen)](https://github.com/yck30/YCK_Portfolio)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Branch](https://img.shields.io/badge/branch-main-blue)](https://github.com/yck30/YCK_Portfolio)

---

## Live Site

| Environment | URL | Status |
|---|---|---|
| Production | https://yck-portfolio.vercel.app/ | 🟢 Live |
| Staging | Vercel Preview URLs | 🔄 Automatic per-branch |

---

## What Is This?

This is CK's personal brand hub — a single destination that showcases:
- **Projects**: KitaBuild, BIKIN INGAT, and other ventures
- **Writing**: Blog and essays on tech, startups, and building in public
- **Profile**: Who CK is and what CK builds
- **Contact**: A direct line for collaboration and inquiries

Built with a **Cinematic Liquid Editorial** aesthetic — film-still quality, restrained interface layer. No generic templates.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Animation | GSAP |
| Styling | Vanilla CSS + CSS Custom Properties |
| Package Manager | pnpm |
| Content | MDX + JSON |
| Forms | Formspree |
| Analytics | GA4 |
| Email | Buttondown |
| Container | Docker (multi-stage) + nginx |
| Deployment | Vercel (free tier) |

---

## Quick Start

### Prerequisites
- Node.js ≥ 18
- pnpm ≥ 10 (`npm install -g pnpm`)

### Install & Run
```bash
# Clone
git clone https://github.com/yck30/YCK_Portfolio.git
cd YCK_Portfolio

# Install dependencies
pnpm install

# Copy env template
cp .env.example .env
# Fill in your values in .env

# Start dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```bash
# Required for Phase 2 (leave blank for Phase 1)
NEXT_PUBLIC_GA4_MEASUREMENT_ID=    # Google Analytics 4
FORMSPREE_ID=                      # Formspree form ID
NEXT_PUBLIC_FORMSPREE_ID=          # Formspree form ID (public)
BUTTONDOWN_API_KEY=                # Buttondown newsletter API key
```

> ⚠️ Never commit `.env` to git. It is gitignored.

---

## Project Structure

```
YCK_Portfolio/
├── .agent/              # 5-layer agent governance (read this first)
│   ├── constitution.md  # Master operating contract
│   ├── skills/          # Agent playbooks
│   ├── hooks/           # Pre/post execution guards
│   ├── subagents/       # Specialist agent roles
│   └── memory/          # Persistent knowledge base
├── artifacts/           # Reference documents and PDFs
├── public/              # Static assets (video, images, fonts)
├── src/
│   ├── app/             # Next.js App Router pages
│   ├── components/      # Reusable React components
│   ├── content/         # MDX blog posts
│   └── data/            # JSON content (projects, social links)
├── scripts/             # Build and QA utility scripts
├── ARCHITECTURE.md      # System design overview
├── BACKLOG.md           # Feature backlog (MoSCoW)
├── CHANGELOG.md         # Release history
└── SECURITY.md          # Security policy
```

---

## Deployment

### Docker (Staging)
```bash
docker build -t ck-portfolio:latest .
docker run -p 8080:80 ck-portfolio:latest
```

### Vercel (Production)
Connect the repository to Vercel. It auto-deploys on push to `main`.

> ⚠️ Production deploys require CK's explicit approval — see `.agent/hooks/pre-deploy.md`

---

## Agent Governance

This project uses a **5-layer Agentic Infrastructure** (per the AIM Whitepaper):

| Layer | Location | Purpose |
|---|---|---|
| 1 — Constitution | `.agent/constitution.md` | Master rules and RACI |
| 2 — Skills | `.agent/skills/` | Task playbooks |
| 3 — Hooks | `.agent/hooks/` | Pre/post execution guards |
| 4 — Subagents | `.agent/subagents/` | Specialist roles |
| 5 — Memory | `.agent/memory/` | Persistent knowledge |

All AI agents contributing to this project must operate under the constitution's rules.

---

## Contributing

This is a solo project. No external contributions accepted at this time.

If you're an AI agent working on this project: **read `.agent/constitution.md` first.**

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

*Built by [CK](https://github.com/yck30) · Governed by the AIM Whitepaper v1.0*
