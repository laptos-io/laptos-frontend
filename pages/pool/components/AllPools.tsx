import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

import SearchBox from "@/components/Header/SearchBox";
import useAllPools from "@/hooks/useAllPairs";
import { ITokenPair } from "@/types/aptos";

import AddLiquidityDialog from "./AddLiquidityDialog";
import CreatePoolDialog from "./CreatePoolDialog";
import TokenPairLogo from "./TokenPairLogo";

const AllPools = () => {
  const [q, setQ] = useState("");

  const [isRefreshing, setIsRefreshing] = useState(false);

  const allValidPairs = useAllPools();
  const [selectPair, setSelectedPair] = useState<ITokenPair>();
  const [isCreatePoolDialogOpen, setIsCreatePoolDialogOpen] = useState(false);

  const [isAddLiquidityDialogOpen, setIsAddLiquidityDialogOpen] =
    useState(false);

  return (
    <>
      <div className="w-full">
        <div className="card flex w-full items-center justify-start rounded-3xl">
          <div className="flex flex-1 flex-col items-center">
            <div className=" text-base text-text-placeholder">
              Total Value Locked
            </div>
            <div className="text-[28px] font-semibold text-text-default">
              $1 191 281
            </div>
          </div>
          <div className="mx-4 h-[54px] w-0 shrink-0 border-l border-slate-200"></div>
          <div className="flex flex-1 flex-col items-center">
            <div className=" text-base text-text-placeholder">
              Total 24h Volume
            </div>
            <div className="text-[28px] font-semibold text-text-default">
              $12 156
            </div>
          </div>
          <div className="mx-4 h-[54px] w-0 shrink-0 border-l border-slate-200"></div>
          <div className="flex flex-1 flex-col items-center">
            <div className=" text-base text-text-placeholder">JUMBO Price</div>
            <div className="text-[28px] font-semibold text-text-default">
              $0.58
            </div>
          </div>

          <div className="mx-4 h-[54px] w-0 shrink-0 border-l border-slate-200"></div>
          <div className="flex flex-1 flex-col items-center">
            <div className=" text-base text-text-placeholder">
              Weekly Emissions
            </div>
            <div className="text-[28px] font-semibold text-text-default">-</div>
          </div>
        </div>

        <div className="mt-8 flex w-full items-center justify-between space-x-3">
          <SearchBox value={q} onChange={(val = "") => setQ(val)} />

          {/* <button
            type="button"
            className="inline-flex items-center space-x-2 text-green-500"
            onClick={() => {
              setIsRefreshing(true);
              setTimeout(() => setIsRefreshing(false), 5000);
            }}
          >
            <span
              className={`inline-block h-3.5 w-3.5 rounded-full border-2 border-gray-500 border-t-green-500 ${
                isRefreshing ? "animate-spin" : ""
              }`}
            ></span>
            <span className="inline-block">Refresh</span>
          </button> */}

          <button
            type="button"
            className="inline-flex items-center justify-center space-x-2 rounded-lg bg-orange-500 px-4 py-2 text-white hover:bg-orange-600"
            onClick={() => setIsCreatePoolDialogOpen(true)}
          >
            <PlusCircleIcon className="h-4 w-4" />
            <span>Create Pool</span>
          </button>
        </div>

        <div className="sticky top-0 h-screen w-full">
          {allValidPairs?.length === 0 ? (
            <div className="flex min-h-[240px] w-full items-center justify-center">
              <span className="text-sm text-slate-300">Empty Pools</span>
            </div>
          ) : (
            <div className="w-full space-y-5 py-5">
              {allValidPairs.map((pairItem) => {
                const { xCoin, yCoin, LPToken } = pairItem;
                return (
                  <div
                    key={LPToken!.type}
                    className="card relative w-full px-4 py-3"
                  >
                    <div className="mb-4 flex w-full items-center justify-between">
                      <span className="inline-flex items-center space-x-2">
                        <TokenPairLogo xCoin={xCoin!} yCoin={yCoin!} />
                        <span className="text-lg font-semibold">
                          {(LPToken!.data as any)?.symbol}
                        </span>
                      </span>
                    </div>
                    <div className="flex w-full items-center justify-between">
                      <span></span>
                      <button
                        className="rounded-lg bg-primary px-3 py-2 text-sm text-white transition-colors hover:bg-primary-lighter"
                        onClick={() => {
                          setSelectedPair(pairItem);
                          setIsAddLiquidityDialogOpen(true);
                        }}
                      >
                        Add Liquidity
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <CreatePoolDialog
        isOpen={isCreatePoolDialogOpen}
        onDismiss={() => setIsCreatePoolDialogOpen(false)}
      />
      <AddLiquidityDialog
        isOpen={isAddLiquidityDialogOpen}
        tokenPair={selectPair}
        onDismiss={() => {
          setIsAddLiquidityDialogOpen(false);
          setTimeout(() => {
            setSelectedPair(undefined);
          }, 300);
        }}
      />
    </>
  );
};

export default AllPools;
