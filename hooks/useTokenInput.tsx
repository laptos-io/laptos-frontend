import { BigNumber, parseFixed } from "@ethersproject/bignumber";
import { useEffect, useMemo } from "react";

import { ICoinInfo } from "@/types/misc";

import useCoinBalance from "./useCoinBalance";

export default function useTokenInput(
  token?: ICoinInfo,
  inputDisplayed?: string
) {
  const {
    balance,
    displayed: balanceDisplayed,
    isValidating,
  } = useCoinBalance(token?.token_type?.type, 5000);

  const inputBigNumber: BigNumber | undefined = useMemo(() => {
    if (!token) return undefined;
    if (
      typeof inputDisplayed !== "undefined" &&
      typeof +inputDisplayed === "number"
    ) {
      const inputBigNumber = parseFixed(inputDisplayed, token.decimals);
      return inputBigNumber;
    }
    return undefined;
  }, [inputDisplayed, token]);

  const error = useMemo(() => {
    if (!inputBigNumber) return undefined;
    if (!balance) return "Unknown balance";
    const balanceBigNumber = BigNumber.from(balance);
    return balanceBigNumber.lt(inputBigNumber)
      ? "Insufficient balance"
      : undefined;
  }, [balance, inputBigNumber]);

  return useMemo(() => {
    return {
      balance,
      balanceDisplayed,
      inputAmount: inputBigNumber?.toString(),
      isValidating,
      error,
    };
  }, [balance, balanceDisplayed, error, inputBigNumber, isValidating]);
}
