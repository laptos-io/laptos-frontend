import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

import { IOwnerCollection } from "@/hooks/useUserNFTs";
import { ICoinInfo } from "@/types/misc";
import { CreatePoolStep, PoolType } from "@/types/nft";

import SelectNFTCollectionDialog from "./SelectNFTCollectionDialog";
import SelectTokenDialog from "./SelectTokenDialog";

interface Props {
  poolType?: PoolType;
  xType?: string; // NFT type
  yType?: string; // token type
  onChangeXtype: (value?: string) => void;
  onChangeXTokenCollection: (value?: IOwnerCollection) => void;
  onChangeYtype: (value?: ICoinInfo) => void;
  onChangeStep: (value: CreatePoolStep) => void;
}

export default function SelectAssets({
  poolType,
  xType,
  yType,
  onChangeXtype,
  onChangeXTokenCollection,
  onChangeYtype,
  onChangeStep,
}: Props) {
  const [isTokenDialogOpen, setIsTokenDialogOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<ICoinInfo>();

  const [isNFTDialogOpen, setIsNFTDialogOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<any>();
  if (typeof poolType === "undefined") return null;
  return (
    <>
      <div className="mx-auto w-full max-w-md 2xl:max-w-3xl">
        {poolType === PoolType.Token ? (
          <div className="card w-full space-y-4 px-12 py-10">
            <div className="text-sm lg:text-lg">I want to...</div>
            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4">
              <label
                htmlFor="country"
                className="block text-xl font-medium leading-6 text-gray-900 sm:pt-1.5"
              >
                deposit
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <button
                  className="flex h-10 w-full items-center justify-between space-x-2 rounded-lg border border-[#E6E8F0] px-3"
                  onClick={() => setIsTokenDialogOpen(true)}
                >
                  <span className="text-base font-semibold">
                    {selectedToken?.symbol}
                  </span>
                  <ChevronDownIcon className="h-4 w-4" />
                </button>
                {/* <select
                id="country"
                name="country"
                autoComplete="country-name"
                className="block w-full max-w-lg rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              >
                <option>APT</option>
              </select> */}
              </div>
            </div>
            <div className="text-sm lg:text-lg">and</div>
            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4">
              <label
                htmlFor="country"
                className="block text-xl font-medium leading-6 text-gray-900 sm:pt-1.5"
              >
                receive
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <button
                  className="flex h-10 w-full items-center justify-between space-x-2 rounded-lg border border-[#E6E8F0] px-3"
                  onClick={() => setIsNFTDialogOpen(true)}
                >
                  <span className="text-base font-semibold">
                    {selectedCollection?.name}
                  </span>
                  <ChevronDownIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ) : poolType === PoolType.NFT ? (
          <div className="card w-full space-y-4 px-12 py-10">
            <div className="text-sm lg:text-lg">I want to...</div>
            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4">
              <label
                htmlFor="country"
                className="block text-xl font-medium leading-6 text-gray-900 sm:pt-1.5"
              >
                deposit
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <button
                  className="flex h-10 w-full items-center justify-between space-x-2 rounded-lg border border-[#E6E8F0] px-3"
                  onClick={() => setIsNFTDialogOpen(true)}
                >
                  <span className="text-base font-semibold">
                    {selectedCollection?.name}
                  </span>
                  <ChevronDownIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="text-sm lg:text-lg">and</div>
            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4">
              <label
                htmlFor="country"
                className="block text-xl font-medium leading-6 text-gray-900 sm:pt-1.5"
              >
                receive
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <button
                  className="flex h-10 w-full items-center justify-between space-x-2 rounded-lg border border-[#E6E8F0] px-3"
                  onClick={() => setIsTokenDialogOpen(true)}
                >
                  <span className="text-base font-semibold">
                    {selectedToken?.symbol}
                  </span>
                  <ChevronDownIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="card w-full space-y-4 px-12 py-10">
            <div className="text-sm lg:text-lg">I want to...</div>
            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4">
              <label
                htmlFor="country"
                className="block text-xl font-medium leading-6 text-gray-900 sm:pt-1.5"
              >
                deposit
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <button
                  className="flex h-10 w-full items-center justify-between space-x-2 rounded-lg border border-[#E6E8F0] px-3"
                  onClick={() => setIsTokenDialogOpen(true)}
                >
                  <span className="text-base font-semibold">
                    {selectedToken?.symbol}
                  </span>
                  <ChevronDownIcon className="h-4 w-4" />
                </button>
                {/* <select
                id="country"
                name="country"
                autoComplete="country-name"
                className="block w-full max-w-lg rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              >
                <option>APT</option>
              </select> */}
              </div>
            </div>
            <div className="text-sm lg:text-lg">and</div>
            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4">
              <label
                htmlFor="country"
                className="block text-xl font-medium leading-6 text-gray-900 sm:pt-1.5"
              >
                deposit
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <button
                  className="flex h-10 w-full items-center justify-between space-x-2 rounded-lg border border-[#E6E8F0] px-3"
                  onClick={() => setIsNFTDialogOpen(true)}
                >
                  <span className="text-base font-semibold">
                    {selectedCollection?.name}
                  </span>
                  <ChevronDownIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="text-sm lg:text-lg">to earn trading fees</div>
          </div>
        )}
      </div>
      <SelectTokenDialog
        isOpen={isTokenDialogOpen}
        onDismiss={() => setIsTokenDialogOpen(false)}
        onSelect={(coin) => {
          setSelectedToken(coin);
          onChangeYtype(coin);
          setIsTokenDialogOpen(false);
        }}
      />

      <SelectNFTCollectionDialog
        isOpen={isNFTDialogOpen}
        onDismiss={() => setIsNFTDialogOpen(false)}
        onSelect={(collection) => {
          setSelectedCollection(collection);
          onChangeXTokenCollection(collection);
          // TODO: 确定 NFT type
          // onChangeXtype(collection.token_type.type);
          setIsNFTDialogOpen(false);
        }}
      />
    </>
  );
}
