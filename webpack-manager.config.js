function requireUncached(module) {
	delete require.cache[require.resolve(module)];
	return require(module);
}

function readPackageJson(srcDir) {
	console.log(`read packageJson @ ${srcDir}`);
	let packageJson = null;
	try {
		packageJson = requireUncached(`${srcDir}/package.json`);
	} catch (error) {
		console.log(`no packageJson found @ ${srcDir}`);
		// noop
	}
	return packageJson;
}

async function createPackageJsonContent(srcDir, destDir, helper, application) {
	const { applicationNameLowercase: applicationName, applicationType } = application;
	const templatePackageJson = readPackageJson(srcDir);

	let projectPackageJson = readPackageJson(destDir);

	if (projectPackageJson) {
		projectPackageJson.scripts = templatePackageJson.scripts;
		projectPackageJson.devDependencies = Object.assign(
			projectPackageJson.devDependencies || {},
			templatePackageJson.devDependencies
		);
		projectPackageJson.dependencies = Object.assign(
			projectPackageJson.dependencies || {},
			templatePackageJson.dependencies
		);

		if (!projectPackageJson.typings) {
			projectPackageJson = Object.assign(projectPackageJson, { typings: templatePackageJson.typings });
		}

		delete projectPackageJson.private;
		delete projectPackageJson.eslintConfig;
		delete projectPackageJson["eslint.debug"];
		delete projectPackageJson.browserslist;
		delete projectPackageJson.resolutions;
		delete projectPackageJson.homepage;
		delete projectPackageJson.overrides;
		delete projectPackageJson.proxy;
		delete projectPackageJson.dependencies["react-scripts"];
	} else {
		projectPackageJson = templatePackageJson;
	}

	projectPackageJson.name = `@marcapo/${applicationName}`;
	projectPackageJson.description = applicationType;

	await helper.fs.writeJson(`${destDir}/package.json`, projectPackageJson, {
		spaces: 2,
	});
}

function asyncReadFile(file, helper) {
	return new Promise((resolve, reject) => {
		helper.fs.readFile(file, "utf8", (err, data) => {
			if (err) {
				reject(err);
			} else {
				resolve(data);
			}
		});
	});
}

module.exports = async function config({ srcDir, destDir, application, helper }) {
	console.log("APPLICATION: ", application);
	let dockerfileInclude = "";
	try {
		dockerfileInclude = await asyncReadFile(`${destDir}/Dockerfile.include`, helper);
	} catch (err) {
		console.log(`couldn't read Dockerfile.include: ${err}`);
	}

	try {
		console.log("removing unnecessary files");
		// cra-manager
		await helper.fs
			.pathExists(`${destDir}/src/configuration/dev.proxyConfig.js`)
			.then(async exists => exists && (await helper.fs.remove(`${destDir}/src/configuration/dev.proxyConfig.js`)));
		await helper.fs
			.pathExists(`${destDir}/src/index.tsx`)
			.then(async exists => exists && (await helper.fs.remove(`${destDir}/src/index.tsx`)));
		await helper.fs
			.pathExists(`${destDir}/.eslintrc.json`)
			.then(async exists => exists && (await helper.fs.remove(`${destDir}/.eslintrc.json`)));

		// next-manager
		await helper.fs
			.pathExists(`${destDir}/.gitlab/`)
			.then(async exists => exists && (await helper.fs.rmdir(`${destDir}/.gitlab`)));
		await helper.fs
			.pathExists(`${destDir}/.next/`)
			.then(async exists => exists && (await helper.fs.rmdir(`${destDir}/.next`)));
		await helper.fs
			.pathExists(`${destDir}/.pages/`)
			.then(async exists => exists && (await helper.fs.rmdir(`${destDir}/.pages`)));
		await helper.fs
			.pathExists(`${destDir}/.babelrc`)
			.then(async exists => exists && (await helper.fs.remove(`${destDir}/.babelrc`)));
		await helper.fs
			.pathExists(`${destDir}/build-docker-image.sh`)
			.then(async exists => exists && (await helper.fs.remove(`${destDir}/build-docker-image.sh`)));
		await helper.fs
			.pathExists(`${destDir}/index.ts`)
			.then(async exists => exists && (await helper.fs.remove(`${destDir}/index.ts`)));
		await helper.fs
			.pathExists(`${destDir}/next-env.d.ts`)
			.then(async exists => exists && (await helper.fs.remove(`${destDir}/next-env.d.ts`)));
		await helper.fs
			.pathExists(`${destDir}/next.config.js`)
			.then(async exists => exists && (await helper.fs.remove(`${destDir}/next.config.js`)));
		await helper.fs
			.pathExists(`${destDir}/nodemon.json`)
			.then(async exists => exists && (await helper.fs.remove(`${destDir}/nodemon.json`)));
		await helper.fs
			.pathExists(`${destDir}/ployfill.js`)
			.then(async exists => exists && (await helper.fs.remove(`${destDir}/ployfill.js`)));
		await helper.fs
			.pathExists(`${destDir}/tsconfig.server.json`)
			.then(async exists => exists && (await helper.fs.remove(`${destDir}/tsconfig.server.json`)));
	} catch (err) {
		console.log(err);
	}

	await createPackageJsonContent(srcDir, destDir, helper, application);
	return {
		name: "webpack-manager",
		dockerfileInclude,
		templates: [
			{
				src: "gitlab-ci.yml",
				dest: ".gitlab-ci.yml",
				overwrite: true,
				doNotResolve: false,
			},
			{
				src: "eslintrc.cjs",
				dest: ".eslintrc.cjs",
				overwrite: true,
				doNotResolve: true,
			},
			{
				src: "README.md",
				overwrite: true,
				doNotResolve: false,
			},
			{
				src: ".prettierrc",
				overwrite: true,
				doNotResolve: false,
			},
			{
				src: ".env",
				overwrite: true,
				doNotResolve: false,
			},
			{
				src: "Dockerfile",
				overwrite: true,
				doNotResolve: false,
			},
			{
				src: "gitignore",
				dest: ".gitignore",
				overwrite: true,
				doNotResolve: true,
			},
			{
				src: "tsconfig.json",
				overwrite: true,
				doNotResolve: true,
			},
			{
				src: "src/manager",
				overwrite: false,
				doNotResolve: true,
			},
			{
				src: "src/configuration",
				overwrite: false,
				doNotResolve: false,
			},
			{
				src: "src/internal",
				overwrite: true,
				doNotResolve: true,
			},
			{
				src: "webpack.mfe.config.ts",
				doNotResolve: false,
				overwrite: false,
			},
			{
				src: "webpack.config.ts",
				doNotResolve: true,
				overwrite: true,
			},
			{
				src: "public/",
				overwrite: true,
				doNotResolve: false,
			},
			{
				src: "src/index.ts",
				overwrite: true,
				doNotResolve: true,
			},
			{
				src: "src/init.ts",
				overwrite: true,
				doNotResolve: true,
			},
			{
				src: "src/bootstrap.tsx",
				overwrite: true,
				doNotResolve: true,
			},
			{
				src: "startserver.sh",
				overwrite: true,
				doNotResolve: true,
			},
			{
				src: "server.ts",
				overwrite: true,
				doNotResolve: true,
			},
		],
	};
};
