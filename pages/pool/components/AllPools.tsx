import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

import SearchBox from "@/components/Header/SearchBox";
import useAptosClient from "@/hooks/useAptosClient";
import useCoinBalance from "@/hooks/useCoinBalance";
import useCoinList from "@/hooks/useCoinList";
import { ICoinInfo } from "@/types/misc";

import CreatePoolDialog from "./CreatePoolDialog";

const AllPools = () => {
  const aptosClient = useAptosClient();

  const [q, setQ] = useState("");

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCreatePoolDialogOpen, setIsCreatePoolDialogOpen] = useState(false);

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

          <button
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
          </button>

          <button
            type="button"
            className="inline-flex items-center justify-center space-x-2 rounded-lg bg-orange-500 px-4 py-2 text-white hover:bg-orange-600"
            onClick={() => setIsCreatePoolDialogOpen(true)}
          >
            <PlusCircleIcon className="h-4 w-4" />
            <span>Create Pool</span>
          </button>
        </div>
      </div>
      <CreatePoolDialog
        isOpen={isCreatePoolDialogOpen}
        onDismiss={() => setIsCreatePoolDialogOpen(false)}
      />
    </>
  );
};

export default AllPools;
