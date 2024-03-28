const Configs = require("./configs");


export default {
  expo: {
    name: "moyasar-apple-pay-example",
    slug: "moyasar-apple-pay-example",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: ["**/*"],
    plugins: ["../app.plugin.js"],
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