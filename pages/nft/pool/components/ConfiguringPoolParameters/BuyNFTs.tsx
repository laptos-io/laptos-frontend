import { BigNumber, formatFixed, parseFixed } from "@ethersproject/bignumber";
import { useEffect, useMemo, useState } from "react";

import { BASIC_DECIMALS, ZERO } from "@/constants/misc";
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
  onChangeBuyCount: (value?: number) => void;
  onChangeBuyAmount: (value?: BigNumber) => void;
  onChangeStep: (value: CreatePoolStep) => void;
}

export default function BuyNFTs({
  bondingCurve,
  xTokenCollection,
  yCoin,
  spotPrice,
  delta,
  onChangeBondingCurve,
  onChangeSpotPrice,
  onChangeDelta,
  onChangeBuyCount,
  onChangeBuyAmount,
  onChangeStep,
}: Props) {
  const [buyPoolWantBuy, setBuyPoolWantBuy] = useState<number>();
  const [buyCount, setBuyCount] = useState<number>();
  const wantBuyAmount = usePoolPricing({
    poolType: PoolType.Token,
    spotPrice: spotPrice?.amount?.value,
    bondingCurve,
    delta,
    count: buyPoolWantBuy || 0,
  });

  const buyAmount = usePoolPricing({
    poolType: PoolType.Token,
    spotPrice: spotPrice?.amount?.value,
    bondingCurve,
    delta,
    count: buyCount || 0,
  });

  useEffect(() => {
    onChangeBuyAmount(buyAmount);
  }, [buyAmount, onChangeBuyAmount]);
  const isInvalidAmount = wantBuyAmount?.lte(ZERO);

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
      <div className="flex mx-auto w-full max-w-4xl items-stretch space-x-4">
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
              <div className="flex relative mt-2 rounded-xl shadow-sm">
                <input
                  type="text"
                  name="sopt-price"
                  id="sopt-price"
                  autoComplete="none"
                  className="block relative w-full min-w-0 flex-1 rounded-xl border-0 py-2 pr-16 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
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
              <div className="flex relative mt-2 rounded-xl shadow-sm">
                <SelectBondingCurve
                  value={bondingCurve}
                  onChange={onChangeBondingCurve}
                />
              </div>
            </div>

            <div className="w-full">
              <label
                htmlFor="delta"
                className="block text-sm font-medium leading-6 text-[#6B7196]"
              >
                Delta
              </label>
              <div className="flex relative mt-2 rounded-xl shadow-sm">
                <input
                  type="number"
                  name="delta"
                  id="delta"
                  autoComplete="none"
                  className="block relative w-full min-w-0 flex-1 rounded-xl border-0 py-2 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                  value={deltaDisplayed || undefined}
                  onChange={(e) =>
                    onChangeDelta(
                      +e.target.value
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

        <div className="card flex-1 shrink-0 rounded-lg px-6 py-10 shadow-lg">
          <h2 className="mb-2 text-center text-[20px] font-medium">
            Asset Amounts
          </h2>
          <p className="mb-6 text-center text-sm text-secondary">
            Set how many tokens you deposit into the pool.
          </p>
          <div className="w-full">
            <div className="flex mb-5 w-full items-center justify-between">
              <label
                htmlFor="wantBuy"
                className="block text-sm font-medium leading-6 text-[#6B7196]"
              >
                If you want to buy
              </label>
              <div className="flex relative ml-3 flex-1 rounded-xl shadow-sm">
                <input
                  type="number"
                  name="wantBuy"
                  id="wantBuy"
                  autoComplete="none"
                  className="block relative w-full min-w-0 flex-1 rounded-xl border-0 py-2 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                  value={buyPoolWantBuy}
                  onChange={(e) =>
                    setBuyPoolWantBuy(+e.target.value || undefined)
                  }
                />
                <span className="absolute right-0 top-0 inline-flex h-10 items-center overflow-visible whitespace-nowrap px-3 leading-10 text-gray-500 sm:text-sm">
                  {xTokenCollection?.name}
                </span>
              </div>
            </div>

            <div className="w-full">
              {typeof wantBuyAmount !== "undefined" && isInvalidAmount ? (
                <p className="text-center text-sm text-red-500">
                  Invalid count
                </p>
              ) : (
                <p className="text-center text-sm text-secondary">
                  you will need to deposit{" "}
                  {wantBuyAmount
                    ? formatFixed(wantBuyAmount, BASIC_DECIMALS)
                    : 0}{" "}
                  APT total.
                </p>
              )}
            </div>
          </div>

          <div className="my-16 h-0 border-t border-slate-100"></div>
          <div className="flex mx-auto w-full max-w-xs flex-col items-center space-y-4">
            <p className="text-xs">
              Buying <strong>{buyCount || 0}</strong> NFTs...
            </p>
            <input
              className="text-primary"
              type="range"
              min={0}
              max={buyPoolWantBuy || 0}
              value={buyCount}
              onChange={(e) => {
                setBuyCount(+e.target.value);
                onChangeBuyCount(+e.target.value);
              }}
            />
            <p className="text-xs">
              will cost you{" "}
              <strong>
                {buyAmount ? formatFixed(buyAmount, BASIC_DECIMALS) : 0}{" "}
              </strong>{" "}
              APT...
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
