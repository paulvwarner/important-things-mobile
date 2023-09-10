# Important Things mobile app

See https://github.com/paulvwarner/important-things-web for a general description of the Important Things system. This is the companion mobile app for that system.

#### Links:
- This repository is for the Important Things React Native mobile app. The Important Things web application repository is: https://github.com/paulvwarner/important-things-web
- Task tracking, known issues (Trello): https://trello.com/b/V0dJfbiy/important-things-mobile-app



# Installation (on a Mac)

#### Environment setup
- This project uses npm to install JavaScript dependencies. You may need to use node v14.18.2 for the npm install command and the webpack configuration to work. I use "n" to manage my node installation. To use "n" to set the correct node version:
    - install n: `npm install -g n`
    - set node version to use: `n 14.18.2`

#### Install dependencies
- get npm dependencies: from the app project's main directory: `npm install`
- get cocoapod dependencies: from the app project's main directory: `npx pod-install ios`

#### Configuration
- /js/Common/GlobalSettingsManager.js - exports a JSON object of global environment configuration settings that the app will use. Determines URL to use for API and other things.
- /ios/ImportantThingsMobile.xcodeproj/project.pbxproj - stores the iOS build version number.
- /android/app/build.gradle - stores the Android build version number.

#### To run mobile app locally:
- iOS: Open the project using the xcworkspace file. Run the app in a simulator from Xcode. You'll probably need to update the Signing & Capabilities info to use your own provisioning profile. 
- Android: Open an Android emulator from Android Studio, then run `react-native run-android`
  from the project root folder.



# Deployment
I currently only run this app on my own test devices.
