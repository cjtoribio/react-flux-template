module.exports = [
	require("./utils/webpack/make-webpack-config")({
		// commonsChunk: true,
		longTermCaching: true,
		separateStylesheet: true,
		minimize: true
		// devtool: "source-map"
	}),
	require("./utils/webpack/make-webpack-config")({
		prerender: true,
		minimize: true
	})
];