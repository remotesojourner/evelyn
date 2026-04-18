const { join, resolve } = require("path");

if (!process.env.BROWSER) throw new Error("set $BROWSER to chrome or firefox");

const ROOT = "./src";
const paths = {
	assets: `${ROOT}/assets`,
	dist: resolve(`dist-${process.env.BROWSER}`),
	src: ROOT,
	stylesName: "styles",
	static: `${ROOT}/assets/static`,
	tsIndex: `${ROOT}/index.tsx`,
};

module.exports = {
	loaders: {
		css: [
			"style-loader",

			"@teamsupercell/typings-for-css-modules-loader",

			{
				loader: "css-loader",
				options: {
					modules: {
						namedExport: false,
						exportLocalsConvention: "camelCase",
						localIdentName:
							process.env.NODE_ENV === "production"
								? "[hash:base64:4]"
								: "[name]__[local]--[hash:base64:2]",
					},
					importLoaders: 1,
					sourceMap: process.env.NODE_ENV === "development",
				},
			},

			{
				loader: "./tools/scope-hack-loader",
				options: { prepend: "#tube-mount" },
			},

			"postcss-loader",

			"resolve-url-loader",

			{
				loader: "sass-loader",
				options: {
					sourceMap: true,
					sassOptions: {
						loadPaths: [
							resolve(
								__dirname,
								join("..", paths.src, paths.stylesName)
							),
						],
					},
				},
			},
		],
	},
	paths: paths,
};
