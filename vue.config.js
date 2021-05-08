const BUNDLE_NAME = "finsr-calc";

module.exports = {
    configureWebpack: {
        optimization: {
            splitChunks: false,
        },
        output: {
            filename: `${BUNDLE_NAME}.js`,
            chunkFilename: `${BUNDLE_NAME}.js`,
        },
    },
    css: {
        extract: false,
    },
};
