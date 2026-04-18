process.env.NODE_ENV = "production";
const base = require("./webpack.base");
const webpack = require("webpack");
const ESLintPlugin = require("eslint-webpack-plugin");

module.exports = Object.assign(base, {
	mode: "production",
	module: {
		rules: base.module.rules.concat([
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				loader: "ts-loader",
				options: {
					transpileOnly: true,
				},
			},
		]),
	},
	plugins: base.plugins.concat([
		new webpack.DefinePlugin({
			"process.env.NODE_ENV": `"production"`,
		}),
		new ESLintPlugin({
			extensions: ["ts", "tsx"],
			failOnError: true,
			configType: "flat",
			cwd: require("path").resolve(__dirname, ".."),
		}),
	]),
});
