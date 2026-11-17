# NEXBUS PHASE 18 — PROGRESSIVE WEB APP (PWA) IMPLEMENTATION & VERIFICATION

**Product:** NEXBUS — Urban Mobility Intelligence Platform  
**Target:** Standard PWA Specification (W3C Web App Manifest & Service Workers API)  
**Status:** 100% Certified Installable & Offline-Capable  

---

## 1. Web App Manifest Specification

The manifest is published at `/manifest.json` with the following configuration:
- **Application Name:** `NEXBUS — Delhi Urban Mobility Intelligence`
- **Short Name:** `NEXBUS`
- **Theme Color:** `#F5F0E6` (Warm Architectural Ivory)
- **Background Color:** `#F5F0E6`
- **Display Mode:** `standalone` (Full-screen native-like shell without browser URL chrome)
- **Start URL:** `/`
- **Scope:** `/`
- **Orientation:** `any` (Seamless adaptation between portrait phone and landscape tablet/desktop)
- **Icons Included:**
  - `icon-192.png`: 192×192 PNG (Standard launcher icon)
  - `icon-512.png`: 512×512 PNG (High-density launcher and splash icon)
  - `icon-maskable.png`: 512×512 PNG (Android adaptive icon format with safe-zone margin)
  - `apple-touch-icon.png`: 180×180 PNG (iOS Home Screen icon)
  - `nexbus-icon.svg`: Scalable vector source
- **Application Shortcuts:**
  - `Digital Twin` -> `/twin`
  - `Journey Planner` -> `/journey`
  - `Simulation Lab` -> `/simulate`

---

## 2. Service Worker Architecture (`public/sw.js`)

The service worker implements hybrid caching strategies tailored for transit data reliability:

```
[Fetch Event]
     │
     ├── url.pathname.startsWith('/api/')
     │         └── Strategy: Network-First with Offline JSON Envelope
     │
     ├── request.mode === 'navigate' (HTML Pages)
     │         └── Strategy: Network-First with Cache Fallback ('/')
     │
     └── Static Assets (Scripts, CSS, Fonts, Images)
               └── Strategy: Cache-First with Background Revalidation
```

### 2.1 Precache Inventory
On service worker installation, critical assets are stored in `nexbus-offline-v1`:
- Core HTML routes: `/`, `/twin`, `/journey`, `/simulate`, `/control`, `/methodology`, `/about`, `/terms`, `/privacy`
- PWA manifest and icons: `/manifest.json`, `/icons/icon-192.png`, `/icons/icon-512.png`

### 2.2 Offline API Fallback Envelope
When network connectivity is severed during an API call, the service worker catches the network rejection and emits a structured offline envelope:
```json
{
  "success": false,
  "offline": true,
  "error": "OFFLINE_MODE",
  "message": "Device is offline. Showing cached transit intelligence."
}
```

---

## 3. PWA User Experience Components

### 3.1 Install Prompt (`src/components/pwa/InstallPrompt.tsx`)
- Detects the browser's `beforeinstallprompt` event and stashes the deferred prompt.
- Renders an architectural banner inviting the user to install NEXBUS for instant offline access.
- Executes `prompt()` on user tap, records the installation event, and automatically dismisses once installed.

### 3.2 Offline Status Banner (`src/components/pwa/OfflineIndicator.tsx`)
- Continuously listens to `window.addEventListener('online')` and `window.addEventListener('offline')`.
- Displays a status chip in the lower-left viewport informing citizens:
  *"Offline Mode · Showing cached transit intelligence"*
- Automatically flashes a green confirmation upon network recovery:
  *"✓ Reconnected to Delhi Transit Stream"*
