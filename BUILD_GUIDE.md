# Android APK Build Guide - Photo Notes App

This guide documents the complete process to successfully build an Android APK for the Photo Notes React Native/Expo app.

## Problem Overview

The initial build failed due to version compatibility issues between Expo SDK and React Native versions. The primary error was:

```
> Task :expo-modules-core:compileReleaseKotlin FAILED
e: file:///path/to/node_modules/expo-modules-core/android/src/main/java/expo/modules/adapters/react/apploader/RNHeadlessAppLoader.kt:32:21 
Unresolved reference: addReactInstanceEventListener
```

## Root Cause

- **Expo SDK Version**: 52.0.0
- **React Native Version**: 0.75.2 (incompatible)
- **Required React Native Version**: 0.76.x for Expo SDK 52

## Solution Steps

### 1. Update React Native Version

**File**: `package.json`

**Change**:
```json
// Before
"react-native": "0.75.2"

// After  
"react-native": "0.76.0"
```

### 2. Install Updated Dependencies

```bash
cd /home/congdv/projects/photo-notes
npm install
```

This updated React Native but revealed additional compatibility issues with other packages.

### 3. Fix Kotlin Version Compatibility

The build failed with:
```
This version (1.5.15) of the Compose Compiler requires Kotlin version 1.9.25 but you appear to be using Kotlin version 1.9.24
```

**Solution A**: Update `android/gradle.properties`
```properties
# Add this line
android.kotlinVersion=1.9.25
```

**Solution B**: Update `android/build.gradle`
```groovy
// Before
classpath('org.jetbrains.kotlin:kotlin-gradle-plugin')

// After
classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlinVersion")
```

### 4. Fix Package Compatibility with Expo CLI

Instead of manually updating each package, use Expo CLI to automatically fix compatibility:

```bash
npx expo install --fix
```

This command automatically updated:
- `react-native`: 0.76.0 → 0.76.9
- `react-native-gesture-handler`: 2.18.1 → 2.20.2
- `react-native-screens`: 4.0.0 → 4.4.0
- `react-native-safe-area-context`: 4.10.5 → 4.12.0
- `expo-constants`: 16.0.2 → 17.0.8
- `expo-image-picker`: 15.0.7 → 16.0.6
- `@shopify/flash-list`: 2.0.3 → 1.7.3
- `@types/react`: 18.2.79 → 18.3.12

### 5. Clean and Build

```bash
cd android
./gradlew clean
./gradlew assembleRelease
```

## Final Working Configuration

### package.json (Key Dependencies)
```json
{
  "dependencies": {
    "expo": "~52.0.0",
    "react": "18.3.1",
    "react-native": "0.76.9",
    "react-native-gesture-handler": "~2.20.2",
    "react-native-screens": "~4.4.0",
    "react-native-safe-area-context": "4.12.0",
    "expo-constants": "~17.0.8",
    "expo-image-picker": "~16.0.6"
  }
}
```

### android/build.gradle
```groovy
buildscript {
    ext {
        buildToolsVersion = findProperty('android.buildToolsVersion') ?: '35.0.0'
        minSdkVersion = Integer.parseInt(findProperty('android.minSdkVersion') ?: '24')
        compileSdkVersion = Integer.parseInt(findProperty('android.compileSdkVersion') ?: '35')
        targetSdkVersion = Integer.parseInt(findProperty('android.targetSdkVersion') ?: '34')
        kotlinVersion = findProperty('android.kotlinVersion') ?: '1.9.25'
        ndkVersion = "26.1.10909125"
    }
    
    dependencies {
        classpath('com.android.tools.build:gradle')
        classpath('com.facebook.react:react-native-gradle-plugin')
        classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlinVersion")
    }
}
```

### android/gradle.properties
```properties
# Kotlin version
android.kotlinVersion=1.9.25

# Other existing properties...
android.useAndroidX=true
android.enablePngCrunchInReleaseBuilds=true
reactNativeArchitectures=armeabi-v7a,arm64-v8a,x86,x86_64
newArchEnabled=true
hermesEnabled=true
expo.gif.enabled=true
expo.webp.enabled=true
expo.webp.animated=false
```

## Build Commands

### Clean Build
```bash
cd android
./gradlew clean
```

### Release Build
```bash
./gradlew assembleRelease
```

### Debug Build (Optional)
```bash
./gradlew assembleDebug
```

## Output Location

The successful build generates the APK at:
```
/home/congdv/projects/photo-notes/android/app/build/outputs/apk/release/app-release.apk
```

**File Details**:
- Size: ~74 MB (73,785,351 bytes)
- Signed with: Debug keystore (for testing)

## Version Compatibility Reference

| Expo SDK | React Native | Kotlin |
|----------|-------------|--------|
| 52.0.0   | 0.76.x     | 1.9.25 |
| 51.0.0   | 0.74.x     | 1.9.24 |
| 50.0.0   | 0.73.x     | 1.9.22 |

## Troubleshooting Tips

1. **Always check version compatibility** between Expo SDK and React Native
2. **Use `npx expo install --fix`** instead of manually updating packages
3. **Clean build directory** after major version updates: `./gradlew clean`
4. **Check Kotlin version** if you get Compose Compiler errors
5. **Verify NDK version** matches the one specified in build.gradle

## Build Time

The successful build took approximately **33 minutes and 45 seconds** on the build machine.

## Next Steps

1. **Testing**: Install the APK on Android devices for testing
2. **Release Signing**: For production, replace debug keystore with release keystore
3. **App Store**: Upload to Google Play Store or other distribution platforms

## Quick Share Options

### Local HTTP Server
```bash
cd /path/to/apk/directory
python3 -m http.server 8000
```
Access at: `http://YOUR_IP:8000/app-release.apk`

### File Transfer
```bash
# Copy to USB
cp app-release.apk /media/usb/

# SCP to remote server
scp app-release.apk user@server:/path/
```

---

**Build Date**: August 27, 2025  
**Build Status**: ✅ SUCCESS  
**APK Size**: ~74 MB  
**Target Android Version**: API 24+ (Android 7.0+)
