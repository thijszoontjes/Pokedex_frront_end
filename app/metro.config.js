// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname, { isCSSEnabled: true });

// allow loading WebAssembly used by expo-sqlite on web
config.resolver.assetExts.push('wasm');

module.exports = config;
