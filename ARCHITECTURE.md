# CherryOS Architecture Map

This document provides a comprehensive guide to the project structure and technical implementation of CherryOS.

## 1. Project Hierarchy

```text
CherryOS-dev/
â”œâ”€â”€ .github/            # CI/CD Workflows (Security Scans)
â”œâ”€â”€ src/                # Source Code
â”‚   â”œâ”€â”€ apps/           # Modular full-page applications
â”‚   â”œâ”€â”€ components/     # Reusable UI components (DataGrid, LazyImage)
â”‚   â”œâ”€â”€ context/        # Global State Management (OSContext)
â”‚   â”œâ”€â”€ data/           # Static assets, schemas (Zod), and constants
â”‚   â””â”€â”€ test/           # Unit and Integration tests (Vitest)
â”œâ”€â”€ Dockerfile          # OCI Deployment Configuration
â””â”€â”€ vite.config.js      # Build & Test Pipeline Config
```

## 2. Component Architecture

### Core OS Layer
- **`OSContext.jsx`**: Manages boot state, active windows, and device detection (mobile vs. desktop).
- **`App.jsx`**: The root router. Uses `basename="/CherryOS"` for GitHub Pages compatibility.

### Application Layer
Each app in `src/apps/` is a self-contained environment:
- **`MySongsApp.jsx`**: High-fidelity music player with async fetching and manifest validation.
- **`WatchLogApp.jsx`**: Media tracker using the `DataGrid` component for organized visualization.
- **`GameCenterApp.jsx`**: Portfolio-style game library with card-based layouts.

## 3. Guide for Making Changes

### How to add a new "App":
1. Create your component in `src/apps/NewApp.jsx`.
2. Register the route in `src/App.jsx`.
3. Add the application icon/link to `src/components/Desktop.jsx`.
4. (Optional) Define a data schema in `src/data/schemas.js` if it fetches external data.

### How to modify UI Scaling:
- **Desktop**: Edit `src/components/Desktop.jsx`. We use Tailwind utility classes (`gap-24`, `p-10`, etc.) to fill empty space.
- **Components**: Edit `src/components/DataGrid.jsx` for table/grid layouts.

### How to update Data/APIs:
- **Static fallback**: Edit `src/data/constants.js`.
- **Remote Data**: Update `src/data/music_manifest.json` (local copy) or the OCI-hosted version.
- **Validation**: Update `src/data/schemas.js` to change how the frontend validates incoming JSON.

## 4. OCI & Deployment
- **Containerization**: The `Dockerfile` uses a multi-stage build (Node -> Nginx).
- **Sync**: Deployment artifacts are served from the root of the `gh-pages` branch.
