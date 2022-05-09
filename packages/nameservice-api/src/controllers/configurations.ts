import { Controller } from "@cauriland/core-api";
import { Container } from "@cauriland/core-kernel";
import Hapi from "@hapi/hapi";
import { Defaults as CryptoDefaults } from "@caurihub/nameservice-crypto";
import { Defaults as TransactionDefaults } from "@caurihub/nameservice-transactions";
import latestVersion from "latest-version";

import { defaults as ApiDefaults } from "../defaults";
import { ConfigurationResource } from "../resources/configurations";

const packageName = require("../../package.json").name;
const currentVersion = require("../../package.json").version;

@Container.injectable()
export class ConfigurationController extends Controller {
    public async index(request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> {
        const apiLatestVersion = await latestVersion(packageName);
        const cryptoLatestVersion = await latestVersion("@caurihub/nameservice-crypto");
        const transactionsLatestVersion = await latestVersion("@caurihub/nameservice-transactions");

        return this.respondWithResource(
            {
                apiPackageName: packageName,
                apiLatestVersion,
                cryptoLatestVersion,
                transactionsLatestVersion,
                currentVersion: currentVersion,
                transactionsDefaults: TransactionDefaults,
                cryptoDefaults: CryptoDefaults,
                apiDefaults: ApiDefaults,
            },
            ConfigurationResource,
        );
    }
}
