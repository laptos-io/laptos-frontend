import { useMemo } from "react";
import { useRecoilValue } from "recoil";

import { FT_SWAP_ADDRESSES } from "@/constants/contracts";
import { coinListMappingState } from "@/recoil/coinList";
import { networkState } from "@/recoil/network";
import { ITokenPair, TokenPairMetadata } from "@/types/aptos";

import useAccountResources from "./useAccountResources";

export default function useAllPairs() {
  const { network } = useRecoilValue(networkState);
  const {
    data: resources,
    isValidating,
    error,
  } = useAccountResources(FT_SWAP_ADDRESSES[network]);

  const coinListMapping = useRecoilValue(coinListMappingState);

  const validCoinPairs = useMemo(() => {
    if (!resources) return [];

    const tempTokenPairMapping: Record<string, ITokenPair> = {};
    for (const resource of resources) {
      if (
        /linear_swap::LPToken<(.*),\s?(.*)>>$/.test(resource.type) &&
        (resource.data as any).symbol
      ) {
        const [_, xCoinType, yCoinType] =
          resource.type.match(/linear_swap::LPToken<(.*),\s?(.*)>>$/) || [];

        if (!tempTokenPairMapping[`${xCoinType},${yCoinType}`]) {
          tempTokenPairMapping[`${xCoinType},${yCoinType}`] = {};
        }
        tempTokenPairMapping[`${xCoinType},${yCoinType}`].LPToken = resource;
        if (
          coinListMapping[xCoinType] &&
          !tempTokenPairMapping[`${xCoinType},${yCoinType}`].xCoin
        ) {
          tempTokenPairMapping[`${xCoinType},${yCoinType}`].xCoin =
            coinListMapping[xCoinType];
        }
        if (
          coinListMapping[yCoinType] &&
          !tempTokenPairMapping[`${xCoinType},${yCoinType}`].yCoin
        ) {
          tempTokenPairMapping[`${xCoinType},${yCoinType}`].yCoin =
            coinListMapping[yCoinType];
        }
        // if (
        //   xCoinType &&
        //   coinListMapping[xCoinType] &&
        //   yCoinType &&
        //   coinListMapping[yCoinType] &&
        //   (resource.data as any).symbol
        // ) {
        //   // console.log(resource);
        //   // res.push({
        //   //   xCoin: coinListMapping[xCoinType],
        //   //   yCoin: coinListMapping[yCoinType],
        //   //   LPResource: resource,
        //   // });
        // }
      } else if (
        /linear_swap::TokenPairMetadata<(.*),\s?(.*)>$/.test(resource.type)
      ) {
        const [_, xCoinType, yCoinType] =
          resource.type.match(
            /linear_swap::TokenPairMetadata<(.*),\s?(.*)>$/
          ) || [];

        if (!tempTokenPairMapping[`${xCoinType},${yCoinType}`]) {
          tempTokenPairMapping[`${xCoinType},${yCoinType}`] = {};
        }
        tempTokenPairMapping[`${xCoinType},${yCoinType}`].tokenPairMetadata =
          resource as TokenPairMetadata;
        if (
          coinListMapping[yCoinType] &&
          !tempTokenPairMapping[`${xCoinType},${yCoinType}`].yCoin
        ) {
          tempTokenPairMapping[`${xCoinType},${yCoinType}`].yCoin =
            coinListMapping[yCoinType];
        }
      }
    }

    const res: ITokenPair[] = Object.values(tempTokenPairMapping);
    return res;
  }, [coinListMapping, resources]);

  return validCoinPairs;
  // const data = useMemo(() => {
  //   if (!resources) return undefined;
  //   const expectedLPType =
  //     FT_SWAP_ADDRESSES[network] &&
  //     xCoinType &&
  //     yCoinType &&
  //     xCoinType !== yCoinType
  //       ? `0x1::coin::CoinInfo<${FT_SWAP_ADDRESSES[network]}::linear_swap::LPToken<${xCoinType}, ${yCoinType}>>`
  //       : undefined;
  //   return resources.find((s) => s.type === expectedLPType);
  // }, [network, resources, xCoinType, yCoinType]);

  // return useMemo(() => {
  //   console.log(data);
  //   return {
  //     data,
  //     isValidating,
  //     error,
  //   };
  // }, [data, error, isValidating]);
}
