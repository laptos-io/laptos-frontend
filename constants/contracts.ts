import { MaybeHexString } from "aptos";

import { Network } from "@/types/misc";

export const FT_SWAP_ADDRESSES: Record<Network, MaybeHexString> = {
  [Network.Devnet]: "",
  [Network.Testnet]:
    "0x60e8c493799c93cb3bee6c76a444381f4b5f13ccb232511c211f221a8f7a76f6",
  [Network.Mainnet]: "",
};
