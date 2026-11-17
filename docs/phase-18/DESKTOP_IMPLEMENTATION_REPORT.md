# NEXBUS PHASE 18 — DESKTOP APPLICATION ARCHITECTURE & TAURI SPECIFICATION

**Platforms Supported:** macOS (.app, .dmg), Windows (.msi, .exe), Linux (.deb, .AppImage)  
**Desktop Framework:** Tauri 1.5+ (Rust Core + OS Native Webview)  
**Binary Footprint:** ~12–15 MB (compared to ~180 MB Electron distributions)  
**Security Model:** Strict Content Security Policy, zero external execution privilege  

---

## 1. Tauri Configuration Breakdown (`src-tauri/tauri.conf.json`)

- **Window Specifications:**
  - Initial Size: `1280 × 860` pixels (centered on screen)
  - Minimum Constraints: `800 × 600` pixels
  - Window Decorations: Enabled with native OS title bar and traffic-light / window control buttons
  - Light Theme Enforcement: Matches the Swiss editorial palette (`#F5F0E6`)
- **Native OS Webviews Utilized:**
  - macOS: `WKWebView`
  - Windows: `WebView2` (Chromium Evergreen Runtime)
  - Linux: `WebKitGTK`
- **Security Envelope:**
  - Content Security Policy (CSP):
    ```
    default-src 'self' 'unsafe-inline' 'unsafe-eval' https: http://localhost:3000 data: blob:
    ```
  - API Allowlist: Shell open is restricted solely to external informational URLs (e.g. documentation, open government datasets). Zero local file system mutation permissions.

---

## 2. Desktop Keyboard Navigation & Shortcuts

| Shortcut | Action | Scope |
|---|---|---|
| `Cmd/Ctrl + 1` | Navigate to Overview (`/`) | Global |
| `Cmd/Ctrl + 2` | Open Digital Twin (`/twin`) | Global |
| `Cmd/Ctrl + 3` | Open Journey Planner (`/journey`) | Global |
| `Cmd/Ctrl + 4` | Open Scenario Simulator (`/simulate`) | Global |
| `Cmd/Ctrl + 5` | Open Executive Observatory (`/control`) | Global |
| `Space` | Toggle 3D Fleet Motion Pause/Resume | Digital Twin |
| `R` | Reset Camera to Overview Perspective | Digital Twin |
| `Esc` | Dismiss Autocomplete or Tutorial Card | All Modals |

---

## 3. Production Build Matrix

To build release desktop binaries from the repository root:
```bash
# Prerequisites: Rust toolchain (cargo, rustc)
# 1. Compile Next.js web bundle
npm run build

# 2. Package desktop installer
cargo tauri build
```

Target bundles generated:
- **macOS:** `src-tauri/target/release/bundle/dmg/NEXBUS_1.0.0_aarch64.dmg`
- **Windows:** `src-tauri/target/release/bundle/msi/NEXBUS_1.0.0_x64_en-US.msi`
- **Linux:** `src-tauri/target/release/bundle/deb/nexbus_1.0.0_amd64.deb`
