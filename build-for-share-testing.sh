#!/bin/bash

# Build script for testing share functionality
# This script helps build and test the share feature on both platforms

echo "🔧 Building Photo Notes App for Share Testing"
echo "============================================="

# Function to show usage
show_usage() {
    echo "Usage: $0 [android|ios|both]"
    echo ""
    echo "Options:"
    echo "  android  - Build and run Android version"
    echo "  ios      - Build and run iOS version (macOS only)"
    echo "  both     - Build both platforms"
    echo ""
    echo "Make sure to have your device connected and development environment set up!"
    exit 1
}

# Check if argument provided
if [ $# -eq 0 ]; then
    show_usage
fi

# Function to build Android
build_android() {
    echo "📱 Building Android version..."
    echo "This will create a development build with share intent support."
    
    # Pre-build checklist
    echo ""
    echo "✅ Pre-build checklist:"
    echo "   - Device connected via USB debugging"
    echo "   - Android SDK and tools installed"
    echo "   - app.json configured with intent filters"
    echo ""
    
    # Build and run
    echo "🚀 Starting Android build..."
    npx expo run:android
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Android build successful!"
        echo ""
        echo "📋 Testing Instructions:"
        echo "1. Take a screenshot on your Android device"
        echo "2. Open the screenshot in Gallery/Photos app"
        echo "3. Tap the Share button"
        echo "4. Look for 'photo-notes' in the share menu"
        echo "5. Select it and verify the app opens with the image"
        echo ""
    else
        echo "❌ Android build failed. Check the errors above."
        exit 1
    fi
}

# Function to build iOS
build_ios() {
    # Check if running on macOS
    if [[ "$OSTYPE" != "darwin"* ]]; then
        echo "❌ iOS builds are only supported on macOS"
        exit 1
    fi
    
    echo "📱 Building iOS version..."
    echo "This will create a development build with URL scheme support."
    
    # Pre-build checklist
    echo ""
    echo "✅ Pre-build checklist:"
    echo "   - iOS device/simulator connected"
    echo "   - Xcode and iOS development tools installed"
    echo "   - app.json configured with URL schemes"
    echo ""
    
    # Build and run
    echo "🚀 Starting iOS build..."
    npx expo run:ios
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ iOS build successful!"
        echo ""
        echo "📋 Testing Instructions:"
        echo "1. Take a screenshot on your iOS device"
        echo "2. Open the screenshot in Photos app"
        echo "3. Tap the Share button"
        echo "4. Look for 'Photo Notes' in the share sheet"
        echo "5. Select it and verify the app opens with the image"
        echo ""
    else
        echo "❌ iOS build failed. Check the errors above."
        exit 1
    fi
}

# Main logic
case $1 in
    "android")
        build_android
        ;;
    "ios")
        build_ios
        ;;
    "both")
        build_android
        echo ""
        echo "========================================"
        echo ""
        build_ios
        ;;
    *)
        show_usage
        ;;
esac

echo ""
echo "🎉 Build process completed!"
echo ""
echo "💡 Additional Testing Tips:"
echo "   - Use the testing panel in development mode"
echo "   - Check console logs for debugging"
echo "   - Test with different image sizes and formats"
echo "   - Verify the toast notification appears"
echo ""
echo "📚 For more details, see: SHARE_SETUP_GUIDE.md"
