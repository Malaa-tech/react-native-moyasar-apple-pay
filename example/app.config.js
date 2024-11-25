const Configs = require("./configs");


export default {
  expo: {
    name: "moyasar-apple-pay-example",
    slug: "moyasar-apple-pay-example",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    assetBundlePatterns: ["**/*"],
    plugins: ["../app.plugin.js",  [
        "expo-splash-screen",
        {
          "backgroundColor": "#232323",
          "image": "./assets/icon.png",
          "dark": {
            "image": "./assets/icon.png",
            "backgroundColor": "#000000"
          },
          "imageWidth": 200
        }
      ]],
    ios: {
      supportsTablet: true,
      bundleIdentifier: Configs.AppBundleID,
      entitlements: {
        "com.apple.developer.in-app-payments": [Configs.Merchant]
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: Configs.AppBundleID
    },
    web: {
      favicon: "./assets/favicon.png"
    }
  }
};