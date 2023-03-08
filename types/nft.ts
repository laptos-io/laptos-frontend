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
