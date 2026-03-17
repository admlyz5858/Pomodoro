# Focus Universe APK Downloads

## Available Builds

| File | Size | Description |
|------|------|-------------|
| `focus-universe-debug.apk` | ~4.2 MB | Debug build — install directly, no signing needed |
| `focus-universe-release.apk` | ~3.2 MB | Release build (unsigned) — smaller, optimized |

## How to Install

### Debug APK (Recommended for testing)

1. Download `focus-universe-debug.apk` to your Android phone
2. Open the file on your phone
3. Allow "Install from unknown sources" if prompted
4. Install and open Focus Universe

### Release APK

The release APK is unsigned. To install:

1. Sign with your own keystore:

```bash
# Generate a keystore (one time)
keytool -genkey -v -keystore focus-universe.keystore -alias focus -keyalg RSA -keysize 2048 -validity 10000

# Sign the APK
apksigner sign --ks focus-universe.keystore --out focus-universe-signed.apk focus-universe-release.apk
```

2. Or use the debug APK which is pre-signed for testing.

## Build from Source

```bash
cd /path/to/project
npm install --legacy-peer-deps
npm run build
npx cap sync android
cd android && ./gradlew assembleDebug
```

APK output: `android/app/build/outputs/apk/debug/app-debug.apk`
