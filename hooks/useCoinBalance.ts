import { BigNumber, formatFixed } from "@ethersproject/bignumber";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useInterval, usePrevious } from "react-use";
import { useRecoilValue } from "recoil";

import { APTOS_COIN_TYPE } from "@/constants/misc";
import { coinListState } from "@/recoil/coinList";

import useAptosClient from "./useAptosClient";
import useAptosWallet from "./useAptosWallet";

function useCoinBalance(coinType?: string, refreshInterval?: number) {
  const [balance, setBalance] = useState<string>();
  const [displayed, setDisplayed] = useState<string>();
  const { connected, activeWallet } = useAptosWallet();
  const aptosClient = useAptosClient();
  const { items: coinList = [] } = useRecoilValue(coinListState);

  const [isValidating, setIsValidating] = useState(false);

  const coin = useMemo(() => {
    // const aptosCoin = coinList.find(
    //   (coinItem) => coinItem.token_type.type === APTOS_COIN_TYPE
    // );
    // if (!coinType) return aptosCoin;
    return coinList.find((coinItem) => coinItem.token_type.type === coinType);
  }, [coinList, coinType]);

  const walletAddress = activeWallet?.toString();

  const checkBalance = useCallback(async () => {
    const coinType = coin?.token_type?.type;
    if (!coinType || !connected) {
      setBalance(undefined);
      setDisplayed(undefined);
      return;
    }
    setIsValidating(true);
    const typeTag = `0x1::coin::CoinStore<${coinType}>`;
    const accountResource = await aptosClient.getAccountResource(
      walletAddress!,
      typeTag
    );
    // const accountResource = resources.find((r) => r.type === typeTag);
    if (accountResource) {
      const value = (accountResource!.data as any).coin.value;
      // const displayed = (value / Math.pow(10, coin?.decimals)).toString();

      const displayed = formatFixed(BigNumber.from(value), coin?.decimals);
      setBalance(value);
      setDisplayed(displayed);
    }
    setIsValidating(false);
  }, [
    aptosClient,
    coin?.decimals,
    coin?.token_type?.type,
    connected,
    walletAddress,
  ]);

  // useEffect(() => {
  //   if (connected && activeWallet?.toString) {
  //     checkBalance();
  //   } else {
  //     setBalance(undefined);
  //     setDisplayed(undefined);
  //   }
  // }, [
  //   activeWallet,
  //   aptosClient,
  //   checkBalance,
  //   coinType,
  //   connected,
  //   walletAddress,
  // ]);
  useEffect(() => {
    setBalance(undefined);
    setDisplayed(undefined);
  }, [coinType]);

  useInterval(() => {
    checkBalance();
  }, refreshInterval);

  return useMemo(() => {
    return {
      balance,
      displayed,
      checkBalance,
      isValidating,
    };
  }, [balance, checkBalance, displayed, isValidating]);
}

export default useCoinBalance;
