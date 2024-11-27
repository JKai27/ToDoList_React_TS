export interface IConfig {
	managerName: string;
	environment: Environment;
	applicationName: string;
	showShopDropdown: boolean;
}

// eslint-disable-next-line no-shadow
export enum Environment {
	DEV = "dev",
	LOCAL = "local",
	STAGING = "staging",
	PRODUCTION = "production",
}
