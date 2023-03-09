import { BigNumber, BigNumberish } from "@ethersproject/bignumber";

import { ICoinInfo } from "./misc";

export interface ICollection {
  name: string;
  type: string;
  coverImage?: string;
  listing: number;
  floorPrice?: string;
  bestOffer?: string;
  offerTVL?: string;
  volumn?: string;
}

export enum CreatePoolStep {
  SelectType,
  SelectAssets,
  ConfiguringPoolParameters,
  FinalizingDeposit,
}

export enum PoolType {
  Token, // buy
  NFT, // sell
  Trade, // trading
}

export enum BondingCurve {
  Linear = 1,
  Exponential,
}

export interface CoinAmount {
  coin?: ICoinInfo;
  amount?: {
    displayed: string;
    value: BigNumber;
  };
}
