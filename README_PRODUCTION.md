Production build instructions for Photo Notes

This project uses Expo SDK 52. To create production builds using EAS (Expo Application Services):

1. Install the EAS CLI:

   npm install -g eas-cli

2. Login to your Expo account:

   eas login

3. Configure credentials and follow prompts (only needed once):

   eas credentials

4. Run a production build:

   eas build --profile production --platform all

Notes:
- `eas.json` contains `production` and `preview` profiles. Adjust if you need custom keystore or provisioning profiles.
- For App Store / Play Store submissions, use `eas submit` or upload the artifacts manually.


# Buildwith EAS
eas build --profile preview --platform android