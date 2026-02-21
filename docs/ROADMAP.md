# CherryOS Roadmap & Future Plans

This document serves as the unified source of truth for the ongoing development, maintenance, and strategic expansion of CherryOS.

## 1. Versioning

CherryOS adheres to **Semantic Versioning 2.0.0 (SemVer)**:

- **MAJOR**: Incompatible API changes or complete architectural overhauls (e.g., the recent React 19 + Vite 7 migration).
- **MINOR**: Backward-compatible functionality additions (e.g., adding a new application to the desktop).
- **PATCH**: Backward-compatible bug fixes and security patches.

**Current Version:** 2.0.0 (Modular Refactor)

## 2. Feature Sets

### High Priority (Phase 2 & 3)

- **State Management Migration**: Transition from Context API to **Zustand** or **Redux Toolkit** for predictable state mutations and better debugging.
- **User Preferences System**: Implementation of light/dark themes, layout customization, and window behavior persistence using `localStorage`.
- **Enhanced Window Management**: Add window snapping (edge docking), multi-monitor simulation, and global keyboard shortcuts.
- **Extended Application Suite**:
  - **Project Showcase**: Filterable portfolio of work.
  - **Skills Matrix**: Interactive visualization of technical expertise.
  - **Contact Form**: Integrated feedback/communication tool.

### Experimental

- **Plugin Architecture**: Enable external developers to load custom apps into the CherryOS environment.
- **PWA Support**: Offline capability and "Install to Desktop" functionality.

## 3. Bug Fixes & Security

### Security Strategy

- **Automated Scanning**: Integrate CodeQL and `npm audit` into the quality gate.
- **Dependency Management**: Weekly Dependabot audits to address CVEs in high-impact packages (e.g., Vite, ESLint).
- **Pen Testing**: Periodic manual and automated penetration testing focusing on XSS prevention in the Terminal and dynamic content rendering.

### Resolved Issues

- **Rendering Block**: Fixed blank screen issue by correcting Tailwind 4 Vite integration and base pathing.
- **Boot Freeze**: Resolved race condition in the `BootScreen` progress logic.
- **Linter Crashes**: Stabilized ESLint configuration for React 19 compatibility.

## 4. Deployment Targets

- **Target OS**: Cross-platform Web (Chrome, Firefox, Safari, Edge).
- **Architecture**: Static Site Generation (SSG) / Single Page Application (SPA).
- **Environments**:
  - **Local**: Vite Dev Server.
  - **Staging**: PR Previews (Planned via GitHub Actions).
  - **Production**: GitHub Pages (Actions-based deployment).

## 5. Changelog

### [2.0.0] - 2026-02-20

- **Refactor**: Split monolithic `App.jsx` into `src/apps/`, `src/components/`, and `src/context/`.
- **Optimization**: Implemented code-splitting with `React.lazy` for all desktop applications.
- **Upgrade**: Migrated to React 19, Vite 7, and Tailwind CSS 4.
- **CI/CD**: Consolidated GitHub Actions into a unified `main.yml` lifecycle.
- **Security**: Added `.nojekyll` and configured CodeQL (manual trigger).

### [1.0.0] - Legacy

- Initial release of the React-based OPERATING SYSTEM simulation.

## 6. Roadmap

- **Q1 2026**: Stability, Documentation, and Modularization (Completed).
- **Q2 2026**: Advanced Window Management & User Preference Persistence.
- **Q3 2026**: Application Expansion (Skills Matrix, Blog Integration).
- **Q4 2026**: PWA Implementation and Community Plugin Support.
