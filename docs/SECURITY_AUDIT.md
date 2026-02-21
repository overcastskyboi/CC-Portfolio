# CherryOS Security Audit & Penetration Testing

This document describes security best practices applied to CherryOS, common vulnerability checks, and remediation steps.

## Security Best Practices Implemented

### 1. HTTP Security Headers

- **X-Content-Type-Options: nosniff** — Prevents MIME-sniffing; set in `index.html` and Vite dev/preview servers.
- **X-Frame-Options: DENY** — Mitigates clickjacking; configured in `vite.config.js` for dev/preview.
- **Referrer-Policy: strict-origin-when-cross-origin** — Limits referrer leakage.
- **Permissions-Policy** — Restricts camera, microphone, geolocation (not used by the app).

**Remediation for production (e.g. GitHub Pages):** GitHub Pages does not allow custom headers. For full header control, use a proxy (e.g. Cloudflare) or a host that supports custom headers (Netlify `_headers`, Vercel `headers`, etc.).

### 2. No User-Controlled Script Execution

- The app does not use `eval()`, `new Function()`, or `innerHTML` with unsanitized user input.
- React’s default escaping prevents XSS in rendered content.

**Remediation:** If you add rich text or user content, use a sanitization library (e.g. DOMPurify) and never inject raw HTML from users.

### 3. Dependency Hygiene

- Keep dependencies up to date: `npm audit` and `npm update`; address critical/high findings.
- CI runs on push to `main`; consider adding `npm audit --audit-level=high` to the quality gate.

**Remediation:** Run `npm audit fix` for known vulnerabilities; for breaking changes, upgrade and test.

### 4. No Sensitive Data in Client Code

- No API keys or secrets in source; use environment variables (`import.meta.env`) for build-time config.
- `.env` is gitignored; never commit secrets.

**Remediation:** Rotate any exposed secrets; use env vars and secret managers for deployment.

### 5. Content Security Policy (CSP)

- Strict CSP is recommended for production. Example (tune for your host):

  ```text
  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; base-uri 'self'; form-action 'self'
  ```

**Remediation:** Where the host allows custom headers, add CSP. For inline styles (e.g. Tailwind), `style-src 'self' 'unsafe-inline'` may be required; avoid `unsafe-eval` and broad `unsafe-inline` for scripts.

## Penetration Testing Checklist

| Area | Check | Status / Remediation |
|------|--------|----------------------|
| XSS | No unsanitized user input in DOM | ✅ React escaping; avoid `dangerouslySetInnerHTML` with user data |
| Clickjacking | X-Frame-Options or CSP frame-ancestors | ✅ DENY in dev/preview; set on production if possible |
| MIME sniffing | X-Content-Type-Options: nosniff | ✅ Set in HTML and Vite config |
| Open redirects | No redirects using user-controlled URLs | ✅ N/A for current static app |
| Sensitive data exposure | No secrets in repo or client bundle | ✅ Env vars; .env gitignored |
| Dependency vulns | npm audit | Run regularly; fix high/critical |
| HTTPS | All traffic over TLS in production | ✅ Enforce on host (e.g. GitHub Pages) |
| Subresource Integrity (SRI) | For any CDN scripts | Consider if you add external scripts |

## Reporting a Vulnerability

See [SECURITY.md](../SECURITY.md) for supported versions and how to report vulnerabilities.

## Static Audit: TerminalApp.jsx & OSContext.jsx

### TerminalApp.jsx

| Risk | Finding | Remediation |
|------|--------|-------------|
| **XSS** | Command output and user `input` are rendered as text via `{line}` in JSX. React escapes by default, so no HTML/script injection. | **No code change required.** Do not introduce `dangerouslySetInnerHTML` for terminal output. If rich output is ever needed, use a sanitizer (e.g. DOMPurify) and allow only safe tags. |
| **Input abuse** | Unbounded input can grow history and memory. | **Implemented:** Input capped at 256 chars; control characters stripped before processing. |
| **Telemetry injection** | `telemetry.cpu`, `telemetry.mem`, `telemetry.uptime` are interpolated into a string and rendered as text. If the API returned malicious content, React would still escape. | **Defense in depth:** Validate telemetry shape and types before use; treat as display-only. |
| **External request** | Fetch to `https://129.80.222.26:3000/metrics/` — hardcoded IP, mixed content possible in some hosts. | Prefer env-based URL (`import.meta.env.VITE_TELEMETRY_URL`), HTTPS only, and CORS configured on the endpoint. |

### OSContext.jsx

| Risk | Finding | Remediation |
|------|--------|-------------|
| **State injection** | `openWindow(appId, component, title, icon, initialProps)` — `title` and `initialProps` are rendered in `WindowFrame` as text / passed to app components. Titles are currently hardcoded in Desktop. | **Policy:** Never pass user-controlled or unsanitized strings as `title` or into `initialProps` if they are ever rendered as HTML elsewhere. Document for future plugins. |
| **XSS** | `win.title` is rendered in `<span>{win.title}</span>`; React escapes. | No change; keep rendering as text only. |

### Remediation Plan (CVEs / Insecure Patterns)

1. **TerminalApp:** Input sanitization (max length + strip control chars) — **done below.**  
2. **TerminalApp:** Validate telemetry: ensure `cpu`/`mem` are numbers, `uptime` is number; otherwise show "unavailable."  
3. **TerminalApp:** Move telemetry URL to env (e.g. `VITE_TELEMETRY_URL`); default to empty to disable.  
4. **OSContext:** No code change; document in ARCHITECTURE/API that `title` and `initialProps` must be trusted or sanitized.  
5. **Project:** Continue to avoid `eval`, `new Function`, and `dangerouslySetInnerHTML` for user or external data.

## Updates

This audit reflects the current static, client-only architecture. If you add authentication, APIs, or server-side logic, re-run a full pen-test and update this document.
