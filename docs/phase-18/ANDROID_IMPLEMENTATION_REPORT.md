# NEXBUS PHASE 18 — ANDROID PACKAGING & RUNTIME ARCHITECTURE

**Platform:** Android (API Level 26+ / Android 8.0 Oreo through Android 15+)  
**Runtime Bridge:** Capacitor 6+ Native Bridge  
**Package Identifier:** `in.gov.delhi.nexbus`  
**Safety Invariant:** `READ-ONLY + PASSIVE + ADVISORY`  

---

## 1. Android Manifest & Permissions (`AndroidManifest.xml`)

NEXBUS strictly minimizes device permissions in accordance with its civic privacy invariant:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="in.gov.delhi.nexbus">

    <!-- Essential Network Permissions -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <!-- ZERO DANGEROUS PERMISSIONS:
         NO ACCESS_FINE_LOCATION (Commuter privacy preserved: stops chosen manually)
         NO CAMERA / RECORD_AUDIO
         NO WRITE_EXTERNAL_STORAGE -->

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme.NoActionBar"
        android:usesCleartextTraffic="false">
        
        <activity
            android:name=".MainActivity"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|smallestScreenSize|screenLayout|uiMode"
            android:exported="true"
            android:launchMode="singleTask"
            android:theme="@style/AppTheme.NoActionBarLaunch">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
```

---

## 2. Hardware Acceleration & WebGL Performance on Android

- **WebView Implementation:** Uses modern Chromium-based Android System WebView.
- **Hardware Acceleration:** Enabled by default (`android:hardwareAccelerated="true"`).
- **DPR Clamping:** Clamped to `Math.min(window.devicePixelRatio, 2.0)` to prevent mobile GPU thermal throttling on high-resolution displays (e.g. 1440p AMOLED panels).
- **Graceful Vector Fallback:** On low-RAM Android devices (e.g. Android Go devices with $\le 2\text{ GB}$ RAM) where WebGL memory is restricted, the canvas automatically shifts to the interactive 2D SVG vector schematic without crashing the host app.
- **Back Button Navigation:** Handled via Capacitor App plugin to navigate history stacks intuitively rather than abruptly terminating the app.

---

## 3. Splash Screen & Status Bar Integration

- **Splash Background:** `#F5F0E6` (Warm Ivory) matching the web design system.
- **Status Bar:** Styled with dark icons on `#F5F0E6` background (`style: 'DARK'`), blending seamlessly with the app's top bar without harsh color discontinuities.
- **Safe Area Insets:** Handled via CSS environment variables `padding-top: env(safe-area-inset-top)` to clear notches and camera punch holes.
