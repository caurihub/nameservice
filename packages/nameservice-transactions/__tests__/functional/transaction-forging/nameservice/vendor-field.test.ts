import "@cauriland/core-test-framework/dist/matchers";

import { Contracts } from "@cauriland/core-kernel";
import { passphrases, snoozeForBlock } from "@cauriland/core-test-framework";

import * as support from "../__support__";
import { NamespaceTransactionFactory } from "../__support__/transaction-factory";

let app: Contracts.Kernel.Application;
beforeAll(async () => (app = await support.setUp()));
afterAll(async () => await support.tearDown());

describe("Nameservice functional tests - with VendorField", () => {
    it("should broadcast, accept and forge it [Signed with 1 Passphrase]", async () => {
        // Save name
        const nameservice = NamespaceTransactionFactory.initialize(app)
            .Nameservice({
                name: "zan",
            })
            .withVendorField("VendorField test -> [Nameservice]")
            .withPassphrase(passphrases[0]!)
            .createOne();

        await expect(nameservice).toBeAccepted();
        await snoozeForBlock(1);
        await expect(nameservice.id).toBeForged();
    });
});
