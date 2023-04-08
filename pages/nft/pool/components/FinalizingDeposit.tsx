import { BigNumber, formatFixed, parseFixed } from "@ethersproject/bignumber";
import { useWallet } from "@manahippo/aptos-wallet-adapter";
import { HexString, Types } from "aptos";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useRecoilValue } from "recoil";

import { FT_SWAP_ADDRESSES } from "@/constants/contracts";
import { BASIC_DECIMALS } from "@/constants/misc";
import useAptosClient from "@/hooks/useAptosClient";
import useAptosWallet from "@/hooks/useAptosWallet";
import useCreateNFTPoolAndAddLiquidity from "@/hooks/useCreateNFTPoolAndAddLiquidity";
import { IOwnerCollection, OwnerTokens } from "@/hooks/useUserNFTs";
import { getErrMsg } from "@/lib/error";
import { networkState } from "@/recoil/network";
import { ICoinInfo } from "@/types/misc";
import {
  BondingCurve,
  CoinAmount,
  CreatePoolStep,
  PoolType,
} from "@/types/nft";

import ChooseNFTsDialog from "./ChooseNFTsDialog";

interface Props {
  fee?: BigNumber;
  xTokenCollection: IOwnerCollection;
  yCoin: ICoinInfo;
  spotPrice: CoinAmount;
  bondingCurve: BondingCurve;
  delta: BigNumber;
  buyCount?: number;
  buyAmount?: BigNumber;
  sellCount?: number;
  sellAmount?: BigNumber;
  poolType?: PoolType;
  xType?: string; // NFT type
  yType?: string; // token type
  onChangeStep: (value: CreatePoolStep) => void;
}

export default function FinalizingDeposit({
  fee,
  xTokenCollection,
  yCoin,
  spotPrice,
  bondingCurve,
  delta,
  buyCount,
  buyAmount,
  sellCount,
  sellAmount,
  poolType,
  xType,
  yType,
  onChangeStep,
}: Props) {
  const { signAndSubmitTransaction } = useWallet();
  const aptosClient = useAptosClient();
  const [creatable, setCreatable] = useState(true);
  const { network } = useRecoilValue(networkState);
  const { connected, activeWallet, openModal } = useAptosWallet();
  const [isTokenDialogOpen, setIsTokenDialogOpen] = useState(false);
  const [tokens, setTokens] = useState<OwnerTokens>([]);

  const disableCreate = useMemo(() => {
    return (
      !activeWallet ||
      !xTokenCollection ||
      !yCoin ||
      !spotPrice ||
      !bondingCurve ||
      !creatable
    );
  }, [
    activeWallet,
    bondingCurve,
    creatable,
    spotPrice,
    xTokenCollection,
    yCoin,
  ]);

  const createPoolPayload = useMemo(() => {
    if (disableCreate) return;
    const args = [
      activeWallet!.toString(),
      poolType || 1, // parseFixed((poolType || 1).toString(), 1).div(parseFixed("1", 8)),
      bondingCurve || 1, // parseFixed((bondingCurve || 1).toString(), 1).div(parseFixed("1", 8)),
      spotPrice.amount?.value._hex,
      delta._hex,
      fee?._hex,
      activeWallet!.toString(),
    ];
    const payload: Types.TransactionPayload_EntryFunctionPayload = {
      type: "entry_function_payload",
      function: `${FT_SWAP_ADDRESSES[network]}::pair_scripts::createPair`,
      type_arguments: ["0x3::token::TokenStore", yCoin!.token_type.type],
      arguments: args,
    };
    return payload;
  }, [
    activeWallet,
    bondingCurve,
    delta,
    disableCreate,
    fee,
    network,
    poolType,
    spotPrice,
    yCoin,
  ]);

  const addLiquidityPayloadWithoutPoolNum = useMemo(() => {
    const collectionName = tokens?.[0]?.collection_name;
    if (!yCoin || !collectionName || !yCoin?.token_type.type) return;
    const methodName = "depositCoinNFTs";
    const type_arguments = ["0x3::token::TokenStore", yCoin.token_type.type];
    const args = [
      undefined, // poolNum
      poolType === PoolType.NFT ? "0" : spotPrice.amount?.value._hex, // amount
      activeWallet!.toString(), // creator
      collectionName,
      tokens?.map((t) => t.name),
    ];

    console.log(1234, { args, poolType });

    const payload: Types.TransactionPayload_EntryFunctionPayload = {
      type: "entry_function_payload",
      function: `${FT_SWAP_ADDRESSES[network]}::pair_scripts::${methodName}`,
      type_arguments: type_arguments,
      arguments: args,
    };
    return payload;
  }, [
    activeWallet,
    network,
    poolType,
    spotPrice.amount?.value._hex,
    tokens,
    yCoin,
  ]);

  const {
    pendingTx,
    pending,
    error,
    mutate: onCreatePool,
  } = useCreateNFTPoolAndAddLiquidity(
    createPoolPayload,
    addLiquidityPayloadWithoutPoolNum
  );

  // const handleAddLiquidity = useCallback(async () => {

  //   console.log({ payload });
  //   const pendingTx = await signAndSubmitTransaction(payload);
  //   console.log("pendingTx", pendingTx);
  //   const txn = await aptosClient.waitForTransactionWithResult(pendingTx.hash);
  //   console.log(1234, txn);
  // }, [aptosClient, network, signAndSubmitTransaction, yCoin]);

  useEffect(() => {
    const errMsg = getErrMsg(error);
    if (errMsg) {
      toast.error(errMsg);
    } else if (pendingTx && !pending) {
      console.log(1234, pendingTx);
      toast.success("Succeed to create pool!");
      setCreatable(false);
    }
  }, [error, pending, pendingTx]);

  return (
    <>
      <div className="mx-auto w-full max-w-3xl">
        <div className="card flex w-full flex-col items-center justify-start space-y-4 px-12 py-10">
          <div className="text-center text-[20px] font-medium">
            Your Pool Details
          </div>
          <p className="mb-5 text-center text-sm">
            You are depositing{" "}
            {buyAmount?._isBigNumber
              ? formatFixed(buyAmount, BASIC_DECIMALS)
              : 0}{" "}
            to buy up to {buyCount} {xTokenCollection?.name}.
          </p>
          <p className="mb-5 text-center text-sm">
            Your pool will have a starting price of{" "}
            {spotPrice?.amount?.displayed} APT.
          </p>
          {poolType !== PoolType.NFT && (
            <p className="mb-5 text-center text-sm">
              Each time your pool buys an NFT, your price will adjust down by{" "}
              {bondingCurve === BondingCurve.Linear
                ? (+formatFixed(delta, BASIC_DECIMALS)).toFixed(2) + " APT."
                : +formatFixed(delta, BASIC_DECIMALS) * 100 + "%."}
            </p>
          )}
          {poolType !== PoolType.Token && (
            <p className="mb-5 text-center text-sm">
              Each time your pool dells an NFT, your price will adjust up by{" "}
              {bondingCurve === BondingCurve.Linear
                ? (+formatFixed(delta, BASIC_DECIMALS)).toFixed(2) + " APT."
                : +formatFixed(delta, BASIC_DECIMALS) * 100 + "%."}
            </p>
          )}

          <div className="flex w-full items-center justify-center space-x-5 pt-6">
            <button
              className="rounded-lg border border-primary px-4 py-2 text-sm leading-6 text-primary hover:bg-primary hover:text-white"
              onClick={() => setIsTokenDialogOpen(true)}
            >
              {tokens?.length > 0
                ? `${tokens?.length} items selected`
                : "Select your NFTs"}
            </button>

            <button
              className="rounded-lg border border-primary px-4 py-2 text-sm leading-6 text-primary hover:bg-primary hover:text-white"
              onClick={() => {
                setCreatable(true);
                onCreatePool();
              }}
            >
              Create Pool
            </button>
          </div>
        </div>
      </div>
      <ChooseNFTsDialog
        collection={xTokenCollection}
        isOpen={isTokenDialogOpen}
        onDismiss={() => setIsTokenDialogOpen(false)}
        onSelect={(tokens) => {
          setTokens(tokens);
        }}
      />
    </>
  );
}
