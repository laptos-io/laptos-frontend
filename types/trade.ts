import { BigNumber } from "@ethersproject/bignumber";

import { ITokenPair } from "./aptos";
import { ICoinInfo } from "./misc";

export type SwapExecutionPrice = BigNumber;

export interface Trade {
  inputToken: ICoinInfo;
  outputToken: ICoinInfo;
  routes: ITokenPair[];
  inputAmount: string;
  outputAmount: string;
  executionPrice: SwapExecutionPrice;
}
