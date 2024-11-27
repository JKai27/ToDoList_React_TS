const path = require("path");
const express = require("express");
const Axios = require("axios");

type Environment = "STAGING" | "PRODUCTION";

class ServerSingleton {
	private environment: Environment = "STAGING";

	public getEnvironment(): Environment {
		return this.environment;
	}

	public async loadCSS(version: string, res: any, shopUrl?: string): Promise<void> {
		const cssUrl = `https://evo.marcapo${this.getEnvironment() === "PRODUCTION" ? "" : "integration"}.com/css/${
			shopUrl ? shopUrl : "manager"
		}-brandingstyles/${version}/${shopUrl ? shopUrl : "manager"}-brandingstyles.css`;

		console.log(`get CSS: `, cssUrl);
		const response = await Axios.get(cssUrl, { responseType: "stream" });
		res.setHeader("Content-Type", "text/css");
		response?.data.pipe(res);
	}

	public start = (): void => {
		this.environment = process.env.DEPLOYMENT_ENVIRONMENT === "production" ? "PRODUCTION" : "STAGING";
		console.log(`+ Using ENV ${this.environment}`);
		const port = 3000;
		const app = express();
		const buildPath = path.join(process.cwd(), "./build");
		const indexPath = path.join(buildPath, "index.html");
		app.get("/", (_req: any, res: any) => {
			res.sendFile(indexPath);
		});

		app.get("/health", (req: any, res: any) => {
			res.status(200).send({ status: "UP" });
		});

		app.get("/:version/brandingstyles.css", (req: any, res: any) => {
			const shopUrl = req.query.shopUrl as string;
			const version = req.params.version;
			try {
				void this.loadCSS(version, res, shopUrl);
			} catch (error) {
				console.log(error);
				res.sendStatus(404);
			}
		});

		app.use(express.static(buildPath));
		app.listen(port, () => console.log(`+ Server started on port ${port}`));

		const compression = require("compression");
		const { createProxyMiddleware } = require("http-proxy-middleware");

		const proxyServer = express();

		proxyServer.use(compression());
		const pathRewrite = {} as any;
		pathRewrite["^/[a-zA-Z]+(.*)"] = "/$1";

		proxyServer.use(
			"/",
			createProxyMiddleware({
				target: "http://localhost:3000",
				changeOrigin: true,
				pathRewrite,
			})
		);
		const proxyPort = 8080;
		proxyServer.listen(proxyPort);
	};
}

const Server = new ServerSingleton();
Server.start();
