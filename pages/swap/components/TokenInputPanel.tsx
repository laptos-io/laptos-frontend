import { ChevronDownIcon, WalletIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

import SelectCoinDialog from "@/components/Dialogs/SelectCoinDialog";
import { ICoinInfo } from "@/types/misc";

interface Props {
  token?: ICoinInfo;
  inputDisplayed?: string;
  balanceDisplayed?: string;
  onSelectToken: (token: ICoinInfo) => void;
  onChangeAmount: (value?: string) => void;
}

export default function TokenInputPanel({
  token,
  inputDisplayed = "",
  balanceDisplayed,
  onSelectToken,
  onChangeAmount,
}: Props) {
  const [isSelectCoinDialogOpen, setIsSelectCoinDialogOpen] = useState(false);
  return (
    <>
      <div className="w-full">
        <div className="flex items-center">
          <WalletIcon className="h-3 w-3" />
          <span className="ml-1 text-sm">{balanceDisplayed || "0"}</span>
        </div>
        {token ? (
          <div className="relative flex w-full items-center justify-between rounded-2xl border border-border/50 px-3 py-2">
            <div className="mr-2 flex flex-1 items-center justify-start">
              <input
                type="text"
                className="relative block flex-1 border-none pl-[48px] outline-none focus:border-none focus:outline-none focus:ring-0"
                value={inputDisplayed}
                onChange={(e) => onChangeAmount(e.target.value)}
              />
              <div className="absolute mr-0 h-[40px] w-[40px] shrink-0">
                {token?.logo_url ? (
                  <div
                    className="absolute inset-1 rounded-lg bg-slate-200 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${token?.logo_url})` }}
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
                setIsSelectCoinDialogOpen(true);
              }}
            >
              <span className="text-base font-semibold">{token?.symbol}</span>
              <ChevronDownIcon className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            className="relative flex w-full items-center justify-between rounded-2xl border border-border/50 px-3 py-2"
            onClick={() => {
              setIsSelectCoinDialogOpen(true);
            }}
          >
            <span className="mr-2 flex h-10 flex-1 items-center justify-start">
              Select a token
            </span>
            <span className="inline-flex items-center space-x-2">
              <ChevronDownIcon className="h-4 w-4" />
            </span>
          </button>
        )}
      </div>

      <SelectCoinDialog
        isOpen={isSelectCoinDialogOpen}
        onDismiss={() => setIsSelectCoinDialogOpen(false)}
        onSelect={(token) => {
          onSelectToken(token);
          setIsSelectCoinDialogOpen(false);
        }}
      />
    </>
  );
}
