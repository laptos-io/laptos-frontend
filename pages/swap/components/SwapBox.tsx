import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { useWallet } from "@manahippo/aptos-wallet-adapter";
import { Types } from "aptos";
import { PendingTransaction } from "aptos/src/generated";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useRecoilValue } from "recoil";

import SelectCoinDialog from "@/components/Dialogs/SelectCoinDialog";
import { FT_SWAP_ADDRESSES } from "@/constants/contracts";
import useAptosClient from "@/hooks/useAptosClient";
import useAptosWallet from "@/hooks/useAptosWallet";
import useCheckExistedPool from "@/hooks/useCheckExistedPool";
import useCoinBalance from "@/hooks/useCoinBalance";
import { getErrMsg } from "@/lib/error";
import { coinListState } from "@/recoil/coinList";
import { networkState } from "@/recoil/network";
import { ICoinInfo } from "@/types/misc";

const CoinWithBalance = ({ coinInfo }: { coinInfo: ICoinInfo }) => {
  const balance = useCoinBalance(coinInfo?.token_type?.type);
  return (
    <div className="">
      <span className="">{coinInfo.symbol}: </span>
      <span>{balance?.displayed || "0"}</span>
    </div>
  );
};

enum TokenPosition {
  X,
  Y,
}

const SwapBox = () => {
  const { network } = useRecoilValue(networkState);

  const aptosClient = useAptosClient();

  const [xCoin, setXCoin] = useState<ICoinInfo>();
  const [yCoin, setYCoin] = useState<ICoinInfo>();

  const [isSelectCoinDialogOpen, setIsSelectCoinDialogOpen] = useState(false);
  const [tokenPosition, setTokenPosition] = useState<TokenPosition>();

  useEffect(() => {
    if (!isSelectCoinDialogOpen) {
      setTokenPosition(undefined);
    }
  }, [isSelectCoinDialogOpen]);

  const [xAmount, setXAmount] = useState<string>("1000000");
  const [yAmount, setYAmount] = useState<string>("10000000");

  const [pending, setPending] = useState(false);
  const [pendingTx, setPendingTx] = useState<PendingTransaction>();
  const [error, setError] = useState<unknown>();

  const {
    data: isExistedThisPool,
    isValidating: isCheckingExistedPool,
    error: checkExistedPoolError,
  } = useCheckExistedPool(xCoin?.token_type?.type, yCoin?.token_type?.type);

  const isValidPool = useMemo(() => {
    return isExistedThisPool;
  }, [isExistedThisPool]);

  const { connected, activeWallet, openModal } = useAptosWallet();
  const { signAndSubmitTransaction } = useWallet();

  const disableSubmit = useMemo(() => {
    return (
      !activeWallet ||
      !xCoin ||
      !yCoin ||
      xCoin.token_type.type === yCoin.token_type.type ||
      !isValidPool ||
      !xAmount ||
      !yAmount
    );
  }, [activeWallet, isValidPool, xAmount, xCoin, yAmount, yCoin]);

  const addLiquidityPayload = useMemo(() => {
    if (disableSubmit) return;
    const args = [xAmount, yAmount];
    const payload: Types.TransactionPayload_EntryFunctionPayload = {
      type: "entry_function_payload",
      function: `${FT_SWAP_ADDRESSES[network]}::LinearScripts::add_liquidity_script`,
      type_arguments: [xCoin!.token_type.type, yCoin!.token_type.type],
      arguments: args,
    };
    return payload;
  }, [disableSubmit, network, xAmount, xCoin, yAmount, yCoin]);

  useEffect(() => {
    const errMsg = getErrMsg(error);
    if (errMsg) {
      toast.error(errMsg);
    } else if (pendingTx && !pending) {
      toast.success("Succeed to create pool!");
    }
  }, [error, pending, pendingTx]);

  const onAddLiquidity = useCallback(async () => {
    if (disableSubmit || !addLiquidityPayload) return;

    try {
      setPending(true);
      const pendingTx = await signAndSubmitTransaction(addLiquidityPayload);
      console.log("pendingTx", pendingTx);
      setPendingTx(pendingTx as PendingTransaction);
      const txn = await aptosClient.waitForTransactionWithResult(
        pendingTx.hash
      );
      console.log(1234, txn);
    } catch (error) {
      console.log(error);
      const errMsg = getErrMsg(error);
      errMsg && toast.error(errMsg);
    } finally {
      setPending(false);
    }
  }, [
    addLiquidityPayload,
    aptosClient,
    disableSubmit,
    signAndSubmitTransaction,
  ]);
  return (
    <>
      <div className="card mx-auto mt-6 w-full max-w-[480px] pt-5">
        <div className="relative flex w-full items-center justify-between rounded-2xl border border-border/50 px-3 py-2">
          <div className="flex flex-1 items-center justify-start">
            <div className="relative mr-2 h-[40px] w-[40px] shrink-0">
              {xCoin?.logo_url ? (
                <div
                  className="absolute inset-1 rounded-lg bg-slate-200 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${xCoin?.logo_url})` }}
                ></div>
              ) : (
                <div className="absolute inset-1 rounded-lg bg-slate-200 bg-cover bg-center bg-no-repeat"></div>
              )}
            </div>
          </div>
          <button
            type="button"
            className="inline-flex items-center space-x-2"
            onClick={() => {
              setTokenPosition(TokenPosition.X);
              setIsSelectCoinDialogOpen(true);
            }}
          >
            <span className="text-base font-semibold">{xCoin?.symbol}</span>
            <ChevronDownIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="my-6 w-full"></div>

        <div className="relative flex w-full items-center justify-between rounded-2xl border border-border/50 px-3 py-2">
          <div className="flex flex-1 items-center justify-start">
            <div className="relative mr-2 h-[40px] w-[40px] shrink-0">
              {yCoin?.logo_url ? (
                <div
                  className="absolute inset-1 rounded-lg bg-slate-200 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${yCoin?.logo_url})` }}
                ></div>
              ) : (
                <div className="absolute inset-1 rounded-lg bg-slate-200 bg-cover bg-center bg-no-repeat"></div>
              )}
            </div>
          </div>
          <button
            type="button"
            className="inline-flex items-center space-x-2"
            onClick={() => {
              setTokenPosition(TokenPosition.Y);
              setIsSelectCoinDialogOpen(true);
            }}
          >
            <span className="text-base font-semibold">{yCoin?.symbol}</span>
            <ChevronDownIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="my-6 w-full"></div>

        {connected ? (
          <button
            disabled={disableSubmit || pending}
            className={`flex w-full items-center justify-center space-x-2 rounded-lg px-3 py-2.5 text-center font-semibold transition-colors ${
              disableSubmit || pending || isCheckingExistedPool
                ? "cursor-not-allowed bg-bg-disabled text-text-disabled"
                : "cursor-pointer bg-primary text-white hover:bg-primary-lighter"
            }`}
            onClick={() => (onAddLiquidity ? onAddLiquidity() : null)}
          >
            {isCheckingExistedPool ? (
              <>
                <span>Checking Pair</span>
                {pending && (
                  <span
                    className={`inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-white`}
                  ></span>
                )}
              </>
            ) : isValidPool ? (
              <>
                <span>Add Liquidity</span>
                {pending && (
                  <span
                    className={`inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-white`}
                  ></span>
                )}
              </>
            ) : (
              <span>Invalid Pair</span>
            )}
          </button>
        ) : (
          <button
            className="flex w-full justify-center rounded-lg bg-primary px-3 py-2.5 text-center text-white transition-colors hover:bg-primary-lighter"
            onClick={openModal}
          >
            Connect Wallet
          </button>
        )}
      </div>

      <SelectCoinDialog
        isOpen={isSelectCoinDialogOpen}
        onDismiss={() => setIsSelectCoinDialogOpen(false)}
        onSelect={(token) => {
          if (tokenPosition === TokenPosition.Y) {
            setYCoin(token);
          } else {
            setXCoin(token);
          }
          setIsSelectCoinDialogOpen(false);
        }}
      />
    </>
  );
};

export default SwapBox;
