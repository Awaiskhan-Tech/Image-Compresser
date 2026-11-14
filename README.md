
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

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- DaisyUI
- React Router
- Lucide React

## Getting Started

Follow these instructions to run the project locally.

### Prerequisites

- Node.js
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

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the local URL displayed in your terminal.

## Production Build

To create an optimised production build:

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
├── src/
│   ├── components/
│   │   ├── controls/
│   │   ├── layout/
│   │   ├── pages/
│   │   ├── preview/
│   │   └── upload/
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
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
