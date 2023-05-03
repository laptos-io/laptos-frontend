import { BigNumber, parseFixed } from "@ethersproject/bignumber";
import { useMemo, useState } from "react";

import { BASIC_DECIMALS } from "@/constants/misc";
import { BondingCurve, PoolType } from "@/types/nft";
import { INFTPairMetadata } from "@/types/nftpair";

import PoolItem from "./PoolItem";

interface Props {
  data?: Array<
    INFTPairMetadata & {
      image?: string;
    }
  >;
}

export default function Pools({ data }: Props) {
  const [minPrice, setMinPrice] = useState<string>();
  const [maxPrice, setMaxPrice] = useState<string>();
  const minPriceBigNumber = useMemo(() => {
    return minPrice && !Number.isNaN(+minPrice)
      ? parseFixed(minPrice, BASIC_DECIMALS)
      : null;
  }, [minPrice]);
  const maxPriceBigNumber = useMemo(() => {
    return maxPrice && !Number.isNaN(+maxPrice)
      ? parseFixed(maxPrice, BASIC_DECIMALS)
      : null;
  }, [maxPrice]);
  const [activePoolTypes, setActivePoolTypes] = useState<
    Record<PoolType, boolean>
  >({
    [PoolType.Token]: false,
    [PoolType.NFT]: false,
    [PoolType.Trade]: false,
  });

  const [activeBoundingCurves, setActiveBoundingCurves] = useState<
    Record<BondingCurve, boolean>
  >({
    [BondingCurve.Exponential]: false,
    [BondingCurve.Linear]: false,
  });

  const filterPools = useMemo(() => {
    const selectedPoolTypes: Array<PoolType> = [];
    for (const p of [PoolType.NFT, PoolType.Token, PoolType.Trade]) {
      if (activePoolTypes[p]) selectedPoolTypes.push(p);
    }

    const selectedBoundingCurves: Array<BondingCurve> = [];
    for (const p of [BondingCurve.Linear, BondingCurve.Exponential]) {
      if (activeBoundingCurves[p]) selectedBoundingCurves.push(p);
    }

    return data?.filter((item) => {
      return (
        (selectedPoolTypes.length === 0
          ? true
          : selectedPoolTypes.includes(item.poolType)) &&
        (selectedBoundingCurves.length === 0
          ? true
          : selectedBoundingCurves.includes(item.curveType))
      );
    });
  }, [activeBoundingCurves, activePoolTypes, data]);

  return (
    <div className="flex w-full items-start space-x-4">
      <div className="card w-[320px] shrink-0">
        <form className="w-full">
          <div className="">
            <label
              htmlFor="minPrice"
              className="block text-sm leading-6 text-gray-900"
            >
              Price
            </label>
            <div className="mt-2 w-full">
              <div className="flex items-center justify-between space-x-5">
                <div className="w-full min-w-0 flex-1 rounded-[10px] shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                  <input
                    type="text"
                    name="minPrice"
                    id="minPrice"
                    autoComplete="none"
                    className="block flex-1 border-0 bg-transparent px-2 py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Min Price(APT)"
                    onChange={(e) => setMinPrice(e.currentTarget.value)}
                  />
                </div>
                <div className="w-full min-w-0 flex-1 rounded-[10px] shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                  <input
                    type="text"
                    name="macPrice"
                    id="macPrice"
                    autoComplete="none"
                    className="block flex-1 border-0 bg-transparent px-2 py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Max Price(APT)"
                    onChange={(e) => setMinPrice(e.currentTarget.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <label
              htmlFor="poolType"
              className="block text-sm leading-6 text-gray-900"
            >
              Pool Type
            </label>
            <div className="mt-2 w-full">
              <div className="relative flex w-full gap-x-3 rounded-[10px] bg-[#EEF1F3CC]/80 px-[14px] py-3">
                <div className="flex-1 text-sm leading-6">
                  <label
                    htmlFor="Token"
                    className="block w-full select-none font-medium text-gray-900"
                  >
                    Token
                  </label>
                </div>
                <div className="flex h-6 shrink-0 items-center">
                  <input
                    id="Token"
                    name="Token"
                    type="checkbox"
                    checked={activePoolTypes[PoolType.Token]}
                    onChange={(e) => {
                      setActivePoolTypes((curr) => {
                        return {
                          ...curr,
                          [PoolType.Token]: e.target.checked,
                        };
                      });
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
              </div>
              <div className="relative mt-4 flex w-full gap-x-3 rounded-[10px] bg-[#EEF1F3CC]/80 px-[14px] py-3">
                <div className="flex-1 text-sm leading-6">
                  <label
                    htmlFor="NFT"
                    className="block w-full select-none font-medium text-gray-900"
                  >
                    NFT
                  </label>
                </div>
                <div className="flex h-6 shrink-0 items-center">
                  <input
                    id="NFT"
                    name="NFT"
                    type="checkbox"
                    checked={activePoolTypes[PoolType.NFT]}
                    onChange={(e) => {
                      setActivePoolTypes((curr) => {
                        return {
                          ...curr,
                          [PoolType.NFT]: e.target.checked,
                        };
                      });
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
              </div>
              <div className="relative mt-4 flex w-full gap-x-3 rounded-[10px] bg-[#EEF1F3CC]/80 px-[14px] py-3">
                <div className="flex-1 text-sm leading-6">
                  <label
                    htmlFor="Trade"
                    className="block w-full select-none font-medium text-gray-900"
                  >
                    Trade
                  </label>
                </div>
                <div className="flex h-6 shrink-0 items-center">
                  <input
                    id="Trade"
                    name="Trade"
                    type="checkbox"
                    checked={activePoolTypes[PoolType.Trade]}
                    onChange={(e) => {
                      setActivePoolTypes((curr) => {
                        return {
                          ...curr,
                          [PoolType.Trade]: e.target.checked,
                        };
                      });
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label
              htmlFor="poolType"
              className="block text-sm leading-6 text-gray-900"
            >
              Bonding Curve
            </label>
            <div className="mt-2 w-full">
              <div className="relative flex w-full gap-x-3 rounded-[10px] bg-[#EEF1F3CC]/80 px-[14px] py-3">
                <div className="flex-1 text-sm leading-6">
                  <label
                    htmlFor="Linear"
                    className="block w-full select-none font-medium text-gray-900"
                  >
                    Linear
                  </label>
                </div>
                <div className="flex h-6 shrink-0 items-center">
                  <input
                    id="Linear"
                    name="Linear"
                    type="checkbox"
                    checked={activeBoundingCurves[BondingCurve.Linear]}
                    onChange={(e) => {
                      setActiveBoundingCurves((curr) => {
                        return {
                          ...curr,
                          [BondingCurve.Linear]: e.target.checked,
                        };
                      });
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
              </div>
              <div className="relative mt-4 flex w-full gap-x-3 rounded-[10px] bg-[#EEF1F3CC]/80 px-[14px] py-3">
                <div className="flex-1 text-sm leading-6">
                  <label
                    htmlFor="Exponential"
                    className="block w-full select-none font-medium text-gray-900"
                  >
                    Exponential
                  </label>
                </div>
                <div className="flex h-6 shrink-0 items-center">
                  <input
                    id="Exponential"
                    name="Exponential"
                    type="checkbox"
                    checked={activeBoundingCurves[BondingCurve.Exponential]}
                    onChange={(e) => {
                      setActiveBoundingCurves((curr) => {
                        return {
                          ...curr,
                          [BondingCurve.Exponential]: e.target.checked,
                        };
                      });
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div className="flex-1">
        {filterPools?.map((item, index) => {
          return (
            <div key={index} className="w-full">
              <PoolItem data={item} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
