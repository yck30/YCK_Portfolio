# Skill: Content Update
<!-- layer: skills | version: 1.0 | updated: 2026-08-01 -->

## Trigger

Use this playbook for content-only updates: blog posts, project descriptions, copy changes, and asset swaps. No code changes.

---

## Scope (STRICT)

| ✅ Allowed | ❌ NOT Allowed |
|---|---|
| `src/content/**` (MDX, JSON) | `src/components/**` |
| `public/**` (images, videos, favicons) | `src/app/**` (Next.js pages) |
| `src/data/**` (project JSON, social links) | `package.json` |
| Markdown files in root (`README`, `BACKLOG`, etc.) | `.agent/**` (requires CK approval) |

If the update requires touching code files → **STOP**. Use the `feature-implementation` skill instead.

---

## Adding a Blog Post

1. Create file: `src/content/posts/YYYY-MM-DD-post-slug.mdx`
2. Required frontmatter:
   ```mdx
   ---
   title: "Your Post Title"
   date: "YYYY-MM-DD"
   excerpt: "One sentence summary for the listing page."
   tags: ["tag1", "tag2"]
   published: true
   ---
   ```
3. Write content in MDX below the frontmatter
4. Add any images to `public/assets/posts/`
5. Verify the post appears on the blog listing page

---

## Updating a Project Entry

Edit `src/data/projects.json`:
```json
{
  "id": "project-slug",
  "title": "Project Name",
  "description": "One-paragraph description.",
  "tags": ["React", "TypeScript"],
  "url": "https://project-url.com",
  "github": "https://github.com/yck30/repo",
  "featured": true,
  "image": "/assets/projects/project-slug.png"
}
```

---

## Updating Social Links

Edit `src/data/social.json`:
```json
[
  { "platform": "GitHub", "url": "https://github.com/yck30", "icon": "github" },
  { "platform": "LinkedIn", "url": "https://linkedin.com/in/...", "icon": "linkedin" }
]
```

---

## Asset Swap

1. Optimise the new image/video before adding:
   - Images: WebP format, max 200KB for thumbnails
   - Videos: H.264 MP4, keep under 10MB
2. Place in `public/assets/`
3. Update the reference in the relevant content file

---

## Post-Update Checklist

- [ ] `pnpm build` passes (catches MDX syntax errors)
- [ ] Content renders correctly in local dev (`pnpm dev`)
- [ ] No broken image links
- [ ] Commit with message: `content: <description>`
- [ ] CHANGELOG updated
