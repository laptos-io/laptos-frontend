import { BigNumber, BigNumberish, parseFixed } from "@ethersproject/bignumber";
import { useWallet } from "@manahippo/aptos-wallet-adapter";
import { Types } from "aptos";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRecoilValue } from "recoil";

import { FT_SWAP_ADDRESSES } from "@/constants/contracts";
import { ZERO } from "@/constants/misc";
import useAptosClient from "@/hooks/useAptosClient";
import useAptosWallet from "@/hooks/useAptosWallet";
import useNFTMetadataHandle from "@/hooks/useNFTMetadataHandle";
import useNFTPairMetadata from "@/hooks/useNFTPairMetadata";
import useNFTPools from "@/hooks/useNFTPools";
import usePoolNums from "@/hooks/usePoolNums";
import { IOwnerCollection } from "@/hooks/useUserNFTs";
import classNames from "@/lib/classNames";
import { getCreatedPairMetadata } from "@/lib/getCreatedPairMetadata";
import { networkState } from "@/recoil/network";
import { ICoinInfo } from "@/types/misc";
import {
  BondingCurve,
  CoinAmount,
  CreatePoolStep,
  PoolType,
} from "@/types/nft";

import BuyAndSell from "./components/ConfiguringPoolParameters/BuyAndSell";
import BuyNFTs from "./components/ConfiguringPoolParameters/BuyNFTs";
import SellNFTs from "./components/ConfiguringPoolParameters/SellNFTs";
import FinalizingDeposit from "./components/FinalizingDeposit";
import SelectAssets from "./components/SelectAssets";
import SelectPoolType from "./components/SelectPoolType";

const steps = [
  { name: "Selecting Pool Type", value: CreatePoolStep.SelectType },
  { name: "Selecting Assets", value: CreatePoolStep.SelectAssets },
  {
    name: "Configuring Pool Parameters",
    value: CreatePoolStep.ConfiguringPoolParameters,
  },
  { name: "Finalizing Deposit", value: CreatePoolStep.FinalizingDeposit },
];
export default function CreateNFTPoolPage() {
  const [currentStep, setCurrentStep] = useState(CreatePoolStep.SelectType);

  const [poolType, setPoolType] = useState<PoolType>();
  const [xType, setXType] = useState<string>();
  const [xTokenCollection, setXTokenCollection] = useState<IOwnerCollection>();

  const [yCoin, setYCoin] = useState<ICoinInfo>();
  const yType = yCoin?.token_type?.type;

  const [spotPrice, setSpotPrice] = useState<CoinAmount | undefined>();

  const [bondingCurve, setBondingCurve] = useState<BondingCurve>(
    BondingCurve.Linear
  );
  const [delta, setDelta] = useState<BigNumber>();

  useEffect(() => {
    console.log("@@@ delta", delta);
  }, [delta]);

  const [fee, setFee] = useState<BigNumber | undefined>(ZERO);

  const [buyCount, setBuyCount] = useState<number>();
  const [sellCount, setSellCount] = useState<number>();
  const [buyAmount, setBuyAmount] = useState<BigNumber>();
  const [sellAmount, setSellAmount] = useState<BigNumber>();

  // useEffect(() => {
  //   setDelta(undefined);
  // }, [bondingCurve]);

  useEffect(() => {
    typeof poolType !== "undefined" &&
      setCurrentStep(CreatePoolStep.SelectAssets);
  }, [poolType]);

  useEffect(() => {
    setSpotPrice((prevState) => {
      return {
        coin: yCoin,
        amount:
          yCoin && prevState?.amount?.displayed
            ? {
                displayed: prevState.amount.displayed,
                value: parseFixed(prevState.amount.displayed, yCoin.decimals),
              }
            : undefined,
      };
    });
  }, [yCoin]);

  useEffect(() => {
    console.log(xTokenCollection, yCoin, spotPrice, delta, currentStep);
  }, [xTokenCollection, delta, spotPrice, yCoin, currentStep]);

  const { network } = useRecoilValue(networkState);
  const aptosClient = useAptosClient();
  const { activeWallet } = useAptosWallet();

  const handleGetPoolMetadata = useCallback(async () => {
    const res = await getCreatedPairMetadata({
      aptosClient,
      indeedCreatorAddress: FT_SWAP_ADDRESSES[network],
      accountAddress: activeWallet?.toString(),
    });
  }, [activeWallet, aptosClient, network]);
  return (
    <div className="h-full w-full">
      <div className="flex w-full flex-col items-center justify-center bg-primary py-[60px] px-10">
        <h1 className="mb-3 text-[40px] font-medium leading-tight text-white">
          Create Pool
        </h1>
        <p className=" max-w-xl text-lg text-white/70">
          Provide liquidity to buy, sell, or trade NFTs on your behalf.
        </p>
      </div>
      <div className="container mx-auto py-11">
        <div className="mb-8 flex w-full items-center  justify-center">
          <nav aria-label="Progress">
            <ol className="flex items-center">
              {steps.map((step, stepIdx) => (
                <li
                  key={step.name}
                  className={classNames(
                    stepIdx !== steps.length - 1 ? "pr-8 sm:pr-20" : "",
                    "relative"
                  )}
                >
                  <div
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true"
                  >
                    <div className="h-px w-full bg-gray-200" />
                  </div>
                  <button
                    className="relative flex items-center justify-center space-x-2 bg-[#F1F6FF] px-2"
                    aria-current="step"
                    onClick={() => setCurrentStep(step.value)}
                  >
                    <span
                      className={classNames(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full  border border-primary text-lg leading-8",
                        currentStep === step.value
                          ? "bg-primary text-white"
                          : "bg-transparent text-primary"
                      )}
                    >
                      {stepIdx + 1}
                    </span>
                    <span
                      className={classNames(
                        "text-sm",
                        currentStep === step.value
                          ? "text-black"
                          : "text-[#A1A7BB]"
                      )}
                    >
                      {step.name}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </nav>
        </div>
        <div
          className={classNames(
            "w-full",
            typeof currentStep === "undefined" ||
              currentStep === CreatePoolStep.SelectType
              ? "block"
              : "hidden"
          )}
        >
          <SelectPoolType
            currentStep={currentStep}
            value={poolType}
            onChange={setPoolType}
            onChangeStep={(value: CreatePoolStep) => setCurrentStep(value)}
          />
        </div>

        <div
          className={classNames(
            "w-full",
            currentStep === CreatePoolStep.SelectAssets ? "block" : "hidden"
          )}
        >
          <SelectAssets
            poolType={poolType}
            xType={xType}
            yType={yType}
            onChangeXtype={setXType}
            onChangeXTokenCollection={setXTokenCollection}
            onChangeYtype={setYCoin}
            onChangeStep={(value: CreatePoolStep) => setCurrentStep(value)}
          />
        </div>

        <div
          className={classNames(
            "w-full",
            currentStep === CreatePoolStep.ConfiguringPoolParameters
              ? "block"
              : "hidden"
          )}
        >
          {poolType === PoolType.Token && (
            <BuyNFTs
              fee={fee}
              xTokenCollection={xTokenCollection}
              yCoin={yCoin}
              spotPrice={spotPrice}
              bondingCurve={bondingCurve}
              delta={delta}
              onChangeFee={setFee}
              onChangeSpotPrice={setSpotPrice}
              onChangeBondingCurve={setBondingCurve}
              onChangeDelta={setDelta}
              onChangeBuyCount={setBuyCount}
              onChangeBuyAmount={setBuyAmount}
              onChangeStep={(value: CreatePoolStep) => setCurrentStep(value)}
            />
          )}

          {poolType === PoolType.NFT && (
            <SellNFTs
              fee={fee}
              xTokenCollection={xTokenCollection}
              yCoin={yCoin}
              spotPrice={spotPrice}
              bondingCurve={bondingCurve}
              delta={delta}
              onChangeFee={setFee}
              onChangeSpotPrice={setSpotPrice}
              onChangeBondingCurve={setBondingCurve}
              onChangeDelta={setDelta}
              onChangeSellCount={setSellCount}
              onChangeSellAmount={setSellAmount}
              onChangeStep={(value: CreatePoolStep) => setCurrentStep(value)}
            />
          )}

          {poolType === PoolType.Trade && (
            <BuyAndSell
              fee={fee}
              xTokenCollection={xTokenCollection}
              yCoin={yCoin}
              spotPrice={spotPrice}
              bondingCurve={bondingCurve}
              delta={delta}
              onChangeFee={setFee}
              onChangeSpotPrice={setSpotPrice}
              onChangeBondingCurve={setBondingCurve}
              onChangeDelta={setDelta}
              onChangeBuyCount={setBuyCount}
              onChangeBuyAmount={setBuyAmount}
              onChangeSellCount={setSellCount}
              onChangeSellAmount={setSellAmount}
              onChangeStep={(value: CreatePoolStep) => setCurrentStep(value)}
            />
          )}
        </div>

        <div
          className={classNames(
            "w-full",
            currentStep === CreatePoolStep.FinalizingDeposit
              ? "block"
              : "hidden"
          )}
        >
          {xTokenCollection && yCoin && spotPrice && delta && (
            <FinalizingDeposit
              fee={fee}
              poolType={poolType}
              xTokenCollection={xTokenCollection}
              yCoin={yCoin}
              spotPrice={spotPrice}
              bondingCurve={bondingCurve}
              delta={delta}
              buyCount={buyCount}
              buyAmount={buyAmount}
              sellCount={sellCount}
              sellAmount={sellAmount}
              onChangeStep={(value: CreatePoolStep) => setCurrentStep(value)}
            />
          )}
        </div>
      </div>
      <div className="flex w-full justify-center space-x-3">
        <button
          className="rounded bg-primary px-3 py-1.5 leading-6 text-white"
          onClick={handleGetPoolMetadata}
        >
          Get PoolMetadata
        </button>
        {/* <button
          className="rounded bg-primary px-3 py-1.5 leading-6 text-white"
          onClick={handleAddLiquidity}
        >
          Add Liquidity
        </button> */}
      </div>
    </div>
  );
}
