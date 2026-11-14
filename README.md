
# Webistic Image Compressor

A modern, browser-based image compression tool built to reduce image file sizes while maintaining visual quality.

**Compress images directly in your browser. No image uploads to external servers are required for the compression process.**

## Features

- **Image Compression** — Reduce image file sizes quickly.
- **Multiple Formats** — Support for JPG, JPEG, PNG and WebP images.
- **Target File Size** — Compress images towards a desired file size.
- **Compression Presets** — Choose predefined compression settings.
- **Batch Processing** — Add and process multiple images.
- **Image Comparison** — Compare original and compressed images.
- **Individual Downloads** — Download compressed images separately.
- **Privacy-Focused** — Image processing runs locally in your browser.
- **Responsive Interface** — Designed for desktop and mobile devices.
- **Sanity-powered blog** — Publish and manage articles through the embedded Studio at `/studio`.

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- React Router
- Sanity Studio and Content Lake
- Lucide React

## Getting Started

Follow these instructions to run the project locally.

### Prerequisites

- Node.js 22.12 or later
- npm
- Git

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Awaiskhan-Tech/Image-Compresser.git
   ```

2. Navigate to the project directory:

   ```bash
   cd Image-Compresser
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Copy `.env.example` to `.env` and set `VITE_SITE_URL` to the canonical production origin. The Sanity project ID and dataset default to the public Webistic project configuration shown in `.env.example`.

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open the local URL displayed in your terminal.

## Sanity CMS

The existing React/Vite app hosts Sanity Studio at `/studio`; no separate Studio application is needed. The Studio uses project `6yinrhqf`, dataset `production`, and the schemas in `src/sanity/schemaTypes`. Public published content is queried from the browser using GROQ. No private API token is included in frontend code.

Before using the Studio, add each site origin (for example `http://localhost:3000` and the production origin) in the Sanity project's **API > CORS origins** settings, with **Allow credentials** enabled for Studio sign-in. Editors must be signed in with an account that has access to the project.

To publish an article:

1. Open `/studio` and sign in.
2. Select **Blog post**, create a post, and fill in its title, slug, excerpt, cover image and alternative text, author, category, publication date, and article body.
3. Optionally add tags, mark the post as featured, and fill in the SEO fields.
4. Publish the document. Published articles appear automatically at `/blog` and `/blog/<slug>`.

The `production` dataset must permit unauthenticated read access for the public website. If it is private, do not add a read token to the browser; use a trusted server-side API/proxy or a public dataset instead.

## Blog and SEO

Routes:

- `/blog` — Sanity-backed listing, category filters, featured article, and load-more pagination.
- `/blog/:slug` — Published article with Portable Text, related content, metadata, and JSON-LD.
- `/studio/*` — Embedded Sanity Studio route, including Studio sub-routes.

Set `VITE_SITE_URL` to the canonical origin (for example, `https://compressor.example.com`) before a production build. The `postbuild` step queries published Sanity articles and writes `dist/sitemap.xml` and a matching `dist/robots.txt`. If the origin is unset, the build completes but sitemap generation is skipped with a warning. A static sitemap reflects content at build time; configure a Sanity publish webhook to rebuild/redeploy if the sitemap must update immediately after publishing.

The app is currently a client-rendered Vite SPA. It updates title, description, canonical, Open Graph, Twitter, robots, and JSON-LD after React renders, and includes dynamic published URLs in its generated sitemap; however, this does not put article HTML or metadata into the initial response. Search and social crawlers with limited JavaScript rendering may therefore miss article-specific content. Full first-response SEO would require a rendering/prerendering architecture change (such as route-aware prerendering or a server-rendered React deployment). That change is intentionally not included; it should be chosen separately before implementation. Production hosting must also rewrite deep routes such as `/blog/<slug>` and `/studio/**` to the Vite SPA entry point.

## Production Build

To create an optimized production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Supported Image Formats

| Format | Support |
|---|---|
| JPG / JPEG | Yes |
| PNG | Yes |
| WebP | Yes |

## Privacy

Webistic Image Compressor is designed with privacy in mind.

Image compression is performed locally in the user's browser. Images are not uploaded to a remote server as part of the compression workflow.

## Project Structure

```text
Image-Compresser/
├── public/
├── scripts/
│   └── generate-sitemap.ts
├── src/
│   ├── components/
│   │   ├── blog/
│   │   ├── layout/
│   │   └── pages/
│   ├── lib/
│   │   ├── compression/
│   │   └── sanity/
│   ├── sanity/
│   │   └── schemaTypes/
│   ├── App.tsx
│   ├── main.tsx
│   └── sanity.config.ts
├── index.html
├── package.json
└── tsconfig.json
```

## Contributing

Contributions, suggestions and improvements are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Submit a pull request.

## Developed By

**Webistic Marketing Solutions**

Website: https://webistic.co

Email: info@webistic.co

---

If you find this project useful, consider giving the repository a ⭐ on GitHub.
