import { BigNumber } from "@ethersproject/bignumber";
import { useMemo } from "react";
import { getOutputAmount } from "utils/trade";

import { SWAP_FEE, SWAP_FEE_BASE } from "@/constants/misc";
import { ITokenPair } from "@/types/aptos";
import { ICoinInfo } from "@/types/misc";

import useAllPairs from "./useAllPairs";

function getBestTrade(
  currentRoutes: ITokenPair[],
  inputToken: ICoinInfo,
  inputAmount: string,
  targetOutputToken: ICoinInfo,
  restTokenPairs: ITokenPair[],
  maxHops: number
):
  | {
      routes: ITokenPair[];
      outputAmount?: string;
    }
  | undefined {
  if (currentRoutes?.length > maxHops) return;

  if (inputToken?.token_type?.type === targetOutputToken.token_type.type) {
    // 当前 pair 就是
    return {
      routes: currentRoutes,
      outputAmount: inputAmount,
    };
  }
  let bestOutput:
    | {
        routes: ITokenPair[];
        outputAmount?: string;
      }
    | undefined;
  for (let index = 0; index < restTokenPairs.length; index++) {
    const currentPair = restTokenPairs[index];
    if (currentPair.xCoin?.token_type.type === inputToken.token_type.type) {
      // 当前 pair 是以 inputToken 开头
      const nextInputAmount = getOutputAmount(currentPair, inputAmount);
      if (nextInputAmount) {
        const nextCurrentRoutes = [...(currentRoutes || []), currentPair];
        const nextInputToken = currentPair.yCoin!;
        const nextRestTokenPairs = [
          ...restTokenPairs.slice(0, index),
          ...restTokenPairs.slice(index + 1, restTokenPairs.length),
        ];
        const _bestOutput = getBestTrade(
          nextCurrentRoutes,
          nextInputToken,
          nextInputAmount,
          targetOutputToken,
          nextRestTokenPairs,
          maxHops - 1
        );
        if (
          !bestOutput ||
          (_bestOutput?.outputAmount &&
            BigNumber.from(bestOutput.outputAmount).lt(
              BigNumber.from(_bestOutput?.outputAmount)
            ))
        ) {
          bestOutput = _bestOutput;
        }
      }
    }
  }
  return bestOutput;
}

function useAllRoutes(
  inputToken?: ICoinInfo,
  outputToken?: ICoinInfo,
  inputAmount?: string
) {
  const allPairs = useAllPairs();

  return useMemo(() => {
    if (!inputToken || !outputToken) return [];
    if (!inputAmount || !+inputAmount) return [];
    if (!allPairs || allPairs?.length === 0) return [];

    const oneStepRoutes: ITokenPair[] = [];
    const twoStepRoutes: ITokenPair[] = [];
    const threeStepRoutes: ITokenPair[] = [];

    const pairsBeginWithInputToken: ITokenPair[] = [];
    const pairsEndWithOutToken: ITokenPair[] = [];
    const pairsRest: ITokenPair[] = [];

    for (const pair of allPairs) {
      if (pair.xCoin?.token_type.type === inputToken.token_type.type) {
        pairsBeginWithInputToken.push(pair);
        if (pair.yCoin?.token_type.type === outputToken.token_type.type) {
          oneStepRoutes.push(pair); // 找到了一步 swap 路由
        }
      } else if (pair.yCoin?.token_type.type === outputToken.token_type.type) {
        pairsEndWithOutToken.push(pair);
      } else {
        pairsRest.push(pair);
      }
    }
  }, [allPairs, inputAmount, inputToken, outputToken]);
}

const getInputAmountWithFee = (inputAmount: string | undefined) => {
  return BigNumber.from(inputAmount)
    .mul(BigNumber.from(`${SWAP_FEE_BASE - SWAP_FEE}`))
    .div(BigNumber.from(SWAP_FEE_BASE))
    .toString();
};
export default function useBestTrade(
  inputToken?: ICoinInfo,
  outputToken?: ICoinInfo,
  inputAmount?: string,
  slippage?: number
) {
  const allPairs = useAllPairs();
  const bestTrade =
    inputToken && inputAmount && outputToken && allPairs
      ? getBestTrade(
          [],
          inputToken,
          getInputAmountWithFee(inputAmount),
          outputToken,
          allPairs,
          3
        )
      : undefined;
  console.log("@@@ bestTrade", bestTrade);
  return bestTrade;
}
