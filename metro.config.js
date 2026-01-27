const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
    // Disable Expo Router - we're using React Navigation
    // This prevents Metro from looking for an 'app' directory
});

// Ensure web platform is properly supported
config.resolver.sourceExts = [...config.resolver.sourceExts, 'mjs'];

// Disable Hermes transform for web (Hermes is for native only)
config.transformer = {
    ...config.transformer,
    getTransformOptions: async () => ({
        transform: {
            experimentalImportSupport: false,
            inlineRequires: true,
        },
    }),
};

module.exports = config;
