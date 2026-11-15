# NEXBUS — Production Deployment Guide

## 1. System Requirements

- **Node.js:** v18.18.0 or higher (v20+ recommended).
- **Package Manager:** `npm` v9+ or `pnpm`.
- **Operating Environment:** Linux (Ubuntu 22.04 LTS / Debian 12 / Alpine), macOS, or Docker container.
- **Client Requirements:** Modern Evergreen Browser (Chrome 90+, Safari 15+, Firefox 90+, Edge) with WebGL 2.0 support. (Automated 2D vector fallback engages when WebGL is absent).

---

## 2. Environment Configuration

Create `.env.local` or set production environment variables:

```bash
# Application Environment
NODE_ENV=production
PORT=3000

# Base URL for metadata and canonical links
NEXT_PUBLIC_SITE_URL=https://nexbus.delhi.gov.in

# API Rate Limiting (Requests per minute per IP)
API_RATE_LIMIT_PER_MINUTE=120

# Optional GTFS / Telemetry Remote Endpoints
OTD_DELHI_API_KEY=optional_public_token
```

---

## 3. Build & Production Start Commands

```bash
# 1. Install exact dependencies
npm ci

# 2. Run static type checking
npx tsc --noEmit

# 3. Execute automated platform verification suite (29 tests)
npm test

# 4. Generate optimized production build
npm run build

# 5. Start production server
npm run start
```

---

## 4. Production Security & Caching Headers

NEXBUS configures production security headers in `next.config.ts`:
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(self)`
- `Cache-Control`: Dynamic API routes emit `public, max-age=60, s-maxage=300, stale-while-revalidate=600`.
