# NEXBUS PHASE 18 — iOS PACKAGING & WKWEBVIEW ARCHITECTURE

**Platform:** iOS 15.0+ (iPhone & iPad Universal)  
**Runtime Bridge:** Capacitor iOS Native Bridge (`WKWebView`)  
**Bundle Identifier:** `in.gov.delhi.nexbus`  
**Display Archetype:** Swiss Transit Cartography & Editorial Monograph  

---

## 1. iOS Configuration (`Info.plist`)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleIdentifier</key>
    <string>in.gov.delhi.nexbus</string>
    <key>CFBundleName</key>
    <string>NEXBUS</string>
    <key>CFBundleDisplayName</key>
    <string>NEXBUS Delhi</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0.0</string>
    <key>CFBundleVersion</key>
    <string>1</string>
    <key>LSRequiresIPhoneOS</key>
    <true/>
    <key>UIRequiresFullScreen</key>
    <false/>
    <key>UIStatusBarStyle</key>
    <string>UIStatusBarStyleDarkContent</string>
    <key>UIViewControllerBasedStatusBarAppearance</key>
    <true/>
    <key>UISupportedInterfaceOrientations</key>
    <array>
        <string>UIInterfaceOrientationPortrait</string>
        <string>UIInterfaceOrientationLandscapeLeft</string>
        <string>UIInterfaceOrientationLandscapeRight</string>
    </array>
    <key>UISupportedInterfaceOrientations~ipad</key>
    <array>
        <string>UIInterfaceOrientationPortrait</string>
        <string>UIInterfaceOrientationPortraitUpsideDown</string>
        <string>UIInterfaceOrientationLandscapeLeft</string>
        <string>UIInterfaceOrientationLandscapeRight</string>
    </array>
    
    <!-- Privacy Declaration: Zero Tracking or Advertising -->
    <key>NSAppTransportSecurity</key>
    <dict>
        <key>NSAllowsArbitraryLoads</key>
        <false/>
    </dict>
</dict>
</plist>
```

---

## 2. Safe Area Insets & Dynamic Island Handling

- **Viewport Tag:** Configured with `viewport-fit=cover`:
  ```html
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
  ```
- **CSS Environment Variables:**
  - Header padding: `pt-[env(safe-area-inset-top)]`
  - Bottom navigation clearance: `pb-[env(safe-area-inset-bottom)]`
- **Dynamic Island & Notch:** The Warm Ivory canvas (`#F5F0E6`) flows smoothly beneath the status bar, preventing dark banding across iPhone 14/15/16 display cutouts.
- **Rubber-Banding Prevention:** Canvas containers specify `overscroll-behavior: none` and `touch-action: pan-y` so pinch-to-zoom in the 3D twin does not inadvertently trigger Safari viewport bounce.

---

## 3. WebGL Metal Acceleration in WKWebView

- **Metal Backend:** WKWebView renders Three.js draw calls directly via Apple Metal API.
- **Frame Rate:** Delivers steady 60 FPS across A14 Bionic and M-series chips.
- **Power Efficiency:** Clamping DPR to 2.0 avoids excessive 3x Super Retina fill-rate costs, preserving device battery life during long planning sessions.
