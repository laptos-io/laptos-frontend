import { Network } from "@/types/misc";

export const REGEX_HTTPS_URL =
  /^https?:\/\/(www\.)?[\w#%+.:=@~-]{1,256}\.[\d()A-Za-z]{1,6}\b([\w#%&()+./:=?@~-]*)/;

export const MUNITE_SECONDS = 60;
export const HOUR_SECONDS = 3600;
export const DAY_SECONDS = 86_400;

export const AptosNodes = {
  [Network.Devnet]: "https://fullnode.devnet.aptoslabs.com/v1",
  [Network.Testnet]: "https://fullnode.testnet.aptoslabs.com/v1",
  [Network.Mainnet]: "https://fullnode.mainnet.aptoslabs.com/v1",
};

export const APTOS_COIN_TYPE = "0x1::aptos_coin::AptosCoin";

export const CoinListMapping = {
  [Network.Devnet]:
    "https://raw.githubusercontent.com/laptosio/asset_list/main/ft.testnet.json",
  [Network.Testnet]:
    "https://raw.githubusercontent.com/laptosio/asset_list/main/ft.testnet.json",
  [Network.Mainnet]:
    "https://raw.githubusercontent.com/laptosio/asset_list/main/ft.testnet.json",
};
