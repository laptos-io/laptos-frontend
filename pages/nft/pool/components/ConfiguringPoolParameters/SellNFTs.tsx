import { BigNumber, formatFixed, parseFixed } from "@ethersproject/bignumber";
import { useMemo, useState } from "react";

import { BASIC_DECIMALS } from "@/constants/misc";
import { usePoolPricing } from "@/hooks/usePoolPricing";
import { IOwnerCollection } from "@/hooks/useUserNFTs";
import { ICoinInfo } from "@/types/misc";
import {
  BondingCurve,
  CoinAmount,
  CreatePoolStep,
  PoolType,
} from "@/types/nft";

import SelectBondingCurve from "../SelectBondingCurve";

interface Props {
  bondingCurve?: BondingCurve;
  fee?: BigNumber;
  xTokenCollection?: IOwnerCollection;
  yCoin?: ICoinInfo;
  spotPrice?: CoinAmount;
  delta?: BigNumber;
  onChangeBondingCurve: (value: BondingCurve) => void;
  onChangeFee: (value?: BigNumber) => void;
  onChangeSpotPrice: (value?: CoinAmount) => void;
  onChangeDelta: (value?: BigNumber) => void;
  onChangeSellCount: (value?: number) => void;
  onChangeSellAmount: (value?: BigNumber) => void;
  onChangeStep: (value: CreatePoolStep) => void;
}

export default function BuyNFTs({
  bondingCurve,
  fee,
  xTokenCollection,
  yCoin,
  spotPrice,
  delta,
  onChangeBondingCurve,
  onChangeFee,
  onChangeSpotPrice,
  onChangeDelta,
  onChangeSellCount,
  onChangeSellAmount,
  onChangeStep,
}: Props) {
  const [buyPoolWantSell, setBuyPoolWantSell] = useState<number>();
  const [sellCount, setSellCount] = useState<number>();
  const wantSellAmount = usePoolPricing({
    poolType: PoolType.NFT,
    spotPrice: spotPrice?.amount?.value,
    bondingCurve,
    delta,
    count: buyPoolWantSell || 0,
  });

  const sellAmount = usePoolPricing({
    poolType: PoolType.NFT,
    spotPrice: spotPrice?.amount?.value,
    bondingCurve,
    delta,
    count: sellCount || 0,
  });

  const deltaDisplayed = useMemo(() => {
    if (bondingCurve === BondingCurve.Linear) {
      return delta ? +formatFixed(delta, BASIC_DECIMALS).toString() : undefined;
    } else {
      return delta ? +formatFixed(delta, BASIC_DECIMALS).toString() : undefined;
    }
  }, [bondingCurve, delta]);
  if (typeof bondingCurve === "undefined") return null;
  return (
    <>
      <div className="mx-auto flex w-full max-w-4xl items-stretch space-x-4">
        <div className="card flex-1 shrink-0 rounded-lg px-6 py-10 shadow-lg">
          <h2 className="mb-2 text-center text-[20px] font-medium">
            Pool Pricing
          </h2>
          <p className="mb-6 text-center text-sm text-secondary">
            Set the initial price and how your pool's price changes.
          </p>
          <div className="space-y-6">
            <div className="w-full">
              <label
                htmlFor="sopt-price"
                className="block text-sm font-medium leading-6 text-[#6B7196]"
              >
                Start Price
              </label>
              <div className="relative mt-2 flex rounded-xl shadow-sm">
                <input
                  type="text"
                  name="sopt-price"
                  id="sopt-price"
                  autoComplete="none"
                  className="relative block w-full min-w-0 flex-1 rounded-xl border-0 py-2 pr-16 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                  value={spotPrice?.amount?.displayed}
                  onChange={(e) =>
                    onChangeSpotPrice(
                      spotPrice?.coin
                        ? {
                            coin: spotPrice.coin,
                            amount: +e.target.value
                              ? {
                                  displayed: e.target.value,
                                  value: parseFixed(
                                    e.target.value,
                                    spotPrice?.coin.decimals
                                  ),
                                }
                              : undefined,
                          }
                        : undefined
                    )
                  }
                />
                <span className="absolute right-0 top-0 inline-flex h-10 w-12 items-center px-1 leading-10 text-gray-500 sm:text-sm">
                  {spotPrice?.coin?.symbol}
                </span>
              </div>
            </div>

            <div className="w-full">
              <label
                htmlFor="boudingCurve"
                className="block text-sm font-medium leading-6 text-[#6B7196]"
              >
                Bouding Curve
              </label>
              <div className="relative mt-2 flex rounded-xl shadow-sm">
                <SelectBondingCurve
                  value={bondingCurve}
                  onChange={onChangeBondingCurve}
                />
              </div>
            </div>

            <div className="w-full" key={bondingCurve}>
              <label
                htmlFor="delta"
                className="block text-sm font-medium leading-6 text-[#6B7196]"
              >
                Delta
              </label>
              <div className="relative mt-2 flex rounded-xl shadow-sm">
                <input
                  type="number"
                  name="delta"
                  id="delta"
                  autoComplete="none"
                  className="relative block w-full min-w-0 flex-1 rounded-xl border-0 py-2 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                  value={deltaDisplayed}
                  onChange={(e) =>
                    onChangeDelta(
                      e.target.value && +e.target.value
                        ? parseFixed(e.target.value, BASIC_DECIMALS)
                        : undefined
                    )
                  }
                />
                <span className="absolute right-1 top-0 inline-flex h-10 w-14 items-center justify-end px-3 leading-10 text-gray-500 sm:text-sm">
                  {bondingCurve === BondingCurve.Linear ? "APT" : "%"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="card flex-1 shrink-0 flex-col items-center justify-center rounded-lg px-6 py-10 shadow-lg">
          <h2 className="mb-2 text-center text-[20px] font-medium">
            Asset Amounts
          </h2>
          <p className="mb-6 h-12 text-center text-sm leading-6 text-secondary line-clamp-1">
            Set how many NFTs you deposit into the pool.
          </p>
          <div className="w-full">
            <div className="mb-5 flex w-full items-center justify-between">
              <label
                htmlFor="wantBuy"
                className="block text-sm font-medium leading-6 text-[#6B7196]"
              >
                If you want to sell
              </label>
              <div className="relative ml-3 flex flex-1 rounded-xl shadow-sm">
                <input
                  type="number"
                  name="wantBuy"
                  id="wantBuy"
                  autoComplete="none"
                  className="relative block w-full min-w-0 flex-1 rounded-xl border-0 py-2 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                  value={buyPoolWantSell}
                  onChange={(e) =>
                    setBuyPoolWantSell(+e.target.value ?? undefined)
                  }
                />
                <span className="absolute right-0 top-0 inline-flex h-10 items-center overflow-visible whitespace-nowrap px-3 leading-10 text-gray-500 sm:text-sm">
                  {xTokenCollection?.name}
                </span>
              </div>
            </div>

            <div className="w-full">
              <p className="text-center text-sm text-secondary">
                you will earn{" "}
                {wantSellAmount
                  ? formatFixed(wantSellAmount, BASIC_DECIMALS)
                  : 0}{" "}
                APT total.
              </p>
            </div>
          </div>
          <div className="my-16 h-0 border-t border-slate-100"></div>
          <div className="mx-auto flex w-full max-w-xs flex-col items-center space-y-4">
            <p className="text-xs">
              Selling <strong>{sellCount || 0}</strong> NFTs...
            </p>
            <input
              className="text-primary"
              type="range"
              min={0}
              max={buyPoolWantSell || 0}
              value={sellCount}
              onChange={(e) => setSellCount(+e.target.value)}
            />
            <p className="text-xs">
              will earn you{" "}
              <strong>
                {sellAmount ? formatFixed(sellAmount, BASIC_DECIMALS) : 0}{" "}
              </strong>{" "}
              APT...
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
