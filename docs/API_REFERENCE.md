# CherryOS API Reference

This document provides detailed information about the components, hooks, and utilities available in CherryOS (React 19 + Vite 7 + Tailwind 4, modular layout under `src/`).

## Source Layout

| Path | Contents |
|------|----------|
| **`src/apps/`** | Application modules: `TerminalApp.jsx`, `MySongsApp.jsx`, `WatchLogApp.jsx`, `GameCenterApp.jsx`, `StudioRackApp.jsx`. Each is loaded via `React.lazy()` from `Desktop.jsx`. |
| **`src/components/`** | Shell UI: `BootScreen.jsx`, `LockScreen.jsx`, `Desktop.jsx`, `DesktopIcon.jsx`, `WindowFrame.jsx`, `Taskbar.jsx`, `MobileNav.jsx`. |
| **`src/context/`** | `OSContext.jsx` — global OS state and window management. |
| **`src/hooks/`** | `useOSHooks.js` — e.g. `useDraggable`, `useTime`. |
| **`src/data/`** | Static data (constants, plugin lists, etc.). |

**File renames (2.0.0 refactor):** App components were moved from the monolith into `src/apps/`; shell components remain in `src/components/`. The `APPS` array and lazy imports live in `src/components/Desktop.jsx`.

## Table of Contents

1. [Components](#components)
2. [Hooks](#hooks)
3. [Context Providers](#context-providers)
4. [Utilities](#utilities)
5. [Constants](#constants)
6. [Application Components](#application-components)

## Components

### OSProvider

The main context provider that manages the entire OS state.

**Props:**

- `children` (ReactNode): Child components to wrap with the provider

**Context Value:**

```javascript
{
  bootState: string,        // 'off', 'locked', 'desktop'
  setBootState: function,   // Setter for bootState
  windows: array,           // Array of open windows
  openWindow: function,     // Function to open a new window
  closeWindow: function,    // Function to close a window
  minimizeWindow: function, // Function to minimize a window
  focusWindow: function,    // Function to focus a window
  activeWindowId: string,   // ID of the currently active window
  isMobile: boolean         // Whether the device is mobile
}
```

### WindowFrame

Component that renders a draggable, resizable window.

**Props:**

- `window` (object): Window configuration object
  - `id` (string): Unique identifier
  - `component` (React.Component): Component to render inside the window
  - `title` (string): Window title
  - `icon` (React.Component): Icon component
  - `props` (object): Props to pass to the component
  - `minimized` (boolean): Whether the window is minimized
  - `zIndex` (number): Z-index for stacking
  - `position` (object): Window position {x, y}

### DesktopIcon

Component for desktop application icons.

**Props:**

- `icon` (React.Component): Icon component to display
- `label` (string): Text label for the icon
- `onClick` (function): Function to call when clicked

### Taskbar

System taskbar component that shows running applications and system information.

**Props:**

None

### LockScreen

Lock screen component that appears when the OS is locked.

**Props:**

None

### BootScreen

Boot screen component that appears during OS initialization.

**Location:** `src/components/BootScreen.jsx`  
**Props:** None

## Hooks

### useDraggable

Hook for adding draggable functionality to components.

**Parameters:**

- `initialPosition` (object): Initial position {x, y}

**Returns:**

```javascript
{
  position: {x, y},        // Current position
  handleMouseDown: func    // Mouse down handler for dragging
}
```

### useTime

Hook for getting the current time that updates every second.

**Returns:**

- `Date`: Current date and time

### useOS

Hook for accessing the OS context.

**Returns:**

- OS context value (see OSProvider context value above)

## Context Providers

### OSContext

React context that provides OS state and functions to child components.

## Utilities

### VST_LIST

Object containing categorized lists of music production plugins.

```javascript
{
  Dynamics: [...],
  'Reverb/Delay': [...],
  Instruments: [...],
  Creative: [...],
  Utility: [...]
}
```

### ANIME_DATA

Static data for the watch log application.

```javascript
{
  user: {
    name: string,
    avatar: string,
    stats: {
      animeCount: number,
      mangaCount: number,
      meanScore: number
    }
  },
  catalogue: [...]
}
```

### GAMING_DATA

Static data for the game center application.

```javascript
{
  steam: {...},
  retro: {...}
}
```

### TRACKS

Array of track information for the music player.

```javascript
[
  {
    title: string,
    artist: string,
    duration: string,
    lyrics: [...]
  },
  ...
]
```

## Application Components

All app components live under **`src/apps/`** and are registered in the `APPS` array in `src/components/Desktop.jsx`, loaded via `React.lazy()`.

### TerminalApp

**Location:** `src/apps/TerminalApp.jsx`  
Interactive terminal: built-in commands (help, whoami, ls, clear, reboot, telemetry). User input is sanitized (max length, control chars); telemetry URL is `VITE_TELEMETRY_URL` (optional).  
**Props:** None

### MySongsApp

**Location:** `src/apps/MySongsApp.jsx`  
Music player application.  
**Props:** None

### WatchLogApp

**Location:** `src/apps/WatchLogApp.jsx`  
Media catalog application.  
**Props:** None

### GameCenterApp

**Location:** `src/apps/GameCenterApp.jsx`  
Gaming profile application.  
**Props:** None

### StudioRackApp

**Location:** `src/apps/StudioRackApp.jsx`  
Audio plugin inventory application.  
**Props:** None

## Constants

### APPS

Defined in **`src/components/Desktop.jsx`** (not a separate file). Array of available applications with their metadata; each `component` is a lazy-loaded module from `src/apps/`.

```javascript
[
  {
    id: string,        // e.g. 'term', 'songs', 'watch', 'games', 'studio'
    title: string,      // Display name
    icon: React.Component,
    component: React.Component  // Lazy-loaded from src/apps/
  },
  ...
]
```

## Customization

To customize CherryOS, you can:

1. Modify the data in `src/data/` (e.g. constants, plugin lists).
2. Add new applications: create a component in **`src/apps/`**, then in **`src/components/Desktop.jsx`** add a `lazy(() => import('../apps/YourApp'))` and an entry in the `APPS` array.
3. Customize styling through Tailwind CSS 4 classes.
4. Extend functionality via `src/hooks/` or `src/context/OSContext.jsx`.

## Extending Applications

To add a new application:

1. Create **`src/apps/YourAppName.jsx`** (same pattern as existing apps).
2. In **`src/components/Desktop.jsx`**: add `const YourAppName = lazy(() => import('../apps/YourAppName'));` and an object in `APPS` with `id`, `title`, `icon`, and `component: YourAppName`.
3. Ensure the component works in both desktop and mobile (WindowFrame adapts).
4. Run unit and E2E tests (`npm test`, `npm run test:e2e`).

## Performance Considerations

- DesktopIcon and WindowFrame use `React.memo`.
- All apps are code-split via `React.lazy()` in Desktop; each window is wrapped in `Suspense` with a skeleton fallback.
- LCP target &lt; 2.0s; see `src/test/e2e/performance.spec.js`.
- Use `useCallback` for handlers passed to children where needed; memoize expensive computations.
