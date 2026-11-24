# Seller Hub

Every Marketplace. One App.

## Run on Android

1. Run `npm ci`, then `npx expo start`.
2. Install an Android Expo Go build that matches Expo SDK 54 from [Expo Go](https://expo.dev/go). Connect your phone to the same network and scan the QR code in Expo Go. If LAN access is unavailable, try `npx expo start --tunnel`.
3. For an Android emulator, start an Android virtual device and press **a** in the Expo terminal.

## Generate an installable APK

Run `npx eas-cli@latest login`, then `npx eas-cli@latest build --platform android --profile preview`. Follow the project and signing prompts on the first build. Download and install the APK from the build link. The preview profile builds a standalone app. [Expo APK build guide](https://docs.expo.dev/build-reference/apk/)

## Android smoke test

- Clear the app data and walk through language, region, and signup with a disposable demo password. Close the app and reopen it to check session and preference persistence.
- Add Meesho twice by revisiting the catalog and check that only one entry appears. Open Meesho first, verify the original portal renders, and exercise links, redirects, back, forward, and refresh. Use your own seller account for portal login and OTP tests. Restart the app and check whether that portal preserves its session.
- Toggle airplane mode and reload to exercise the error state. Restore the network and retry. Check that Android hardware back uses page history before returning to the app.
- Remove Meesho and check search and recents. Log out and test both a failed and a successful mock login. Repeat the portal checks individually for the other marketplaces.

Seller Hub demo accounts, selected platforms, and preferences live on the device. Mock recovery displays the available recovery information and does not send email. Marketplace authentication happens on the original seller websites and is separate from the demo account. Seller access, OTP, and session persistence depend on the marketplace and Android WebView. The notifications setting stores a preference. Marketplace tiles use branded initials, and language selection currently stores a preference for the English interface.
