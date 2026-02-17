# CherryOS 2.0

CherryOS 2.0 is a React + Tailwind powered, desktop-style portfolio experience that mimics a lightweight operating system environment in the browser.

## Features

- Boot sequence and lock screen flow
- Desktop with launchable app icons
- Draggable, focusable, minimizable windows
- Taskbar/mobile dock with active apps and clock
- Built-in portfolio apps:
  - **My Songs** (music player shell with lyrics + transport UI)
  - **Watch Log** (anime/manga catalogue with filtering)
  - **Game Center** (gaming profile dashboard)
  - **Studio Rack** (music production plugin inventory)
  - **Terminal** (interactive fake shell commands)

## Tech Stack

- **React 18**
- **Vite 5**
- **Tailwind CSS 3**
- **lucide-react** icons

## Project Structure

```text
CC_Portfolio/
├── public/                      # Static public assets (placeholders for media/images)
├── src/
│   ├── App.jsx                  # CherryOS app shell + all app windows
│   ├── main.jsx                 # React bootstrap entry
│   └── styles.css               # Tailwind directives + global utility styles
├── index.html                   # Vite host HTML
├── package.json                 # Scripts + dependencies
├── postcss.config.js            # Tailwind/PostCSS wiring
├── tailwind.config.js           # Tailwind content config
└── vite.config.js               # Vite React configuration
```

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Run locally

```bash
npm run dev
```

Open the URL shown by Vite (usually `http://localhost:5173`).

### 3) Build production bundle

```bash
npm run build
```

### 4) Preview production build

```bash
npm run preview
```

## Placeholder Dependencies / Content

CherryOS 2.0 is fully functional without external APIs. A few elements are intentionally placeholder-driven so the branch remains portable:

- Music player track/audio state is UI-only (no streaming backend required).
- Anime/manga and gaming stats are static local data objects.
- Background image on lock screen uses a public URL; swap with local assets in `public/` for offline deployments.

## Customization

- Update desktop apps and content in `src/App.jsx`.
- Add real API integrations by replacing static data constants.
- Add custom artwork/audio in `public/` and wire into app components.

## Notes

This branch intentionally preserves legacy static files (`assets/`, `music.html`, `systems.html`) for reference while introducing a complete CherryOS 2.0 React application as the primary runnable site.
