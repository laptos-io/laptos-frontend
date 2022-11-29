import { useMemo } from "react";
import { useRecoilValue } from "recoil";

import COIN_LIST_MAINNET from "@/constants/coinlist/mainnet.json";
import COIN_LIST_TESTNET from "@/constants/coinlist/testnet.json";
import { networkState } from "@/recoil/network";
import { ICoinInfo, Network } from "@/types/misc";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function useCoinList() {
  const { network } = useRecoilValue(networkState);

  return useMemo(
    () =>
      (network === Network.Testnet
        ? COIN_LIST_TESTNET
        : COIN_LIST_MAINNET) as ICoinInfo[],
    [network]
  );
}

export default useCoinList;
