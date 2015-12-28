module.exports = require("./utils/webpack/make-webpack-config")({
	devServer: true,
	hotComponents: true,
	devtool: "source-maps",
	debug: true
});