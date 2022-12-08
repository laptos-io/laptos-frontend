import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { Types } from "aptos";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useRecoilValue } from "recoil";

import SelectCoinDialog from "@/components/Dialogs/SelectCoinDialog";
import Modal from "@/components/Modal";
import { FT_SWAP_ADDRESSES } from "@/constants/contracts";
import useAccountResources from "@/hooks/useAccountResources";
import useAptosClient from "@/hooks/useAptosClient";
import useAptosWallet from "@/hooks/useAptosWallet";
import useCheckExistedPool from "@/hooks/useCheckExistedPool";
import useCreatePoolByAdmin from "@/hooks/useCreatePoolByAdmin";
import { getErrMsg } from "@/lib/error";
import { networkState } from "@/recoil/network";
import { ICoinInfo } from "@/types/misc";

interface CreatePoolDialogProps {
  isOpen: boolean;
  onDismiss: () => void;
}

enum TokenPosition {
  X,
  Y,
}
const CreatePoolDialog = ({ isOpen, onDismiss }: CreatePoolDialogProps) => {
  const { network } = useRecoilValue(networkState);

  const [xCoin, setXCoin] = useState<ICoinInfo>();
  const [yCoin, setYCoin] = useState<ICoinInfo>();

  const {
    data: isExistedThisPool,
    isValidating: isCheckingExistedPool,
    error: checkExistedPoolError,
  } = useCheckExistedPool(xCoin?.token_type?.type, yCoin?.token_type?.type);

  const isValidPool = useMemo(() => {
    return !isExistedThisPool;
  }, [isExistedThisPool]);

  const [isSelectCoinDialogOpen, setIsSelectCoinDialogOpen] = useState(false);
  const [tokenPosition, setTokenPosition] = useState<TokenPosition>();

  useEffect(() => {
    if (!isSelectCoinDialogOpen) {
      setTokenPosition(undefined);
    }
  }, [isSelectCoinDialogOpen]);

  const { connected, activeWallet, openModal } = useAptosWallet();

  const disableCreate = useMemo(() => {
    return (
      !activeWallet ||
      !xCoin ||
      !yCoin ||
      xCoin.token_type.type === yCoin.token_type.type ||
      !isValidPool
    );
  }, [activeWallet, isValidPool, xCoin, yCoin]);

  const createPoolPayload = useMemo(() => {
    if (disableCreate) return;
    const args = [
      activeWallet!.toString(),
      true,
      `LP_${xCoin?.symbol}/${yCoin?.symbol}`,
      `${xCoin?.symbol}/${yCoin?.symbol}`,
    ];
    const payload: Types.TransactionPayload_EntryFunctionPayload = {
      type: "entry_function_payload",
      function: `${FT_SWAP_ADDRESSES[network]}::LinearScripts::create_new_pool_script`,
      type_arguments: [xCoin!.token_type.type, yCoin!.token_type.type],
      arguments: args,
    };
    return payload;
  }, [activeWallet, disableCreate, network, xCoin, yCoin]);

  const {
    pendingTx,
    pending,
    error,
    mutate: onCreatePool,
  } = useCreatePoolByAdmin(createPoolPayload);

  useEffect(() => {
    const errMsg = getErrMsg(error);
    if (errMsg) {
      toast.error(errMsg);
    } else if (pendingTx && !pending) {
      toast.success("Succeed to create pool!");
    }
  }, [error, pending, pendingTx]);

  // const onCreatePool = useCallback(async () => {
  //   if (disableCreate) return;
  //   const args = [
  //     activeWallet!.toString(),
  //     true,
  //     `LP_${xCoin?.symbol}/${yCoin?.symbol}`,
  //     `${xCoin?.symbol}/${yCoin?.symbol}`,
  //   ];
  //   const payload: Types.TransactionPayload_EntryFunctionPayload = {
  //     type: "entry_function_payload",
  //     function: `${FT_SWAP_ADDRESSES[network]}::LinearScripts::create_new_pool_script`,
  //     type_arguments: [xCoin!.token_type.type, yCoin!.token_type.type],
  //     arguments: args,
  //   };
  //   try {
  //     const pendingTx = await signAndSubmitTransaction(payload, {
  //       max_gas_amount: "2000",
  //     });
  //     const txn = await aptosClient.waitForTransactionWithResult(
  //       pendingTx.hash
  //     );
  //     console.log(1234, txn);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }, [
  //   activeWallet,
  //   aptosClient,
  //   disableCreate,
  //   network,
  //   signAndSubmitTransaction,
  //   xCoin,
  //   yCoin,
  // ]);
  return (
    <>
      <Modal
        title="Create Pool"
        isOpen={isOpen}
        onDismiss={onDismiss}
        maxWidth={"480px"}
      >
        <div className="w-full pt-5">
          <button
            type="button"
            className="relative flex w-full items-center justify-between rounded-2xl border border-border/50 px-3 py-2"
            onClick={() => {
              setTokenPosition(TokenPosition.X);
              setIsSelectCoinDialogOpen(true);
            }}
          >
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
              <span className="text-base font-semibold">{xCoin?.symbol}</span>
            </div>
            <ChevronDownIcon className="h-4 w-4" />
          </button>

          <div className="my-6 w-full"></div>

          <button
            type="button"
            className="relative flex w-full items-center justify-between rounded-2xl border border-border/50 px-3 py-2"
            onClick={() => {
              setTokenPosition(TokenPosition.Y);
              setIsSelectCoinDialogOpen(true);
            }}
          >
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
              <span className="text-base font-semibold">{yCoin?.symbol}</span>
            </div>
            <ChevronDownIcon className="h-4 w-4" />
          </button>

          <div className="my-6 w-full"></div>

          {connected ? (
            <button
              disabled={disableCreate || pending}
              className={`flex w-full items-center justify-center space-x-2 rounded-lg px-3 py-2.5 text-center font-semibold transition-colors ${
                disableCreate || pending || isCheckingExistedPool
                  ? "cursor-not-allowed bg-bg-disabled text-text-disabled"
                  : "cursor-pointer bg-primary text-white hover:bg-primary-lighter"
              }`}
              onClick={() => (onCreatePool ? onCreatePool() : null)}
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
                  <span>Create Pool</span>
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

export default CreatePoolDialog;
