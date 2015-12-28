var path = require("path");
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var StatsPlugin = require("stats-webpack-plugin");
var loadersByExtension = require("./loadersByExtension");

module.exports = function(options) {
	var projectDirectory = path.join(__dirname,'../../');

	var entry = {
		main: options.prerender ? "./config/mainPrerenderer" : "./config/mainApp"
		// second: options.prerender ? "./config/secondPrerenderer" : "./config/secondApp"
	};
	var loaders = {
		"jsx": options.hotComponents ? ["react-hot-loader", "babel-loader?stage=0"] : "babel-loader?stage=0",
		"js": {
			loader: "babel-loader?stage=0",
			include: path.join(projectDirectory, "app")
		},
		"json": "json-loader",
		"coffee": "coffee-redux-loader",
		"json5": "json5-loader",
		"txt": "raw-loader",
		"png|jpg|jpeg|gif|svg": "url-loader?limit=10000",
		"woff|woff2": "url-loader?limit=100000",
		"ttf|eot": "file-loader",
		"wav|mp3": "file-loader",
		"html": "html-loader",
		"md|markdown": ["html-loader", "markdown-loader"]
	};

	var alias = {

	};
	var aliasLoader = {

	};
	var externals = [

	];
	var publicPath = options.devServer ?
		"http://localhost:2992/_assets/" :
		"/_assets/";
	var output = {
		path: path.join(projectDirectory, "build", options.prerender ? "prerender" : "public"),
		publicPath: publicPath,
		filename: "[name].js" + (options.longTermCaching && !options.prerender ? "?[chunkhash]" : ""),
		chunkFilename: (options.devServer ? "[id].js" : "[name].js") + (options.longTermCaching && !options.prerender ? "?[chunkhash]" : ""),
		sourceMapFilename: "debugging/[file].map",
		libraryTarget: options.prerender ? "commonjs2" : undefined,
		pathinfo: options.debug || options.prerender
	};
	var excludeFromStats = [
		/node_modules[\\\/]react(-router)?[\\\/]/,
		/node_modules[\\\/]items-store[\\\/]/
	];
	var plugins = [
		new webpack.PrefetchPlugin("react"),
		new webpack.PrefetchPlugin("react/lib/ReactComponentBrowserEnvironment")
	];
	if(options.prerender) {
		plugins.push(new StatsPlugin(path.join(projectDirectory, "build", "stats.prerender.json"), {
			chunkModules: true,
			exclude: excludeFromStats
		}));
		// aliasLoader["react-proxy$"] = "react-proxy/unavailable";
		// aliasLoader["react-proxy-loader$"] = "react-proxy-loader/unavailable";
		// externals.push(
		// 	/^react(\/.*)?$/,
		// 	/^reflux(\/.*)?$/,
		// 	"superagent",
		// 	"async"
		// );
		plugins.push(new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }));
	}else{
		plugins.push(new StatsPlugin(path.join(projectDirectory, "build", "stats.json"), {
			chunkModules: true,
			exclude: excludeFromStats
		}));
	}
	if(options.commonsChunk) {
		plugins.push(new webpack.optimize.CommonsChunkPlugin("commons", "commons.js" + (options.longTermCaching && !options.prerender ? "?[chunkhash]" : "")));
	}
	var asyncLoader = {
		test: require(path.join(projectDirectory, "./app/route-handlers/async")).map(function(name) {
			return path.join(projectDirectory, "app", "route-handlers", name);
		}),
		loader: options.prerender ? "react-proxy-loader/unavailable" : "react-proxy-loader"
	};




	var cssLoader = options.minimize ? 
					"css-loader?module" : 
					"css-loader?module&localIdentName=[path][name]---[local]---[hash:base64:5]";
	var stylesheetLoaders = {
		"css"		:  cssLoader,
		"less"		: [cssLoader, "less-loader"],
		"styl"		: [cssLoader, "stylus-loader"],
		"scss|sass"	: [cssLoader, "sass-loader"]
	};
	Object.keys(stylesheetLoaders).forEach(function(ext) {
		var stylesheetLoader = stylesheetLoaders[ext];
		if(Array.isArray(stylesheetLoader)) stylesheetLoader = stylesheetLoader.join("!");
		if(options.prerender) {
			stylesheetLoaders[ext] = stylesheetLoader.replace(/^css-loader/, "css-loader/locals");
		} else if(options.separateStylesheet) {
			stylesheetLoaders[ext] = ExtractTextPlugin.extract("style-loader", stylesheetLoader);
		} else {
			stylesheetLoaders[ext] = "style-loader!" + stylesheetLoader;
		}
	});
	if(options.separateStylesheet && !options.prerender) {
		plugins.push(new ExtractTextPlugin("[name].css" + (options.longTermCaching ? "?[contenthash]" : "")));
	}
	if(options.minimize && !options.prerender) {
		plugins.push(
			new webpack.optimize.UglifyJsPlugin({
				compressor: {
					warnings: false
				}
			}),
			new webpack.optimize.DedupePlugin()
		);
	}


	if(options.minimize) {
		plugins.push(
			new webpack.DefinePlugin({
				"process.env": {
					NODE_ENV: JSON.stringify("production")
				}
			}),
			new webpack.NoErrorsPlugin()
		);
	}


	return {
		// entry file for processing
		entry: entry,
		output: output,

		// node outputs for node to handle while web is compiled for the web
		target: options.prerender ? "node" : "web",

		// register all loaders
		module: {
			loaders: [asyncLoader]
					 .concat(loadersByExtension(loaders))
					 .concat(loadersByExtension(stylesheetLoaders))
					 .concat([]) // any aditional loader
		},

		// See "https://webpack.github.io/docs/configuration.html#devtool" (source-maps, eval)
		devtool: options.devtool,

		// Switch loaders to debug mode.
		debug: options.debug,
		resolveLoader: {
			
			// root to resolve loaders
			root: path.join(projectDirectory, "node_modules"),

			// alias for loaders
			alias: aliasLoader

		},
		// allows require('moduleName') when moduleName was a script not resolved by webpack
		// example if you import jQuery from CDN this will mock a module with jQuery and allow require.
		externals: [],
		resolve: {

			// root of the project
			root: path.join(projectDirectory, "app"), 

			// foler names of modules
			modulesDirectories: ["web_modules", "node_modules"], 

			// extensions for modules
			extensions: ["", ".web.js", ".js", ".jsx"], 
			
			// map of aliases for modules
			alias: {} 
		},
		// adds all the plugins
		plugins: plugins,

		
		devServer: {
			stats: {
				cached: true,
				exclude: excludeFromStats
			}
		}
	};
};
