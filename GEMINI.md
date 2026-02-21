# Gemini CLI Context - CherryOS

## Project Overview
CherryOS is a React-based web application simulating a desktop operating system. It features a modular architecture using React Router for full-page application experiences ("Apps") rather than internal window management.

## Core Architecture
*   **Framework**: React 19 (Vite 7)
*   **Styling**: Tailwind CSS 4.0
*   **Routing**: React Router 7 (`BrowserRouter` with `basename="/CherryOS"`)
*   **State Management**: `OSContext` (React Context API)
*   **Data Validation**: Zod (for Watch List and other data models)
*   **Deployment**: GitHub Pages (via `gh-pages` branch) & OCI Object Storage (sync via Git Hook)

## Key Modules
*   **Desktop**: `src/components/Desktop.jsx` - Main entry point, grid layout for apps.
*   **Routing**: `src/App.jsx` - Defines routes for `/` (Desktop), `/songs`, `/watch`, `/games`, `/studio`.
*   **Watch List**: `src/apps/WatchLogApp.jsx` - Anime/Manga tracker with Zod validation and mock API simulation.
*   **Boot/Lock**: `src/components/BootScreen.jsx`, `src/components/LockScreen.jsx`.

## Security & Quality Standards
*   **Static Analysis**: ESLint configured with `eslint-plugin-sonarjs` and `eslint-plugin-security`.
*   **CSP**: Strict Content Security Policy in `index.html`.
*   **Validation**: All external/mock data inputs validated via Zod schemas.
*   **Dependencies**: Regular `npm audit` checks required.

## Infrastructure
*   **OCI**: Standard Tier Object Storage Bucket `cherryos-deploy`.
*   **CI/CD**:
    *   **Local**: `.git/hooks/pre-push` syncs `dist/` to OCI using `oci.exe`.
    *   **GitHub**: Actions set to `workflow_dispatch` only (manual trigger) to prevent billing.

## Development Commands
*   `npm run dev`: Start dev server.
*   `npm run build`: Production build (strips console logs).
*   `npm run lint`: Run static analysis (SonarJS/Security).
