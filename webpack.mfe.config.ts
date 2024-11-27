import path from "path";
import { IMfeConfigJson, IMfeProxyJson } from "@marcapo/webpack-config";
import HtmlWebpackPlugin from "html-webpack-plugin";

export const individualMfeConfig: IMfeConfigJson = {
	exposes: {},
	remotes: [],
	outputPath: `${__dirname}/build`,
	customPort: 3000,
	customPlugins: [
		new HtmlWebpackPlugin({
			template: path.join(__dirname, "public/index.html"),
			publicPath: "/marcapoorganizationmanager",
		}),
	],
	customConfig: {
		optimization: {
			runtimeChunk: "single",
		},
	},
};

export const moduleProxys: IMfeProxyJson[] = [
	{
		path: /.*\/brandingstyles.css/,
		proxy: {
			target: "https://manager.marcapointegration.com",
			changeOrigin: true,
		},
	},
	{
		path: "/marcapoorganizationmanager/",
		proxy: { target: "http://localhost:3000", pathRewrite: { "/marcapoorganizationmanager": "" } },
	},
];
