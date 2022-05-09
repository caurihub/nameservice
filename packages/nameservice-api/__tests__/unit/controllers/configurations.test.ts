import "jest-extended";

import { Application } from "@cauriland/core-kernel";
import { Generators } from "@cauriland/core-test-framework";
import { Managers } from "@cauriland/crypto";
import { Defaults as CryptoDefaults } from "@caurihub/nameservice-crypto";
import { Defaults as TransactionsDefaults } from "@caurihub/nameservice-transactions";
import latestVersion from "latest-version";

import { defaults } from "../../../src";
import { ConfigurationController } from "../../../src/controllers/configurations";
import { initApp, ItemResponse } from "../__support__";

jest.setTimeout(30000);

let app: Application;

let configurationsController: ConfigurationController;

beforeEach(() => {
    const config = Generators.generateCryptoConfigRaw();
    Managers.configManager.setConfig(config);

    app = initApp();

    configurationsController = app.resolve<ConfigurationController>(ConfigurationController);
});

describe("Test configurations controller", () => {
    it("index - return package name and version and crypto and transactions default settings", async () => {
        const response = (await configurationsController.index(undefined, undefined)) as ItemResponse;
        const plugin = require("../../../package.json");

        expect(response.data).toStrictEqual({
            api: {
                packageName: plugin.name,
                currentVersion: plugin.version,
                latestVersion: await latestVersion(plugin.name),
                defaults: defaults,
            },
            transactions: {
                packageName: "@caurihub/nameservice-transactions",
                currentVersion: plugin.version,
                latestVersion: await latestVersion("@caurihub/nameservice-transactions"),
                defaults: TransactionsDefaults,
            },
            crypto: {
                packageName: "@caurihub/nameservice-crypto",
                currentVersion: plugin.version,
                latestVersion: await latestVersion("@caurihub/nameservice-crypto"),
                defaults: CryptoDefaults,
            },
        });
    });
});
