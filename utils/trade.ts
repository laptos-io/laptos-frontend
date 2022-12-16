import { BigNumber } from "@ethersproject/bignumber";

import { ZERO } from "@/constants/misc";
import { ITokenPair } from "@/types/aptos";

const calculateOutputAmount = (
  balanceX: string,
  balanceY: string,
  lastK: string,
  deltaX: string
) => {
  // lastK = balanceX * balanceY = (balanceX + deltaX) * (balanceY - deltaY)
  // deltaY = balanceY - lastK / (balanceX + deltaX)
  return BigNumber.from(balanceY).sub(
    BigNumber.from(lastK).div(
      BigNumber.from(balanceX).add(BigNumber.from(deltaX))
    )
  );
};
export const getOutputAmount = (tokenPair: ITokenPair, inputAmount: string) => {
  if (!tokenPair) return;
  if (!+inputAmount || BigNumber.from(inputAmount).lte(ZERO)) return;
  const lastK = tokenPair.tokenPairMetadata?.data.k_last;
  const balanceX = tokenPair.tokenPairMetadata?.data.balance_x.value;
  const balanceY = tokenPair.tokenPairMetadata?.data.balance_y.value;
  if (!lastK || !balanceY || !balanceX) return;
  const expectedOutputAmount: BigNumber = calculateOutputAmount(
    balanceX,
    balanceY,
    lastK,
    inputAmount
  );
  if (expectedOutputAmount.gt(BigNumber.from(balanceY))) {
    console.log("流动性不足");
    return;
  }
  return expectedOutputAmount.toString();
};
