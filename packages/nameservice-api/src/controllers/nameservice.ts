import { Container, Contracts } from "@cauriland/core-kernel";
import Boom from "@hapi/boom";
import Hapi from "@hapi/hapi";
import { Enums } from "@caurihub/nameservice-crypto";

import { Indexers } from "../../../nameservice-transactions";
import { NameserviceResource } from "../resources/nameservice";
import { WalletResource } from "../resources/wallet";
import { BaseController } from "./base-controller";

@Container.injectable()
export class NameserviceController extends BaseController {
    @Container.inject(Container.Identifiers.WalletRepository)
    @Container.tagged("state", "blockchain")
    private readonly walletRepository!: Contracts.State.WalletRepository;

    public async all(request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> {
        const criteria: Contracts.Shared.TransactionCriteria = {
            ...request.query,
            typeGroup: Enums.NameServiceTransactionGroup,
            type: Enums.NameServiceTransactionTypes.Nameservice,
        };

        return this.paginateWithBlock(
            criteria,
            this.getListingOrder(request),
            this.getListingPage(request),
            request.query.transform,
            NameserviceResource,
        );
    }

    public async show(request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> {
        const transaction = await this.transactionHistoryService.findOneByCriteria({
            ...request.query,
            typeGroup: Enums.NameServiceTransactionGroup,
            type: Enums.NameServiceTransactionTypes.Nameservice,
            id: request.params.id,
        });

        if (!transaction) {
            return Boom.notFound("Nameservice Transaction not found");
        }

        return this.respondWithBlockResource(transaction, request.query.transform, NameserviceResource);
    }

    public async wallet(request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<any> {
        let wallet: Contracts.State.Wallet;
        try {
            wallet = this.walletRepository.findByIndex(Indexers.namespaceWalletIndex, request.params.id);
        } catch (e) {
            return Boom.notFound("Nameservice not found");
        }

        return this.respondWithResource(wallet, WalletResource);
    }
}
