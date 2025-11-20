# Android APK Build Guide

This guide wraps the Vite React frontend into a native Android APK using Capacitor.

## Prerequisites
- Node 18+
- Java 17 (Android Gradle plugin requirement)
- Android Studio with Android SDK Platform 34+ and Android SDK Build-Tools
- `ANDROID_HOME` (or `ANDROID_SDK_ROOT`) pointing to your SDK installation
- `JAVA_HOME` pointing to your JDK 17 installation

## 1) Install dependencies
```bash
cd vton-app/frontend
npm install
```

## 2) Build the web assets
```bash
npm run build
```
This produces the `dist/` folder that Capacitor ships inside the native app.

## 3) Add the Android platform (first time only)
```bash
npx cap add android
```
This creates `android/` with Gradle files and a default launcher icon. The `capacitor.config.js` is already present and points to `dist/`.

## 4) Sync assets and Capacitor config
```bash
npm run cap:sync
```
This copies the latest `dist/` build into `android/app/src/main/assets/` and refreshes plugins.

## 5) Configure network security (if needed)
If you access a non-HTTPS dev backend, add a `network_security_config.xml` that permits cleartext traffic for your dev host and reference it from `AndroidManifest.xml`. For production, prefer HTTPS and keep the provided `androidScheme` of `https`.

## 6) Build a debug APK from Android Studio
- Open the project: `npm run cap:open` (opens Android Studio)
- Let Gradle sync finish, then choose **Build > Build Bundle(s) / APK(s) > Build APK(s)**
- The debug APK will be written to `android/app/build/outputs/apk/debug/`

## 7) Build a release APK via CLI
```bash
cd android
./gradlew assembleRelease
```
Sign with your release keystore by updating `android/app/build.gradle` and `gradle.properties` per the Android signing docs.

## 8) Test the APK
Install on a device or emulator:
```bash
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

## Notes
- Any changes to `.env` values consumed at build time require re-running `npm run build` before `npm run cap:sync`.
- If you change `VITE_API_BASE`, ensure the backend URL is reachable from the Android device (use the host machine IP when using an emulator).
- For Play Store uploads, build a release-signed APK or AAB and verify with `apksigner verify --print-certs <apk>`.
