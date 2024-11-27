import { generateWebpackConfig } from "@marcapo/webpack-config";
import { individualMfeConfig, moduleProxys } from "./webpack.mfe.config";
const webpackConfig = generateWebpackConfig({
	packageJson: require("./package.json"),
	packageLock: require("./package-lock.json"),
	containingDirPath: __dirname,
	mfeConfig: individualMfeConfig,
	entryFilePath: "src/init.ts",
	proxys: moduleProxys,
});
console.log(webpackConfig);
module.exports = webpackConfig;
