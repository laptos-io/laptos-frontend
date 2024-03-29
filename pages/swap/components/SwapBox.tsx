import { BigNumber, formatFixed } from "@ethersproject/bignumber";
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
import useBestTrade from "@/hooks/useBestTrade";
import useCoinBalance from "@/hooks/useCoinBalance";
import useTokenInput from "@/hooks/useTokenInput";
import { getErrMsg } from "@/lib/error";
import { networkState } from "@/recoil/network";
import { ICoinInfo } from "@/types/misc";

import TokenInputPanel from "./TokenInputPanel";

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

  const { account, signAndSubmitTransaction } = useWallet();

  const aptosClient = useAptosClient();

  const [isExactIn, setIsExactIn] = useState(true);

  const [xCoin, setXCoin] = useState<ICoinInfo>();
  const [yCoin, setYCoin] = useState<ICoinInfo>();

  const [xCoinInput, setXCoinInput] = useState<string>();
  const [yCoinInput, setYCoinInput] = useState<string>();

  const {
    balance: xCoinBalance,
    balanceDisplayed: xCoinBalanceDisplayed,
    inputAmount: xAmount,
    isLoading: isGettingXCoinBalance,
    error: xCoinInputError,
  } = useTokenInput(xCoin, xCoinInput);

  const {
    balance: yCoinBalance,
    balanceDisplayed: yCoinBalanceDisplayed,
    inputAmount: yAmount,
    isLoading: isGettingYCoinBalance,
    error: yCoinInputError,
  } = useTokenInput(yCoin, yCoinInput);

  const [isSelectCoinDialogOpen, setIsSelectCoinDialogOpen] = useState(false);
  const [tokenPosition, setTokenPosition] = useState<TokenPosition>();

  useEffect(() => {
    if (!isSelectCoinDialogOpen) {
      setTokenPosition(undefined);
    }
  }, [isSelectCoinDialogOpen]);

  const onSelectToken = useCallback(
    (position: TokenPosition, token: ICoinInfo | undefined) => {
      if (position === TokenPosition.X) {
        if (yCoin && token?.token_type.type === yCoin?.token_type.type) {
          const prevXCoin = xCoin;
          setXCoin(token);
          setYCoin(prevXCoin);
        } else {
          setXCoin(token);
        }
      } else if (position === TokenPosition.Y) {
        if (xCoin && token?.token_type.type === xCoin?.token_type.type) {
          const prevYCoin = yCoin;
          setYCoin(token);
          setXCoin(prevYCoin);
        } else {
          setYCoin(token);
        }
      }
    },
    [xCoin, yCoin]
  );

  const [pending, setPending] = useState(false);
  const [pendingTx, setPendingTx] = useState<PendingTransaction>();
  const [error, setError] = useState<unknown>();

  // const {
  //   data: isExistedThisPool,
  //   isValidating: isCheckingExistedPool,
  //   error: checkExistedPoolError,
  // } = useCheckExistedPool(xCoin?.token_type?.type, yCoin?.token_type?.type);

  // const isValidPool = useMemo(() => {
  //   return isExistedThisPool;
  // }, [isExistedThisPool]);

  const { connected, activeWallet, openModal } = useAptosWallet();

  const bestTrade = useBestTrade(
    xCoin,
    yCoin,
    isExactIn ? xAmount : undefined,
    isExactIn ? undefined : yAmount,
    isExactIn,
    undefined
  );

  const disableSubmit = useMemo(() => {
    return Boolean(
      !activeWallet ||
        !xCoin ||
        !yCoin ||
        xCoin.token_type.type === yCoin.token_type.type ||
        !bestTrade
    );
  }, [activeWallet, bestTrade, xCoin, yCoin]);

  useEffect(() => {
    if (isExactIn) {
      setYCoinInput(
        bestTrade?.outputAmount && yCoin?.decimals
          ? formatFixed(bestTrade?.outputAmount, yCoin?.decimals)
          : undefined
      );
    } else {
      setXCoinInput(
        bestTrade?.inputAmount && xCoin?.decimals
          ? formatFixed(bestTrade?.inputAmount, xCoin?.decimals)
          : undefined
      );
    }
  }, [bestTrade, isExactIn, xCoin?.decimals, yCoin?.decimals]);

  const transactionPayload = useMemo(() => {
    if (disableSubmit || !xAmount || !bestTrade) return undefined;
    if (bestTrade.routes.length === 1) {
      const args = [xAmount, "0", bestTrade.outputAmount, "0"];
      const payload: Types.TransactionPayload_EntryFunctionPayload = {
        type: "entry_function_payload",
        function: `${FT_SWAP_ADDRESSES[network]}::LinearScripts::swap_script`,
        type_arguments: [xCoin!.token_type.type, yCoin!.token_type.type],
        arguments: args,
      };
      return payload;
    } else if (bestTrade.routes.length === 2) {
      const midCoinType = bestTrade.routes[0].yCoin?.token_type.type;
      const args = [
        1, // first_pool_type
        true, // first_is_x_to_y
        1, // second_pool_type
        true, // second_is_y_to_z
        xAmount,
        // "0",
        BigNumber.from(bestTrade.outputAmount)
          .mul("990")
          .div("1000")
          .toString(),
      ];
      const payload: Types.TransactionPayload_EntryFunctionPayload = {
        type: "entry_function_payload",
        function: `${FT_SWAP_ADDRESSES[network]}::router::two_step_route_script`,
        type_arguments: [
          xCoin!.token_type.type,
          midCoinType!,
          yCoin!.token_type.type,
        ],
        arguments: args,
      };
      return payload;
    }
  }, [bestTrade, disableSubmit, network, xAmount, xCoin, yCoin]);

  useEffect(() => {
    const errMsg = getErrMsg(error);
    if (errMsg) {
      toast.error(errMsg);
    } else if (pendingTx && !pending) {
      toast.success("Succeed to create pool!");
    }
  }, [error, pending, pendingTx]);

  const onSwap = useCallback(async () => {
    if (disableSubmit || !transactionPayload) return;

    try {
      setPending(true);
      const pendingTx = await signAndSubmitTransaction(transactionPayload);
      console.log("pendingTx", pendingTx);
      setPendingTx(pendingTx as PendingTransaction);
      const txn = await aptosClient.waitForTransactionWithResult(
        pendingTx.hash,
        { checkSuccess: true }
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
    transactionPayload,
    aptosClient,
    disableSubmit,
    signAndSubmitTransaction,
  ]);
  return (
    <>
      <div className="card mx-auto mt-6 w-full max-w-[480px] pt-5">
        <TokenInputPanel
          token={xCoin}
          enableQuickInput={true}
          inputDisplayed={xCoinInput}
          balanceDisplayed={xCoinBalanceDisplayed}
          isGettingBalance={isGettingXCoinBalance}
          onChangeAmount={(val?: string) => {
            setXCoinInput(val || undefined);
            setIsExactIn(true);
          }}
          onSelectToken={(token) => onSelectToken(TokenPosition.X, token)}
        />

        <div className="my-6 w-full"></div>

        <TokenInputPanel
          token={yCoin}
          enableQuickInput={false}
          inputDisplayed={yCoinInput}
          balanceDisplayed={yCoinBalanceDisplayed}
          isGettingBalance={isGettingYCoinBalance}
          onChangeAmount={(val?: string) => {
            setYCoinInput(val);
            setIsExactIn(false);
          }}
          onSelectToken={(token) => onSelectToken(TokenPosition.Y, token)}
        />

        <div className="my-6 w-full"></div>

        {connected ? (
          <button
            disabled={disableSubmit || pending}
            className={`flex w-full items-center justify-center space-x-2 rounded-lg px-3 py-2.5 text-center font-semibold transition-colors ${
              disableSubmit || pending
                ? "cursor-not-allowed bg-bg-disabled text-text-disabled"
                : "cursor-pointer bg-primary text-white hover:bg-primary-lighter"
            }`}
            onClick={onSwap}
          >
            {false ? (
              <>
                <span>Checking Pair</span>
                {pending && (
                  <span
                    className={`inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-white`}
                  ></span>
                )}
              </>
            ) : bestTrade ? (
              <>
                <span>Swap</span>
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
