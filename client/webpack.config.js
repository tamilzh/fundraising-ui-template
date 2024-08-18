module.exports = {
    resolve: {
        fallback: [{
            "stream": require.resolve("stream-browserify")
        }, {
            "crypto": require.resolve("crypto-browserify")
        }, {
            "assert": require.resolve("assert/")
        }, {
            "http": require.resolve("stream-http")
        }, {
            "https": require.resolve("https-browserify")
        }, {
            "url": require.resolve("url/")
        }, {
            "os": require.resolve("os-browserify/browser")
        }, {
            "stream": require.resolve("stream-browserify")
        }]
    }
}