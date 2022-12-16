import { BigNumber, formatFixed, parseFixed } from "@ethersproject/bignumber";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { useWallet } from "@manahippo/aptos-wallet-adapter";
import { Types } from "aptos";
import { PendingTransaction } from "aptos/src/generated";
import TokenInputPanel from "pages/swap/components/TokenInputPanel";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useRecoilValue } from "recoil";

import PendingTransactionDialog from "@/components/Dialogs/PendingTransactionDialog";
import SelectCoinDialog from "@/components/Dialogs/SelectCoinDialog";
import Modal from "@/components/Modal";
import { FT_SWAP_ADDRESSES } from "@/constants/contracts";
import useAccountResources from "@/hooks/useAccountResources";
import useAptosClient from "@/hooks/useAptosClient";
import useAptosWallet from "@/hooks/useAptosWallet";
import useCheckExistedPool from "@/hooks/useCheckExistedPool";
import useTokenInput from "@/hooks/useTokenInput";
import { getErrMsg } from "@/lib/error";
import { networkState } from "@/recoil/network";
import { ITokenPair } from "@/types/aptos";

interface DialogProps {
  isOpen: boolean;
  tokenPair?: ITokenPair;
  onDismiss: () => void;
}

enum TokenPosition {
  X,
  Y,
}

const getAnotherAmountByPair = (
  tokenPair: ITokenPair | undefined,
  tokenPosition: TokenPosition,
  value: string | undefined
) => {
  if (
    !tokenPair ||
    !tokenPair?.xCoin ||
    !tokenPair?.yCoin ||
    !tokenPair.tokenPairMetadata?.data
  )
    return undefined;
  const { xCoin, yCoin, tokenPairMetadata } = tokenPair;
  const { balance_x, balance_y } = tokenPairMetadata.data;
  if (!balance_x || !balance_y) return undefined;
  if (tokenPosition === TokenPosition.X) {
    const xAmount = value ? parseFixed(value, xCoin.decimals) : undefined;
    // should return amountY
    const yAmount =
      xAmount && BigNumber.isBigNumber(xAmount)
        ? xAmount
            .mul(BigNumber.from(balance_y.value))
            .div(BigNumber.from(balance_x.value))
        : undefined;
    return yAmount ? formatFixed(yAmount, yCoin.decimals) : undefined;
  } else {
    const yAmount = value ? parseFixed(value, yCoin.decimals) : undefined;
    // should return amountX
    const xAmount =
      yAmount && BigNumber.isBigNumber(yAmount)
        ? yAmount
            .mul(BigNumber.from(balance_x.value))
            .div(BigNumber.from(balance_y.value))
        : undefined;
    return xAmount ? formatFixed(xAmount, xCoin.decimals) : undefined;
  }
};

const AddLiquidityDialog = ({ isOpen, tokenPair, onDismiss }: DialogProps) => {
  const { network } = useRecoilValue(networkState);

  const aptosClient = useAptosClient();

  const { xCoin, yCoin } = tokenPair ?? {};

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

  const onChangeTokenAmount = useCallback(
    (tokenPosition: TokenPosition, value: string | undefined) => {
      if (tokenPosition === TokenPosition.X) {
        setXCoinInput(value);
        setYCoinInput(
          getAnotherAmountByPair(tokenPair, TokenPosition.X, value)
        );
      } else {
        setYCoinInput(value);
        setXCoinInput(
          getAnotherAmountByPair(tokenPair, TokenPosition.Y, value)
        );
      }
    },
    [tokenPair]
  );

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
      onDismiss();
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
    onDismiss,
    signAndSubmitTransaction,
  ]);
  return (
    <>
      <Modal
        title="Add Liquidity"
        isOpen={isOpen}
        onDismiss={onDismiss}
        maxWidth={"480px"}
      >
        <div className="w-full pt-5">
          <TokenInputPanel
            token={xCoin}
            inputDisplayed={xCoinInput}
            disableSelectToken
            balanceDisplayed={xCoinBalanceDisplayed}
            isGettingBalance={isGettingXCoinBalance}
            onChangeAmount={(val?: string) => {
              onChangeTokenAmount(TokenPosition.X, val);
            }}
          />

          <div className="my-6 w-full"></div>

          <TokenInputPanel
            token={yCoin}
            inputDisplayed={yCoinInput}
            disableSelectToken
            balanceDisplayed={yCoinBalanceDisplayed}
            isGettingBalance={isGettingYCoinBalance}
            onChangeAmount={(val?: string) => {
              onChangeTokenAmount(TokenPosition.Y, val);
            }}
          />

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
      </Modal>
      <PendingTransactionDialog
        pendingTx={pendingTx}
        onDismiss={() => setPendingTx(undefined)}
      />
    </>
  );
};

export default AddLiquidityDialog;
