import { Contracts } from "@cauriland/core-kernel";
import { Interfaces as NameserviceInterfaces } from "@caurihub/nameservice-crypto";

export const namespaceWalletIndex = "namespace.wallet.index";

export const namespaceWalletIndexer = (index: Contracts.State.WalletIndex, wallet: Contracts.State.Wallet): void => {
    if (wallet.hasAttribute("nameservice")) {
        const nameservice: NameserviceInterfaces.INameServiceAsset = wallet.getAttribute("nameservice");

        index.set(nameservice.name, wallet);
    }
};
